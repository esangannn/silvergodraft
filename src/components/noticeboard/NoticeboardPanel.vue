<template>
  <section :class="['noticeboard-panel', { 'is-collapsed': collapsed }]">
    <button
      v-if="collapsed"
      class="collapse-tab collapse-tab--expand"
      type="button"
      :aria-label="'Expand Kampong Noticeboard'"
      @click="$emit('update:collapsed', false)"
    >
      <ChevronRight :size="18" stroke-width="2.5" />
      <span class="collapsed-label">Kampong Noticeboard</span>
    </button>

    <template v-else>
      <header class="panel-header">
        <h2 v-if="!headerArea">Kampong Noticeboard</h2>
        <h2 v-else>
          <span class="notices-prefix">Notices for: </span>
          <span class="notices-area">{{ headerArea }}</span>
        </h2>
        <button
          class="collapse-tab collapse-tab--collapse"
          type="button"
          aria-label="Collapse Kampong Noticeboard"
          @click="$emit('update:collapsed', true)"
        >
          <ChevronLeft :size="18" stroke-width="2.5" />
        </button>
      </header>

      <div v-if="!activeView" class="initial-state">
        <p class="instruction">Select your constituency to view local notices and alerts.</p>
        <ConstituencySelector @search="selectConstituency" />
        <EmptyState />
      </div>

      <div v-else class="selected-state">
        <div class="other-constituencies-wrap">
          <button class="other-constituencies" type="button" @click="clearArea">
            View Other Constituencies
          </button>
        </div>

        <p v-if="activeView === 'home'" class="radius-note">
          Showing notices within {{ radiusKm }}km of your home (S{{ homePostalCode }}).
        </p>
        <p v-else-if="activeView === 'location'" class="radius-note">
          Showing notices within {{ radiusKm }}km of your selected location.
        </p>

        <CategoryTabs :selectedTab="selectedCategory" @update:selectedTab="setCategory" />

        <p v-if="loading" class="status-text">Loading notices…</p>
        <p v-else-if="error" class="status-text status-error">{{ error }}</p>
        <NoticeList v-else :notices="filteredNotices" />
      </div>
    </template>
  </section>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore';
import ConstituencySelector from '@/components/noticeboard/ConstituencySelector.vue';
import CategoryTabs from '@/components/noticeboard/CategoryTabs.vue';
import NoticeList from '@/components/noticeboard/NoticeList.vue';
import EmptyState from '@/components/noticeboard/EmptyState.vue';
import {
  fetchNoticesByConstituency,
  fetchNoticesNearLocation,
} from '@/services/noticeService';
import { geocodePostalCode } from '@/utils/geoUtils';
import { db } from '@/firebase.js';
import { useAuthStore } from '@/stores/authStore';
import { useFacilityStore } from '@/stores/facilityStore';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

export default {
  name: 'NoticeboardPanel',
  emits: ['update:collapsed'],
  props: {
    collapsed: { type: Boolean, default: false },
  },
  components: {
    ConstituencySelector,
    CategoryTabs,
    NoticeList,
    EmptyState,
    ChevronLeft,
    ChevronRight,
  },
  setup() {
    return {
      authStore: useAuthStore(),
      facilityStore: useFacilityStore(),
    };
  },
  data() {
    return {
      activeView: null,
      selectedConstituency: null,
      homePostalCode: '',
      selectedCategory: 'All',
      notices: [],
      loading: false,
      error: '',
    };
  },
  computed: {
    radiusKm() {
      return this.facilityStore.selectedRadius;
    },
    headerArea() {
      if (this.activeView === 'home') return 'Near You';
      if (this.activeView === 'location') return 'Near Selected Location';
      if (this.activeView === 'constituency') return this.selectedConstituency;
      return '';
    },
    filteredNotices() {
      if (this.selectedCategory === 'All') return this.notices;
      return this.notices.filter((n) => n.category === this.selectedCategory);
    },
  },
  async mounted() {
    if (this.facilityStore.userLocation) {
      await this.loadForStoreLocation();
    } else {
      await this.maybeAutoLoadHome();
    }
  },
  watch: {
    'authStore.user'() {
      if (!this.activeView) this.maybeAutoLoadHome();
    },
    'facilityStore.userLocation'(coords) {
      if (coords) this.loadForStoreLocation();
    },
    'facilityStore.selectedRadius'() {
      if (this.activeView === 'location' && this.facilityStore.userLocation) {
        this.loadHomeNotices(this.facilityStore.userLocation);
      } else if (this.activeView === 'home' && this.homePostalCode) {
        this.loadHomeNotices(this.homePostalCode);
      }
    },
  },
  methods: {
    async maybeAutoLoadHome() {
      if (!this.authStore.ready) {
        await new Promise((resolve) => {
          const stop = this.$watch(
            () => this.authStore.ready,
            (val) => {
              if (val) {
                stop();
                resolve();
              }
            }
          );
        });
      }

      const user = this.authStore.user;
      if (!user) return;

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const postal = snap.exists() ? snap.data().postalCode : '';
        if (!postal) return;

        this.homePostalCode = postal;
        this.activeView = 'home';
        this.selectedCategory = 'All';
        await this.loadHomeNotices(postal);
      } catch (err) {
        console.error('Failed to auto-load home notices', err);
      }
    },
    async selectConstituency(area) {
      if (!area) return;
      this.activeView = 'constituency';
      this.selectedConstituency = area;
      this.selectedCategory = 'All';
      await this.loadConstituencyNotices(area);
    },
    clearArea() {
      this.activeView = null;
      this.selectedConstituency = null;
      this.homePostalCode = '';
      this.selectedCategory = 'All';
      this.notices = [];
      this.error = '';
    },
    async loadForStoreLocation() {
      const coords = this.facilityStore.userLocation;
      if (!coords) return;
      this.activeView = 'location';
      this.selectedCategory = 'All';
      await this.loadNoticesAt(coords);
    },
    setCategory(cat) {
      this.selectedCategory = cat;
    },
    async loadConstituencyNotices(area) {
      this.loading = true;
      this.error = '';
      try {
        this.notices = await fetchNoticesByConstituency(area);
      } catch (err) {
        console.error('Failed to load constituency notices', err);
        this.error = this.formatError(err);
        this.notices = [];
      } finally {
        this.loading = false;
      }
    },
    async loadHomeNotices(postalOrCoords) {
      this.loading = true;
      this.error = '';
      try {
        let coords = postalOrCoords;
        if (typeof postalOrCoords === 'string') {
          coords = await geocodePostalCode(postalOrCoords);
        }
        if (!coords) {
          this.error = 'Could not locate your home postal code.';
          this.notices = [];
          return;
        }
        this.notices = await fetchNoticesNearLocation(coords, this.radiusKm);
      } catch (err) {
        console.error('Failed to load home notices', err);
        this.error = this.formatError(err);
        this.notices = [];
      } finally {
        this.loading = false;
      }
    },
    async loadNoticesAt(coords) {
      this.loading = true;
      this.error = '';
      try {
        this.notices = await fetchNoticesNearLocation(coords, this.radiusKm);
      } catch (err) {
        console.error('Failed to load location notices', err);
        this.error = this.formatError(err);
        this.notices = [];
      } finally {
        this.loading = false;
      }
    },
    formatError(err) {
      const msg = err && err.message ? err.message : 'Could not load notices.';
      return `Could not load notices: ${msg}`;
    },
  },
};
</script>

<style scoped>
.noticeboard-panel {
  background: #fff;
  border: 1px solid #dce8f0;
  border-radius: 16px;
  padding: 1rem 1rem 1.25rem;
  color: #1d2f52;
  display: flex;
  flex-direction: column;
}

.noticeboard-panel.is-collapsed {
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}

.panel-header {
  position: relative;
  margin-bottom: 0.75rem;
  padding-right: 2.25rem;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 900;
  text-align: center;
}

.collapse-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #dce8f0;
  background: #fff;
  color: #1d3455;
  border-radius: 999px;
  width: 32px;
  height: 32px;
  padding: 0;
}

.collapse-tab--collapse {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.collapse-tab--expand {
  width: 100%;
  height: auto;
  border-radius: 14px;
  padding: 0.85rem 0.4rem;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 800;
  color: #1d3455;
}

.collapsed-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 0.8rem;
  letter-spacing: 0.02em;
}

.notices-area {
  color: #d8511b;
}

.initial-state {
  margin-top: 0.15rem;
}

.selected-state {
  margin-top: 0.35rem;
}

.other-constituencies-wrap {
  display: flex;
  justify-content: center;
  margin: 0.1rem 0 0.85rem;
}

.other-constituencies {
  border: 1px solid #c7dbf7;
  background: #f8fbff;
  color: #23549f;
  border-radius: 999px;
  padding: 0.5rem 0.95rem;
  font-size: 0.9rem;
  font-weight: 800;
  width: fit-content;
  cursor: pointer;
}

.instruction {
  margin: 0 0 1rem;
  text-align: center;
  color: #3d526f;
  font-size: 0.95rem;
  font-weight: 600;
}

.radius-note {
  text-align: center;
  font-weight: 600;
  color: #23549f;
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
}

.status-text {
  text-align: center;
  font-weight: 600;
  color: #3d526f;
  margin: 1.25rem 0;
}

.status-error {
  color: #c0392b;
}
</style>

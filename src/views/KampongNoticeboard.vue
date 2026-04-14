<template>
  <section class="noticeboard-page">
    <NoticeboardHeader :area="headerArea" @back="clearArea" />

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
        Showing notices within 3km of your home (S{{ homePostalCode }}).
      </p>

      <CategoryTabs :selectedTab="selectedCategory" @update:selectedTab="setCategory" />

      <p v-if="loading" class="status-text">Loading notices…</p>
      <p v-else-if="error" class="status-text status-error">{{ error }}</p>
      <NoticeList v-else :notices="filteredNotices" />
    </div>
  </section>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore';
import NoticeboardHeader from '@/components/noticeboard/NoticeboardHeader.vue';
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

const HOME_RADIUS_KM = 3;

export default {
  name: 'KampongNoticeboard',
  components: {
    NoticeboardHeader,
    ConstituencySelector,
    CategoryTabs,
    NoticeList,
    EmptyState,
  },
  setup() {
    return { authStore: useAuthStore() };
  },
  data() {
    return {
      activeView: null,           // null | 'home' | 'constituency'
      selectedConstituency: null, // constituency name when activeView === 'constituency'
      homePostalCode: '',         // 6-digit postal when activeView === 'home'
      selectedCategory: 'All',
      notices: [],
      loading: false,
      error: '',
    };
  },
  computed: {
    headerArea() {
      if (this.activeView === 'home') return 'Near You';
      if (this.activeView === 'constituency') return this.selectedConstituency;
      return '';
    },
    filteredNotices() {
      if (this.selectedCategory === 'All') return this.notices;
      return this.notices.filter((n) => n.category === this.selectedCategory);
    },
  },
  async mounted() {
    await this.maybeAutoLoadHome();
  },
  watch: {
    'authStore.user'() {
      // If user signs in/out while on this page, re-evaluate auto-load
      if (!this.activeView) this.maybeAutoLoadHome();
    },
  },
  methods: {
    async maybeAutoLoadHome() {
      // Wait for Firebase auth to resolve the user
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
      if (!this.activeView) {
        this.$router.push('/');
      } else {
        this.activeView = null;
        this.selectedConstituency = null;
        this.homePostalCode = '';
        this.selectedCategory = 'All';
        this.notices = [];
        this.error = '';
      }
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
    async loadHomeNotices(postal) {
      this.loading = true;
      this.error = '';
      try {
        const coords = await geocodePostalCode(postal);
        if (!coords) {
          this.error = 'Could not locate your home postal code.';
          this.notices = [];
          return;
        }
        this.notices = await fetchNoticesNearLocation(coords, HOME_RADIUS_KM);
      } catch (err) {
        console.error('Failed to load home notices', err);
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
.noticeboard-page {
  min-height: 100vh;
  padding: 1.1rem 1rem 2rem;
  background: #fff8f3;
  color: #1d2f52;
  max-width: 980px;
  margin: 0 auto;
}

.initial-state{
  margin-top: 0.15rem;
}

.selected-state{
  margin-top: 0.35rem;
}

.other-constituencies-wrap{
  display:flex;
  justify-content:center;
  margin: 0.1rem 0 0.85rem;
}

.other-constituencies {
  border: 1px solid #c7dbf7;
  background: #f8fbff;
  color: #23549f;
  border-radius: 999px;
  padding: 0.55rem 1.05rem;
  font-size: 0.95rem;
  font-weight: 800;
  width: fit-content;
  cursor: pointer;
}

.instruction {
  margin: 0 0 1rem;
  text-align: center;
  color: #3d526f;
  font-size: 1rem;
  font-weight: 600;
}

.radius-note {
  text-align: center;
  font-weight: 600;
  color: #23549f;
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
}

.status-text {
  text-align: center;
  font-weight: 600;
  color: #3d526f;
  margin: 1.5rem 0;
}

.status-error {
  color: #c0392b;
}

@media (max-width: 768px) {
  .noticeboard-page {
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }
}
</style>

<template>
  <section class="search-section" aria-label="Search">
    <div class="search-text">
      <h1 class="search-title">{{ t('search.title') }}</h1>
      <p class="search-subtitle">{{ t('search.subtitle') }}</p>
    </div>

    <div class="search-inputRow">
      <span class="search-inputIcon" aria-hidden="true">
        <Search :size="18" stroke-width="2" />
      </span>
      <input
        class="search-input"
        type="text"
        :value="inputValue"
        :placeholder="t('search.placeholder')"
        @input="onInput($event)"
        @keydown.enter="emitSearch"
      />
      <button
        class="gps-btn"
        type="button"
        aria-label="Use my location"
        :disabled="locating"
        @click="handleGPS"
      >
        <MapPin :size="18" stroke-width="2" />
        <span v-if="locating">{{ t('search.locating') }}</span>
        <span v-else>{{ t('search.useMyLocation') }}</span>
      </button>
    </div>

    <p v-if="gpsError" class="gps-error">{{ gpsError }}</p>

    <div v-if="homePostalCode" class="quick-row">
      <button class="home-btn" type="button" @click="searchNearHome">
        <Home :size="15" stroke-width="2.5" />
        {{ t('search.nearMyHome') }}
      </button>
    </div>
  </section>
</template>

<script>
import { Search, MapPin, Home } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useFacilityStore } from '@/stores/facilityStore';
import { useAuthStore } from '@/stores/authStore';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase';

const db = getFirestore(app);

export default {
  name: 'SearchSection',
  components: { Search, MapPin, Home },
  setup() {
    const { t } = useI18n();
    const store = useFacilityStore();
    const authStore = useAuthStore();
    return { t, store, authStore };
  },
  data() {
    return {
      inputValue: '',
      locating: false,
      gpsError: null,
      homePostalCode: null,
    };
  },
  mounted() {
    this.loadHomePostalCode();
  },
  watch: {
    'authStore.ready'() {
      this.loadHomePostalCode();
    },
    'authStore.user'() {
      this.loadHomePostalCode();
    },
  },
  methods: {
    async loadHomePostalCode() {
      if (!this.authStore.ready) return;
      const user = this.authStore.user;
      if (!user) {
        this.homePostalCode = null;
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        this.homePostalCode = snap.exists() && snap.data().postalCode
          ? snap.data().postalCode
          : null;
      } catch {
        // silently ignore — button just won't show
      }
    },
    onInput(e) {
      this.inputValue = e.target.value;
      this.$emit('search', this.inputValue);
    },
    emitSearch() {
      this.$emit('search', this.inputValue);
    },
    searchNearHome() {
      if (this.homePostalCode) {
        this.inputValue = this.homePostalCode;
        this.store.searchByPostalCode(this.homePostalCode);
      }
    },
    handleGPS() {
      if (!navigator.geolocation) {
        this.gpsError = this.t('search.gpsUnsupported');
        return;
      }
      this.locating = true;
      this.gpsError = null;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.locating = false;
          this.store.setLocationAndSearch({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          this.locating = false;
          this.gpsError = this.t('search.gpsError');
        }
      );
    },
  },
};
</script>

<style scoped>
.search-section {
  margin: 0.25rem 0 0.95rem;
}
.search-text {
  margin-bottom: 0.85rem;
}

.search-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 900;
  color: #1e3247;
}

.search-subtitle {
  margin: 0.35rem 0 0;
  color: #556b84;
  font-size: 0.9rem;
  line-height: 1.35;
}

.search-inputRow {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.9rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(209, 231, 255, 0.9);
  background: #fff;
}

.search-inputIcon {
  color: #5a6f88;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.search-input {
  flex: 1 1 auto;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 700;
  color: #19345a;
}

.search-input::placeholder {
  color: #86a0b5;
  font-weight: 700;
}

.gps-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: none;
  background: #ff6b36;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.gps-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.gps-error {
  margin-top: 0.5rem;
  font-size: 0.82rem;
  color: #dc2626;
  font-weight: 700;
  padding-left: 0.5rem;
}

.quick-row {
  margin-top: 0.6rem;
  display: flex;
  gap: 0.5rem;
}

.home-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1.5px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.home-btn:hover {
  background: #dbeafe;
}
</style>

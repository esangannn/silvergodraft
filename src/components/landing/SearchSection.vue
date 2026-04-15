<template>
  <section class="search-section" aria-label="Search">
    <div class="search-text">
      <h1 class="search-title">{{ t('search.title') }}</h1>
      <p class="search-subtitle">{{ t('search.subtitle') }}</p>
    </div>

    <div class="search-inputWrap" ref="inputWrap">
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
          @keydown.enter.prevent="onEnter"
          @keydown.down.prevent="moveSuggestion(1)"
          @keydown.up.prevent="moveSuggestion(-1)"
          @keydown.esc="closeSuggestions"
          @focus="maybeOpenSuggestions"
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

      <ul
        v-if="suggestionsOpen && (suggestions.length > 0 || suggestionsLoading)"
        class="suggestions"
        role="listbox"
      >
        <li v-if="suggestionsLoading && suggestions.length === 0" class="suggestion-status">
          Searching…
        </li>
        <li
          v-for="(s, idx) in suggestions"
          :key="s.label + idx"
          :class="['suggestion-item', { 'suggestion-item--active': idx === highlightedIndex }]"
          role="option"
          :aria-selected="idx === highlightedIndex"
          @mousedown.prevent="selectSuggestion(s)"
          @mouseenter="highlightedIndex = idx"
        >
          <span class="suggestion-label">{{ s.label }}</span>
          <span v-if="s.postal" class="suggestion-postal">S{{ s.postal }}</span>
        </li>
      </ul>
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
import { fetchAddressSuggestions } from '@/utils/geoUtils';
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
      suggestions: [],
      suggestionsOpen: false,
      suggestionsLoading: false,
      highlightedIndex: -1,
      suggestionSeq: 0,
      suggestionTimer: null,
    };
  },
  mounted() {
    this.loadHomePostalCode();
    document.addEventListener('mousedown', this.onDocumentMouseDown);
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.onDocumentMouseDown);
    if (this.suggestionTimer) clearTimeout(this.suggestionTimer);
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
      const trimmed = this.inputValue.trim();

      // Auto-submit only when a valid 6-digit postal code has been entered.
      // Free-form addresses require pressing Enter or a suggestion click.
      if (/^\d{6}$/.test(trimmed)) {
        this.closeSuggestions();
        this.$emit('search', this.inputValue);
        return;
      }

      this.scheduleSuggestions(trimmed);
    },
    onEnter() {
      if (
        this.suggestionsOpen &&
        this.highlightedIndex >= 0 &&
        this.suggestions[this.highlightedIndex]
      ) {
        this.selectSuggestion(this.suggestions[this.highlightedIndex]);
        return;
      }
      this.closeSuggestions();
      this.$emit('search', this.inputValue);
    },
    emitSearch() {
      this.$emit('search', this.inputValue);
    },
    scheduleSuggestions(query) {
      if (this.suggestionTimer) clearTimeout(this.suggestionTimer);
      if (query.length < 3) {
        this.suggestions = [];
        this.suggestionsOpen = false;
        this.suggestionsLoading = false;
        this.highlightedIndex = -1;
        return;
      }
      this.suggestionsOpen = true;
      this.suggestionsLoading = true;
      this.suggestionTimer = setTimeout(() => this.loadSuggestions(query), 220);
    },
    async loadSuggestions(query) {
      const seq = ++this.suggestionSeq;
      try {
        const results = await fetchAddressSuggestions(query, 5);
        if (seq !== this.suggestionSeq) return;
        this.suggestions = results;
        this.highlightedIndex = results.length > 0 ? 0 : -1;
      } catch {
        if (seq !== this.suggestionSeq) return;
        this.suggestions = [];
        this.highlightedIndex = -1;
      } finally {
        if (seq === this.suggestionSeq) this.suggestionsLoading = false;
      }
    },
    selectSuggestion(s) {
      this.inputValue = s.label;
      this.closeSuggestions();
      this.store.setLocationAndSearch(s.coords);
    },
    moveSuggestion(delta) {
      if (!this.suggestionsOpen || this.suggestions.length === 0) return;
      const n = this.suggestions.length;
      this.highlightedIndex = (this.highlightedIndex + delta + n) % n;
    },
    closeSuggestions() {
      this.suggestionsOpen = false;
      this.highlightedIndex = -1;
    },
    maybeOpenSuggestions() {
      if (this.suggestions.length > 0) this.suggestionsOpen = true;
    },
    onDocumentMouseDown(e) {
      const wrap = this.$refs.inputWrap;
      if (wrap && !wrap.contains(e.target)) this.closeSuggestions();
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

.search-inputWrap {
  position: relative;
  width: 100%;
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

.suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.35rem 0;
  list-style: none;
  background: #fff;
  border: 1px solid #dce8f0;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(30, 50, 71, 0.12);
  z-index: 50;
  max-height: 280px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.95rem;
  cursor: pointer;
  color: #1d3455;
  font-size: 0.9rem;
}

.suggestion-item--active,
.suggestion-item:hover {
  background: #f0f7ff;
}

.suggestion-label {
  font-weight: 700;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestion-postal {
  color: #5a6f88;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.suggestion-status {
  padding: 0.6rem 0.95rem;
  color: #5a6f88;
  font-size: 0.88rem;
  font-weight: 600;
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

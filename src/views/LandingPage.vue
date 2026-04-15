<template>
  <div class="landing-page">
    <LandingHeader />

    <div :class="['landing-layout', { 'is-collapsed': noticeboardCollapsed }]">
      <aside class="noticeboard-column">
        <NoticeboardPanel
          :collapsed="noticeboardCollapsed"
          @update:collapsed="noticeboardCollapsed = $event"
        />
      </aside>

      <main class="main-column">
        <CategoryFilter :selected="selectedCategories" @update:selected="handleCategoryChange" />
        <RadiusFilter :selected="selectedRadius" :wheelchairOnly="store.wheelchairOnly" @update:selected="handleRadiusChange" @update:wheelchairOnly="handleWheelchairToggle" />
        <SearchSection @search="handleSearch" />
        <MapSection :locations="store.facilities" :activeLocationId="activeLocationId" />

        <div v-if="store.isLoading" class="status-msg">{{ $t('status.searching') }}</div>
        <div v-else-if="store.error" class="status-msg status-msg--error">{{ store.error }}</div>
        <div v-else-if="!store.userLocation" class="status-msg">{{ $t('status.enterPostalCode') }}</div>
        <div v-else-if="store.facilities.length === 0 && store.wheelchairOnly" class="status-msg">
          {{ $t('status.noWheelchair') }}
        </div>
        <div v-else-if="store.facilities.length === 0" class="status-msg">
          {{ $t('status.noResults') }}
        </div>
        <ResultsList v-else :locations="store.facilities" @select="activeLocationId = $event" />
      </main>
    </div>
  </div>
</template>

<script>
import { useFacilityStore } from '@/stores/facilityStore';
import LandingHeader from '@/components/landing/LandingHeader.vue';
import SearchSection from '@/components/landing/SearchSection.vue';
import CategoryFilter from '@/components/landing/CategoryFilter.vue';
import RadiusFilter from '@/components/landing/RadiusFilter.vue';
import MapSection from '@/components/landing/MapSection.vue';
import ResultsList from '@/components/landing/ResultsList.vue';
import NoticeboardPanel from '@/components/noticeboard/NoticeboardPanel.vue';

export default {
  name: 'LandingPage',
  components: {
    LandingHeader,
    SearchSection,
    CategoryFilter,
    RadiusFilter,
    MapSection,
    ResultsList,
    NoticeboardPanel
  },
  setup() {
    const store = useFacilityStore();
    return { store };
  },
  data() {
    return {
      selectedCategories: [],
      selectedRadius: '3km',
      activeLocationId: null,
      noticeboardCollapsed: false,
    };
  },
  methods: {
    handleSearch(value) {
      const trimmed = (value || '').trim();
      if (!trimmed) return;
      if (/^\d{6}$/.test(trimmed)) {
        this.store.searchByPostalCode(trimmed);
      } else {
        this.store.searchByAddress(trimmed);
      }
    },
    handleCategoryChange(values) {
      this.selectedCategories = values;
      if (values.length === 0) {
        this.store.resetToAllPlaces();
        return;
      }
      // Map UI labels to store category names
      const labelMap = {
        'Healthcare':        'Healthcare',
        'Community Centres': 'Community Centre',
        'Activities':        'Activity',
      };
      this.store.setCategory(values.map(v => labelMap[v]).filter(Boolean));
    },
    handleRadiusChange(value) {
      this.selectedRadius = value;
      const km = parseInt(value); // '3km' → 3
      this.store.setRadius(km);
    },
    handleWheelchairToggle(value) {
      this.store.setWheelchairOnly(value);
    },
  },
};
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: #fff8f3;
  padding: 0.95rem 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.landing-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.65fr) minmax(0, 1.35fr);
  gap: 1.25rem;
  align-items: start;
  margin-top: 0.5rem;
  transition: grid-template-columns 0.25s ease;
}

.landing-layout.is-collapsed {
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 0.85rem;
}

.noticeboard-column {
  position: sticky;
  top: 0.95rem;
  max-height: calc(100vh - 1.9rem);
  overflow-y: auto;
}

.main-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.status-msg {
  margin-top: 1.5rem;
  text-align: center;
  color: #556b84;
  font-size: 0.95rem;
  font-weight: 700;
}

.status-msg--error {
  color: #dc2626;
}

@media (max-width: 960px) {
  .landing-layout,
  .landing-layout.is-collapsed {
    grid-template-columns: 1fr;
  }

  .noticeboard-column {
    position: static;
    max-height: none;
    overflow: visible;
  }
}
</style>

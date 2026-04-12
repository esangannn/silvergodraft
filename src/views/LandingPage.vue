<template>
  <div class="landing-page">
    <LandingHeader />
    <NoticeboardBanner />
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
  </div>
</template>

<script>
import { useFacilityStore } from '@/stores/facilityStore';
import LandingHeader from '@/components/landing/LandingHeader.vue';
import NoticeboardBanner from '@/components/landing/NoticeboardBanner.vue';
import SearchSection from '@/components/landing/SearchSection.vue';
import CategoryFilter from '@/components/landing/CategoryFilter.vue';
import RadiusFilter from '@/components/landing/RadiusFilter.vue';
import MapSection from '@/components/landing/MapSection.vue';
import ResultsList from '@/components/landing/ResultsList.vue';

export default {
  name: 'LandingPage',
  components: {
    LandingHeader,
    NoticeboardBanner,
    SearchSection,
    CategoryFilter,
    RadiusFilter,
    MapSection,
    ResultsList
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
    };
  },
  methods: {
    handleSearch(value) {
      // Only trigger when exactly 6 digits are entered (valid Singapore postal code)
      if (/^\d{6}$/.test(value)) {
        this.store.searchByPostalCode(value);
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
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
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
</style>

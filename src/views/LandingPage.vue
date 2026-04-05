<template>
  <div class="landing-page">
    <LandingHeader />
    <NoticeboardBanner />
    <CategoryFilter :selected="selectedCategory" @update:selected="handleCategoryChange" />
    <RadiusFilter :selected="selectedRadius" :wheelchairOnly="store.wheelchairOnly" @update:selected="handleRadiusChange" @update:wheelchairOnly="handleWheelchairToggle" />
    <SearchSection @search="handleSearch" />
    <MapSection />

    <div v-if="store.isLoading" class="status-msg">Searching...</div>
    <div v-else-if="store.error" class="status-msg status-msg--error">{{ store.error }}</div>
    <div v-else-if="!store.userLocation" class="status-msg">Enter a postal code to find facilities near you.</div>
    <ResultsList v-else :locations="store.facilities" />
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
      selectedCategory: 'All Places',
      selectedRadius: '3km',
    };
  },
  methods: {
    handleSearch(value) {
      // Only trigger when exactly 6 digits are entered (valid Singapore postal code)
      if (/^\d{6}$/.test(value)) {
        this.store.searchByPostalCode(value);
      }
    },
    handleCategoryChange(value) {
      this.selectedCategory = value;
      const categoryMap = {
        'All Places':        () => this.store.resetToAllPlaces(),
        'Healthcare':        () => this.store.setCategory('Healthcare'),
        'Community Centres': () => this.store.setCategory('Community Centre'),
        'Activities':        () => this.store.setCategory('Activity'),
      };
      if (categoryMap[value]) categoryMap[value]();
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

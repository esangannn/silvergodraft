<template>
  <div class="landing-page">
    <LandingHeader />
    <NoticeboardBanner />
    <CategoryFilter v-model:selected="selectedCategory" />
    <RadiusFilter v-model:selected="selectedRadius" />
    <SearchSection @search="handleSearch" />
    <MapSection />
    <ResultsList :locations="filteredLocations" />
    <LocationDetails />
  </div>
</template>

<script>
import LandingHeader from '@/components/landing/LandingHeader.vue';
import NoticeboardBanner from '@/components/landing/NoticeboardBanner.vue';
import SearchSection from '@/components/landing/SearchSection.vue';
import CategoryFilter from '@/components/landing/CategoryFilter.vue';
import RadiusFilter from '@/components/landing/RadiusFilter.vue';
import MapSection from '@/components/landing/MapSection.vue';
import ResultsList from '@/components/landing/ResultsList.vue';
import LocationDetails from './LocationDetails.vue';

export default {
  name: 'LandingPage',
  components: {
    LandingHeader,
    NoticeboardBanner,
    SearchSection,
    CategoryFilter,
    RadiusFilter,
    MapSection,
    ResultsList,
    LocationDetails
  },
  data() {
    return {
      selectedCategory: 'All Places',
      selectedRadius: '3km',
      locations: [
        {
          id: 1,
          name: 'Ang Mo Kio Polyclinic',
          group: 'Healthcare',
          category: 'Polyclinic',
          address: '21 Ang Mo Kio Central 2, #01-01',
          distance: '1.2 km',
          accessibility: 'Wheelchair Access',
          rating: '4.2/5',
          iconType: 'stethoscope',
          iconColor: '#ff7f50',
        },
        {
          id: 2,
          name: 'Tan Tock Seng Hospital',
          group: 'Healthcare',
          category: 'Hospital',
          address: '11 Jalan Tan Tock Seng',
          distance: '2.5 km',
          accessibility: 'Wheelchair Access',
          rating: '4.5/5',
          iconType: 'stethoscope',
          iconColor: '#ff7f50',
        },
        {
          id: 3,
          name: 'Bishan Community Club',
          group: 'Community Centres',
          category: 'Community Centre',
          address: '51 Bishan Street 13',
          distance: '0.8 km',
          accessibility: 'Wheelchair Access',
          rating: '4.3/5',
          iconType: 'users',
          iconColor: '#64b5f6',
        },
        {
          id: 4,
          name: 'Toa Payoh Active Ageing Centre',
          group: 'Activities',
          category: 'Active Ageing Centre',
          address: 'Block 93 Toa Payoh Lorong 4, #01-324',
          distance: '1.9 km',
          accessibility: 'Wheelchair Access',
          rating: '4.1/5',
          iconType: 'activity',
          iconColor: '#64b5f6',
        },
        {
          id: 5,
          name: 'Serangoon Community Centre',
          group: 'Community Centres',
          category: 'Community Centre',
          address: '83 Serangoon North Avenue 1',
          distance: '2.1 km',
          accessibility: 'Wheelchair Access',
          rating: '4.0/5',
          iconType: 'users',
          iconColor: '#64b5f6',
        },
        {
          id: 6,
          name: 'Jurong Polyclinic',
          group: 'Healthcare',
          category: 'Polyclinic',
          address: '162 Jurong East Street 12',
          distance: '3.2 km',
          accessibility: 'Wheelchair Access',
          rating: '4.2/5',
          iconType: 'stethoscope',
          iconColor: '#ff7f50',
        },
        {
          id: 7,
          name: 'Ang Mo Kio Family Clinic',
          group: 'Healthcare',
          category: 'Clinic',
          address: '117 Ang Mo Kio Avenue 4',
          distance: '2.7 km',
          accessibility: 'Wheelchair Access',
          rating: '4.1/5',
          iconType: 'stethoscope',
          iconColor: '#ff7f50',
        },
        {
          id: 8,
          name: 'Woodlands Active Ageing Centre',
          group: 'Activities',
          category: 'Active Ageing Centre',
          address: '20 Woodlands Avenue 4',
          distance: '4.0 km',
          accessibility: 'Wheelchair Access',
          rating: '4.3/5',
          iconType: 'activity',
          iconColor: '#64b5f6',
        },
        {
          id: 9,
          name: 'Bedok Community Centre',
          group: 'Community Centres',
          category: 'Community Centre',
          address: '12 Bedok North Street 2',
          distance: '3.4 km',
          accessibility: 'Wheelchair Access',
          rating: '4.4/5',
          iconType: 'users',
          iconColor: '#64b5f6',
        },
      ],
      query: ''
    };
  },
  methods: {
    handleSearch(value) {
      this.query = value;
    }
  },
  computed: {
    filteredLocations() {
      return this.locations.filter(location => {
        const categoryMatch = this.selectedCategory === 'All Places' || location.group === this.selectedCategory;
        const queryMatch = this.query ? location.name.toLowerCase().includes(this.query.toLowerCase()) : true;
        const radiusMatch = true;
        return categoryMatch && queryMatch && radiusMatch;
      });
    }
  }
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
</style>

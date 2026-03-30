<template>
  <section class="results" aria-label="Results">
    <h2 class="results__title">{{ locations.length }} Places Found</h2>
    <div class="results-list">
      <LocationCard
        v-for="location in locations"
        :key="location.id"
        :location="location"
      />
    </div>
  </section>
</template>
<script>
import LocationCard from './LocationCard.vue';
export default {
  name: 'ResultsList',
  components: { LocationCard },
  props: {
    locations: { type: Array, default: () => [] }
  }
};
</script>
<style scoped>
.results {
  margin-top: 0.2rem;
}

.results__title {
  margin: 0 0 0.7rem;
  font-size: 1rem;
  font-weight: 900;
  color: #1e3247;
}

.results-list {
  display: grid;
  gap: 0.75rem;
}
</style>
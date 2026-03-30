<template>
  <div class="category-tabs">
    <Chip
      v-for="tab in tabs"
      :key="tab"
      :selected="selectedTab === tab"
      @click="$emit('update:selectedTab', tab)">
      {{ tab }}
    </Chip>
  </div>
</template>
<script>
import Chip from '@/components/shared/Chip.vue';

export default {
  name: 'CategoryTabs',
  components: { Chip },
  props: {
    selectedTab: { type: String, default: 'All' }
  },
  data() {
    return { tabs: ['All', 'Alerts', 'Roadworks', 'Upgrading', 'Events'] };
  }
};
</script>
<style scoped>
.category-tabs {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
</style>
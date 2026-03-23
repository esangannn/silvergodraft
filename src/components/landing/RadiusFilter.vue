<template>
  <div class="radius-filter" aria-label="Radius filter">
    <button
      v-for="radius in radii"
      :key="radius.value"
      type="button"
      class="radius-pill"
      :class="{ 'radius-pill--active': selected === radius.value }"
      @click="$emit('update:selected', radius.value)"
    >
      {{ radius.label }}
    </button>
  </div>
</template>
<script>
export default {
  name: 'RadiusFilter',
  props: { selected: { type: String, default: '3km' } },
  data() {
    return {
      radii: [
        { value: '1km', label: '1 km Radius' },
        { value: '3km', label: '3 km Radius' },
        { value: '5km', label: '5 km Radius' },
        { value: '10km', label: '10 km Radius' },
      ],
    };
  }
};
</script>
<style scoped>
.radius-filter {
  display: flex;
  gap: 0.65rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0.8rem;
}

.radius-pill {
  border: 1px solid #dce8f0;
  background: #fff;
  color: #173b65;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
}

.radius-pill--active {
  background: #ff6b36;
  border-color: #ff6b36;
  color: #fff;
}
</style>
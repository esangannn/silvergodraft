<template>
  <div class="popular-areas">
    <span class="label">Popular areas:</span>
    <div class="area-chips">
      <button
        v-for="area in areas"
        :key="area"
        type="button"
        class="area-pill"
        :class="{ 'area-pill--selected': selectedArea === area }"
        @click="$emit('select-area', area)"
      >
        {{ area }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PopularAreas',
  props: {
    selectedArea: { type: String, default: '' }
  },
  data() {
    return { areas: ['Ang Mo Kio', 'Bedok', 'Tampines', 'Jurong'] };
  }
};
</script>
<style scoped>
.popular-areas {
  margin-bottom: 1rem;
}
.area-chips {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  margin-top: 0.5rem;
}
.label {
  font-weight: 700;
}

.area-pill{
  width: 100%;
  height: 44px;
  border-radius: 999px;
  border: 1px solid #cde4f6;
  background: #ebf6ff;
  color: #123b68;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
}

.area-pill--selected{
  border-color:#264f88;
  background:#d1e7ff;
  color:#091f47;
}
</style>
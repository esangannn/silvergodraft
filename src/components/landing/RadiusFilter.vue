<template>
  <div class="filter-section" aria-label="Filters">

    <div class="filter-group">
      <span class="filter-label">Distance</span>
      <div class="radius-filter">
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
    </div>

    <div class="filter-group">
      <span class="filter-label">Accessibility</span>
      <button
        type="button"
        class="wheelchair-toggle"
        :class="{ 'wheelchair-toggle--active': wheelchairOnly }"
        @click="$emit('update:wheelchairOnly', !wheelchairOnly)"
        aria-label="Wheelchair accessible only"
      >
        <span class="toggle-track" :class="{ 'toggle-track--on': wheelchairOnly }">
          <span class="toggle-thumb" />
        </span>
        <span class="toggle-icon">♿</span>
        <span class="toggle-text">Wheelchair accessible</span>
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'RadiusFilter',
  props: {
    selected: { type: String, default: '3km' },
    wheelchairOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      radii: [
        { value: '1km', label: '1 km' },
        { value: '3km', label: '3 km' },
        { value: '5km', label: '5 km' },
        { value: '10km', label: '10 km' },
      ],
    };
  }
};
</script>

<style scoped>
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.8rem;
  background: #fff;
  border: 1px solid #e8f0f8;
  border-radius: 16px;
  padding: 0.75rem 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  font-size: 0.78rem;
  font-weight: 900;
  color: #556b84;
  width: 100px;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Radius pills */
.radius-filter {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.radius-pill {
  border: 1.5px solid #dce8f0;
  background: #f4f8fc;
  color: #173b65;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.radius-pill:hover {
  border-color: #ff6b36;
  color: #ff6b36;
}

.radius-pill--active {
  background: #ff6b36;
  border-color: #ff6b36;
  color: #fff;
}

/* Wheelchair toggle */
.wheelchair-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0;
}

.toggle-track {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #dce8f0;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-track--on {
  background: #0f766e;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: left 0.2s;
}

.toggle-track--on .toggle-thumb {
  left: 19px;
}

.toggle-icon {
  font-size: 1rem;
}

.toggle-text {
  font-size: 0.85rem;
  font-weight: 800;
  color: #173b65;
}

.wheelchair-toggle--active .toggle-text {
  color: #0f766e;
}
</style>

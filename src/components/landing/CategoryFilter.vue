<template>
  <div class="category-filter" aria-label="Category filter">
    <button
      v-for="item in categories"
      :key="item.name"
      type="button"
      class="cat-item"
      :class="{ 'cat-item--active': selected === item.name }"
      @click="$emit('update:selected', item.name)"
    >
      <span class="cat-item__icon" :style="{ background: item.color }" aria-hidden="true">
        <component :is="item.icon" :size="22" stroke-width="2" />
      </span>
      <span class="cat-item__label">{{ item.name }}</span>
    </button>
  </div>
</template>

<script>
import { Home, Stethoscope, Users, Activity } from 'lucide-vue-next';

export default {
  name: 'CategoryFilter',
  props: {
    selected: { type: String, default: 'All Places' },
  },
  data() {
    return {
      categories: [
        { name: 'All Places', icon: Home, color: '#0f766e' },
        { name: 'Healthcare', icon: Stethoscope, color: '#fb923c' },
        { name: 'Community Centres', icon: Users, color: '#60a5fa' },
        { name: 'Activities', icon: Activity, color: '#34d399' },
      ],
    };
  },
};
</script>

<style scoped>
.category-filter {
  display: flex;
  justify-content: space-between;
  gap: 0.9rem;
  margin-top: 0.85rem;
}

.cat-item {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.65rem 0.15rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

.cat-item__icon {
  width: 54px;
  height: 54px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.cat-item__label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #415569;
  text-align: center;
}

.cat-item--active .cat-item__icon {
  filter: brightness(0.98);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
}
</style>
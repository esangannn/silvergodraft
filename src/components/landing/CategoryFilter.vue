<template>
  <div class="category-filter" aria-label="Category filter">
    <button
      v-for="item in categories"
      :key="item.name"
      type="button"
      class="cat-item"
      :class="{ 'cat-item--active': isActive(item.name) }"
      @click="toggle(item.name)"
    >
      <span
        class="cat-item__icon"
        :style="isActive(item.name)
          ? { background: item.color, boxShadow: `0 0 0 3px white, 0 0 0 5px ${item.color}` }
          : { background: item.color }"
        aria-hidden="true"
      >
        <component :is="item.icon" :size="22" stroke-width="2" />
      </span>
      <span class="cat-item__label">{{ t(item.labelKey) }}</span>
    </button>
  </div>
</template>

<script>
import { Home, Stethoscope, Users, Activity } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

export default {
  name: 'CategoryFilter',
  emits: ['update:selected'],
  props: {
    selected: { type: Array, default: () => [] },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      categories: [
        { name: 'All Places',        labelKey: 'category.allPlaces',        icon: Home,        color: '#0f766e' },
        { name: 'Healthcare',        labelKey: 'category.healthcare',        icon: Stethoscope, color: '#fb923c' },
        { name: 'Community Centres', labelKey: 'category.communityCentres', icon: Users,       color: '#60a5fa' },
        { name: 'Activities',        labelKey: 'category.activities',        icon: Activity,    color: '#34d399' },
      ],
    };
  },
  methods: {
    isActive(name) {
      if (name === 'All Places') return this.selected.length === 0;
      return this.selected.includes(name);
    },
    toggle(name) {
      if (name === 'All Places') {
        this.$emit('update:selected', []);
        return;
      }
      const current = [...this.selected];
      const idx = current.indexOf(name);
      if (idx === -1) {
        current.push(name);
      } else {
        current.splice(idx, 1);
      }
      this.$emit('update:selected', current);
    },
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
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.cat-item__label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #415569;
  text-align: center;
}

.cat-item--active .cat-item__icon {
  transform: scale(1.08);
}

.cat-item--active .cat-item__label {
  color: #0f172a;
  font-weight: 900;
}
</style>
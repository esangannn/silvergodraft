<template>
  <article :class="['notice-card', categoryClass]">
    <div class="card-header">
      <h3>{{ item.title }}</h3>
      <component :is="iconComponent" class="card-icon" :size="20" stroke-width="2" />
    </div>
    <p class="card-description">{{ item.description }}</p>
    <div class="card-footer">
      <span class="posted-time">🗓️ {{ item.posted }}</span>
      <button class="details-btn">View Details</button>
    </div>
  </article>
</template>

<script>
import { computed } from 'vue';
import { AlertTriangle, Wrench, TrendingUp, Calendar } from 'lucide-vue-next';

export default {
  name: 'NoticeCard',
  props: {
    item: { type: Object, required: true }
  },
  computed: {
    categoryClass() {
      switch (this.item.category) {
        case 'Alerts':
          return 'alerts-card';
        case 'Upgrading':
          return 'upgrading-card';
        case 'Roadworks':
          return 'roadworks-card';
        case 'Events':
          return 'events-card';
        default:
          return '';
      }
    },
    iconComponent() {
      switch (this.item.category) {
        case 'Alerts':
          return AlertTriangle;
        case 'Upgrading':
          return Wrench;
        case 'Roadworks':
          return TrendingUp;
        case 'Events':
          return Calendar;
        default:
          return Calendar;
      }
    }
  }
};
</script>

<style scoped>
.notice-card {
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  padding: 1.1rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #11305f;
}

.card-icon {
  min-width: 24px;
  min-height: 24px;
  color: #334f7d;
}

.card-description {
  margin: 0;
  color: #415c77;
  font-size: 1rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.posted-time {
  color: #3a586f;
  font-size: 0.95rem;
  font-weight: 600;
}

.details-btn {
  border: 1px solid #0f2a4c;
  background: #ffffff;
  color: #0f2a4c;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.95rem;
  font-weight: 650;
  cursor: pointer;
}

.details-btn:hover {
  background: #f0f8ff;
}

.alerts-card {
  border-color: #ffb68d;
  background: #fff2e9;
}

.upgrading-card {
  border-color: #a4d6ff;
  background: #eaf6ff;
}

.roadworks-card {
  border-color: #ffd386;
  background: #fff8e6;
}

.events-card {
  border-color: #8cd5a0;
  background: #e6fbef;
}
</style>
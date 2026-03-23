<template>
  <div :class="['notice-card', notice.category.toLowerCase()]">
    <div class="card-header">
      <h3>{{ notice.title }}</h3>
      <button class="icon-btn" type="button" aria-label="Notice type">
        <BaseIcon :icon="icon" :size="20" />
      </button>
    </div>
    <p>{{ notice.description }}</p>
    <div class="card-footer">
      <small>{{ notice.date }}</small>
      <BaseButton label="View Details" variant="secondary" />
    </div>
  </div>
</template>
<script>
import BaseIcon from '@/components/shared/BaseIcon.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import { AlertTriangle, Wrench, TrendingUp, Calendar } from 'lucide-vue-next';

export default {
  name: 'NoticeCard',
  components: { BaseIcon, BaseButton },
  props: { notice: { type: Object, required: true } },
  computed: {
    icon() {
      switch (this.notice.category) {
        case 'Alerts': return AlertTriangle;
        case 'Upgrading': return Wrench;
        case 'Roadworks': return TrendingUp;
        case 'Events': return Calendar;
        default: return Calendar;
      }
    }
  }
};
</script>
<style scoped>
.notice-card {
  border-radius: 16px;
  padding: 1rem;
  background: white;
  border: 1px solid transparent;
}
.notice-card h3 {
  margin: 0;
  font-size: 1.1rem;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.icon-btn{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.7);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notice-card.alerts {
  border-color: #ffb68d;
  background: #fff2e9;
}
.notice-card.alerts .icon-btn{
  color:#f97316;
  border-color: rgba(249,115,22,0.35);
}
.notice-card.upgrading {
  border-color: #a4d6ff;
  background: #eaf6ff;
}
.notice-card.upgrading .icon-btn{
  color:#3b82f6;
  border-color: rgba(59,130,246,0.35);
}
.notice-card.roadworks {
  border-color: #ffd386;
  background: #fff8e6;
}
.notice-card.roadworks .icon-btn{
  color:#f59e0b;
  border-color: rgba(245,158,11,0.35);
}
.notice-card.events {
  border-color: #8cd5a0;
  background: #e6fbef;
}
.notice-card.events .icon-btn{
  color:#22c55e;
  border-color: rgba(34,197,94,0.35);
}
</style>
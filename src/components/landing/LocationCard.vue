<template>
  <article class="location-card">
    <div class="location-card__iconWrap" :style="{ background: location.iconColor }" aria-hidden="true">
      <BaseIcon :icon="locationIcon" :size="20" stroke-width="2" />
    </div>

    <div class="location-card__content">
      <div class="location-card__topRow">
        <h3 class="location-card__name">{{ location.name }}</h3>

        <button class="fav-btn" type="button" aria-label="Favourite">
          <BaseIcon :icon="Heart" :size="18" stroke-width="2" />
        </button>
      </div>

      <div class="location-card__category">{{ location.category }}</div>
      <div class="location-card__address">{{ location.address }}</div>

      <div class="location-card__tagRow">
        <span class="distance-tag">{{ location.distance }} away</span>
        <span class="a11y-pill">{{ location.accessibility }}</span>
      </div>

      <div class="location-card__rating">Rating: {{ location.rating }}</div>
    </div>
  </article>
</template>

<script>
import BaseIcon from '@/components/shared/BaseIcon.vue';
import { Heart, Home, Stethoscope, Users, Activity } from 'lucide-vue-next';

export default {
  name: 'LocationCard',
  components: { BaseIcon },
  props: {
    location: { type: Object, required: true },
  },
  computed: {
    locationIcon() {
      const type = this.location.iconType;
      switch (type) {
        case 'stethoscope':
          return Stethoscope;
        case 'users':
          return Users;
        case 'activity':
          return Activity;
        case 'home':
        default:
          return Home;
      }
    },
  },
  data() {
    return { Heart };
  },
};
</script>

<style scoped>
.location-card {
  width: 100%;
  display: flex;
  gap: 0.95rem;
  align-items: flex-start;
  background: #fff;
  border: 1px solid #dce8f0;
  border-radius: 14px;
  padding: 0.9rem 0.95rem;
}

.location-card__iconWrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #fff;
  flex: 0 0 auto;
}

.location-card__content {
  flex: 1 1 auto;
  min-width: 0;
}

.location-card__topRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.location-card__name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 900;
  color: #0f172a;
}

.fav-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.05rem;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.location-card__category {
  margin-top: 0.25rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: #64748b;
}

.location-card__address {
  margin-top: 0.25rem;
  font-size: 0.78rem;
  color: #475569;
  line-height: 1.25;
}

.location-card__tagRow {
  margin-top: 0.55rem;
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  align-items: center;
}

.distance-tag {
  font-size: 0.78rem;
  font-weight: 800;
  color: #334155;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.15);
}

.a11y-pill {
  font-size: 0.78rem;
  font-weight: 900;
  color: #047857;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.18);
}

.location-card__rating {
  margin-top: 0.6rem;
  font-size: 0.78rem;
  font-weight: 900;
  color: #6b7280;
}
</style>
<template>
  <section class="places-section">
    <h2>{{ filteredPlaces.length }} Places Found</h2>
    <div class="places-list">
      <article class="place-card" v-for="place in filteredPlaces" :key="place.id">
        <div class="place-icon" :class="`icon-${place.iconType}`">
          <component :is="getIcon(place.iconType)" :size="18" stroke-width="2" class="icon-svg" />
        </div>
        <div class="place-content">
          <div class="place-header">
            <h4>{{ place.name }}</h4>
            <Heart class="heart-icon" :size="18" stroke-width="2" />
          </div>
          <p class="place-type">{{ place.type }}</p>
          <p class="place-address">
            <MapPin class="address-icon" :size="16" stroke-width="2" />
            {{ place.address }}
          </p>
          <div class="place-meta">
            <span>{{ place.distance }} away</span>
            <span class="badge">{{ place.badge }}</span>
          </div>
          <div class="rating-row">
            <span>Rating: {{ place.rating }}/5</span>
            <span class="crowd-status" :class="place.status.toLowerCase().replace(' ', '-')">{{ place.status }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MapPin, Heart, Stethoscope, Home, Users, Activity } from 'lucide-vue-next';

type IconType = 'stethoscope' | 'hospital' | 'users' | 'activity';

interface Place {
  id: number;
  name: string;
  type: string;
  address: string;
  distance: string;
  rating: string;
  status: string;
  iconType: IconType;
  badge: string;
  color: string;
}

const places = ref<Place[]>([
  { id: 1, name: 'Ang Mo Kio Polyclinic', type: 'Polyclinic', address: '21 Ang Mo Kio Central 2, #01-01', distance: '1.2 km', rating: '4.2/5', status: 'Not Crowded', iconType: 'stethoscope', badge: 'Wheelchair Access', color: '#ff7f50' },
  { id: 2, name: 'Tan Tock Seng Hospital', type: 'Hospital', address: '11 Jalan Tan Tock Seng', distance: '2.5 km', rating: '4.5/5', status: 'Busy', iconType: 'hospital', badge: 'Wheelchair Access', color: '#ff7f50' },
  { id: 3, name: 'Bishan Community Club', type: 'Community Centre', address: '51 Bishan Street 13', distance: '0.8 km', rating: '4.3/5', status: 'Not Crowded', iconType: 'users', badge: 'Wheelchair Access', color: '#64b5f6' },
  { id: 4, name: 'Toa Payoh Active Ageing Centre', type: 'Active Ageing Centre', address: 'Block 93 Toa Payoh Lorong 4, #01-324', distance: '1.9 km', rating: '4.1/5', status: 'Moderate', iconType: 'activity', badge: 'Wheelchair Access', color: '#64b5f6' }
]);

const getIcon = (iconType: IconType) => {
  switch (iconType) {
    case 'stethoscope':
      return Stethoscope;
    case 'hospital':
      return Home;
    case 'users':
      return Users;
    case 'activity':
      return Activity;
    default:
      return Home;
  }
};

const filteredPlaces = computed(() => places.value);
</script>

<style scoped>
.places-section {
  padding: 1rem;
}

.places-section h2 {
  margin: 0 0 1rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3247;
}

.places-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.place-card {
  display: flex;
  background: #fff;
  border: 1px solid #e5ecf6;
  border-radius: 12px;
  padding: 0.9rem;
  gap: 0.9rem;
  align-items: flex-start;
  transition: box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
}

.place-card:hover {
  box-shadow: 0 4px 12px rgba(34, 69, 116, 0.08);
  border-color: #ff6b36;
}

.place-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}

.place-icon .icon-svg {
  width: 24px;
  height: 24px;
  stroke: #fff;
  color: #fff;
}

.icon-stethoscope {
  background-color: #ff7f50;
}

.icon-hospital {
  background-color: #ff7f50;
}

.icon-users {
  background-color: #64b5f6;
}

.icon-activity {
  background-color: #64b5f6;
}

.place-content {
  flex: 1;
}

.place-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}

.place-header h4 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e3247;
}

.heart {
  cursor: pointer;
  transition: color 0.2s;
}

.heart-icon {
  width: 20px;
  height: 20px;
  color: #c5d1e0;
  cursor: pointer;
  transition: color 0.2s;
}

.heart-icon:hover {
  color: #ff6b36;
}

.place-type {
  margin: 0.1rem 0 0.05rem;
  font-size: 0.9rem;
  color: #6b7c93;
  font-weight: 500;
}

.place-address {
  margin: 0.1rem 0 0.5rem;
  font-size: 0.9rem;
  color: #52647d;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.address-icon {
  width: 16px;
  height: 16px;
  color: #52647d;
  flex-shrink: 0;
}

.place-meta {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  color: #344d6e;
  flex-wrap: wrap;
}

.place-meta span:first-child {
  font-weight: 600;
}

.badge {
  background: #d6f3e8;
  color: #2d8659;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.rating-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.85rem;
  color: #344d6e;
}

.crowd-status {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

.crowd-status.not-crowded {
  background: #d8f2de;
  color: #2f8d53;
}

.crowd-status.busy {
  background: #fff0d2;
  color: #ca7f08;
}

.crowd-status.moderate {
  background: #e8f0ff;
  color: #3869b0;
}

.crowd-status.relaxed {
  background: #d7f4e9;
  color: #2b7a51;
}
</style>

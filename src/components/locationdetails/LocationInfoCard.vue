<template>
  <div class="info-card">
    <p class="section-title">Location Details</p>

    <div class="row">
        <MapPinIcon class="h-5 w-5 icon" />
        <div>
            <p class="label">Address</p>
            <p class="value">{{ location.address }}</p>
        </div>
    </div>

    <div class="row">
        <ClockIcon class="h-5 w-5 icon" />
        <div>
            <p class="label">Operating Hours</p>
            <p class="value">{{ location.hours }}</p>
        </div>
    </div>

    <div class="row">
        <PhoneIcon class="h-5 w-5 icon" />
        <div>
            <p class="label">Contact Number</p>
            <a class="phone" :href="`tel:${location.phone}`">
            {{ location.phone }}
            </a>
        </div>
    </div>

    <div class="about">
        <p class="label">About</p>
        <p class="value">{{ location.about }}</p>
    </div>

    <div v-if="location.wheelchair" class="wheelchair">
        Wheelchair Accessible Facility
    </div>

  </div>
</template>

<script setup>
import {
    MapPinIcon,
    ClockIcon,
    PhoneIcon
} from '@heroicons/vue/24/outline'

defineProps({ location: Object })
</script>

<style scoped>
.info-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;              
}

.section-title {
  margin-top: 0;       
  margin-bottom: 0px;
  font-weight: 700;
  font-size: 20px;
}

.row {
  display: flex;
  gap: 12px;
  align-items: flex-start;   
}

.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transform: translateY(2px);
}

.row > div {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.label, .value {
  margin: 0;
  line-height: 1.4; 
}

.label {
  font-weight: 700;
  font-size: 14px;
}

.value {
  color: #6b7280;
  font-size: 14px;
}

.phone {
  color: #2563eb;
  font-weight: 700;
  font-size: 14px;
  text-decoration: underline;
}

.wheelchair {
  border: 2px solid #22c55e;
  background: #ecfdf5;
  color: #15803d;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px
}

.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 3px;
}
</style>
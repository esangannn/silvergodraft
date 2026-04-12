<template>
  <div class="navigation-card">
    <a class="directions-btn" :href="mapsUrl" target="_blank" rel="noopener noreferrer">
      <PaperAirplaneIcon class="btn-icon" />
      Get Directions
    </a>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  address: { type: String, default: '' }
})

const mapsUrl = computed(() =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(props.address)}`
)
</script>

<style scoped>
.navigation-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.directions-btn {
  width: 100%;
  background-color: #335c81;
  color: white;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.directions-btn:hover {
  background-color: #264a6a;
}

.btn-icon {
  width: 18px;
  height: 18px;
  transform: rotate(-45deg) translateY(-2px);
}

</style>

<script setup>
import { GoogleMap, AdvancedMarker, InfoWindow } from 'vue3-google-map'
import { ref, watch, computed } from 'vue'
import LocationCard from './LocationCard.vue'
import { useFacilityStore } from '@/stores/facilityStore'

const props = defineProps({
  locations: {
    type: Array,
    default: () => []
  },
  activeLocationId: {
    type: String,
    default: null
  }
})

const facilityStore = useFacilityStore()
const userLocation = computed(() => facilityStore.userLocation)

const center = { lat: 1.3651, lng: 103.8198 }
const activeMarkerId = ref(null)
const mapRef = ref(null)
const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY

watch(() => props.locations, (locations) => {
  if (!mapRef.value?.map) return
  const user = userLocation.value
  if (locations.length === 0 && !user) return
  const bounds = new google.maps.LatLngBounds()
  locations.forEach(loc => bounds.extend({ lat: loc.lat, lng: loc.lng }))
  if (user) bounds.extend({ lat: user.lat, lng: user.lng })
  mapRef.value.map.fitBounds(bounds)
}, { deep: true })

watch(userLocation, (coords) => {
  if (!coords || !mapRef.value?.map) return
  if (props.locations.length === 0) {
    mapRef.value.map.panTo({ lat: coords.lat, lng: coords.lng })
    mapRef.value.map.setZoom(15)
  }
})

// When a card in the results list is clicked, pan to it and open its InfoWindow
watch(() => props.activeLocationId, (id) => {
  if (!id || !mapRef.value?.map) return
  const loc = props.locations.find(l => l.id === id)
  if (!loc) return
  mapRef.value.map.panTo({ lat: loc.lat, lng: loc.lng })
  mapRef.value.map.setZoom(16)
  activeMarkerId.value = id
})

const openInfoWindow = (id) => {
  activeMarkerId.value = id
}
</script>

<template>
  <GoogleMap
    ref="mapRef"
    :api-key="mapsApiKey"
    style="width: 100%; height: 500px; border-radius: 12px;"
    :center="center"
    :zoom="11.5"
    mapId="DEMO_MAP_ID"
  >
    <AdvancedMarker
      v-if="userLocation"
      :options="{ position: { lat: userLocation.lat, lng: userLocation.lng }, title: 'Your location', zIndex: 9999 }"
      :pinOptions="{ background: '#dc2626', borderColor: '#ffffff', glyphColor: '#ffffff', scale: 1.2 }"
    />

    <AdvancedMarker
      v-for="location in locations"
      :key="location.id"
      :options="{ position: { lat: location.lat, lng: location.lng }, title: location.name }"
      :pinOptions="{ background: location.iconColor, borderColor: '#ffffff', glyphColor: '#ffffff' }"
      @gmp-click="openInfoWindow(location.id)"
    >
      <InfoWindow 
        v-if="activeMarkerId === location.id"
        @closeclick="activeMarkerId = null"
      >
        <div style="min-width: 280px; padding: 0.5rem 0;">
          <LocationCard style="border: none; padding: 0; box-shadow: none;" :location="location" />
        </div>
      </InfoWindow>
    </AdvancedMarker>
  </GoogleMap>
</template>
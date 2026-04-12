<script setup>
import { GoogleMap, AdvancedMarker, InfoWindow } from 'vue3-google-map'
import { ref, watch } from 'vue'
import LocationCard from './LocationCard.vue'

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

const center = { lat: 1.3651, lng: 103.8198 }
const activeMarkerId = ref(null)
const mapRef = ref(null)

watch(() => props.locations, (locations) => {
  if (!mapRef.value?.map || locations.length === 0) return
  const bounds = new google.maps.LatLngBounds()
  locations.forEach(loc => bounds.extend({ lat: loc.lat, lng: loc.lng }))
  mapRef.value.map.fitBounds(bounds)
}, { deep: true })

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
    api-key="AIzaSyD_-r610v9OcV51HW_N1m9yNfjIBQhhNG4"
    style="width: 100%; height: 500px; border-radius: 12px;"
    :center="center"
    :zoom="11.5"
    mapId="DEMO_MAP_ID"
  >
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
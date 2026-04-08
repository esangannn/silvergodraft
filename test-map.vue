<script setup>
import { GoogleMap, AdvancedMarker, Pin, InfoWindow } from 'vue3-google-map'
import { ref } from 'vue'

const center = { lat: 1.3521, lng: 103.8198 }
const locs = [{id: 1, lat: 1.35, lng: 103.81, name: 'Test'}]
</script>
<template>
  <GoogleMap api-key="AIzaSyD_-r610v9OcV51HW_N1m9yNfjIBQhhNG4" :center="center" :zoom="12" mapId="DEMO_MAP_ID">
    <AdvancedMarker v-for="l in locs" :key="l.id" :options="{ position: {lat: l.lat, lng: l.lng} }">
      <Pin />
      <InfoWindow>
        <div>{{ l.name }}</div>
      </InfoWindow>
    </AdvancedMarker>
  </GoogleMap>
</template>

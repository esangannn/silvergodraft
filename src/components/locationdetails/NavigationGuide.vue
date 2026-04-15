<template>
  <div class="navigation-card">
    <div class="actions">
      <button
        class="directions-btn"
        type="button"
        :disabled="locating"
        @click="toggleDirections"
      >
        <PaperAirplaneIcon class="btn-icon" />
        <span v-if="locating">Locating you…</span>
        <span v-else>{{ open ? 'Hide Directions' : t('navigation.getDirections') }}</span>
      </button>

      <a
        class="open-link"
        :href="externalUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Maps
      </a>
    </div>

    <p v-if="geoError" class="error-msg">{{ geoError }}</p>

    <div v-if="open" class="directions-panel">
      <div class="mode-row" role="tablist" aria-label="Mode of transport">
        <button
          v-for="m in modes"
          :key="m.value"
          type="button"
          role="tab"
          :aria-selected="mode === m.value"
          class="mode-btn"
          :class="{ 'mode-btn--active': mode === m.value }"
          :disabled="!origin"
          @click="mode = m.value"
        >
          <component :is="m.icon" class="mode-icon" />
          <span>{{ m.label }}</span>
        </button>
      </div>

      <div class="map-wrap">
        <iframe
          :src="embedUrl"
          class="directions-frame"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
      </div>

      <div v-if="origin" class="steps-section">
        <div v-if="stepsLoading" class="steps-status">Loading step-by-step directions…</div>
        <div v-else-if="stepsError" class="steps-status steps-status--error">{{ stepsError }}</div>
        <template v-else-if="steps.length > 0">
          <div class="steps-summary">
            <strong>{{ routeSummary.duration }}</strong>
            <span>· {{ routeSummary.distance }}</span>
          </div>
          <ol class="steps-list">
            <li v-for="(step, i) in steps" :key="i" class="step-item">
              <div class="step-header">
                <span class="step-index">{{ i + 1 }}</span>
                <div class="step-main">
                  <div v-if="step.transit" class="transit-chip-row">
                    <span
                      class="transit-chip"
                      :style="{ background: step.transit.color, color: step.transit.textColor }"
                    >
                      {{ step.transit.lineLabel }}
                    </span>
                    <span class="transit-vehicle">{{ step.transit.vehicleName }}</span>
                  </div>
                  <div class="step-instruction" v-html="step.instruction"></div>
                  <div v-if="step.transit" class="transit-stops">
                    <div>From <strong>{{ step.transit.departureStop }}</strong></div>
                    <div>To <strong>{{ step.transit.arrivalStop }}</strong></div>
                    <div v-if="step.transit.numStops != null">
                      {{ step.transit.numStops }} stop<span v-if="step.transit.numStops !== 1">s</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="step-meta">
                <span v-if="step.distance">{{ step.distance }}</span>
                <span v-if="step.duration">· {{ step.duration }}</span>
              </div>
            </li>
          </ol>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PaperAirplaneIcon,
  TruckIcon,
  UserIcon,
  BuildingOffice2Icon,
} from '@heroicons/vue/24/outline'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { useFacilityStore } from '@/stores/facilityStore'

const { t } = useI18n()

const props = defineProps({
  address: { type: String, default: '' },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
})

const MAPS_EMBED_KEY = import.meta.env.VITE_MAPS_API_KEY

const facilityStore = useFacilityStore()

const open = ref(false)
const origin = ref(null) // "lat,lng" string or null
const mode = ref('driving')
const locating = ref(false)
const geoError = ref('')

const steps = ref([])
const routeSummary = ref({ duration: '', distance: '' })
const stepsLoading = ref(false)
const stepsError = ref('')

const modes = [
  { value: 'driving',   label: 'Drive',   icon: TruckIcon },
  { value: 'transit',   label: 'Transit', icon: BuildingOffice2Icon },
  { value: 'walking',   label: 'Walk',    icon: UserIcon },
  { value: 'bicycling', label: 'Cycle',   icon: PaperAirplaneIcon },
]

const destinationParam = computed(() =>
  props.lat != null && props.lng != null
    ? `${props.lat},${props.lng}`
    : props.address
)

const externalUrl = computed(() => {
  const base = 'https://www.google.com/maps/dir/?api=1'
  const dest = `&destination=${encodeURIComponent(destinationParam.value)}`
  const travel = `&travelmode=${mode.value}`

  // Prefer the searched location so Google Maps opens with the same origin
  // the user specified here, not their device's current location.
  const searched = facilityStore.userLocation
  const originStr = searched
    ? `${searched.lat},${searched.lng}`
    : origin.value

  const orig = originStr ? `&origin=${encodeURIComponent(originStr)}` : ''
  return `${base}${orig}${dest}${travel}`
})

const embedUrl = computed(() => {
  const base = 'https://www.google.com/maps/embed/v1'
  const dest = encodeURIComponent(destinationParam.value)
  if (origin.value) {
    const orig = encodeURIComponent(origin.value)
    return `${base}/directions?key=${MAPS_EMBED_KEY}&origin=${orig}&destination=${dest}&mode=${mode.value}`
  }
  return `${base}/place?key=${MAPS_EMBED_KEY}&q=${dest}`
})

// Lazy-loaded Google Maps Routes library (shared across toggles / mode changes)
let routesPromise = null
function loadRoutes() {
  if (!routesPromise) {
    setOptions({ key: MAPS_EMBED_KEY, v: 'weekly' })
    routesPromise = importLibrary('routes')
  }
  return routesPromise
}

function parseOrigin() {
  if (!origin.value) return null
  const [latStr, lngStr] = origin.value.split(',')
  return { lat: parseFloat(latStr), lng: parseFloat(lngStr) }
}

function destinationLatLng() {
  if (props.lat != null && props.lng != null) {
    return { lat: props.lat, lng: props.lng }
  }
  return props.address // DirectionsService will geocode it
}

function travelModeEnum(routes) {
  switch (mode.value) {
    case 'transit':   return routes.TravelMode.TRANSIT
    case 'walking':   return routes.TravelMode.WALKING
    case 'bicycling': return routes.TravelMode.BICYCLING
    default:          return routes.TravelMode.DRIVING
  }
}

function mapTransitDetails(td) {
  if (!td) return null
  const line = td.line || {}
  const vehicle = line.vehicle || {}
  return {
    lineLabel: line.short_name || line.name || vehicle.name || '',
    vehicleName: vehicle.name || '',
    color: line.color || '#335c81',
    textColor: line.text_color || '#ffffff',
    departureStop: td.departure_stop?.name || '',
    arrivalStop: td.arrival_stop?.name || '',
    numStops: td.num_stops ?? null,
  }
}

async function fetchSteps() {
  steps.value = []
  stepsError.value = ''
  routeSummary.value = { duration: '', distance: '' }

  const orig = parseOrigin()
  if (!orig) return

  stepsLoading.value = true
  try {
    const routes = await loadRoutes()
    const svc = new routes.DirectionsService()
    const res = await svc.route({
      origin: orig,
      destination: destinationLatLng(),
      travelMode: travelModeEnum(routes),
    })

    const leg = res.routes?.[0]?.legs?.[0]
    if (!leg) {
      stepsError.value = 'No route found for this mode.'
      return
    }

    routeSummary.value = {
      duration: leg.duration?.text || '',
      distance: leg.distance?.text || '',
    }

    steps.value = (leg.steps || []).map((s) => ({
      instruction: s.instructions || '',
      distance: s.distance?.text || '',
      duration: s.duration?.text || '',
      transit: mapTransitDetails(s.transit),
    }))
  } catch (err) {
    // Dump everything we can see so we can diagnose in DevTools.
    console.error('Directions lookup failed', {
      err,
      code: err?.code,
      status: err?.status,
      message: err?.message,
      name: err?.name,
      stack: err?.stack,
    })

    const haystack = `${err?.code || ''} ${err?.status || ''} ${err?.message || ''} ${err?.name || ''}`

    if (/REQUEST_DENIED/i.test(haystack)) {
      stepsError.value =
        'Directions API request denied. Enable the "Directions API" on your Google Cloud project for this key (separate from the Embed API).'
    } else if (/ZERO_RESULTS/i.test(haystack)) {
      stepsError.value =
        mode.value === 'transit'
          ? 'No transit route available between these points.'
          : 'No route available for this mode between these points.'
    } else if (/OVER_QUERY_LIMIT|RESOURCE_EXHAUSTED/i.test(haystack)) {
      stepsError.value = 'Directions quota exceeded. Check billing on your Google Cloud project.'
    } else if (/NOT_FOUND/i.test(haystack)) {
      stepsError.value = 'Could not geocode the origin or destination.'
    } else if (err?.message) {
      stepsError.value = `Could not load directions: ${err.message}`
    } else {
      stepsError.value = 'Could not load step-by-step directions. Check the browser console for details.'
    }
  } finally {
    stepsLoading.value = false
  }
}

// Refetch steps whenever the panel opens, origin changes, or mode changes.
watch(
  () => [open.value, origin.value, mode.value],
  ([isOpen, org]) => {
    if (isOpen && org) fetchSteps()
  },
  { immediate: false }
)

function toggleDirections() {
  if (open.value) {
    open.value = false
    return
  }

  geoError.value = ''

  const searched = facilityStore.userLocation
  if (searched) {
    origin.value = `${searched.lat},${searched.lng}`
    open.value = true
    return
  }

  if (!navigator.geolocation) {
    origin.value = null
    open.value = true
    geoError.value = 'Location unavailable — showing destination only.'
    return
  }

  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locating.value = false
      origin.value = `${pos.coords.latitude},${pos.coords.longitude}`
      open.value = true
    },
    () => {
      locating.value = false
      origin.value = null
      open.value = true
      geoError.value = 'Could not access your location — showing destination only.'
    },
    { enableHighAccuracy: false, timeout: 8000 }
  )
}
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

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.directions-btn:hover {
  background-color: #264a6a;
}

.directions-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-icon {
  width: 18px;
  height: 18px;
  transform: rotate(-45deg) translateY(-2px);
}

.open-link {
  align-self: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #335c81;
  text-decoration: underline;
}

.error-msg {
  margin: 0;
  font-size: 0.82rem;
  color: #b45309;
  font-weight: 600;
}

.directions-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mode-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.mode-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 6px;
  border-radius: 999px;
  border: 1px solid #dce8f0;
  background: #f8fbff;
  color: #23549f;
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
}

.mode-btn:hover:not(:disabled) {
  background: #eaf4ff;
}

.mode-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.mode-btn--active {
  background: #335c81;
  color: #fff;
  border-color: #335c81;
}

.mode-icon {
  width: 16px;
  height: 16px;
}

.map-wrap {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5ecf6;
}

.directions-frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.steps-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.steps-status {
  font-size: 0.88rem;
  color: #3d526f;
  font-weight: 600;
  text-align: center;
  padding: 10px 0;
}

.steps-status--error {
  color: #b45309;
}

.steps-summary {
  font-size: 0.9rem;
  color: #1f2937;
  display: flex;
  gap: 6px;
  align-items: baseline;
  padding: 6px 2px 2px;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  background: #f8fbff;
  border: 1px solid #e5ecf6;
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.step-index {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #335c81;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.step-main {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transit-chip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.transit-chip {
  padding: 2px 10px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 0.85rem;
}

.transit-vehicle {
  font-size: 0.82rem;
  color: #556b84;
  font-weight: 600;
}

.step-instruction {
  font-size: 0.9rem;
  color: #1f2937;
  line-height: 1.35;
}

.step-instruction :deep(b) {
  font-weight: 700;
}

.transit-stops {
  font-size: 0.82rem;
  color: #3d526f;
  line-height: 1.4;
}

.step-meta {
  font-size: 0.78rem;
  color: #6b7c93;
  font-weight: 600;
  padding-left: 32px;
}
</style>

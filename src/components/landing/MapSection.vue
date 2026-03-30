<template>
  <section class="map-section" aria-label="Map">
    <div class="map-card">
      <div ref="mapCanvas" class="map-canvas" :class="{ 'map-canvas--hidden': Boolean(mapError) }" />

      <div v-if="isLoading && !mapError" class="map-status" role="status" aria-live="polite">
        Loading map...
      </div>

      <div v-if="mapError" class="map-fallback" role="status" aria-live="polite">
        {{ mapError }}
      </div>
    </div>
  </section>
</template>
<script>
const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-js';
const SINGAPORE_CENTER = { lat: 1.3521, lng: 103.8198 };

const MOCK_LOCATIONS = [
  { id: 'ang-mo-kio', name: 'Ang Mo Kio', position: { lat: 1.3691, lng: 103.8454 } },
  { id: 'bishan', name: 'Bishan', position: { lat: 1.3509, lng: 103.8483 } },
  { id: 'tampines', name: 'Tampines', position: { lat: 1.3526, lng: 103.9451 } },
];

export default {
  name: 'MapSection',
  data() {
    return {
      map: null,
      markers: [],
      mapError: '',
      isLoading: false,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      restoreAuthFailure: null,
      mapErrorObserver: null,
    };
  },
  mounted() {
    this.initializeMap();
  },
  beforeUnmount() {
    this.teardownMap();
  },
  methods: {
    async initializeMap() {
      if (!this.apiKey) {
        this.mapError = 'Map unavailable — API key not configured';
        return;
      }

      this.isLoading = true;
      this.mapError = '';

      try {
        this.setAuthFailureHandler();
        await this.loadGoogleMaps();

        if (!this.$refs.mapCanvas) {
          return;
        }

        this.map = new window.google.maps.Map(this.$refs.mapCanvas, {
          center: SINGAPORE_CENTER,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        this.markers = MOCK_LOCATIONS.map((location) =>
          new window.google.maps.Marker({
            map: this.map,
            position: location.position,
            title: location.name,
          })
        );

        this.observeGoogleMapErrors();
      } catch (error) {
        console.error('Failed to initialize Google Maps:', error);
        this.mapError = 'Map unavailable — unable to load Google Maps';
      } finally {
        this.isLoading = false;
      }
    },
    loadGoogleMaps() {
      if (window.google && window.google.maps) {
        return Promise.resolve();
      }

      const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
      if (existingScript) {
        return this.waitForScript(existingScript);
      }

      const script = document.createElement('script');
      script.id = GOOGLE_MAPS_SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(this.apiKey)}&v=weekly&loading=async`;
      script.async = true;
      script.defer = true;

      document.head.appendChild(script);
      return this.waitForScript(script);
    },
    waitForScript(script) {
      return new Promise((resolve, reject) => {
        const onLoad = () => {
          cleanup();
          if (window.google && window.google.maps) {
            resolve();
            return;
          }
          reject(new Error('Google Maps script loaded but API is unavailable.'));
        };

        const onError = () => {
          cleanup();
          reject(new Error('Google Maps script failed to load.'));
        };

        const cleanup = () => {
          script.removeEventListener('load', onLoad);
          script.removeEventListener('error', onError);
        };

        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);
      });
    },
    setAuthFailureHandler() {
      const previousHandler = window.gm_authFailure;
      window.gm_authFailure = () => {
        this.mapError = 'Map unavailable — unable to load Google Maps';
        if (typeof previousHandler === 'function') {
          previousHandler();
        }
      };

      this.restoreAuthFailure = () => {
        if (typeof previousHandler === 'function') {
          window.gm_authFailure = previousHandler;
          return;
        }
        delete window.gm_authFailure;
      };
    },
    observeGoogleMapErrors() {
      if (!this.$refs.mapCanvas || this.mapErrorObserver) {
        return;
      }

      this.mapErrorObserver = new MutationObserver(() => {
        const hasError = this.$refs.mapCanvas.querySelector('.gm-err-container');
        if (hasError) {
          this.mapError = 'Map unavailable — unable to load Google Maps';
        }
      });

      this.mapErrorObserver.observe(this.$refs.mapCanvas, {
        childList: true,
        subtree: true,
      });
    },
    teardownMap() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
      this.map = null;

      if (this.mapErrorObserver) {
        this.mapErrorObserver.disconnect();
        this.mapErrorObserver = null;
      }

      if (typeof this.restoreAuthFailure === 'function') {
        this.restoreAuthFailure();
        this.restoreAuthFailure = null;
      }
    },
  },
};
</script>
<style scoped>
.map-section {
  margin: 0 0 1.2rem;
}

.map-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 285px;
  width: 100%;
  border: 1px solid #e5ecf6;
  background: #dde8f6;
}

.map-canvas {
  min-height: 285px;
  width: 100%;
  height: 100%;
}

.map-canvas--hidden {
  visibility: hidden;
}

.map-status,
.map-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  font-weight: 700;
  color: #1e3247;
  padding: 0.5rem;
}

.map-status {
  background: rgba(255, 255, 255, 0.45);
}

.map-fallback {
  background: #dde8f6;
}

.map-card :deep(.gm-err-container) {
  display: none !important;
}
</style>
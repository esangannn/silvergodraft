<template>
  <section class="map-section" aria-label="Map">
    <div class="map-card">
      <div class="map-controls" aria-hidden="true">
        <button class="map-btn" type="button">+</button>
        <button class="map-btn map-btn--down" type="button">−</button>
      </div>

      <div class="map-pins" aria-hidden="true">
        <div
          v-for="pin in pins"
          :key="pin.id"
          class="pin"
          :class="`pin--${pin.tone}`"
          :style="{ left: `${pin.xPct}%`, top: `${pin.yPct}%` }"
        />
      </div>

      <div class="map-error-modal">
        <div class="google-label">Google</div>
        <div class="modal-text">This page can't load Google Maps correctly.</div>
        <div class="modal-text">Do you own this website?</div>
        <button class="ok-button" type="button" @click="handleOK">OK</button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'MapSection',
  data() {
    return {
      pins: [
        { id: 'p1', xPct: 18, yPct: 55, tone: 'green' },
        { id: 'p2', xPct: 33, yPct: 45, tone: 'purple' },
        { id: 'p3', xPct: 44, yPct: 58, tone: 'blue' },
        { id: 'p4', xPct: 52, yPct: 40, tone: 'green' },
        { id: 'p5', xPct: 61, yPct: 52, tone: 'purple' },
        { id: 'p6', xPct: 70, yPct: 60, tone: 'green' },
        { id: 'p7', xPct: 78, yPct: 46, tone: 'purple' },
        { id: 'p8', xPct: 86, yPct: 55, tone: 'blue' },
        { id: 'p9', xPct: 91, yPct: 40, tone: 'green' },
      ],
    };
  },
  methods: {
    handleOK() {
      // Placeholder-only; keeps parity with prototype error modal.
      console.log('Map OK button clicked');
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
  background: linear-gradient(180deg, rgba(115, 150, 97, 0.2), rgba(69, 103, 180, 0.1));
}

.map-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 40%, rgba(34, 197, 94, 0.35), rgba(34, 197, 94, 0) 44%),
    radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0) 48%),
    linear-gradient(90deg, #0f766e 0%, #0f766e 7%, #1f2937 7%, #1f2937 93%, #0f766e 93%, #0f766e 100%);
  opacity: 0.85;
}

.map-controls {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  z-index: 2;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}

.map-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #fff;
  font-weight: 900;
  cursor: pointer;
}

.map-btn--down {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.pin {
  position: absolute;
  width: 14px;
  height: 14px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 2;
  background: #fff;
  border: 3px solid #fff;
  box-shadow: 0 12px 18px rgba(0, 0, 0, 0.18);
}

.pin::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: 50%;
  background: currentColor;
}

.pin--green {
  color: #22c55e;
}
.pin--purple {
  color: #a855f7;
}
.pin--blue {
  color: #60a5fa;
}

.map-error-modal {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  z-index: 3;
  background: #fff;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  text-align: center;
  max-width: 310px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.google-label {
  font-weight: 800;
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}

.modal-text {
  font-size: 0.9rem;
  color: #1e3247;
  line-height: 1.25;
  margin: 0.1rem 0;
}

.ok-button {
  margin-top: 0.65rem;
  background: #fff;
  border: 1px solid rgba(37, 99, 235, 0.3);
  color: #1d4ed8;
  padding: 0.35rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
}
</style>
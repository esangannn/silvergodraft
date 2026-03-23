<template>
  <section class="map-section">
    <div class="map-placeholder">
      <div class="map-error-modal">
        <p class="google-label">Google</p>
        <p>This page can't load Google Maps correctly.</p>
        <p class="ownership-text">Do you own this website?</p>
        <button class="ok-button" @click="handleOK">OK</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MapSection',
  methods: {
    handleOK() {
      console.log('Map OK button clicked');
    }
  }
};
</script>

<style scoped>
.map-section {
  margin: 0 1rem 1.5rem;
  border-radius: 18px;
  overflow: hidden;
  min-height: 300px;
  background: linear-gradient(130deg, rgba(115, 150, 97, 0.2), rgba(69, 103, 180, 0.1));
  border: 1px solid #e5ecf6;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #7d9d79 0%, #6b8e6f 100%);
}

.map-error-modal {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.map-error-modal p {
  margin: 0.4rem 0;
  font-size: 0.95rem;
  color: #1e3247;
  line-height: 1.4;
}

.google-label {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.6rem;
}

.ownership-text {
  font-size: 0.9rem;
}

.ok-button {
  background: #2196f3;
  color: #fff;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.ok-button:hover {
  background-color: #1e88e5;
}

.ok-button:active {
  background-color: #1976d2;
}
</style>

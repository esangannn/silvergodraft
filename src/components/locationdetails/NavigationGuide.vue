<template>
  <div class="navigation-card">
    <button class="directions-btn">
      <PaperAirplaneIcon class="btn-icon" />
      Get Directions
    </button>

    <!-- placeholder -->
    <div class="guidance-container">
      <p class="section-label">How to Get There</p>

      <div class="steps-list">
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-content">
            <p class="step-title">Walk to Bus Stop</p>
            <p class="step-desc">Walk to nearest bus stop (200m, 3 mins)</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-content">
            <p class="step-title">Take Bus 88</p>
            <p class="step-desc">Board Bus 88 towards Ang Mo Kio (3 stops, 8 mins)</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-content">
            <p class="step-title">Walk to Destination</p>
            <p class="step-desc">Walk to Tan Tock Seng Hospital (150m, 2 mins)</p>
          </div>
        </div>
      </div>

      <div class="summary-row">
        <p class="total-time">Total Journey Time: <b>~15 minutes</b></p>
        <button class="google-maps-btn">
          Open in Google Maps
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
.navigation-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.directions-btn {
  width: 100%;
  background-color: #335c81; /* Matching the deep blue in your image */
  color: white;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.btn-icon {
  width: 18px;
  height: 18px;
  transform: rotate(-45deg) translateY(-2px);
}

.guidance-container {
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  padding: 16px;
}

.section-label {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 16px;
  margin-top: 0;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
}

.step-number {
  background: #335c81;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-title {
  font-weight: 700;
  font-size: 13px;
  margin: 0;
}

.step-desc {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.summary-row {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.total-time {
  font-size: 13px;
  margin-bottom: 12px;
}

.google-maps-btn {
  background-color: #61a375; /* Matching the green in your image */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.share-btn {
  width: 100%;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1e40af;
  padding: 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

</style>
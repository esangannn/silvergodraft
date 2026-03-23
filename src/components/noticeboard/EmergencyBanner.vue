<template>
  <div class="emergency-banner">
    <div>
      <h3>Emergency Alert</h3>
      <p>{{ message }}</p>
    </div>
    <BaseButton label="View Safety Tips" variant="secondary" />
  </div>
</template>
<script>
import BaseButton from '@/components/shared/BaseButton.vue';

export default {
  name: 'EmergencyBanner',
  components: { BaseButton },
  props: { message: { type: String, default: 'Health alert in your selected constituency' } }
};
</script>
<style scoped>
.emergency-banner {
  border: 1px solid #f18c4a;
  background: #fff2e3;
  padding: 1rem;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.emergency-banner h3 {
  margin: 0;
  color: #d1461e;
}
</style>
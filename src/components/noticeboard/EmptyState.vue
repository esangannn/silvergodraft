<template>
  <div class="empty-state">
    <div class="empty-circle" aria-hidden="true">
      <Home :size="34" />
    </div>
    <p>Your neighbourhood notices will appear once you select your area</p>
  </div>
</template>
<script>
import { Home } from 'lucide-vue-next';

export default {
  name: 'EmptyState',
  components: { Home }
};
</script>
<style scoped>
.empty-state {
  width: 100%;
  margin: 1.2rem 0 0.4rem;
  padding: 0.6rem 0;
  text-align: center;
}

.empty-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  margin: 0 auto 0.9rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(220, 232, 240, 0.8);
  display: grid;
  place-items: center;
  color: #ff6b36;
}
.empty-state p {
  font-size: 0.95rem;
  color: #3a5678;
  margin: 0;
}
</style>
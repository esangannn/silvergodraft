<template>
  <router-link to="/noticeboard" class="noticeboard-banner">
    <div class="banner-icon" aria-hidden="true"><Info :size="20" stroke-width="2" /></div>
    <div class="banner-content">
      <h2>Kampong Noticeboard</h2>
      <p>View local alerts and events</p>
    </div>
    <div class="banner-arrow" aria-hidden="true">›</div>
  </router-link>
</template>
<script>
import { Info } from 'lucide-vue-next';

export default {
  name: 'NoticeboardBanner',
  components: { Info }
};
</script>
<style scoped>
.noticeboard-banner {
  display: block;
  background: #fff;
  border: 1px solid #dce8f0;
  border-radius: 16px;
  padding: 1rem;
  text-decoration: none;
  color: #1d3455;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.banner-icon{
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #0f766e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.noticeboard-banner h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 900;
}

.noticeboard-banner p {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.banner-content{
  flex: 1 1 auto;
}

.banner-arrow{
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12);
  color: #0f766e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}
</style>
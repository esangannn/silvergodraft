<template>
  <div class="why-card">
    <h3>Why create an account?</h3>

    <div class="why-row">
      <div class="icon heart">
        <HeartIcon />
      </div>
      <p>Save your favourite locations and access them from any device</p>
    </div>

    <div class="why-row">
      <div class="icon home">
        <HomeIcon />
      </div>
      <p>Save your home postal code for personalised alerts</p>
    </div>

    <div class="why-row">
      <div class="icon bell">
        <BellIcon />
      </div>
      <p>Get notified about nearby health alerts and community events</p>
    </div>
  </div>
</template>

<script setup>
import { HeartIcon, HomeIcon, BellIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
.why-card{
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  padding: 20px;
  color:#1f2937;
}

h3{
  font-size:14px;
  font-weight:700;
  margin-bottom:14px;
}

.why-row{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:14px;
}

.why-row p{
  margin:0;
  font-size:14px;
  font-weight:500;
  line-height:1.5;
}

/* icon bubble */
.icon{
  width:34px;
  height:34px;
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.icon :deep(svg){
  width:18px;
  height:18px;
  stroke-width:2;
}

/* icon backgrounds */
.heart{ background:#ffe9e6; }
.home{  background:#e8f4ff; }
.bell{  background:#e7f8ee; }
</style>
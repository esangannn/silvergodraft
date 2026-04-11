<template>
  <div class="location-header">
    <button class="icon-btn" @click="$router.back()">
      <ArrowLeftIcon class="icon" />
    </button>

    <h1 class="title">Welcome</h1>

    <div style="width:20px"></div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
.location-header {
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;   
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 18px;    
  cursor: pointer;
}

.icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  color: #1f2937; 
}
</style>
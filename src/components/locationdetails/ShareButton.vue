<template>
  <button class="share-btn">
    <ShareIcon class="icon" />
    Share
  </button>
</template>

<script setup>
import { ShareIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
.share-btn {
  /* Layout */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  
  /* The "Pill" Look from your screenshot */
  background: #f0f7ff; 
  border: 1px solid #e0eefe;
  border-radius: 999px; 
  
  /* Text & Icon styling */
  color: #2563eb;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Minimal hover just so it feels like a button */
.share-btn:hover {
  background: #e0eefe;
}
</style>
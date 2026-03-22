<template>
  <section class="search-container">
    <div class="search-header">
      <h1 class="search-title">Find Healthcare & Activities Near You</h1>
      <p class="search-description">Discover nearby healthcare facilities, community centres, and senior-friendly activities in your area.</p>
    </div>
    <div class="search-input-group">
      <input 
        type="text" 
        placeholder="Enter Postal Code or Estate" 
        v-model="query" 
        class="search-input"
      />
      <button class="locate-btn" title="Use current location" @click="handleLocate">
        <MapPin :size="18" stroke-width="2" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MapPin } from 'lucide-vue-next';

const query = ref('');

const handleLocate = () => {
  console.log('Locate button clicked');
};
</script>

<style scoped>
.search-container {
  padding: 1rem;
  background: #fefcf8;
}

.search-header {
  margin-bottom: 1.2rem;
}

.search-title {
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e3247;
  line-height: 1.2;
}

.search-description {
  margin: 0;
  font-size: 0.95rem;
  color: #5a6f88;
  line-height: 1.4;
}

.search-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 1px solid #e5ecf6;
  border-radius: 999px;
  font-size: 0.95rem;
  background: #fff;
  color: #1e3247;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input::placeholder {
  color: #b8c5d8;
}

.search-input:focus {
  outline: none;
  border-color: #ff6b36;
  box-shadow: 0 0 0 3px rgba(255, 107, 54, 0.1);
}

.locate-btn {
  border: none;
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  background: #2ca86f;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.locate-btn svg {
  width: 20px;
  height: 20px;
  stroke: #fff;
}

.locate-btn:hover {
  background-color: #26935d;
  transform: scale(1.05);
}

.locate-btn:active {
  transform: scale(0.95);
}
</style>

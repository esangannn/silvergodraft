<template>
  <div class="select-card" aria-label="Select Constituency">
    <label for="constituency-select" class="select-label">Select Constituency</label>
    <select
      id="constituency-select"
      class="select-input"
      v-model="selected"
      @change="$emit('search', selected)"
    >
      <option value="" disabled>Choose your constituency</option>
      <option v-for="name in constituencies" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
  </div>
</template>
<script>
import { CONSTITUENCY_NAMES } from '@/data/constituencies';

export default {
  name: 'ConstituencySelector',
  emits: ['search'],
  data() {
    return {
      selected: '',
      constituencies: CONSTITUENCY_NAMES,
    };
  },
};
</script>
<style scoped>
.select-card {
  max-width: 920px;
  margin: 0 auto 1rem;
  background: #fff;
  border: 1px solid #dce8f0;
  border-radius: 18px;
  padding: 1.1rem;
}

.select-label{
  display: block;
  font-weight: 800;
  font-size: 1rem;
  color: #1e3247;
  margin-bottom: 0.6rem;
}

.select-input {
  width: 100%;
  height: 54px;
  border-radius: 999px;
  border: 1px solid #a5bed5;
  padding: 0 1.2rem;
  font-size: 1rem;
  color: #19345a;
  background: #fdfdfd;
  outline: none;
  font-weight: 700;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%2319345a' d='M6 8L0 0h12z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 1.2rem center;
}
</style>

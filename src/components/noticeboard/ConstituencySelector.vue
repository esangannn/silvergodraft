<template>
  <div class="select-card" aria-label="Select Constituency">
    <label class="select-label">Select Constituency</label>
    <input
      class="select-input"
      type="text"
      v-model="search"
      placeholder="e.g., Ang Mo Kio, Bedok"
      @keydown.enter="$emit('search', search)"
    />
  </div>
</template>
<script>
export default {
  name: 'ConstituencySelector',
  data() {
    return { search: '' };
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
  display: block;
  width: 100%;
  box-sizing: border-box;
  height: 54px;
  border-radius: 999px;
  border: 1px solid #a5bed5;
  padding: 0 1.2rem;
  font-size: 1rem;
  color: #19345a;
  background: #fdfdfd;
  outline: none;
  font-weight: 700;
}

.select-input::placeholder{
  color:#6f8fa9;
}
</style>
<template>
  <section class="search-section" aria-label="Search">
    <div class="search-text">
      <h1 class="search-title">Find Healthcare &amp; Activities Near You</h1>
      <p class="search-subtitle">
        Discover nearby healthcare facilities, community centres, and senior-friendly activities in your area.
      </p>
    </div>

    <div class="search-inputRow">
      <span class="search-inputIcon" aria-hidden="true">
        <Search :size="18" stroke-width="2" />
      </span>
      <input
        class="search-input"
        type="text"
        :value="inputValue"
        placeholder="Enter Postal Code or Estate"
        @input="onInput($event)"
        @keydown.enter="emitSearch"
      />
    </div>
  </section>
</template>
<script>
import { Search } from 'lucide-vue-next';

export default {
  name: 'SearchSection',
  data() {
    return { inputValue: '' };
  },
  methods: {
    onInput(e) {
      this.inputValue = e.target.value;
      // Keep parent in sync for filtering even without a dedicated Search button.
      this.$emit('search', this.inputValue);
    },
    emitSearch() {
      this.$emit('search', this.inputValue);
    },
  },
};
</script>
<style scoped>
.search-section {
  margin: 0.25rem 0 0.95rem;
}
.search-text {
  margin-bottom: 0.85rem;
}

.search-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 900;
  color: #1e3247;
}

.search-subtitle {
  margin: 0.35rem 0 0;
  color: #556b84;
  font-size: 0.9rem;
  line-height: 1.35;
}

.search-inputRow {
  width: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.9rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(209, 231, 255, 0.9);
  background: #fff;
}

.search-inputIcon {
  color: #5a6f88;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 700;
  color: #19345a;
}

.search-input::placeholder {
  color: #86a0b5;
  font-weight: 700;
}
</style>
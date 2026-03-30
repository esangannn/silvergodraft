<template>
  <div class="search-input-wrap">
    <input
      class="search-input"
      :placeholder="placeholder"
      v-model="value"
      @input="$emit('update:modelValue', value)"
    />
  </div>
</template>
<script>
export default {
  name: 'SearchInput',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  },
  data() {
    return {
      value: this.modelValue
    };
  },
  watch: {
    modelValue(newVal) {
      this.value = newVal;
    }
  }
};
</script>
<style scoped>
.search-input-wrap {
  width: 100%;
}
.search-input {
  width: 100%;
  height: 48px;
  border-radius: 999px;
  border: 1px solid #a5bed5;
  padding: 0 1rem;
  font-size: 1rem;
  color: #19345a;
  background: #fdfdfd;
}
.search-input::placeholder {
  color: #6f8fa9;
}
</style>
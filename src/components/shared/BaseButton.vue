<template>
  <button :class="['base-button', variant]" @click="$emit('click')">{{ label }}</button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    label: { type: String, default: 'Button' },
    variant: { type: String, default: 'primary' },
  },
};
</script>

<style scoped>
.base-button {
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.base-button.primary {
  color: #fff;
  background: #ff6b36;
}
.base-button.secondary {
  color: #1f4a79;
  background: #eaf4ff;
  border: 1px solid #bfd8ff;
}
</style>

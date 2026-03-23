<template>
  <button
    :class="['chip', { selected } ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
<script>
export default {
  name: 'Chip',
  props: {
    selected: { type: Boolean, default: false }
  }
};
</script>
<style scoped>
.chip {
  border-radius: 999px;
  border: 1px solid #c7dbf7;
  background: #f8fbff;
  color: #1c4f87;
  padding: 0.45rem 0.85rem;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
}
.chip.selected {
  border-color: #ff6b36;
  background: #ff6b36;
  color: #fff;
}
</style>
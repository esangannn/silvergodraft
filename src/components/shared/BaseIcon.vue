<template>
  <component
    :is="icon"
    :size="size"
    :stroke-width="strokeWidth"
    class="base-icon"
  />
</template>

<script>
export default {
  name: 'BaseIcon',
  props: {
    icon: {
      type: [Object, Function],
      required: true,
    },
    size: {
      type: Number,
      default: 20,
    },
    strokeWidth: {
      type: Number,
      default: 2,
    },
  },
};
</script>

<style scoped>
.base-icon {
  display: inline-flex;
  vertical-align: middle;
}
</style>

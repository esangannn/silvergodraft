<template>
  <section class="card-container">
    <slot />
  </section>
</template>
<script>
export default {
  name: 'CardContainer'
};
</script>
<style scoped>
.card-container {
  width: 100%;
  background: #fff;
  border: 1px solid #dce8f0;
  border-radius: 18px;
  box-shadow: 0 5px 18px rgba(14, 44, 81, 0.08);
  padding: 1rem;
}
</style>
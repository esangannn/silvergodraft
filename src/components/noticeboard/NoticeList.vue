<template>
  <div class="notice-list">
    <NoticeCard
      v-for="notice in notices"
      :key="notice.id"
      :notice="notice"
    />
  </div>
</template>
<script>
import NoticeCard from './NoticeCard.vue';

export default {
  name: 'NoticeList',
  components: { NoticeCard },
  props: {
    notices: { type: Array, default: () => [] }
  }
};
</script>
<style scoped>
.notice-list {
  display: grid;
  gap: 0.8rem;
}
</style>
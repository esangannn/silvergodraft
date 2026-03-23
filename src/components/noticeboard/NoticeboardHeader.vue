<template>
  <header class="noticeboard-header">
    <button class="back-btn" type="button" @click="$emit('back')" aria-label="Back">
      <ChevronLeft :size="24" />
    </button>
    <h1 v-if="!area">Kampong Noticeboard</h1>
    <h1 v-else>
      <span class="notices-prefix">Notices for: </span>
      <span class="notices-area">{{ area }}</span>
    </h1>
  </header>
</template>
<script>
import { ChevronLeft } from 'lucide-vue-next';

export default {
  name: 'NoticeboardHeader',
  components: { ChevronLeft },
  props: {
    area: { type: String, default: '' }
  }
};
</script>
<style scoped>
.noticeboard-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-btn {
  border: 1px solid #3a4f7a;
  background: #fff;
  border-radius: 999px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0.05rem;
  top: 50%;
  transform: translateY(-50%);
}
.noticeboard-header h1 {
  margin: 0;
  font-size: 1.54rem;
  font-weight: 900;
}

.notices-area{
  color: #d8511b;
}
</style>
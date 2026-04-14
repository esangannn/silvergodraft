<template>
  <transition name="slide-down">
    <div v-if="visible" class="alert-banner" role="status" aria-live="polite">
      <div class="alert-content">
        <BellIcon class="alert-icon" />
        <div class="alert-text">
          <strong>Nationwide Alerts</strong>
          <span>{{ message }}</span>
        </div>
      </div>
      <button
        class="close-btn"
        type="button"
        aria-label="Dismiss alert"
        @click="dismiss"
      >
        <XIcon :size="18" />
      </button>
    </div>
  </transition>
</template>

<script>
import { BellIcon, XIcon } from 'lucide-vue-next';

export default {
  name: 'NationwideAlertBanner',
  components: { BellIcon, XIcon },
  data() {
    return {
      visible: false,
      message: 'No nationwide alerts at the moment.',
      timer: null,
    };
  },
  mounted() {
    this.visible = true;
    this.timer = setTimeout(() => {
      this.visible = false;
    }, 15000);
  },
  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  },
  methods: {
    dismiss() {
      this.visible = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  },
};
</script>

<style scoped>
.alert-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1.1rem;
  background: #1e3a5f;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #ffd36b;
}

.alert-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.alert-text strong {
  font-size: 0.92rem;
  font-weight: 800;
}

.alert-text span {
  font-size: 0.85rem;
  opacity: 0.92;
}

.close-btn {
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-radius: 999px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.22);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>

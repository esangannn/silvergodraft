<template>
  <div class="tabs-card">
    <div class="tabs">
      <button
        :class="['tab', modelValue === 'login' && 'active']"
        @click="$emit('update:modelValue', 'login')"
      >
        Log In
      </button>

      <button
        :class="['tab', modelValue === 'signup' && 'active']"
        @click="$emit('update:modelValue', 'signup')"
      >
        Create Account
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  padding: 10px;
}

/* container */
.tabs {
  display: flex;
  background: #f3f4f6;
  border-radius: 999px;
  padding: 4px;
  gap: 6px;
}

/* each tab */
.tab {
  flex: 1;
  border: none;
  border-radius: 999px;
  padding: 10px 0;
  font-weight: 700;
  font-size: 14px;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

/* active tab */
.tab.active {
  background: #1f2937;
  color: white;
}
</style>
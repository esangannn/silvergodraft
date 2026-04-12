<template>
  <div class="field">
    <p class="label">{{ label }}</p>
    <input
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      v-model="model"
      class="input"
      :class="{ 'disabled-input': disabled }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  modelValue: String,
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-weight: 700;
  font-size: 14px;
  margin: 0;
}

.input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid #e5ecf6;
  font-size: 14px;
  outline: none;
  box-sizing: border-box
}

.input:focus {
  border-color: #1f2937;
}

.disabled-input {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>
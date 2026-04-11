<template>
  <div class="form-card">
    <AuthInput
      label="Email Address"
      placeholder="e.g. uncle.tan@gmail.com"
      type="email"
      v-model="email"
    />

    <AuthInput
      label="Password"
      placeholder="Create a password"
      type="password"
      v-model="password"
    />

    <AuthInput
      label="Confirm Password"
      placeholder="Re-enter password"
      type="password"
      v-model="confirm"
    />

    <button class="primary-btn">Create Account</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AuthInput from './AuthInput.vue'

const email = ref('')
const password = ref('')
const confirm = ref('')
</script>

<style scoped>
.form-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.primary-btn {
  margin-top: 8px;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: #BEE7FF;
  color: #1f2937;
  font-weight: 700;
  cursor: pointer;
}
</style>
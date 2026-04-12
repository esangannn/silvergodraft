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

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <button class="primary-btn" @click="handleSignup" :disabled="isLoading">
      {{ isLoading ? 'Creating...' : 'Create Account' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AuthInput from './AuthInput.vue'
import { auth } from '../../firebase.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const emit = defineEmits(['switchToLogin'])

const email = ref('')
const password = ref('')
const confirm = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleSignup = async () => {
  errorMessage.value = ''
  
  if (password.value !== confirm.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  try {
    isLoading.value = true
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    // Switch back to the login tab on successful registration
    emit('switchToLogin')
  } catch (error) {
    console.error("Signup error:", error)
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage.value = 'This email is already in use.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email address.'
        break
      case 'auth/weak-password':
        errorMessage.value = 'Password should be at least 6 characters.'
        break
      default:
        errorMessage.value = error.message || 'Failed to create account.'
    }
  } finally {
    isLoading.value = false
  }
}
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
  transition: all 0.2s;
}

.primary-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}
</style>
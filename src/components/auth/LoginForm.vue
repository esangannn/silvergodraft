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
      placeholder="Enter your password"
      type="password"
      v-model="password"
    />

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <button class="primary-btn" @click="handleLogin" :disabled="isLoading">
      {{ isLoading ? 'Logging in...' : 'Log In' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AuthInput from './AuthInput.vue'
import { auth } from '../../firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in both email and password.'
    alert(errorMessage.value)
    return
  }

  try {
    isLoading.value = true
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const displayName = userCredential.user.displayName || 'User'
    alert(`Logged in successfully! Welcome back, ${displayName}.`)
    // Redirect to home/landing page after successful login
    router.push('/')
  } catch (error) {
    console.error("Login error:", error)
    // Clean up Firebase error messages
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        errorMessage.value = 'Invalid email or password.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email address.'
        break
      case 'auth/too-many-requests':
        errorMessage.value = 'Too many failed login attempts. Please try again later.'
        break
      default:
        errorMessage.value = error.message || 'Failed to log in.'
    }
    alert(errorMessage.value)
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
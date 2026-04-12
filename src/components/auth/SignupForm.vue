<template>
  <div class="form-card">
    <AuthInput
      label="First Name"
      placeholder="e.g. John"
      type="text"
      v-model="firstName"
    />

    <AuthInput
      label="Last Name"
      placeholder="e.g. Tan"
      type="text"
      v-model="lastName"
    />

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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useRouter } from 'vue-router'

const emit = defineEmits(['switchToLogin'])
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleSignup = async () => {
  errorMessage.value = ''
  
  if (password.value !== confirm.value) {
    errorMessage.value = 'Passwords do not match.'
    alert(errorMessage.value)
    return
  }

  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.'
    alert(errorMessage.value)
    return
  }

  try {
    isLoading.value = true
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    
    // Update the user's profile with their first and last name
    await updateProfile(userCredential.user, {
      displayName: `${firstName.value} ${lastName.value}`
    })

    alert(`Account created successfully for ${firstName.value} ${lastName.value}!`)
    router.push('/')
    
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
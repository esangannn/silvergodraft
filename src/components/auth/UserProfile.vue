<template>
  <div class="profile-card">
    <h2 class="profile-title">Your Profile</h2>

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
      label="Home Postal Code"
      placeholder="e.g. 123456"
      type="text"
      v-model="postalCode"
    />

    <AuthInput
      label="Email Address"
      type="email"
      :modelValue="user.email"
      disabled
    />

    <button class="primary-btn" @click="handleUpdateProfile" :disabled="isLoading">
      {{ isLoading ? 'Saving...' : 'Save Changes' }}
    </button>
  </div>

  <button class="logout-btn" @click="handleLogout">
    Log Out
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthInput from './AuthInput.vue'
import { auth, db } from '../../firebase.js'
import { updateProfile, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const postalCode = ref('')
const isLoading = ref(false)

onMounted(async () => {
  if (props.user && props.user.displayName) {
    const parts = props.user.displayName.split(' ')
    firstName.value = parts[0] || ''
    lastName.value = parts.slice(1).join(' ') || ''
  }
  
  if (props.user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', props.user.uid))
      if (userDoc.exists() && userDoc.data().postalCode) {
        postalCode.value = userDoc.data().postalCode
      }
    } catch (error) {
      console.error('Error fetching postal code:', error)
    }
  }
})

const handleUpdateProfile = async () => {
  if (!firstName.value || !lastName.value) {
    alert('Please fill in your first and last name.')
    return
  }
  
  try {
    isLoading.value = true
    await updateProfile(auth.currentUser, {
      displayName: `${firstName.value} ${lastName.value}`
    })

    if (postalCode.value) {
      await setDoc(doc(db, 'users', props.user.uid), {
        postalCode: postalCode.value
      }, { merge: true })
    }

    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Update profile error:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    alert('Logged out successfully.')
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
    alert('Failed to log out.')
  }
}
</script>

<style scoped>
.profile-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1f2937;
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

.logout-btn {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ef4444;
  background: white;
  color: #ef4444;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.logout-btn:hover {
  background: #fef2f2;
}
</style>
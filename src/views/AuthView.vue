<template>
  <div class="auth-page">
    <AuthHeader />

    <template v-if="user">
      <UserProfile :user="user" />
    </template>
    
    <template v-else>
      <AuthTabs v-model="activeTab" />

      <LoginForm v-if="activeTab === 'login'" />
      <SignupForm v-else @switch-to-login="activeTab = 'login'" />

      <button class="guest-btn" @click="$router.push('/')">Continue as Guest (No account needed)</button>

      <WhyCreateAccount />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

import AuthHeader from '@/components/auth/AuthHeader.vue'
import AuthTabs from '@/components/auth/AuthTabs.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import SignupForm from '@/components/auth/SignupForm.vue'
import WhyCreateAccount from '@/components/auth/WhyCreateAccount.vue'
import UserProfile from '@/components/auth/UserProfile.vue'

const activeTab = ref('login')
const user = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #fff8f3;  
  padding: 0.95rem 1rem 2rem;
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guest-btn{
  width:100%;
  margin: 0;          
  padding: 6px 0;     
  background:none;
  border:none;
  text-decoration:underline;
  font-weight:600;
  cursor:pointer;
}
</style>
<template>
  <div class="auth-page">
    <AuthHeader />

    <AuthTabs v-model="activeTab" />

    <LoginForm v-if="activeTab === 'login'" />
    <SignupForm v-else @switch-to-login="activeTab = 'login'" />

    <button class="guest-btn" @click="$router.push('/')">Continue as Guest (No account needed)</button>

    <WhyCreateAccount />
  </div>
</template>

<script>
import AuthHeader from '@/components/auth/AuthHeader.vue'
import AuthTabs from '@/components/auth/AuthTabs.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import SignupForm from '@/components/auth/SignupForm.vue'
import WhyCreateAccount from '@/components/auth/WhyCreateAccount.vue'

export default {
  components: {
    AuthHeader,
    AuthTabs,
    LoginForm,
    SignupForm,
    WhyCreateAccount,
  },
  data() {
    return { activeTab: 'login' }
  },
}
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
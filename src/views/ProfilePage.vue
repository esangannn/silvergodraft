<template>
  <div class="page">
    <button class="back-btn" type="button" @click="$router.push('/')">
      <ArrowLeftIcon class="back-icon" /> Back
    </button>

    <div class="profile-card">
      <UserCircleIcon class="avatar" />
      <p class="email">{{ authStore.user?.email }}</p>
    </div>

    <button class="logout-btn" type="button" @click="handleLogout">
      Log Out
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/auth')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #fff8f3;
  padding: 1rem 1rem 2rem;
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-weight: 700;
  font-size: 0.9rem;
  color: #335c81;
  cursor: pointer;
  padding: 0;
}

.back-icon {
  width: 16px;
  height: 16px;
}

.profile-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 64px;
  height: 64px;
  color: #94a3b8;
}

.email {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1e3247;
  margin: 0;
}

.logout-btn {
  margin-top: auto;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1.5px solid #fca5a5;
  background: #fff;
  color: #dc2626;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}

.logout-btn:hover {
  background: #fef2f2;
}
</style>

<template>
  <header class="landing-header">
    <button class="home-btn" type="button" aria-label="Home">
      <Home :size="22" stroke-width="2" />
    </button>

    <div class="actions">
      <button
        v-if="!user"
        class="login-btn"
        type="button"
        @click="$router.push('/auth')"
      >
        Log In
      </button>

      <button
        v-else
        class="login-btn user-profile-btn"
        type="button"
        @click="$router.push('/auth')"
      >
        <User :size="16" stroke-width="2" />
        {{ displayName }}
      </button>

      <button class="icon-btn" type="button" aria-label="Language">
        <Globe :size="20" stroke-width="2" />
      </button>
      <button class="icon-btn icon-btn--filled" type="button" aria-label="Favourites">
        <Heart :size="20" stroke-width="2" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Home, Globe, Heart, User } from 'lucide-vue-next'
import { auth } from '../../firebase.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const user = ref(null)
const router = useRouter()

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})

const displayName = computed(() => {
  if (!user.value) return ''
  // Returns firstName if displayName is available, else 'User'
  return user.value.displayName ? user.value.displayName.split(' ')[0] : 'User'
})
</script>

<style scoped>
.landing-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 0.25rem 0.75rem;
}

.home-btn {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #dce8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #173b65;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.login-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #d5dce8;
  background: #fff;
  color: #2e3b56;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.login-btn:hover {
  background: #f8fafc;
}

.user-profile-btn {
  color: #173b65;
  border-color: #bbdefb;
  background: #eaf4ff;
}

.user-profile-btn:hover {
  background: #dbeafe;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5ecf6;
  background: #fff;
  color: #2e3b56;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-btn--filled {
  background: #ff6b36;
  border-color: #ff6b36;
  color: #fff;
}
</style>
<template>
  <div class="page">
    <header class="fav-header">
      <button class="back-btn" type="button" @click="$router.push('/')">
        <ArrowLeftIcon class="back-icon" />
      </button>
      <h1 class="title">Saved Places</h1>
    </header>

    <div v-if="isLoading" class="status-msg">Loading...</div>

    <div v-else-if="favourites.length === 0" class="empty-state">
      <HeartIcon class="empty-icon" />
      <p class="empty-title">No saved places yet</p>
      <p class="empty-sub">Tap the heart on any facility to save it here.</p>
      <button class="explore-btn" @click="$router.push('/')">Explore Facilities</button>
    </div>

    <div v-else class="results-list">
      <LocationCard
        v-for="place in favourites"
        :key="place.id"
        :location="place"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { app } from '@/firebase'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, HeartIcon } from '@heroicons/vue/24/outline'
import LocationCard from '@/components/landing/LocationCard.vue'

const db = getFirestore(app)
const authStore = useAuthStore()
const router = useRouter()

const favourites = ref([])
const isLoading = ref(true)

onMounted(async () => {
  if (!authStore.user) {
    router.push('/auth')
    return
  }
  const snap = await getDocs(collection(db, 'users', authStore.user.uid, 'favourites'))
  favourites.value = snap.docs.map(d => d.data())
  isLoading.value = false
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #fff8f3;
  padding: 0.95rem 1rem 2rem;
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fav-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.25rem 0;
}

.back-btn {
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
  flex-shrink: 0;
}

.back-icon {
  width: 18px;
  height: 18px;
}

.title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 900;
  color: #1e3247;
}

.status-msg {
  text-align: center;
  color: #556b84;
  font-size: 0.95rem;
  font-weight: 700;
  margin-top: 2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 4rem;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #fca5a5;
}

.empty-title {
  font-weight: 900;
  font-size: 1rem;
  color: #1e3247;
  margin: 0;
}

.empty-sub {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.explore-btn {
  margin-top: 8px;
  padding: 10px 24px;
  border-radius: 999px;
  border: none;
  background: #335c81;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}

.results-list {
  display: grid;
  gap: 0.75rem;
}
</style>

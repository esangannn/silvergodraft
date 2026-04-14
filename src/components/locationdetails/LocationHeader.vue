<template>
  <div class="location-header">
    <button class="icon-btn" @click="$router.back()">←</button>

    <h1 class="title">{{ location?.name || '' }}</h1>

    <button
      class="icon-btn"
      :aria-label="isFavourite ? 'Remove from favourites' : 'Save to favourites'"
      :disabled="busy"
      @click="toggleFavourite"
    >
      <HeartSolid v-if="isFavourite" class="icon icon-filled" />
      <HeartIcon v-else class="icon" />
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { HeartIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid'
import { doc, getDoc, setDoc, deleteDoc, getFirestore } from 'firebase/firestore'
import { app } from '@/firebase'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  location: { type: Object, default: () => ({}) },
  facilityId: { type: String, default: '' },
})

const db = getFirestore(app)
const router = useRouter()
const authStore = useAuthStore()

const isFavourite = ref(false)
const busy = ref(false)

function favDocRef() {
  if (!authStore.user || !props.facilityId) return null
  return doc(db, 'users', authStore.user.uid, 'favourites', props.facilityId)
}

async function refresh() {
  const ref = favDocRef()
  if (!ref) {
    isFavourite.value = false
    return
  }
  const snap = await getDoc(ref)
  isFavourite.value = snap.exists()
}

watch(
  () => [authStore.ready, authStore.user?.uid, props.facilityId],
  () => refresh(),
  { immediate: true }
)

async function toggleFavourite() {
  if (!authStore.user) {
    router.push('/auth')
    return
  }
  const ref = favDocRef()
  if (!ref) return

  busy.value = true
  try {
    if (isFavourite.value) {
      await deleteDoc(ref)
      isFavourite.value = false
    } else {
      await setDoc(ref, {
        id: props.facilityId,
        ...props.location,
        savedAt: Date.now(),
      })
      isFavourite.value = true
    }
  } catch (err) {
    console.error('Favourite toggle failed', err)
    alert('Could not update favourites. Please try again.')
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.location-header {
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1 1 auto;
  text-align: center;
  padding: 0 8px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.icon-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  width: 22px;
  height: 22px;
  stroke-width: 2;
  color: #1f2937;
}

.icon-filled {
  color: #ff4d6d;
}
</style>

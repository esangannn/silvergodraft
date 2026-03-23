<template>
  <div class="max-w-3xl mx-auto p-6">
    <div v-if="loading" class="text-center py-10">
      <p class="text-lg">Loading facility details...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-600">
      <p class="text-xl">{{ error }}</p>
    </div>

    <div v-else class="space-y-6">
      <h1 class="text-3xl font-bold">{{ location.name || 'Unnamed Facility' }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p><strong>Address:</strong> {{ location.address || 'N/A' }}</p>
          <p><strong>Type:</strong> {{ location.type || 'N/A' }}</p>
          <p><strong>Wheelchair Accessible:</strong> {{ location.wheelchair ? 'Yes' : 'No' }}</p>
          <p><strong>Hours:</strong> {{ location.hours || 'N/A' }}</p>
          <p><strong>Phone:</strong> {{ location.phone || 'N/A' }}</p>
          <p><strong>About:</strong> {{ location.about || 'No description available' }}</p>
        </div>

        <!-- Map placeholder -->
        <div class="bg-gray-200 h-64 rounded flex items-center justify-center">
          <p class="text-gray-600">Map would go here (lat: {{ location.lat }}, lng: {{ location.lng }})</p>
        </div>
      </div>

      <!-- Crowd Voting -->
      <div class="mt-10 border-t pt-8">
        <h2 class="text-2xl font-semibold mb-4">Current Crowd Level</h2>

        <div class="inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-6" :class="badgeClass">
          {{ badgeText }}
        </div>

        <p class="text-sm text-gray-600 mb-4">
          Votes: Not Crowded {{ votes.notCrowded }} • Busy {{ votes.busy }} • Very Crowded {{ votes.veryCrowded }}
        </p>

        <p class="font-medium mb-4">How crowded is it right now?</p>

        <div class="flex flex-wrap gap-4">
          <button
            @click="vote('notCrowded')"
            :disabled="hasVoted || loading"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Not Crowded
          </button>
          <button
            @click="vote('busy')"
            :disabled="hasVoted || loading"
            class="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Busy
          </button>
          <button
            @click="vote('veryCrowded')"
            :disabled="hasVoted || loading"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Very Crowded
          </button>
        </div>

        <p v-if="hasVoted" class="mt-4 text-green-600 font-medium">
          Thank you! Your vote has been recorded (one vote per device).
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, onSnapshot, updateDoc, increment, getFirestore } from 'firebase/firestore'
import { app } from '@/firebase'  

const db = getFirestore(app)
const route = useRoute()

const location = ref({})
const votes = ref({ notCrowded: 0, busy: 0, veryCrowded: 0 })
const loading = ref(true)
const error = ref(null)
const hasVoted = ref(localStorage.getItem(`voted_${route.params.id}`) === 'true')

let unsubscribe = null

onMounted(async () => {
  const id = route.params.id
  if (!id) {
    error.value = 'No facility ID provided in URL'
    loading.value = false
    return
  }

  const docRef = doc(db, 'facilities', id)  

  try {
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      location.value = snap.data()
      votes.value = {
        notCrowded: snap.data().notCrowded || 0,
        busy: snap.data().busy || 0,
        veryCrowded: snap.data().veryCrowded || 0
      }
    } else {
      error.value = 'Facility not found'
    }
  } catch (err) {
    error.value = err.message || 'Failed to load facility'
    console.error(err)
  } finally {
    loading.value = false
  }

  // Real-time vote updates
  unsubscribe = onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data()
      votes.value = {
        notCrowded: data.notCrowded || 0,
        busy: data.busy || 0,
        veryCrowded: data.veryCrowded || 0
      }
    }
  }, (err) => {
    console.error('Snapshot error:', err)
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const totalVotes = computed(() => {
  return votes.value.notCrowded + votes.value.busy + votes.value.veryCrowded
})

const badgeText = computed(() => {
  if (totalVotes.value === 0) return 'No votes yet'
  const max = Math.max(votes.value.notCrowded, votes.value.busy, votes.value.veryCrowded)
  if (votes.value.notCrowded === max) return 'Not Crowded'
  if (votes.value.busy === max) return 'Busy'
  return 'Very Crowded'
})

const badgeClass = computed(() => {
  const text = badgeText.value
  if (text === 'Not Crowded') return 'bg-green-500'
  if (text === 'Busy') return 'bg-yellow-500'
  if (text === 'Very Crowded') return 'bg-red-500'
  return 'bg-gray-500'
})

async function vote(level) {
  if (hasVoted.value) return

  const id = route.params.id
  if (!id) return

  const docRef = doc(db, 'facilities', id)

  try {
    await updateDoc(docRef, { [level]: increment(1) })
    localStorage.setItem(`voted_${id}`, 'true')
    hasVoted.value = true
  } catch (err) {
    console.error('Vote failed:', err)
    alert('Could not record vote: ' + (err.message || 'Unknown error'))
  }
}
</script>

<style>

</style>

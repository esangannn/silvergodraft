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

        <div class="bg-gray-200 h-64 rounded flex items-center justify-center">
          <p class="text-gray-600">Map would go here (lat: {{ location.lat }}, lng: {{ location.lng }})</p>
        </div>
      </div>

      <div class="mt-10 border-t pt-8">
        <h2 class="text-2xl font-semibold mb-2">Current Crowd Level</h2>
        <p class="text-sm text-gray-400 mb-4">Based on votes in the past hour</p>

        <!-- Badge -->
        <div class="inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-6" :class="badgeClass">
          {{ badgeText }}
        </div>

        <!-- Bar chart -->
        <div v-if="totalVotes > 0" class="mb-6">
          <div class="crowd-bar-row">
            <span class="crowd-bar-label">Not Crowded</span>
            <div class="crowd-bar-track">
              <div
                class="crowd-bar-fill crowd-bar-fill--green"
                :style="{ width: pct(votes.notCrowded) + '%' }"
              />
            </div>
            <span class="crowd-bar-count">{{ votes.notCrowded }}</span>
          </div>
          <div class="crowd-bar-row">
            <span class="crowd-bar-label">Busy</span>
            <div class="crowd-bar-track">
              <div
                class="crowd-bar-fill crowd-bar-fill--yellow"
                :style="{ width: pct(votes.busy) + '%' }"
              />
            </div>
            <span class="crowd-bar-count">{{ votes.busy }}</span>
          </div>
          <div class="crowd-bar-row">
            <span class="crowd-bar-label">Very Crowded</span>
            <div class="crowd-bar-track">
              <div
                class="crowd-bar-fill crowd-bar-fill--red"
                :style="{ width: pct(votes.veryCrowded) + '%' }"
              />
            </div>
            <span class="crowd-bar-count">{{ votes.veryCrowded }}</span>
          </div>
          <p class="crowd-total">{{ totalVotes }} vote{{ totalVotes === 1 ? '' : 's' }} in the past hour</p>
        </div>

        <div v-else class="mb-6 text-gray-500 text-sm">No votes in the past hour. Be the first to report!</div>

        <!-- Vote buttons -->
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
          Thank you! Your vote has been recorded.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, onSnapshot, updateDoc, increment, serverTimestamp, getFirestore } from 'firebase/firestore'
import { app } from '@/firebase'

const db = getFirestore(app)
const route = useRoute()

const location = ref({})
const votes = ref({ notCrowded: 0, busy: 0, veryCrowded: 0 })
const loading = ref(true)
const error = ref(null)
const hasVoted = ref(false)

let unsubscribe = null

// Check if the hour window has expired and reset if so
async function checkAndResetIfExpired(docRef, data) {
  const resetAt = data.resetAt?.toDate?.()
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  if (!resetAt || resetAt < oneHourAgo) {
    // Reset votes and set a new resetAt timestamp
    await updateDoc(docRef, {
      notCrowded: 0,
      busy: 0,
      veryCrowded: 0,
      resetAt: serverTimestamp(),
    })
    // Also clear the local vote lock so user can vote in the new window
    localStorage.removeItem(`voted_${route.params.id}`)
    hasVoted.value = false
    return true // was reset
  }
  return false
}

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

      const wasReset = await checkAndResetIfExpired(docRef, snap.data())

      if (!wasReset) {
        // Only restore saved vote if we're still in the same hour window
        hasVoted.value = localStorage.getItem(`voted_${id}`) === 'true'
        votes.value = {
          notCrowded: snap.data().notCrowded || 0,
          busy: snap.data().busy || 0,
          veryCrowded: snap.data().veryCrowded || 0,
        }
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

  // Real-time listener — reflects votes from all users live
  unsubscribe = onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data()
      votes.value = {
        notCrowded: data.notCrowded || 0,
        busy: data.busy || 0,
        veryCrowded: data.veryCrowded || 0,
      }
    }
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const totalVotes = computed(() => {
  return votes.value.notCrowded + votes.value.busy + votes.value.veryCrowded
})

function pct(value) {
  if (totalVotes.value === 0) return 0
  return Math.round((value / totalVotes.value) * 100)
}

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
    alert('Could not record vote: ' + (err.message || 'Unknown error'))
  }
}
</script>

<style scoped>
.crowd-bar-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
}

.crowd-bar-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
  width: 110px;
  flex-shrink: 0;
}

.crowd-bar-track {
  flex: 1;
  height: 14px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}

.crowd-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.crowd-bar-fill--green  { background: #22c55e; }
.crowd-bar-fill--yellow { background: #eab308; }
.crowd-bar-fill--red    { background: #ef4444; }

.crowd-bar-count {
  font-size: 0.82rem;
  font-weight: 800;
  color: #64748b;
  width: 24px;
  text-align: right;
  flex-shrink: 0;
}

.crowd-total {
  margin-top: 0.4rem;
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 700;
}
</style>

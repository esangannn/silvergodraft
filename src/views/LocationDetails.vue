<template>
  <div class="details-page">
    <LocationHeader :location="location" :facilityId="route.params.id" />

    <LocationInfoCard :location="location" />

    <CrowdInsights
      :votes="votes"
      :totalVotes="totalVotes"
      :pct="pct"
      :badgeText="badgeText"
      :badgeClass="badgeClass"
      :hasVoted="hasVoted"
      @vote="vote"
    />

    <NavigationGuide
      :address="location.address"
      :lat="location.lat"
      :lng="location.lng"
    />
    
    <ShareButton :name="location.name" />
  </div>
</template>

<script setup>
import LocationHeader from '@/components/locationdetails/LocationHeader.vue'
import LocationInfoCard from '@/components/locationdetails/LocationInfoCard.vue'
import CrowdInsights from '@/components/locationdetails/CrowdInsights.vue'
import NavigationGuide from '@/components/locationdetails/NavigationGuide.vue'
import ShareButton from '@/components/locationdetails/ShareButton.vue'

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
.details-page {
  min-height: 100vh;
  background: #fff8f3;  
  padding: 0.95rem 1rem 2rem;
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px
}
</style>

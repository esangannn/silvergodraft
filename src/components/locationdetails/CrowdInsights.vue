<template>
  <div class="crowdinsights">

    <div class="section-header">
        <UsersIcon class="users-icon" />
        <p class="section-title">Crowd Insights</p>
    </div>
 
    <div class="live-status">
        <p class="sub-label">Live Crowd Status</p>
        <div :class="['pill-badge', badgeClass]">{{ badgeText }}</div>
        <p class="medium-text">
            Votes: Not Crowded {{ votes.notCrowded }} • Busy {{ votes.busy }} • Very Crowded {{ votes.veryCrowded }}
        </p>
    </div>

    <div class="vote-distribution">
        <p class="sub-label">Crowd Vote Distribution</p>

        <div v-if="totalVotes > 0" class="crowd-chart">
        <div class="row">
            <span>Not Crowded</span>
            <div class="track"><div class="fill green" :style="{ width: pct(votes.notCrowded) + '%' }"></div></div>
            <span class="count">{{ votes.notCrowded }}</span>
        </div>
        <div class="row">
            <span>Busy</span>
            <div class="track"><div class="fill yellow" :style="{ width: pct(votes.busy) + '%' }"></div></div>
            <span class="count">{{ votes.busy }}</span>
        </div>
        <div class="row">
            <span>Very Crowded</span>
            <div class="track"><div class="fill red" :style="{ width: pct(votes.veryCrowded) + '%' }"></div></div>
            <span class="count">{{ votes.veryCrowded }}</span>
        </div>
        <p class="medium-text">{{ totalVotes }} vote{{ totalVotes === 1 ? '' : 's' }} in the past hour</p>
        </div>

        <div v-else class="medium-text">No votes in the past hour. Be the first to report!</div>
    </div>

    <div class="footer">
      <p class="sub-label">How crowded is it right now?</p>
      <p class="medium-text"> Help others by sharing the current crowd level.</p>
      <div class="btn-stack">
        <button @click="$emit('vote', 'notCrowded')" :disabled="hasVoted" class="btn btn-green">Not Crowded</button>
        <button @click="$emit('vote', 'busy')" :disabled="hasVoted" class="btn btn-orange">Busy</button>
        <button @click="$emit('vote', 'veryCrowded')" :disabled="hasVoted" class="btn btn-red">Very Crowded</button>
      </div>
      <p v-if="hasVoted" class="thanks">Thank you! Your vote has been recorded.</p>
    </div>
  </div>
</template>

<script setup>
import { UsersIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps([
  'votes',
  'totalVotes',
  'pct',
  'badgeText',
  'hasVoted'
])

defineEmits(['vote'])

const badgeClass = computed(() => {
  if (props.totalVotes === 0) return 'no-votes'

  if (props.badgeText === 'Not Crowded') return 'not-crowded'
  if (props.badgeText === 'Busy') return 'busy'
  if (props.badgeText === 'Very Crowded') return 'very-crowded'

  return ''
})

</script>

<style scoped>
.crowdinsights {
  background: white;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.users-icon {
  width: 20px;
  height: 20px;
  color: #111827;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
}

.sub-label {
  font-weight: 700;
  margin-bottom: 14px;
  font-size: 14px;
}

.medium-text {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  line-height: 1.4;
}

/* live crowd status */

.pill-badge {
  display: inline-block;
  padding: 4px 12px;   
  border-radius: 999px;
  color: white;
  font-weight: 700;
  font-size: 14px;    
  margin-bottom: 12px;
}

.pill-badge.not-crowded {
  background: #16a34a;   
}

.pill-badge.busy {
  background: #f59e0b;   
}

.pill-badge.very-crowded {
  background: #dc2626;   
}

.pill-badge.no-votes {
  background: #6b7280;  
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 600;
}
 /* vote distribution */

.vote-distribution {
  display: flex;
  flex-direction: column;
  gap: 0px;  
}

.track {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.fill {
  height: 100%;
}

.green {
  background: #22c55e;
}

.yellow {
  background: #eab308;
}

.red {
  background: #ef4444;
}

/* voting */

.btn-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-green {
  background: #589b6b;
}

.btn-orange {
  background: #f1a542;
}

.btn-red {
  background: #d15050;
}

.thanks {
  color: #16a34a;
  font-weight: 600;
  margin-top: 12px;
  font-size: 14px;
}
</style>
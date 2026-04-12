<template>
  <button class="share-btn" @click="share">
    <ShareIcon class="icon" />
    {{ copied ? 'Link Copied!' : 'Share' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { ShareIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  name: { type: String, default: 'this facility' }
})

const copied = ref(false)

async function share() {
  const url = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({
        title: props.name,
        text: `Check out ${props.name} on SilverGo SG`,
        url,
      })
    } catch {
      // User cancelled — do nothing
    }
  } else {
    // Fallback for browsers without Web Share API (e.g. desktop Chrome)
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<style scoped>
.share-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: #f0f7ff;
  border: 1px solid #e0eefe;
  border-radius: 999px;
  color: #2563eb;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.share-btn:hover {
  background: #e0eefe;
}

.icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}
</style>

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | { uid: string; email: string | null }>(null)
  // true once Firebase has resolved the initial auth state (prevents flash of wrong UI)
  const ready = ref(false)

  const auth = getAuth()

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
      ? { uid: firebaseUser.uid, email: firebaseUser.email }
      : null
    ready.value = true
  })

  async function logout(): Promise<void> {
    await signOut(auth)
    user.value = null
  }

  return { user, ready, logout }
})

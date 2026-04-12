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
        {{ t('header.login') }}
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

      <!-- Language dropdown -->
      <div class="lang-wrap" ref="langWrap">
        <button class="lang-trigger" type="button" @click="langOpen = !langOpen">
          {{ LOCALE_LABELS[locale] }}
          <ChevronDown :size="12" stroke-width="3" :class="{ 'chevron--open': langOpen }" />
        </button>
        <div v-if="langOpen" class="lang-dropdown">
          <button
            v-for="l in LOCALES"
            :key="l"
            class="lang-option"
            :class="{ 'lang-option--active': locale === l }"
            type="button"
            @click="selectLocale(l)"
          >
            {{ LOCALE_LABELS[l] }}
          </button>
        </div>
      </div>

      <button
        class="icon-btn icon-btn--filled"
        type="button"
        aria-label="Favourites"
        @click="$router.push('/favourites')"
      >
        <Heart :size="20" stroke-width="2" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Home, Heart, User, ChevronDown } from 'lucide-vue-next'
import { auth } from '../../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

const { t, locale } = useI18n()
const user = ref(null)
const langOpen = ref(false)
const langWrap = ref(null)

const LOCALES = ['en', 'zh', 'ms', 'ta']
const LOCALE_LABELS = { en: 'EN', zh: '中文', ms: 'BM', ta: 'தமிழ்' }

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})

function onClickOutside(e) {
  if (langWrap.value && !langWrap.value.contains(e.target)) {
    langOpen.value = false
  }
}

const displayName = computed(() => {
  if (!user.value) return ''
  return user.value.displayName ? user.value.displayName.split(' ')[0] : 'User'
})

function selectLocale(l) {
  locale.value = l
  localStorage.setItem('locale', l)
  langOpen.value = false
}
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

/* Language dropdown */
.lang-wrap {
  position: relative;
}

.lang-trigger {
  height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #d5dce8;
  background: #fff;
  color: #2e3b56;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: background 0.15s;
}

.lang-trigger:hover {
  background: #f8fafc;
}

.chevron--open {
  transform: rotate(180deg);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #fff;
  border: 1px solid #dce8f0;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  z-index: 100;
  min-width: 100px;
}

.lang-option {
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 700;
  color: #2e3b56;
  cursor: pointer;
}

.lang-option:hover {
  background: #f0f7ff;
}

.lang-option--active {
  color: #2563eb;
  background: #eff6ff;
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

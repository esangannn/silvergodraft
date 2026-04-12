import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import en from './i18n/en.js';
import zh from './i18n/zh.js';
import ms from './i18n/ms.js';
import ta from './i18n/ta.js';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, zh, ms, ta },
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);

// Start the Firebase auth listener immediately so auth state is
// available before any component tries to read it.
useAuthStore();

app.mount('#app');

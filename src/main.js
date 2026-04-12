import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Start the Firebase auth listener immediately so auth state is
// available before any component tries to read it.
useAuthStore();

app.mount('#app');

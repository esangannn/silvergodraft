import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import LandingPage from '@/views/LandingPage.vue';
import LocationDetails from '@/views/LocationDetails.vue';
import AuthView from '@/views/AuthView.vue';
import FavouritesPage from '@/views/FavouritesPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';

const routes = [
  { path: '/',             name: 'Landing',           component: LandingPage },
  { path: '/location/:id', name: 'LocationDetails',   component: LocationDetails },
  { path: '/auth',         name: 'AuthView',          component: AuthView },
  { path: '/favourites',   name: 'Favourites',        component: FavouritesPage, meta: { requiresAuth: true } },
  { path: '/profile',      name: 'Profile',           component: ProfilePage,    meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Redirect unauthenticated users away from protected routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !getAuth().currentUser) {
    next('/auth');
  } else {
    next();
  }
});

export default router;

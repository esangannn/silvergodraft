import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/LandingPage.vue';
import KampongNoticeboard from '@/views/KampongNoticeboard.vue';
import LocationDetails from '@/views/LocationDetails.vue';   

const routes = [
  { path: '/', name: 'Landing', component: LandingPage },
  { path: '/noticeboard', name: 'KampongNoticeboard', component: KampongNoticeboard },
  
  { 
    path: '/location/:id', 
    name: 'LocationDetails', 
    component: LocationDetails 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

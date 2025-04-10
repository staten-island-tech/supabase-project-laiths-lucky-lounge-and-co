import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '@/views/LogIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LogIn,
    },
    {
      path: '/homepage',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/blackjack',
      name: 'blackjack',
      component: () => import('../views/BlackjackPage.vue'),
    },
    {
      path: '/highlow',
      name: 'highlow',
      component: () => import('../views/HighLow.vue'),
    },
    {
      path: '/roulette',
      name: 'roulette',
      component: () => import('../views/RoulettePage.vue'),
    },
    {
      path: '/slotmachine',
      name: 'slotmachine',
      component: () => import('../views/SlotPage.vue'),
    },
  ],
})

export default router

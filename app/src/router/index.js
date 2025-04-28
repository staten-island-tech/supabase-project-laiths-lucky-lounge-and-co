import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '@/views/LogIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      view: LogIn,
    },
    {
      path: '/homepage',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/blackjack',
      name: 'Blackjack',
      component: () => import('../views/BlackjackPage.vue'),
    },
    {
      path: '/coinflip',
      name: 'CoinFlip',
      component: () => import('../views/CoinFlip.vue'),
    },
    {
      path: '/highlow',
      name: 'HighLow',
      component: () => import('../views/HighLow.vue'),
    },
    {
      path: '/slotpage',
      name: 'SlotPage',
      component: () => import('../views/SlotPage.vue'),
    },
    {
      path: '/cashcheck',
      name: 'CashChecker',
      component: () => import('../views/CashCheck.vue'),
    },
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '@/views/LogIn.vue'
import { useUserStore } from '@/stores/user.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LogIn,
    },
    {
      path: '/signup',
      name: 'signUp',
      component: () => import('../views/SignUp.vue'),
    },
    {
      path: '/confirmemail',
      name: 'ConfirmEmail',
      component: () => import('../views/EmailPage.vue'),
    },
    {
      path: '/homepage',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/blackjack',
      name: 'Blackjack',
      component: () => import('../views/BlackjackPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/coinflip',
      name: 'CoinFlip',
      component: () => import('../views/CoinFlip.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/highlow',
      name: 'HighLow',
      component: () => import('../views/HighLow.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/slotpage',
      name: 'SlotPage',
      component: () => import('../views/SlotPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/moneyinput',
      name: 'MoneyInput',
      component: () => import('../views/MoneyLaunder.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  await userStore.checkLoggedInStatus()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router

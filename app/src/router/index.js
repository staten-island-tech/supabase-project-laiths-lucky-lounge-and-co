import FrontPage from '@/views/FrontPage.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FrontPage,
    },
/*  {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
    }*/
  ],
})

export default router

<template>
  <div>
    <div>
      <h1>Log into Laith's Lucky Lounge</h1>
      <input type="text" id="Username" placeholder="Username" />
      <input type="password" id="Password" placeholder="Password" />
      <div class="box">
        <p>Ni Hao</p>
      </div>
    </div>
    <TestHeader />
    <RouterLink to="/homepage">Game Room</RouterLink>
  </div>
</template>

<script setup>
gsap.to('.box', { x: 200 })
import { gsap } from 'gsap'

const router = useRouter()
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    alert('You must log in to Laiths Lucky Lounge to Continue!')
    next('/')
  } else {
    next()
  }
})
import TestHeader from '@/components/TestHeader.vue'
import { RouterLink } from 'vue-router'
</script>

<style scoped></style>

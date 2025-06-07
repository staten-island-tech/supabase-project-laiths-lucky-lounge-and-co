<template>
  <div>
    <HomeHeader />
  </div>
</template>

<script setup>
import HomeHeader from '@/components/HomeHeader.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  await userStore.checkLoggedInStatus()

  if (!userStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped></style>

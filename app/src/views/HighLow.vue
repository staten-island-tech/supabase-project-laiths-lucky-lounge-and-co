<template>
  <div>
    <HighLowStuff />
    <RouterLink to="/homepage">
      <button
        class="absolute top-3 left-3 p-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-md outline-2 outline-offset-2"
      >
        &lt;
      </button>
    </RouterLink>
  </div>
</template>

<script setup>
import HighLowStuff from '@/components/HighLowStuff.vue'
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

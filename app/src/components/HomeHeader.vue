<template>
  <div class="bg-teal-500 h-[20vh] flex items-center justify-center relative">
    <button
      @click="handleLogout"
      class="absolute top-3 left-3 btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
    >
      Log Out
    </button>
    <h1 class="text-[5vh] font-bold">Laith's Lucky Lounge <span class="text-xs">& co.</span></h1>
    <div class="dropdown dropdown-left absolute top-3 right-3">
      <button tabindex="0" class="btn btn-square">
        <Gamepad2 class="h-5 w-5" />
      </button>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mr-3">
        <li><RouterLink to="/blackjack">Blackjack</RouterLink></li>
        <li><RouterLink to="/coinflip">Coin Flip</RouterLink></li>
        <li><RouterLink to="/highlow">High/Low</RouterLink></li>
        <li><RouterLink to="/slotpage">Slot Machine</RouterLink></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { Gamepad2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped></style>

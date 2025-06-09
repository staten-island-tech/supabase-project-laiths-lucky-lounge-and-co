<template>
  <div class="bg-teal-500 h-[20vh] flex items-center justify-center relative">
    <div class="absolute top-3 left-3 text-white font-bold text-xl">💰 ${{ money }}</div>

    <h1 class="text-[5vh] font-bold">Laith's Lucky Lounge <span class="text-xs">& Ryan</span></h1>

    <div class="dropdown dropdown-left absolute top-3 right-16">
      <button tabindex="0" class="btn btn-square">
        <Gamepad2 class="h-5 w-5 text-black" />
      </button>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mr-3">
        <li><RouterLink to="/blackjack" class="text-black">Blackjack</RouterLink></li>
        <li><RouterLink to="/coinflip" class="text-black">Coin Flip</RouterLink></li>
        <li><RouterLink to="/highlow" class="text-black">High/Low</RouterLink></li>
        <li><RouterLink to="/slotpage" class="text-black">Slot Machine</RouterLink></li>
      </ul>
    </div>

    <div class="dropdown dropdown-left absolute top-3 right-3">
      <button tabindex="0" class="btn btn-square">
        <Settings class="h-5 w-5 text-black" />
      </button>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mr-3">
        <li>
          <button @click="giveStarter" class="text-black">💸 Give $100 if $0</button>
        </li>
        <li>
          <button @click="handleLogout" class="text-black">🚪 Log Out</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Gamepad2, Settings } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const userStore = useUserStore()
const money = ref(0)

const loadMoney = async () => {
  const userId = userStore.user?.id
  if (!userId) return
  const { data } = await supabase.from('users').select('money').eq('id', userId).single()
  if (data) money.value = data.money
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

const giveStarter = async () => {
  const userId = userStore.user?.id
  if (!userId) return
  const { data, error } = await supabase.from('users').select('money').eq('id', userId).single()
  if (!error && data?.money === 0) {
    await supabase.from('users').update({ money: 100 }).eq('id', userId)
    await loadMoney()
  }
}

watch(
  () => userStore.user,
  async (newUser) => {
    if (newUser?.id) await loadMoney()
  },
  { immediate: true },
)

onMounted(loadMoney)
</script>

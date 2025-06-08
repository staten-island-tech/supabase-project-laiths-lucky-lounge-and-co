<template>
  <div class="h-screen bg-gray-900 flex flex-col justify-center">
    <div class="text-white text-6xl font-bold mx-auto">Slot Machine</div>
    <div class="text-white text-2xl font-bold mx-auto mt-4">Balance: ${{ money }}</div>
    <div class="mx-auto mt-4 w-40">
      <input
        type="number"
        v-model.number="betAmount"
        placeholder="Bet"
        class="text-white w-full p-2 border-2 border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800"
        :max="money"
        :min="1"
      />
    </div>
    <div class="mx-auto mt-8">
      <button
        @click="spinAnimate"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
        :disabled="clicked"
      >
        Spin
      </button>
    </div>
    <div class="mx-auto mt-8">
      <div class="grid grid-cols-3 gap-4">
        <div
          :key="`${symbols[0]}-${rando()}`"
          class="text-white text-5xl bg-gray-700 flex justify-center items-center h-32 w-32 rounded-lg"
        >
          <img :src="symbols[0]" :alt="symbols[0]" />
        </div>
        <div
          :key="`${symbols[1]}-${rando()}`"
          class="text-white text-5xl bg-gray-700 flex justify-center items-center h-32 w-32 rounded-lg"
        >
          <img :src="symbols[1]" :alt="symbols[1]" />
        </div>
        <div
          :key="`${symbols[2]}-${rando()}`"
          class="text-white text-5xl bg-gray-700 flex justify-center items-center h-32 w-32 rounded-lg"
        >
          <img :src="symbols[2]" :alt="symbols[2]" />
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <h2 class="text-2xl font-bold text-green-500">{{ winMessage }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import cherry from '../assets/cherryslots.png'
import lemon from '../assets/lemonslots.png'
import orange from '../assets/orangeslots.png'
import plum from '../assets/plumslots.png'
import bell from '../assets/bellslots.png'
import bar from '../assets/barslots.png'
import seven from '../assets/sevenslots.png'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const username = ref('')
const clicked = ref(false)
const money = ref(0)
const betAmount = ref(1)
const symbols = ref(['', '', ''])
const winMessage = ref('')
const slotSymbols = [cherry, lemon, orange, plum, bell, bar, seven]

function rando() {
  return Math.random()
}

async function recordBetAndUpdateMoney(netResult) {
  const userId = userStore.user?.id
  if (!userId) {
    winMessage.value = 'You must be logged in to play.'
    return false
  }
  const newBalance = money.value + netResult
  const { error: betError } = await supabase
    .from('bets')
    .insert([{ username: username.value, result: netResult, game: 'Slots' }])
  if (betError) {
    winMessage.value = 'Failed to record bet, please try again.'
    return false
  }
  const { error: updateError } = await supabase
    .from('users')
    .update({ money: newBalance })
    .eq('id', userId)
  if (updateError) {
    winMessage.value = 'Failed to update balance, please try again.'
    return false
  }
  money.value = newBalance
  return true
}

async function spin() {
  if (betAmount.value > money.value || betAmount.value <= 0) {
    winMessage.value = 'Invalid bet!'
    return
  }
  const nums = Array.from({ length: 3 }, () => Math.floor(Math.random() * slotSymbols.length))
  symbols.value = nums.map((i) => slotSymbols[i])
  let netResult = -betAmount.value
  let message = 'You lose!'
  if (symbols.value[0] === symbols.value[1] && symbols.value[1] === symbols.value[2]) {
    netResult = betAmount.value * 10
    message = `Jackpot! $${netResult}!`
  } else if (
    symbols.value[0] === symbols.value[1] ||
    symbols.value[1] === symbols.value[2] ||
    symbols.value[0] === symbols.value[2]
  ) {
    netResult = betAmount.value * 1.5
    message = `You win $${netResult}!`
  }
  const success = await recordBetAndUpdateMoney(netResult)
  if (success) {
    winMessage.value = message
  }
}

async function spinAnimate() {
  if (clicked.value) return
  clicked.value = true
  for (let i = 0; i < 10; i++) {
    symbols.value = [
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
    ]
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  await spin()
  clicked.value = false
}

async function loadMoney() {
  const userId = userStore.user?.id
  if (!userId) return
  const { data } = await supabase.from('users').select('money').eq('id', userId).single()
  if (data) {
    money.value = data.money
  }
}

watch(
  () => userStore.user,
  async (newUser) => {
    if (!newUser?.id) return
    const { data } = await supabase.from('users').select('username').eq('id', newUser.id).single()
    if (data) username.value = data.username
  },
  { immediate: true },
)

onMounted(() => {
  loadMoney()
  username.value = userStore.user?.user_metadata?.username || ''
})
</script>

<style scoped></style>

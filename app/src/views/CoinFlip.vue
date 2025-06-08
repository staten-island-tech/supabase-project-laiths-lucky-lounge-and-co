<template>
  <div
    class="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6"
  >
    <h1
      class="absolute top-6 right-6 text-lg md:text-xl font-semibold bg-white text-indigo-700 px-4 py-2 rounded-xl shadow-md"
    >
      Your Balance: ${{ money }}
    </h1>

    <div class="bg-white text-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md mt-12">
      <h1 class="text-3xl font-bold mb-6 text-center">Coin Flip</h1>

      <input
        v-model="inputNumber"
        placeholder="Your betting amount!"
        type="number"
        class="w-full p-3 mb-4 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <p class="mt-2 text-sm text-gray-700">
        You're betting:
        <span
          class="ml-2 inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-md border border-indigo-300 shadow-sm"
        >
          ${{ inputNumber }}
        </span>
      </p>

      <p class="mt-2 text-sm text-gray-700">
        You're guessing:
        <span
          class="ml-2 inline-block bg-pink-100 text-pink-700 font-semibold px-3 py-1 rounded-md border border-pink-300 shadow-sm"
        >
          {{ pChoice }}
        </span>
      </p>

      <div class="flex justify-between gap-4 mt-4 mb-4">
        <button
          @click="pChoice = 'Heads'"
          class="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          Heads
        </button>
        <button
          @click="pChoice = 'Tails'"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          Tails
        </button>
      </div>

      <button
        @click="flipcoin"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200"
      >
        Flip Coin!
      </button>

      <div v-if="result" class="mt-4 flex justify-center">
        <img
          :key="flipKey"
          :src="coinImages[`${result}`]"
          alt="Coin Result"
          class="w-24 h-24 flip-coin"
        />
      </div>

      <p v-if="result" class="mt-4 text-lg text-center">
        The coin landed on
        <span class="font-semibold text-indigo-700">{{ result }}</span>
      </p>
    </div>

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
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'
import headsImg from '@/assets/Heads.png'
import tailsImg from '@/assets/Tails.png'

const coinImages = {
  Heads: headsImg,
  Tails: tailsImg,
}

const userStore = useUserStore()
const username = ref('')
const inputNumber = ref(1)
const pChoice = ref('Choose a Coin!')
const result = ref('')
const money = ref(0)
const flipKey = ref(0)

function updateBalance(amount, win) {
  if (win) {
    money.value = Math.round(money.value * 100 + amount * 100) / 100
    recordBet(Math.round(amount * 100) / 100)
  } else {
    money.value = Math.round(money.value * 100 - amount * 100) / 100
    recordBet(Math.round(amount * -100) / 100)
  }
}

function winLoss(choice) {
  updateBalance(inputNumber.value, result.value === choice)
}

function flipcoin() {
  if (inputNumber.value > money.value || inputNumber.value <= 0) {
    alert("You don't have enough money to bet that much!")
    return
  }
  const randomNumber = Math.random()
  result.value = randomNumber > 0.5 ? 'Heads' : 'Tails'
  console.log(result.value)
  console.log('Heads Tails')
  winLoss(pChoice.value)
  flipKey.value++
}

async function recordBet(netResult) {
  await supabase
    .from('bets')
    .insert([{ username: username.value, result: netResult, game: 'Coin Flip' }])
}

async function updateMoneyInSupabase() {
  const userId = userStore.user?.id
  if (!userId) return
  await supabase.from('users').update({ money: money.value }).eq('id', userId)
}

watch(money, () => {
  updateMoneyInSupabase()
})

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
})

async function loadMoney() {
  const userId = userStore.user?.id
  if (!userId) return
  const { data } = await supabase.from('users').select('money').eq('id', userId).single()
  if (data) money.value = data.money
}
</script>

<style scoped>
@keyframes flip {
  0% {
    transform: rotateY(0);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
.flip-coin {
  animation: flip 0.6s ease-in-out;
}
</style>

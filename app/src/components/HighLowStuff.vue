<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 space-y-6"
  >
    <div v-if="!gameStarted" class="space-y-4">
      <input
        type="number"
        v-model.number="bet"
        placeholder="Enter your bet"
        :max="money"
        :min="1"
        @input="validateBet"
        class="w-full px-4 py-2 text-black rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <button
        @click="startGame"
        class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold"
      >
        Place Bet
      </button>
    </div>

    <img
      v-if="oldCard"
      :src="oldCard.image"
      :alt="`${oldCard.value} of ${oldCard.suit}`"
      class="w-32 h-auto"
    />

    <div v-if="gameStarted" class="space-x-4">
      <button
        @click="makeChoice('higher')"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md font-semibold"
      >
        Higher
      </button>
      <button
        @click="makeChoice('lower')"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md font-semibold"
      >
        Lower
      </button>
    </div>

    <button
      v-if="gameStarted && currentWinnings > 0"
      @click="cashOut"
      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold mt-4"
    >
      Cash Out
    </button>

    <p class="text-lg font-bold">Money: ${{ money.toFixed(2) }}</p>
    <p class="text-lg font-bold">Winnings: ${{ currentWinnings.toFixed(2) }}</p>
    <p v-if="result" class="text-xl font-bold text-yellow-400">{{ result }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const username = ref('')
const userId = computed(() => userStore.user?.id)

const deckId = ref('')
const gameStarted = ref(false)
const result = ref('')
const choice = ref('')
const bet = ref(1)
const currentWinnings = ref(0)
const money = ref(0)
const newCard = ref(null)
const oldCard = ref(null)

async function fetchNewDeck() {
  const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  const data = await res.json()
  deckId.value = data.deck_id
}

async function drawCards(count) {
  if (!deckId.value) return []
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId.value}/draw/?count=${count}`,
  )
  const data = await res.json()
  return data.cards
}

function validateBet() {
  if (bet.value > money.value) bet.value = money.value
  if (bet.value < 1) bet.value = 1
}

async function recordBet(netResult) {
  if (!username.value) return
  await supabase
    .from('bets')
    .insert([{ username: username.value, result: netResult, game: 'High Low' }])
}

async function updateMoneyInSupabase() {
  if (!userId.value) return
  await supabase.from('users').update({ money: money.value }).eq('id', userId.value)
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

async function loadMoney() {
  if (!userId.value) return
  const { data } = await supabase.from('users').select('money').eq('id', userId.value).single()
  if (data) money.value = data.money
}

function roundToCents(value) {
  return Math.round(value * 100) / 100
}

async function startGame() {
  if (bet.value > money.value) {
    result.value = 'Not enough money to bet!'
    return
  }
  money.value = roundToCents(money.value - bet.value)
  currentWinnings.value = bet.value
  gameStarted.value = true
  result.value = ''
  oldCard.value = null
  await fetchNewDeck()
  const cards = await drawCards(1)
  if (cards.length) {
    newCard.value = cards[0]
    newTurn()
  }
}

async function newTurn() {
  oldCard.value = newCard.value
  const cards = await drawCards(1)
  if (cards.length) newCard.value = cards[0]
}

function numValue(card) {
  switch (card.value) {
    case 'ACE':
      return 1
    case 'JACK':
      return 11
    case 'QUEEN':
      return 12
    case 'KING':
      return 13
    default:
      return Number(card.value)
  }
}

function findMult(oldVal, newVal, turn) {
  let counter = 0
  let mult = 1
  if (turn === 'higher') {
    counter = oldVal > 7 ? newVal : oldVal
  } else if (turn === 'lower') {
    counter = oldVal < 8 ? 14 - newVal : 14 - oldVal
  }
  for (let i = 0; i < counter; i++) mult *= 1.05
  return mult
}

async function checkResult() {
  if (!oldCard.value || !newCard.value) {
    result.value = 'Card error!'
    return
  }
  const oldC = numValue(oldCard.value)
  const newC = numValue(newCard.value)
  const turnResult = newC > oldC ? 'higher' : newC < oldC ? 'lower' : 'tie'
  const mult = findMult(oldC, newC, turnResult)

  if (turnResult === choice.value) {
    result.value = 'You win!'
    currentWinnings.value = roundToCents(currentWinnings.value * mult)
    await newTurn()
  } else if (turnResult === 'tie') {
    result.value = 'Tie!'
    await newTurn()
  } else {
    result.value = 'You lose!'
    currentWinnings.value = 0
    await recordBet(-bet.value)
    gameStarted.value = false
    oldCard.value = newCard.value
  }
}

function makeChoice(selection) {
  choice.value = selection
  checkResult()
}

async function cashOut() {
  const roundedWinnings = roundToCents(currentWinnings.value)
  money.value = roundToCents(money.value + roundedWinnings)
  await recordBet(roundedWinnings)
  currentWinnings.value = 0
  gameStarted.value = false
  result.value = `You cashed out $${roundedWinnings.toFixed(2)}!`
}

onMounted(() => {
  loadMoney()
  username.value = userStore.user?.user_metadata?.username || ''
})
</script>

<style scoped></style>

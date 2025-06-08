<template>
  <div
    class="bg-green-900 min-h-screen py-10 px-4 text-white font-sans flex flex-col items-center space-y-10"
  >
    <div class="text-center">
      <p class="text-3xl font-bold mb-2">💰 Money: ${{ money }}</p>

      <div
        v-if="!gameStarted"
        class="bg-white/10 border border-white/20 rounded-xl p-6 mt-4 w-full max-w-md mx-auto shadow-md"
      >
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="number"
            v-model.number="bet"
            placeholder="Enter your bet"
            :max="money"
            :min="1"
            @input="validateBet"
            class="px-4 py-2 rounded-md text-black bg-white w-full sm:w-40 text-lg"
          />
          <button
            @click="startGame"
            class="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold text-lg"
          >
            Place Bet
          </button>
        </div>
      </div>

      <p v-else class="text-xl mt-4 font-medium">Current Bet: ${{ bet }}</p>
    </div>

    <div class="w-full max-w-4xl space-y-10">
      <CardHand name="Dealer" :hand="displayedDealerHand" />
      <CardHand name="Player" :hand="playerHand" />
    </div>

    <div class="flex flex-wrap justify-center gap-4 mt-4">
      <button
        @click="hit"
        :disabled="gameOver || !gameStarted"
        class="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-lg disabled:bg-gray-600"
      >
        Hit
      </button>
      <button
        @click="stand"
        :disabled="gameOver || !gameStarted"
        class="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold text-lg disabled:bg-gray-600"
      >
        Stand
      </button>
      <button
        @click="doubleDown"
        :disabled="gameOver || !gameStarted || money < bet"
        class="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-lg disabled:bg-gray-600"
      >
        Double Down
      </button>
      <button
        @click="resetGame"
        :disabled="!gameOver || gameStarted"
        class="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold text-lg"
      >
        Reset
      </button>
    </div>

    <p v-if="result" class="text-2xl font-bold text-yellow-400 mt-6 drop-shadow text-center">
      {{ result }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CardHand from './BJCardHand.vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const username = userStore.user?.user_metadata?.username

const deckId = ref('')
const playerHand = ref([])
const dealerHand = ref([])
const playerScore = ref(0)
const dealerScore = ref(0)
const gameOver = ref(false)
const gameStarted = ref(false)
const result = ref('')
const bet = ref(1)
const money = ref(0)
const showDealerHoleCard = ref(false)

function validateBet() {
  if (bet.value > money.value) bet.value = money.value
  if (bet.value < 1) bet.value = 1
}

async function fetchNewDeck() {
  const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  const data = await res.json()
  deckId.value = data.deck_id
}

async function drawCards(count) {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId.value}/draw/?count=${count}`,
  )
  const data = await res.json()
  return data.cards
}

function calculateScore(hand) {
  let score = 0
  let aces = 0
  for (const card of hand) {
    if (['KING', 'QUEEN', 'JACK'].includes(card.value)) score += 10
    else if (card.value === 'ACE') {
      aces++
      score += 11
    } else score += parseInt(card.value)
  }
  while (score > 21 && aces > 0) {
    score -= 10
    aces--
  }
  return score
}

function updateScores() {
  playerScore.value = calculateScore(playerHand.value)
  dealerScore.value = calculateScore(dealerHand.value)
}

const displayedDealerHand = computed(() => {
  if (showDealerHoleCard.value || dealerHand.value.length < 2) return dealerHand.value
  return [
    dealerHand.value[0],
    {
      code: 'BACK',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Card_back_06.svg/200px-Card_back_06.svg.png',
    },
  ]
})

async function dealInitialCards() {
  const cards = await drawCards(4)
  playerHand.value = [cards[0], cards[2]]
  dealerHand.value = [cards[1], cards[3]]
  updateScores()

  if (playerScore.value === 21 && dealerScore.value === 21) {
    result.value = "Both got blackjack! It's a push."
    money.value += bet.value
    gameOver.value = true
    showDealerHoleCard.value = true
    recordBet(0)
  } else if (dealerScore.value === 21) {
    result.value = 'Dealer has blackjack. You lose.'
    gameOver.value = true
    showDealerHoleCard.value = true
    recordBet(-1 * bet.value)
  } else if (playerScore.value === 21) {
    result.value = 'Blackjack! You win 1.5x your bet!'
    money.value += bet.value * 2.5
    gameOver.value = true
    showDealerHoleCard.value = true
    recordBet(bet.value * 1.5)
  }
}

async function hit() {
  const [card] = await drawCards(1)
  playerHand.value.push(card)
  updateScores()
  if (playerScore.value > 21) {
    result.value = 'You busted!'
    gameOver.value = true
    showDealerHoleCard.value = true
    recordBet(-1 * bet.value)
  }
}

async function stand() {
  showDealerHoleCard.value = true

  while (dealerScore.value < 17) {
    const [card] = await drawCards(1)
    dealerHand.value.push(card)
    updateScores()
  }

  if (dealerScore.value > 21) {
    result.value = 'Dealer busted! You win!'
    money.value += bet.value * 2
    recordBet(bet.value)
  } else if (dealerScore.value > playerScore.value) {
    result.value = 'Dealer wins!'
    recordBet(-1 * bet.value)
  } else if (dealerScore.value < playerScore.value) {
    result.value = 'You win!'
    money.value += bet.value * 2
    recordBet(bet.value)
  } else {
    result.value = "It's a tie!"
    money.value += bet.value
    recordBet(0)
  }

  gameOver.value = true
}

async function doubleDown() {
  money.value -= bet.value
  bet.value *= 2
  await hit()
  if (!gameOver.value) await stand()
}

async function startGame() {
  if (bet.value <= 0 || bet.value > money.value) return
  money.value -= bet.value
  gameOver.value = false
  result.value = ''
  playerHand.value = []
  dealerHand.value = []
  showDealerHoleCard.value = false
  await dealInitialCards()
  gameStarted.value = true
}

async function resetGame() {
  await fetchNewDeck()
  playerHand.value = []
  dealerHand.value = []
  result.value = ''
  gameOver.value = false
  gameStarted.value = false
  bet.value = 0
  showDealerHoleCard.value = false
}

async function recordBet(netResult) {
  const { error } = await supabase
    .from('bets')
    .insert([{ username, result: netResult, game: 'Blackjack' }])

  if (error) {
    console.error('Error recording bet:', error)
  }
}

async function updateMoneyInSupabase() {
  const userId = userStore.user?.id
  if (!userId) return

  await supabase.from('users').update({ money: money.value }).eq('id', userId)
}

watch(money, () => {
  updateMoneyInSupabase()
})

async function loadMoney() {
  const userId = userStore.user?.id
  if (!userId) return

  const { data, error } = await supabase.from('users').select('money').eq('id', userId).single()

  if (data) {
    money.value = data.money
  }
}

onMounted(() => {
  fetchNewDeck()
  loadMoney()
})
</script>

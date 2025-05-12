<template>
  <div>
    <div>
      <p>Money: ${{ money }}</p>

      <div v-if="!gameStarted">
        <input
          type="number"
          v-model.number="bet"
          placeholder="Enter your bet"
          :max="money"
          :min="1"
          @input="validateBet"
        />
        <button @click="startGame">Place Bet</button>
      </div>

      <p v-else>Current Bet: ${{ bet }}</p>
    </div>

    <CardHand name="Dealer" :hand="displayedDealerHand" />
    <CardHand name="Player" :hand="playerHand" />

    <div>
      <button @click="hit" :disabled="gameOver || !gameStarted">Hit</button>
      <button @click="stand" :disabled="gameOver || !gameStarted">Stand</button>
      <button @click="doubleDown" :disabled="gameOver || !gameStarted || money < bet">
        Double Down
      </button>
      <button @click="resetGame">Reset</button>
    </div>

    <p v-if="result">{{ result }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CardHand from './BJCardHand.vue'

const deckId = ref('')
const playerHand = ref([])
const dealerHand = ref([])
const playerScore = ref(0)
const dealerScore = ref(0)
const gameOver = ref(false)
const gameStarted = ref(false)
const result = ref('')
const bet = ref(0)
const money = ref(500)
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
  } else if (dealerScore.value === 21) {
    result.value = 'Dealer has blackjack. You lose.'
    gameOver.value = true
    showDealerHoleCard.value = true
  } else if (playerScore.value === 21) {
    result.value = 'Blackjack! You win 1.5x your bet!'
    money.value += bet.value * 2.5
    gameOver.value = true
    showDealerHoleCard.value = true
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
  } else if (dealerScore.value > playerScore.value) {
    result.value = 'Dealer wins!'
  } else if (dealerScore.value < playerScore.value) {
    result.value = 'You win!'
    money.value += bet.value * 2
  } else {
    result.value = "It's a tie!"
    money.value += bet.value
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

onMounted(() => {
  fetchNewDeck()
})
</script>

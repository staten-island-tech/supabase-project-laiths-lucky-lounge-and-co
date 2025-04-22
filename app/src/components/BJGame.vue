<template>
  <div>
    <CardHand name="Dealer" :hand="dealerHand" />
    <CardHand name="Player" :hand="playerHand" />

    <div style="margin-top: 20px">
      <button @click="hit" :disabled="gameOver">Hit</button>
      <button @click="stand" :disabled="gameOver">Stand</button>
      <button @click="resetGame">Reset</button>
    </div>

    <p v-if="result" style="font-size: 1.5em; margin-top: 10px">{{ result }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CardHand from './BJCardHand.vue'

const deckId = ref('')
const playerHand = ref([])
const dealerHand = ref([])
const playerScore = ref(0)
const dealerScore = ref(0)
const gameOver = ref(false)
const result = ref('')

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

async function dealInitialCards() {
  const cards = await drawCards(4)
  playerHand.value = [cards[0], cards[2]]
  dealerHand.value = [cards[1], cards[3]]
  updateScores()
}

function updateScores() {
  playerScore.value = calculateScore(playerHand.value)
  dealerScore.value = calculateScore(dealerHand.value)
}

async function hit() {
  const [card] = await drawCards(1)
  playerHand.value.push(card)
  updateScores()
  if (playerScore.value > 21) {
    result.value = 'You busted!'
    gameOver.value = true
  }
}

async function stand() {
  while (dealerScore.value < 17) {
    const [card] = await drawCards(1)
    dealerHand.value.push(card)
    updateScores()
  }

  if (dealerScore.value > 21) result.value = 'Dealer busted! You win!'
  else if (dealerScore.value > playerScore.value) result.value = 'Dealer wins!'
  else if (dealerScore.value < playerScore.value) result.value = 'You win!'
  else result.value = "It's a tie!"

  gameOver.value = true
}

async function resetGame() {
  await fetchNewDeck()
  playerHand.value = []
  dealerHand.value = []
  result.value = ''
  gameOver.value = false
  await dealInitialCards()
}

onMounted(() => {
  resetGame()
})
</script>

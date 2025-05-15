<template>
  <div>
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
    <img :src="oldCard.image" :alt="`${oldCard.value} of ${oldCard.suit}`" v-if="oldCard" />
    <p v-if="result">{{ result }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const deckId = ref('')
const gameOver = ref(true)
const gameStarted = ref(false)
const result = ref('')
const bet = ref(0)
const money = ref(500)
const newCard = ref('')
const oldCard = ref('')

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

function validateBet() {
  if (bet.value > money.value) bet.value = money.value
  if (bet.value < 1) bet.value = 1
}
function startGame() {
  gameOver.value = false
  gameStarted.value = true
  result.value = ''
  fetchNewDeck()
  oldCard.value = ''
  newCard.value = drawCards(1).value
  newTurn()
}
function newTurn() {
  oldCard.value = newCard.value
  newCard.value = drawCards(1).value
}
</script>

<style scoped></style>

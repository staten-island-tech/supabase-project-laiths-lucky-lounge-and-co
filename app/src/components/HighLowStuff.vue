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
    <button v-if="gameStarted" @click="choice = 'higher'">Higher</button>
    <button v-if="gameStarted" @click="choice = 'lower'">Lower</button>
    <p v-if="result">{{ result }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const deckId = ref('')
const gameOver = ref(true)
const gameStarted = ref(false)
const result = ref('')
const turnResult = ''
const choice = ''
const bet = ref(0)
const currentWinnings = ref(0)
const money = ref(500)
const newCard = ref(null)
const oldCard = ref(null)
const cards = []

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

async function startGame() {
  gameOver.value = false
  gameStarted.value = true
  result.value = ''
  await fetchNewDeck()
  oldCard.value = ''
  const cards = await drawCards(1)
  newCard.value = cards[0]
  newTurn()
}

async function newTurn() {
  oldCard.value = newCard.value
  cards = await drawCards(1)
  newCard.value = cards[0]
}

function checkResult() {
  if (newCard.value.value > oldCard.value.value) {
    turnResult.value = 'Higher'
  } else if (newCard.value.value < oldCard.value.value) {
    turnResult.value = 'Lower'
  }
  let mult = findMult()
  if (turnResult.value === choice.value) {
    result.value = 'You win!'
    currentWinnings.value = currentWinnings.value * 2
  } else {
    result.value = 'You lose!'
    money.value -= bet.value
  }
}

function findMult() {
  if (newCard.value.value > oldCard.value.value) {
  }
}
</script>

<style scoped></style>

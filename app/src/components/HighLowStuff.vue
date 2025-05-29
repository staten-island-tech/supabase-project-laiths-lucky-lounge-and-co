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
      :src="oldCard.image"
      :alt="`${oldCard.value} of ${oldCard.suit}`"
      v-if="oldCard"
      class="w-32 h-auto"
    />
    <div v-if="gameStarted" class="space-x-4">
      <button
        @click="[(choice = 'higher'), checkResult()]"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md font-semibold"
      >
        Higher
      </button>
      <button
        @click="[(choice = 'lower'), checkResult()]"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md font-semibold"
      >
        Lower
      </button>
    </div>
    <p class="text-lg font-bold">Money: ${{ money }}</p>
    <p class="text-lg font-bold">Winnings: ${{ currentWinnings }}</p>
    <p v-if="result" class="text-xl font-bold text-yellow-400">{{ result }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const deckId = ref('')
const gameStarted = ref(false)
const result = ref('')
const turnResult = ref('')
const choice = ref('')
const bet = ref(0)
const currentWinnings = ref(0)
const money = ref(500)
const newCard = ref(null)
const oldCard = ref(null)
let cards = []

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
  gameStarted.value = true
  result.value = ''
  await fetchNewDeck()
  oldCard.value = ''
  const cards = await drawCards(1)
  newCard.value = cards[0]
  faceCards()
  newTurn()
}

async function newTurn() {
  oldCard.value = newCard.value
  cards = await drawCards(1)
  newCard.value = cards[0]
  faceCards()
}

function checkResult() {
  console.log(`old card ${oldCard.value.value} new card ${newCard.value.value}`)
  if (newCard.value.value > oldCard.value.value) {
    turnResult.value = 'Higher'
    console.log(turnResult.value)
  } else if (newCard.value.value < oldCard.value.value) {
    turnResult.value = 'Lower'
    console.log(turnResult.value)
  }
  console.log(`choice ${choice.value}`)
  let mult = findMult()
  if (turnResult.value === choice.value) {
    result.value = 'You win!'
    currentWinnings.value *= mult
    newTurn()
  } else if (mult == 1) {
    result.value = 'Tie!'
    newTurn()
  } else {
    result.value = 'You lose!'
    money.value -= bet.value
    gameStarted.value = false
  }
}

function faceCards() {
  if (newCard.value.value === 'JACK') {
    newCard.value.value = 11
  } else if (newCard.value.value === 'QUEEN') {
    newCard.value.value = 12
  } else if (newCard.value.value === 'KING') {
    newCard.value.value = 13
  } else if (newCard.value.value === 'ACE') {
    newCard.value.value = 1
  }
}

function findMult() {
  let counter = 0
  let mult = 0
  if (newCard.value.value > oldCard.value.value) {
    mult = 1
    while (newCard.value.value > oldCard.value.value) {
      oldCard.value.value += 1
      counter += 1
    }
  } else if (newCard.value.value < oldCard.value.value) {
    mult = 1
    while (newCard.value.value < oldCard.value.value) {
      oldCard.value.value += 1
      counter += 1
    }
  }
  if (counter == 0) {
    return mult
  } else {
    for (let i = 0; i < counter; i++) {
      mult *= 1.05
    }
    return mult
  }
}
</script>

<style scoped></style>

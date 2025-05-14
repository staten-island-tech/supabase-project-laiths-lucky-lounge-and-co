<template>
  <div>
    <h1>gvbgujbhukkbnbkn</h1>
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
    <p v-if="result">{{ result }}</p>
  </div>
</template>

<script setup>
const deckId = ref('')
const gameOver = ref(true)
const gameStarted = ref(false)
const result = ref('')
const bet = ref(0)
const money = ref(500)
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
</script>

<style scoped></style>

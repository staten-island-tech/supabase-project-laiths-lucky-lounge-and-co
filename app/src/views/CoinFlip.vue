<template>
  <div
    class="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6"
  >
    <h1
      class="absolute top-6 right-6 text-lg md:text-xl font-semibold bg-white text-indigo-700 px-4 py-2 rounded-xl shadow-md"
    >
      Your Balance: ${{ balance }}
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

      <p v-if="result" class="mt-4 text-lg text-center">
        The coin landed on
        <span class="font-semibold text-indigo-700">{{ result }}</span>
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

let pChoice = ref('Choose a Coin!')
const inputNumber = ref(0)
const result = ref('')
let balance = ref(100)

function updateBalance(amount, win) {
  if (win) {
    balance.value += amount
  } else {
    balance.value -= amount
  }
}
function winLoss(choice) {
  if (result.value === choice) {
    updateBalance(inputNumber.value, true)
  } else {
    updateBalance(inputNumber.value, false)
  }
}
function flipcoin() {
  const randomNumber = Math.random()
  result.value = randomNumber > 0.5 ? 'Heads' : 'Tails'
  winLoss(pChoice.value)
}

if (pChoice === '') {}

function moneyCheck() {
  if (balance.value <= 0) {
    alert('You are broke! Please refresh the page to play again.')}}
</script>

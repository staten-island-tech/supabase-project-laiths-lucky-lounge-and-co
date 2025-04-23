<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6"
  >
    <div class="bg-white text-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold mb-6 text-center">Coin Flip</h1>
      <input
        v-model="inputNumber"
        placeholder="Your betting amount!"
        type="number"
        class="w-full p-3 mb-4 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <p v-if="inputNumber" class="mb-4 text-lg text-center">
        You're betting <span class="font-semibold text-indigo-700">${{ inputNumber }}</span>
      </p>
      <button @click="choice = 'heads'">Heads</button>
      <button @click="choice = 'tails'">Tails</button>
      <button
        @click="flipcoin"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200"
      >
        Flip Coin!
      </button>
      <p v-if="result" class="mt-4 text-lg text-center">
        The coin landed on <span class="font-semibold text-indigo-700">{{ result }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const inputNumber = ref(0)
let choice = ref('')
let result = ref('')
function flipcoin() {
  const randomNumber = Math.random()
  if (randomNumber > 0.5) {
    result.value = 'heads'
  } else {
    result.value = 'tails'
  }
}

function payOut() {
  if (choice === result) {
    return inputNumber.value * 2
  }
}
</script>

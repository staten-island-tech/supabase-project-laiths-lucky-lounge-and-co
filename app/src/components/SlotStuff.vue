<template>
  <div class="h-screen bg-gray-900 flex flex-col justify-center">
    <div class="text-white text-6xl font-bold mx-auto">Slot Machine</div>
    <div class="text-white text-2xl font-bold mx-auto mt-4">Balance: ${{ money }}</div>
    <div class="mx-auto mt-4">
      <input
        type="number"
        v-model.number="betAmount"
        placeholder="Bet"
        class="text-white w-full p-2 border-2 border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        :max="money"
        :min="1"
      />
    </div>

    <div class="mx-auto mt-8">
      <button
        @click="spinAnimate"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Spin
      </button>
    </div>
    <div class="mx-auto mt-8">
      <div class="grid grid-cols-3 gap-4">
        <div
          :key="`${symbols[0]}-${rando()}`"
          class="text-white text-5xl bg-gray-700 flex justify-center items-center h-32 w-32 rounded-lg"
        >
          <img :src="symbols[0]" :alt="symbols[0]" />
        </div>
        <div
          :key="`${symbols[1]}-${rando()}`"
          class="text-white text-5xl bg-gray-700 flex justify-center items-center h-32 w-32 rounded-lg"
        >
          <img :src="symbols[1]" :alt="symbols[1]" />
        </div>
        <div
          :key="`${symbols[2]}-${rando()}`"
          class="text-white text-5xl bg-gray-700 flex justify-center items-center h-32 w-32 rounded-lg"
        >
          <img :src="symbols[2]" :alt="symbols[2]" />
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <h2 class="text-2xl font-bold text-green-500">{{ winMessage }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import 'animate.css'
import cherry from '../assets/cherryslots.png'
import lemon from '../assets/lemonslots.png'
import orange from '../assets/orangeslots.png'
import plum from '../assets/plumslots.png'
import bell from '../assets/bellslots.png'
import bar from '../assets/barslots.png'
import seven from '../assets/sevenslots.png'
const clicked = ref(false)
const money = ref(500)
const betAmount = ref(1)
const symbols = ref(['', '', ''])
const slotSymbols = [cherry, lemon, orange, plum, bell, bar, seven]
const winMessage = ref('')
function rando() {
  return Math.random()
}
function spin() {
  if (betAmount.value > money.value || betAmount.value <= 0) {
    winMessage.value = 'Invalid bet! (what a bum u thought u could cheat)'
    return
  }
  let nums = []
  money.value -= betAmount.value
  for (let i = 0; i < 3; i++) {
    nums.push(Math.floor(Math.random() * slotSymbols.length))
  }
  symbols.value = nums.map((num) => slotSymbols[num])
  if (symbols.value[0] === symbols.value[1] && symbols.value[1] === symbols.value[2]) {
    money.value += betAmount.value * 10
    winMessage.value = `Jackpot! $${betAmount.value * 10}!`
  } else if (
    symbols.value[0] === symbols.value[1] ||
    symbols.value[1] === symbols.value[2] ||
    symbols.value[0] === symbols.value[2]
  ) {
    money.value += betAmount.value * 1.5
    winMessage.value = `You win $${betAmount.value * 1.5}!`
  } else {
    winMessage.value = 'You lose!'
  }
}
async function spinAnimate() {
  if (clicked.value) return
  clicked.value = true
  const start = Date.now()
  for (let i = 0; i < 10; i++) {
    symbols.value = [
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
    ]
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  spin()
  clicked.value = false
}
</script>

<style scoped></style>

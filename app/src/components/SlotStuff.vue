<template>
  <div class="h-screen bg-gray-900 flex flex-col justify-center">
    <div class="text-white text-6xl font-bold mx-auto">Slot Machine</div>
    <div class="text-white text-2xl font-bold mx-auto mt-4">Balance: ${{ money }}</div>
    <div class="mx-auto mt-8">
      <button
        @click="spin"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Spin
      </button>
    </div>
    <div class="mx-auto mt-8">
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="(symbol, index) in symbols"
          :key="`${symbol}-${index}`"
          class="text-white text-5xl bg-gray-700 flex justify-center items-center h-32 w-32 rounded-lg"
        >
          <img :src="symbol" :alt="symbol" />
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
import cherry from '../assets/cherryslots.png'
import lemon from '../assets/lemonslots.png'
import orange from '../assets/orangeslots.png'
import plum from '../assets/plumslots.png'
import bell from '../assets/bellslots.png'
import bar from '../assets/barslots.png'
import seven from '../assets/sevenslots.png'
const money = ref(500)
const symbols = ref(['', '', ''])
const slotSymbols = [cherry, lemon, orange, plum, bell, bar, seven]
const winMessage = ref('')
function spin() {
  let nums = []
  for (let i = 0; i < 3; i++) {
    nums.push(Math.floor(Math.random() * slotSymbols.length))
  }
  symbols.value = nums.map((num) => slotSymbols[num])
  if (symbols.value[0] === symbols.value[1] && symbols.value[1] === symbols.value[2]) {
    money.value += 10
    winMessage.value = 'Jackpot! 10$!'
  } else if (
    symbols.value[0] === symbols.value[1] ||
    symbols.value[1] === symbols.value[2] ||
    symbols.value[0] === symbols.value[2]
  ) {
    money.value += 1.5
    winMessage.value = 'You win $1.50!'
  } else {
    money.value -= 1
    winMessage.value = 'You lose!'
  }
}
</script>

<style scoped></style>

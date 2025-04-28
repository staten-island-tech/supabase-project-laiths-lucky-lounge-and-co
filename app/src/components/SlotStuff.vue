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
          {{ symbol }}
        </div>
      </div>
    </div>
    <h2>{{ winMessage }}</h2>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const money = ref(500)
const symbols = ref(['', '', ''])
const slotSymbols = ['Cherry', 'Lemon', 'Orange', 'Plum', 'Bell', 'Bar', 'Seven']
const winMessage = ref('')
function spin() {
  let nums = []
  for (let i = 0; i < 3; i++) {
    nums.push(Math.floor(Math.random() * slotSymbols.length))
  }
  symbols.value = nums.map((num) => slotSymbols[num])
  if (symbols.value[0] === symbols.value[1] && symbols.value[1] === symbols.value[2]) {
    money.value += 10
    winMessage.value = 'Jackpot!'
  } else if (
    symbols.value[0] === symbols.value[1] ||
    symbols.value[1] === symbols.value[2] ||
    symbols.value[0] === symbols.value[2]
  ) {
    money.value += 1.5
    winMessage.value = 'You win!'
  } else {
    money.value -= 1
    winMessage.value = 'You lose!'
  }
}
</script>

<style scoped></style>

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
        <div v-for="symbol in symbols" :key="symbol">{{ symbol }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const money = ref(500)
const symbols = ref(['', '', ''])

function spin() {
  const randomSymbols = ['Cherry', 'Lemon', 'Orange', 'Plum', 'Bell', 'Bar', 'Seven']
  symbols.value = randomSymbols.sort(() => 0.5 - Math.random()).slice(0, 3)
  if (symbols.value[0] === symbols.value[1] && symbols.value[1] === symbols.value[2]) {
    money.value += 10
  } else {
    money.value -= 1
  }
}
</script>

<style scoped></style>

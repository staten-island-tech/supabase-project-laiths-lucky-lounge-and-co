<template>
  <div>
    <h1>Coin Flip</h1>
    <input v-model="inputNumber" placeholder="Your betting amount!" type="number" />
    <p>You're betting {{ inputNumber }}</p>
    <button @click="randomNumber = getRandomIntInclusive(1, 10)">Flip Coin!</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const inputNumber = ref(0)
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let randomNumber = getRandomIntInclusive(1, 10)
if (randomNumber > 5) {
  console.log('Heads')
} else {
  console.log('Tails')
}
</script>

<style scoped></style>

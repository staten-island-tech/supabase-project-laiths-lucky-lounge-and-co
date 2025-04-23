<template>
  <div>
    <h1>Coin Flip</h1>
    <input v-model="inputNumber" placeholder="Your betting amount!" type="number" />
    <p>You're betting {{ inputNumber }}</p>
    <button @click="flipcoin()">Flip Coin!</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const inputNumber = ref(0)

function flipcoin() {
  let randomNumber = Math.random()
  if (randomNumber > 0.5) {
    console.log('Heads')
  } else {
    console.log('Tails')
  }
}
</script>

<style scoped></style>

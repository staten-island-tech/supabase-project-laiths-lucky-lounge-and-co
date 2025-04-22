<template>
  <div></div>
</template>

<script setup>
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

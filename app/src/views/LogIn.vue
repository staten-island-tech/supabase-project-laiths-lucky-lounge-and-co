<template>
  <div class="">
    <SignIn />
    <img :src="coinImages['Heads']" alt="Coin Result" class="w-24 h-24 flip-coin" />
  </div>
</template>

<script setup>
import SignIn from '../components/SignIn.vue'
import headsImg from '@/assets/Heads.png'
import tailsImg from '@/assets/Tails.png'

const coinImages = {
  Heads: headsImg,
  Tails: tailsImg,
}
</script>

<style scoped></style>

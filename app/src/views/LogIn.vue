<template>
  <div class="">
    <SignIn />
    <RouterLink
      to="/signup"
      class="mt-4 bg-yellow-500 hover:bg-yellow-600 text-center text-white font-semibold py-2 rounded-md transition"
    >
      Sign Up
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import SignIn from '../components/SignIn.vue'
</script>

<style scoped></style>

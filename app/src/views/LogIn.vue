<template>
  <div>
    <TestHeader />
    <RouterLink to="/homepage">Home</RouterLink>
  </div>
</template>

<script setup>
import TestHeader from '@/components/TestHeader.vue'
import { RouterLink } from 'vue-router'
</script>

<style scoped></style>

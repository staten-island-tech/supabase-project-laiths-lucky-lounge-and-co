<template>
  <div class="text-center">
    <h2 class="text-2xl font-bold mb-4">{{ name }}</h2>
    <div class="flex flex-wrap justify-center gap-4">
      <img
        v-for="card in hand"
        :key="card.code"
        :src="card.image"
        alt="card"
        class="w-24 drop-shadow-md"
      />
    </div>
  </div>
</template>

<script setup>
defineProps(['name', 'hand'])
</script>

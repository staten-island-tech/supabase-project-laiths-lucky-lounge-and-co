<template>
  <div>
    <h2>{{ name }}</h2>
    <div style="display: flex; gap: 8px; flex-wrap: wrap">
      <img v-for="card in hand" :key="card.code" :src="card.image" alt="card" style="width: 80px" />
    </div>
  </div>
</template>

<script setup>
defineProps(['name', 'hand'])
</script>

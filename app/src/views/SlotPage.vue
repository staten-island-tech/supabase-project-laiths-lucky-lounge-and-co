<template>
  <div>
    <SlotStuff />
    <RouterLink to="/homepage">
      <button
        class="absolute top-3 left-3 p-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-md outline-2 outline-offset-2"
      >
        &lt;
      </button>
    </RouterLink>
  </div>
</template>

<script setup>
import SlotStuff from '@/components/SlotStuff.vue'
</script>

<style scoped></style>

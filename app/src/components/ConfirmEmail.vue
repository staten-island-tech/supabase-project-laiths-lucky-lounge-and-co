<template>
  <div class="flex flex-col items-center justify-center space-y-4">
    <h2 class="text-2xl font-bold">Confirming your email...</h2>
    <p v-if="loading" class="text-gray-600">Please wait while we confirm your email.</p>
    <p v-else-if="error" class="text-red-500">{{ error }}</p>
    <p v-else class="text-green-500">Email confirmed! Redirecting...</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const { error: confirmError } = await supabase.auth.getSession()

  if (confirmError) {
    error.value = confirmError.message
  } else {
    setTimeout(() => {
      window.location.href = '/homepage'
    }, 2000)
  }

  loading.value = false
})
</script>

<style scoped></style>

<template>
  <div class="flex flex-col items-center justify-center space-y-4">
    <h2 class="text-3xl font-bold tracking-wide">Confirming your email...</h2>
    <p v-if="loading" class="text-gray-600 text-lg">Please wait while we confirm your email.</p>
    <p v-else-if="error" class="text-red-500 text-lg font-medium">{{ error }}</p>
    <p v-else class="text-green-500 text-lg font-medium">Email confirmed! Redirecting...</p>
    <svg
      v-if="loading"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 12a8 8 0 018 8v0"
      />
    </svg>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const { error: confirmError } = await supabase.auth.getSession()

  if (confirmError) {
    error.value = confirmError.message
  } else {
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  loading.value = false
})
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

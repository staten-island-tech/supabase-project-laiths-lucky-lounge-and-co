<template>
  <form @submit.prevent="handleSignIn" class="space-y-6">
    <div class="relative">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="bg-white border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      </div>
    </div>
    <div class="relative">
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        minlength="8"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
        class="bg-white border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
          ></path>
          <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
        </svg>
      </div>
    </div>
    <button
      type="submit"
      :disabled="isLoading"
      class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
    >
      {{ isLoading ? 'Logging in...' : 'Sign In' }}
    </button>
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref(null)

const router = useRouter()

const handleSignIn = async () => {
  isLoading.value = true
  error.value = null

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  isLoading.value = false

  if (signInError) {
    error.value = signInError.message
    return
  }

  router.push('/homepage')
}
</script>

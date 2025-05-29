<template>
  <div class="min-h-screen flex items-center justify-center">
    <form
      @submit.prevent="handleSignUp"
      class="bg-white rounded-md shadow-md p-8 space-y-4 w-full max-w-md"
    >
      <h2 class="text-2xl font-bold mb-4">Sign Up</h2>
      <div class="space-y-2">
        <label class="block">
          <span class="block text-sm font-bold mb-1">Email</span>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label class="block">
          <span class="block text-sm font-bold mb-1">Password</span>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            minlength="8"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {{ isLoading ? 'Registering...' : 'Sign Up' }}
      </button>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <RouterLink
        to="/homepage"
        class="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Enter Game Room
      </RouterLink>
    </form>
  </div>
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

const handleSignUp = async () => {
  isLoading.value = true
  error.value = null

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  isLoading.value = false

  if (signUpError) {
    error.value = signUpError.message
    return
  }
  router.push('/confirmemail')
}
</script>

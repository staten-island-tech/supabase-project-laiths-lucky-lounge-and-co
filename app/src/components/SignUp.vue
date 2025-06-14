<template>
  <div class="min-h-screen flex items-center justify-center">
    <RouterLink
      to="/"
      class="absolute top-0 left-0 m-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition"
    >
      Back To Log In
    </RouterLink>
    <form
      @submit.prevent="handleSignUp"
      class="bg-white rounded-md shadow-md p-8 space-y-4 w-full max-w-md"
    >
      <h2 class="text-2xl font-bold mb-4 text-black">Sign Up</h2>
      <div class="space-y-2 text-black">
        <label class="block">
          <span class="block text-sm font-bold mb-1 text-black">Email</span>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </label>
        <label class="block">
          <span class="block text-sm font-bold mb-1 text-black">Username</span>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </label>
        <label class="block">
          <span class="block text-sm font-bold mb-1 text-black">Password</span>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            minlength="8"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
      <p v-if="dLoading" class="text-green-600 text-sm">
        An email was sent to your inbox. Please confirm your email before logging in.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const email = ref('')
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref(null)
const dLoading = ref(false)

const handleSignUp = async () => {
  isLoading.value = true
  dLoading.value = false
  error.value = null

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        username: username.value,
      },
    },
  })

  isLoading.value = false

  if (signUpError) {
    error.value = signUpError.message
    return
  }

  const user = data.user
  if (user) {
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user.id,
        username: username.value,
      },
    ])

    if (insertError) {
      console.error('Error inserting into users table:', insertError.message)
      error.value = 'User created but database entry failed.'
      return
    }
  }

  dLoading.value = true
}
</script>

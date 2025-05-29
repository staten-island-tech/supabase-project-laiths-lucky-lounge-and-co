<template>
  <form @submit.prevent="handleSignUp" class="space-y-4 bg-white rounded-md shadow-md p-8">
    <h2 class="text-2xl font-bold mb-4">Sign Up</h2>
    <div class="space-y-2">
      <label>
        <span class="block text-sm font-bold mb-1">Email</span>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="block w-full px-4 py-2 border rounded-md outline-none"
        />
      </label>
      <label>
        <span class="block text-sm font-bold mb-1">Password</span>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          minlength="8"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          class="block w-full px-4 py-2 border rounded-md outline-none"
        />
      </label>
    </div>
    <button
      type="submit"
      :disabled="isLoading"
      class="block w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md"
    >
      {{ isLoading ? 'Registering...' : 'Sign Up' }}
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

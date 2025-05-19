<template>
  <div>
    <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Add Funds</h2>

      <div class="mb-4">
        <label for="cardNumber" class="block text-gray-900 font-bold mb-2 text-center">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          v-model="cardNumber"
          placeholder="1234 5678 9012 3456"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label for="expiryDate" class="block text-gray-700 font-bold mb-2">Expiry Date</label>
        <input
          type="text"
          id="expiryDate"
          v-model="expiryDate"
          placeholder="MM/YY"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label for="securityCode" class="block text-gray-700 font-bold mb-2">Security Code</label>
        <input
          type="password"
          id="securityCode"
          v-model="securityCode"
          placeholder="&#8226;&#8226;&#8226;"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label for="amount" class="block text-gray-700 font-bold mb-2">Amount</label>
        <input
          type="number"
          id="amount"
          v-model.number="amount"
          placeholder="Enter amount"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="button"
        @click="addFunds"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200"
      >
        Add Money
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cardNumber = ref('')
const expiryDate = ref('')
const securityCode = ref('')
const amount = ref(0)

function addFunds() {
  alert('Funds added successfully!')
}
</script>


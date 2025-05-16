<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div
      class="bg-gray-800/50 backdrop-blur-md border border-gray-600 rounded-xl p-8 w-full max-w-md shadow-lg outline-4 outline-yellow-400"
    >
      <h1 class="text-3xl font-bold text-center text-yellow-400 mb-6">
        Log into <span class="text-yellow-400">Laith's Lucky Lounge</span>
      </h1>

      <div class="flex flex-col gap-4">
        <input
          type="text"
          id="Username"
          placeholder="Username"
          class="px-4 py-2 rounded-md bg-gray-700 text-yellow-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="password"
          id="Password"
          placeholder="Password"
          class="px-4 py-2 rounded-md bg-gray-700 text-yellow-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <RouterLink
          to="/homepage"
          class="mt-4 bg-yellow-500 hover:bg-yellow-600 text-center text-white font-semibold py-2 rounded-md transition"
        >
          Enter Game Room
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>

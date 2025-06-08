<template>
  <div>
    <HomeHeader />

    <div class="max-w-3xl mx-auto mt-6 space-y-8">
      <section class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4">🏆 Top 10 Highest Wins</h2>
        <table class="w-full text-left">
          <thead class="border-b border-gray-300">
            <tr>
              <th class="py-2 px-3">Username</th>
              <th class="py-2 px-3">Result</th>
              <th class="py-2 px-3">Game</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="bet in topWins"
              :key="bet.id"
              class="border-b last:border-none hover:bg-gray-50"
            >
              <td class="py-2 px-3 font-semibold">{{ bet.username }}</td>
              <td class="py-2 px-3">${{ Number(bet.result).toFixed(2) }}</td>
              <td class="py-2 px-3 text-gray-600">{{ bet.game }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4">📅 10 Most Recent Bets</h2>
        <table class="w-full text-left">
          <thead class="border-b border-gray-300">
            <tr>
              <th class="py-2 px-3">Username</th>
              <th class="py-2 px-3">Result</th>
              <th class="py-2 px-3">Game</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="bet in recentBets"
              :key="bet.id"
              class="border-b last:border-none hover:bg-gray-50"
            >
              <td class="py-2 px-3 font-semibold">{{ bet.username }}</td>
              <td class="py-2 px-3">${{ Number(bet.result).toFixed(2) }}</td>
              <td class="py-2 px-3 text-gray-600">{{ bet.game }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup>
import HomeHeader from '@/components/HomeHeader.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const userStore = useUserStore()

const topWins = ref([])
const recentBets = ref([])

onMounted(async () => {
  await userStore.checkLoggedInStatus()
  if (!userStore.isLoggedIn) {
    router.push('/')
    return
  }
  await fetchLeaderboards()
})

async function fetchLeaderboards() {
  const { data: wins, error: err1 } = await supabase
    .from('bets')
    .select('id, username, result, game')
    .order('result', { ascending: false })
    .limit(10)
  if (!err1) topWins.value = wins

  const { data: recent, error: err2 } = await supabase
    .from('bets')
    .select('id, username, result, game')
    .order('placed_at', { ascending: false })
    .limit(10)
  if (!err2) recentBets.value = recent
}
</script>

<style scoped>
table th,
table td {
  padding-right: 1rem;
}
</style>

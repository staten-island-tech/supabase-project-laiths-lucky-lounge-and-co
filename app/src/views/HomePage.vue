<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <HomeHeader />

    <div class="mt-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 p-8">
      <div class="bg-white/10 p-8 rounded-xl shadow-md flex flex-col">
        <h2 class="text-3xl font-extrabold mb-6 text-yellow-400">🏆 Top 10 Highest Wins</h2>
        <table class="w-full text-left text-base flex-grow">
          <thead class="border-b border-white/20">
            <tr>
              <th class="py-4">Username</th>
              <th class="py-4">Result</th>
              <th class="py-4">Game</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in topWins"
              :key="'top-' + index"
              class="border-b border-white/10 hover:bg-white/10 transition-colors"
            >
              <td class="py-4">{{ entry.username }}</td>
              <td class="py-4">${{ Number(entry.result).toFixed(2) }}</td>
              <td class="py-4">{{ entry.game }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white/10 p-8 rounded-xl shadow-md flex flex-col">
        <h2 class="text-3xl font-extrabold mb-6 text-blue-400">🕒 10 Most Recent Bets</h2>
        <table class="w-full text-left text-base flex-grow">
          <thead class="border-b border-white/20">
            <tr>
              <th class="py-4">Username</th>
              <th class="py-4">Result</th>
              <th class="py-4">Game</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in recentBets"
              :key="'recent-' + index"
              class="border-b border-white/10 hover:bg-white/10 transition-colors"
            >
              <td class="py-4">{{ entry.username }}</td>
              <td class="py-4">${{ Number(entry.result).toFixed(2) }}</td>
              <td class="py-4">{{ entry.game }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
  if (!userStore.isLoggedIn) router.push('/')
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
  padding-right: 1.25rem;
}
</style>

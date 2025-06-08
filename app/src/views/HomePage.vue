<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <HomeHeader />

    <div class="mt-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 p-6">
      <div class="bg-white/10 p-6 rounded-xl shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-yellow-400">🏆 Top 10 Highest Wins</h2>
        <table class="w-full text-left text-sm">
          <thead class="border-b border-white/20">
            <tr>
              <th class="py-2">Username</th>
              <th class="py-2">Result</th>
              <th class="py-2">Game</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in topWins"
              :key="'top-' + index"
              class="border-b border-white/10"
            >
              <td class="py-2">{{ entry.username }}</td>
              <td class="py-2">${{ entry.result }}</td>
              <td class="py-2">{{ entry.game }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white/10 p-6 rounded-xl shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-blue-400">🕒 10 Most Recent Bets</h2>
        <table class="w-full text-left text-sm">
          <thead class="border-b border-white/20">
            <tr>
              <th class="py-2">Username</th>
              <th class="py-2">Result</th>
              <th class="py-2">Game</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in recentBets"
              :key="'recent-' + index"
              class="border-b border-white/10"
            >
              <td class="py-2">{{ entry.username }}</td>
              <td class="py-2">${{ entry.result }}</td>
              <td class="py-2">{{ entry.game }}</td>
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
import { useUserStore } from '@/stores/user.js'
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
  const { data: topData, error: topError } = await supabase
    .from('bets')
    .select('username, result, game')
    .gt('result', 0)
    .order('result', { ascending: false })
    .limit(10)

  if (!topError) {
    topWins.value = topData
  }

  const { data: recentData, error: recentError } = await supabase
    .from('bets')
    .select('username, result, game')
    .order('created_at', { ascending: false })
    .limit(10)

  if (!recentError) {
    recentBets.value = recentData
  }
}
</script>

<style scoped>
table th,
table td {
  padding-right: 1rem;
}
</style>

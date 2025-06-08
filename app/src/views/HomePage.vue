<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <HomeHeader />

    <div class="mt-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 p-6">
      <div class="bg-white/10 p-6 rounded-xl shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-yellow-400 w-[40vw]">🏆 Top 10 Highest Wins</h2>
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
        <h2 class="text-2xl font-bold mb-4 text-blue-400 w-[40vw]">🕒 10 Most Recent Bets</h2>
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
import { useUserStore } from '@/stores/user'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const userStore = useUserStore()
onMounted(async () => {
  await userStore.checkLoggedInStatus()
  if (!userStore.isLoggedIn) router.push('/')
})

const topWins = ref([])
const recentBets = ref([])

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

onMounted(fetchLeaderboards)
</script>

<style scoped>
table th,
table td {
  padding-right: 1rem;
}
</style>

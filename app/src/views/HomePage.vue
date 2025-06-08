<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <HomeHeader />

    <div class="mt-6 max-w-7xl mx-auto flex gap-x-20 p-0" style="height: 72.5vh">
      <div
        class="bg-white/10 p-8 rounded-xl shadow-md overflow-auto flex flex-col w-4/5"
        style="min-width: 0"
      >
        <h2 class="text-3xl font-bold mb-6 text-yellow-400">🏆 Top 10 Highest Wins</h2>
        <table class="w-full text-left text-lg">
          <thead class="border-b border-white/20">
            <tr>
              <th class="py-3">Username</th>
              <th class="py-3">Result</th>
              <th class="py-3">Game</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in topWins"
              :key="'top-' + index"
              class="border-b border-white/10"
            >
              <td class="py-3 truncate">{{ entry.username }}</td>
              <td class="py-3">${{ entry.result }}</td>
              <td class="py-3 truncate">{{ entry.game }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="bg-white/10 p-8 rounded-xl shadow-md overflow-auto flex flex-col w-4/5"
        style="min-width: 0"
      >
        <h2 class="text-3xl font-bold mb-6 text-blue-400">🕒 10 Most Recent Bets</h2>
        <table class="w-full text-left text-lg">
          <thead class="border-b border-white/20">
            <tr>
              <th class="py-3">Username</th>
              <th class="py-3">Result</th>
              <th class="py-3">Game</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in recentBets"
              :key="'recent-' + index"
              class="border-b border-white/10"
            >
              <td class="py-3 truncate">{{ entry.username }}</td>
              <td class="py-3">${{ entry.result }}</td>
              <td class="py-3 truncate">{{ entry.game }}</td>
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
div.mx-auto {
  padding-left: 0;
  padding-right: 0;
  margin-left: auto;
  margin-right: auto;
}

.flex > div {
  margin: 0 !important;
}

td.truncate,
th.truncate {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

table th,
table td {
  padding-right: 1.5rem;
  padding-left: 0.5rem;
}

table {
  font-size: 1.125rem;
}
</style>

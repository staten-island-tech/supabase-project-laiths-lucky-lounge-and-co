<template>
  <div>
    <HomeHeader />

    <section class="p-4">
      <h2 class="text-xl font-bold mb-2">🏆 Top 10 Highest Wins</h2>
      <ul>
        <li v-for="bet in topWins" :key="bet.id" class="py-1 border-b">
          {{ bet.username }} – {{ bet.result }} – {{ bet.game }}
        </li>
      </ul>
    </section>

    <section class="p-4 mt-6">
      <h2 class="text-xl font-bold mb-2">📅 10 Most Recent Bets</h2>
      <ul>
        <li v-for="bet in recentBets" :key="bet.id" class="py-1 border-b">
          {{ bet.username }} – {{ bet.result }} – {{ bet.game }}
        </li>
      </ul>
    </section>
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
h2 {
  margin-bottom: 0.5rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.25rem;
}
</style>

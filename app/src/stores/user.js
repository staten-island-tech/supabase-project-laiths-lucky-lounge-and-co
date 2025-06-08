import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  const login = (userData) => {
    user.value = userData
    isLoggedIn.value = true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    isLoggedIn.value = false
  }

  const checkLoggedInStatus = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      login({
        id: session.user.id,
        email: session.user.email,
        username: session.user.user_metadata.username,
      })
    } else {
      logout()
    }
  }

  const initAuthListener = () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        login({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata.username,
        })
      } else {
        logout()
      }
    })
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    checkLoggedInStatus,
    initAuthListener,
  }
})

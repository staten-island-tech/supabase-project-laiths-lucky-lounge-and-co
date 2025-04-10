<template>
  <div>
    <div>
      <h1>Log into Laith's Lucky Lounge</h1>
      <input type="text" id="Username" placeholder="Username" />
      <input type="password" id="Password" placeholder="Password" />
    </div>
  </div>
</template>

<script setup>
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    alert('You must log in to Laiths Lucky Lounge to Continue!')
    next('/')
  } else {
    next()
  }
})

</script>

<style scoped>

</style>

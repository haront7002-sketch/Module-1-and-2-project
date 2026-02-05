<template>
<div>
<NavBar v-if="auth.isAuthenticated" @logout="logout" />
<div class="container py-4">
<router-view />
</div>
</div>
</template>

<script setup>
import { useAuthStore } from './store/hrStore'
const auth = useAuthStore()
function logout() { auth.logout(); window.location.href = '/login' }
</script>


<style>
body {
  transition: background 0.3s, color 0.3s;
}
</style>
<template>
  <div class="d-flex justify-content-center align-items-center vh-100"
        style="background: linear-gradient(135deg,#0d6efd,#6610f2);">
    <div class="card p-4 shadow-lg" style="width: 350px; border-radius: 14px;">
      <h3 class="text-center mb-3">HR Portal</h3>

      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" placeholder="Enter username" />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="Enter password" />
      </div>

      <button class="btn btn-primary w-100" @click="submitLogin">
        Login
      </button>
        Demo: hradmin / Password123
      <div class="text-danger text-center mt-2" v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/hrStore';

const username = ref("");
const password = ref("");
const error = ref("");

const auth = useAuthStore();

function submitLogin() {
  if (auth.login(username.value, password.value)) {
    window.location.href = "/dashboard";
  } else {
    error.value = "Invalid credentials.";
  }
}
</script>

<style>
.page-title { 
  background: linear-gradient(90deg,#031227,#0aa5ff); 
  background-clip:text; 
  color:transparent; 
  font-weight:700; 
}
.card-dashboard { 
  border-radius:12px; 
}
</style>


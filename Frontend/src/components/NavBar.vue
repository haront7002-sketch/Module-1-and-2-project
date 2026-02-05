<template>
  <nav class="navbar navbar-expand-lg navbar-hr px-3 py-2 mb-4">
    <div class="container-fluid">
      <a class="navbar-brand text-white" href="#" @click.prevent="$router.push('/dashboard')">
        <i class="fa-solid fa-briefcase me-2"></i>MODERN DAY TECH
      </a>

     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
  <img src="https://i.postimg.cc/qBbjFCDM/Download-Creative-Professional-Trendy-Monogram-MT-TM-M-T-Logo-Design-in-Black-and-White-Color-Initi.jpg" alt="Logo" class="toggler-logo">
</button>


      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><a class="nav-link" @click.prevent="$router.push('/dashboard')">Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" @click.prevent="$router.push('/employees')">Employees</a></li>
          <li class="nav-item"><a class="nav-link" @click.prevent="$router.push('/payroll')">Payroll</a></li>
          <li class="nav-item"><a class="nav-link" @click.prevent="$router.push('/timeoff')">Time Off</a></li>
          <li class="nav-item"><a class="nav-link" @click.prevent="$router.push('/reviews')">Reviews</a></li>
          <li class="nav-item"><a class="nav-link" @click.prevent="$router.push('/reports')">Reports</a></li>
        </ul>

        <div class="d-flex align-items-center">

          <!-- Theme Switch -->
          <label class="theme-switch me-2">
            <input type="checkbox" v-model="isDark" @change="toggleTheme" />
            <span class="slider"></span>
          </label>

          <button class="btn btn-light btn-sm me-2" @click="$router.push('/reports')"><i class="fa fa-chart-bar"></i></button>
          <button class="btn btn-outline-light btn-sm" @click="logout"><i class="fa fa-sign-out-alt me-1"></i> Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/hrStore'

const auth = useAuthStore()
function logout() {
  auth.logout()
  window.location.href = '/login'
}

const isDark = ref(false)

onMounted(() => {
  // Load theme 
  isDark.value = localStorage.getItem('theme') === 'dark'
  applyTheme()
})

function toggleTheme() {
  applyTheme()
}

function applyTheme() {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<style>
.navbar-hr { background: linear-gradient(90deg,#031227,#0aa5ff); border-radius:8px; }
.nav-link { color: rgba(255,255,255,0.95); margin-right:0.6rem }

/* Dark Mode Switch */
.theme-switch {
  position: relative;
  width: 42px;
  height: 22px;
  display: inline-block;
}

.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: rgba(255,255,255,0.5);
  border-radius: 34px;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: #0d6efd;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.toggler-logo {
  width: 30px; 
  height: 30px; 
  object-fit: contain; 
}

</style>


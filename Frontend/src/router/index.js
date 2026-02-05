import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Attendance from '../pages/Attendance.vue'
import Dashboard from '../pages/Dashboard.vue'
import Employees from '../pages/Employees.vue'
import Payroll from '../pages/Payroll.vue'
import TimeOff from '../pages/TimeOff.vue'
import Reports from '../pages/Reports.vue'
import Reviews from '../pages/Reviews.vue'
import { useAuthStore } from '../store/hrStore'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login },
  { path: '/attendance', component: Attendance, meta: { requiresAuth: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/employees', component: Employees, meta: { requiresAuth: true } },
  { path: '/payroll', component: Payroll, meta: { requiresAuth: true } },
  { path: '/timeoff', component: TimeOff, meta: { requiresAuth: true } },
  { path: '/reports', component: Reports, meta: { requiresAuth: true } },
  { path: '/reviews', component: Reviews, meta: { requiresAuth: true } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return next('/login')
  next()
})

export default router

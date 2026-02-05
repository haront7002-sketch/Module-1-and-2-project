<template>
  <div>
    <NavBar />

    <div class="container">
      <h2 class="mb-3">Reports</h2>

      <div class="card p-3">
        <h5>Employee Salary Chart</h5>
        <canvas id="reportSalaryChart" height="120"></canvas>
      </div>

      <div class="card p-3 mt-4">
        <h5>Department Distribution</h5>
        <canvas id="deptChart" height="120"></canvas>
      </div>

    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { onMounted } from 'vue'
import { useHrStore } from '../store/hrStore'

const hr = useHrStore()

onMounted(() => {
  const salaryCtx = document.getElementById('reportSalaryChart')
  new Chart(salaryCtx, {
    type: 'line',
    data: {
      labels: hr.employees.map(x => x.firstName),
      datasets: [{
        label: 'Salary',
        data: hr.employees.map(x => x.salary)
      }]
    }
  })

  const deptCtx = document.getElementById('deptChart')
  const groups = {}
  hr.employees.forEach(e => groups[e.department] = (groups[e.department] || 0) + 1)

  new Chart(deptCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(groups),
      datasets: [{
        data: Object.values(groups)
      }]
    }
  })
})
</script>

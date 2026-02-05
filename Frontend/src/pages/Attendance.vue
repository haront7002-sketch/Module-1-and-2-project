<template>
  <div>
    <NavBar />

    <div class="container py-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="page-title">Attendance</h2>
        <div>
          <small class="text-muted">View attendance & leave requests</small>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-lg-8">
          <div class="card card-dashboard p-3">
            <h6>Employee Attendance List</h6>
            <div class="table-responsive mt-3">
              <table class="table table-hover table-sm">
                <thead class="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Recent Leave</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="e in hr.employees" :key="e.id">
                    <td>{{ e.firstName }} {{ e.lastName }} <br/><small class="text-muted">{{ e.position }}</small></td>
                    <td><span class="badge bg-success">{{ hr.countPresent(e.id) }}</span></td>
                    <td><span class="badge bg-danger">{{ hr.countAbsent(e.id) }}</span></td>
                    <td>
                      <small v-if="latestLeave(e.id)">
                        {{ latestLeave(e.id).reason }} — <span class="text-muted">{{ latestLeave(e.id).status }}</span>
                      </small>
                      <small v-else class="text-muted">—</small>
                    </td>
                    <td><button class="btn btn-sm btn-outline-primary" @click="openDetails(e.id)">Details</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card card-dashboard p-3">
            <h6>Attendance Chart</h6>
            <canvas id="attChart" height="220"></canvas>
            <div class="mt-3">
              <button class="btn btn-sm btn-light" @click="renderChart">Refresh</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <div v-if="details" class="modal-mask">
        <div class="modal-container">
          <h5>{{ detailsName }} — Attendance details</h5>
          <table class="table table-sm mt-2">
            <thead><tr><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="r in details.attendance" :key="r.date">
                <td>{{ r.date }}</td>
                <td><span :class="r.status === 'Present' ? 'badge bg-success' : 'badge bg-danger'">{{ r.status }}</span></td>
              </tr>
            </tbody>
          </table>

          <h6 class="mt-3">Leave Requests</h6>
          <ul class="list-group">
            <li v-for="l in details.leaveRequests" :key="l.date" class="list-group-item">
              <div><strong>{{ l.reason }}</strong> <small class="text-muted">({{ l.date }})</small></div>
              <div class="small" :class="l.status === 'Approved' ? 'text-success' : l.status === 'Pending' ? 'text-warning' : 'text-danger'">{{ l.status }}</div>
            </li>
          </ul>

          <div class="mt-3 text-end">
            <button class="btn btn-secondary btn-sm" @click="details=null">Close</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import { useHrStore } from '../store/hrStore'

const hr = useHrStore()
const details = ref(null)
const detailsName = ref('')

function latestLeave(empId) {
  const rec = hr.getAttendanceForEmployee(empId)
  if (!rec || !rec.leaveRequests || rec.leaveRequests.length===0) return null
  // return most recent by date
  return rec.leaveRequests.slice().sort((a,b)=> new Date(b.date)-new Date(a.date))[0]
}

function openDetails(empId) {
  details.value = hr.getAttendanceForEmployee(empId)
  const e = hr.employees.find(x=>x.id===empId)
  detailsName.value = e ? `${e.firstName} ${e.lastName}` : 'Details'
}

let chart = null
function renderChart() {
  const ctx = document.getElementById('attChart').getContext('2d')
  const labels = hr.employees.map(e=> e.firstName)
  const data = hr.employees.map(e=> hr.countPresent(e.id))
  if (chart) chart.destroy()
  chart = new Chart(ctx, { type:'bar', data:{ labels, datasets:[{ label:'Present days', data, backgroundColor: 'rgba(124,58,237,0.85)'}] }, options:{ responsive:true, maintainAspectRatio:false } })
}

onMounted(()=> renderChart())
</script>

<style>
.page-title { 
  background: linear-gradient(90deg,#031227,#0aa5ff); 
  -webkit-background-clip:text; 
  color:transparent; 
  font-weight:700; 
}
.card-dashboard { 
  border-radius:12px; 
}
.modal-mask { 
  position:fixed; 
  inset:0; 
  background:rgba(2,6,23,0.6); 
  display:flex; 
  align-items:center; 
  justify-content:center; 
  z-index:9999; 
}
.modal-container { 
  background:white; 
  width:720px; 
  max-width:95%; 
  padding:20px; 
  border-radius:10px; 
}
</style>

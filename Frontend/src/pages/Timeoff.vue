<template>
  <div>
    <NavBar />

    <div class="container py-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="page-title">Time Off Requests</h2>
        <div><small class="text-muted">Submit and manage requests</small></div>
      </div>

      <div class="row g-3">
        <div class="col-lg-6">
          <div class="card card-dashboard p-3">
            <h6>New Request</h6>
            <div class="row g-2">
              <div class="col-md-12">
                <select v-model="form.employeeId" class="form-select form-select-sm">
                  <option disabled value="">Select employee</option>
                  <option v-for="e in hr.employees" :key="e.id" :value="e.id">{{ e.firstName }} {{ e.lastName }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <input type="date" v-model="form.date" class="form-control form-control-sm" />
              </div>
              <div class="col-md-6">
                <select v-model="form.type" class="form-select form-select-sm">
                  <option>Annual</option>
                  <option>Sick</option>
                  <option>Unpaid</option>
                </select>
              </div>
              <div class="col-12">
                <input v-model="form.reason" class="form-control form-control-sm" placeholder="Reason" />
              </div>
            </div>

            <div class="mt-2">
              <button class="btn btn-primary btn-sm" @click="submitRequest">Submit Request</button>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card card-dashboard p-3">
            <h6>Requests</h6>
            <ul class="list-group">
              <li class="list-group-item" v-for="r in hr.timeoff" :key="r.id">
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>{{ name(r.employeeId) }}</strong>
                    <div class="small text-muted">{{ r.date }} • {{ r.type }}</div>
                    <div class="mt-1">{{ r.reason }}</div>
                  </div>
                  <div class="text-end">
                    <div :class="r.status==='Pending' ? 'badge bg-warning text-dark' : r.status==='Approved' ? 'badge bg-success' : 'badge bg-danger'">{{ r.status }}</div>
                    <div class="mt-2">
                      <button v-if="r.status==='Pending'" class="btn btn-success btn-sm me-1" @click="hr.setTimeOffStatus(r.id,'Approved')">Approve</button>
                      <button v-if="r.status==='Pending'" class="btn btn-danger btn-sm" @click="hr.setTimeOffStatus(r.id,'Denied')">Deny</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { reactive } from 'vue'
import { useHrStore } from '../store/hrStore'

const hr = useHrStore()

const form = reactive({ employeeId:'', date:'', type:'Annual', reason:'' })

function submitRequest() {
  if (!form.employeeId || !form.date || !form.reason) return alert('Fill all fields')
  hr.requestTimeOff({ employeeId: form.employeeId, date: form.date, type: form.type, reason: form.reason, status: 'Pending' })
  form.employeeId = form.date = form.reason = ''
  alert('Request submitted')
}

function name(id) {
  const e = hr.employees.find(x=>x.id===id)
  return e ? `${e.firstName} ${e.lastName}` : 'Unknown'
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

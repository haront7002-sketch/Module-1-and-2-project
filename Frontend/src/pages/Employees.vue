<template>
  <div>
    <NavBar />

    <div class="container py-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="page-title">Employees</h2>
        <div class="d-flex gap-2">
          <input v-model="q" class="form-control form-control-sm" placeholder="Search employees..." style="min-width:220px"/>
          <button class="btn btn-sm btn-light" @click="resetForm">Reset</button>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-lg-8">
          <div class="row g-3">
            <div v-for="emp in filtered" :key="emp.id" class="col-md-6">
              <div class="card card-dashboard p-3 h-100">
                
                <div class="d-flex align-items-center">
                  
                  <div class="me-3 flex-shrink-0">
                    <div 
                      class="bg-secondary rounded-circle d-flex align-items-center justify-content-center" 
                      style="width:50px;height:50px;font-size:1.1rem;color:#fff;font-weight:bold;"
                    >
                      {{ getInitials(emp) }}
                    </div>
                  </div>

                  <div class="flex-grow-1">
                    <h6 class="mb-0">{{ emp.firstName }} {{ emp.lastName }}</h6>
                    <small class="text-muted">{{ emp.position }} • {{ emp.department }}</small>
                  </div>

                  <div class="ms-3 text-end flex-shrink-0">
                    <div class="small text-muted">R {{ emp.salary.toLocaleString() }}</div>
                    <button class="btn btn-sm btn-outline-primary mt-2" @click="edit(emp)">Edit</button>
                  </div>

                </div>

                <p v-if="emp.history" class="mt-2 small text-muted">
                    <i class="bi bi-clock-history me-1"></i>
                    {{ emp.history }}
                </p>
                <p v-if="emp.email" class="mt-1 small text-muted">
                    <i class="bi bi-envelope-fill me-1"></i>
                    {{ emp.email }}
                </p>

              </div>
            </div>
            </div>
        </div>

        <div class="col-lg-4">
          <div class="card card-dashboard p-3">
            <h6>{{ editing ? 'Edit Employee' : 'Add Employee' }}</h6>
            <form @submit.prevent="save">
              <div class="mb-2">
                <input v-model="form.firstName" class="form-control form-control-sm" placeholder="First name" required />
              </div>
              <div class="mb-2">
                <input v-model="form.lastName" class="form-control form-control-sm" placeholder="Last name" required />
              </div>
              <div class="mb-2">
                <input v-model="form.position" class="form-control form-control-sm" placeholder="Position" />
              </div>
              <div class="mb-2">
                <input v-model="form.department" class="form-control form-control-sm" placeholder="Department" />
              </div>
              <div class="mb-2">
                <input v-model.number="form.salary" class="form-control form-control-sm" type="number" placeholder="Salary" />
              </div>
              <div class="mb-2">
                <input v-model="form.history" class="form-control form-control-sm" placeholder="History (e.g., Joined in 2020)" />
              </div>
               <div class="mb-2">
                <input v-model="form.email" class="form-control form-control-sm" type="email" placeholder="Email" />
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-primary btn-sm" type="submit">{{ editing ? 'Save' : 'Add' }}</button>
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetForm">Cancel</button>
                <button v-if="editing" class="btn btn-danger btn-sm ms-auto" type="button" @click="remove">Delete</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { reactive, ref, computed } from 'vue'
import { useHrStore } from '../store/hrStore'

const hr = useHrStore()
const q = ref('')
const editing = ref(false)
const editingId = ref(null)
const form = reactive({ firstName:'', lastName:'', position:'', department:'', salary:0, history:'', email:'' })

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return hr.employees
  return hr.employees.filter(e => `${e.firstName} ${e.lastName} ${e.position} ${e.department}`.toLowerCase().includes(term))
})

// Function to calculate initials for use in the template loop
function getInitials(employee) {
    const firstInitial = employee.firstName ? employee.firstName[0].toUpperCase() : '';
    const lastInitial = employee.lastName ? employee.lastName[0].toUpperCase() : '';
    return firstInitial + lastInitial;
}

function edit(emp) {
  editing.value = true
  editingId.value = emp.id
  Object.assign(form, { ...emp })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetForm() {
  editing.value = false
  editingId.value = null
  Object.assign(form, { firstName:'', lastName:'', position:'', department:'', salary:0, history:'', email:'' })
}

function save() {
  if (!form.firstName || !form.lastName) return alert('First and last name required')
  if (editing.value) {
    hr.updateEmployee(editingId.value, { ...form })
  } else {
    hr.addEmployee({ ...form })
  }
  resetForm()
}

function remove() {
  if (!confirm('Delete this employee?')) return
  hr.removeEmployee(editingId.value)
  resetForm()
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
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)); 
  box-shadow:0 8px 28px rgba(12,18,30,0.05); 
}
</style>

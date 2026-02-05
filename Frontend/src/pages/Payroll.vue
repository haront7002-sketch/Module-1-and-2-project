<template>
  <div>
    <NavBar />

    <div class="container">
      <h2 class="mb-3">Payroll Management</h2>

      <div class="card p-3 shadow-sm">
        <h5>Employee Payroll Overview</h5>

        <div class="table-responsive mt-3">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Employee</th>
                <th>Hours Worked</th>
                <th>Leave Deductions</th>
                <th>Gross Pay</th>
                <th>NET Pay</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="emp in hr.employees" :key="emp.id">

                <!-- Employee Name -->
                <td>
                  <strong>{{ emp.firstName }} {{ emp.lastName }}</strong>
                  <br />
                  <small class="text-muted">{{ emp.position }}</small>
                </td>

                <!-- Hours Worked -->
                <td>
                  <input type="number" min="0" class="form-control form-control-sm"
                    v-model.number="getPayroll(emp.id).hoursWorked"
                    @input="updateRealtime(emp.id)" />
                </td>

                <!-- Leave Deductions -->
                <td>
                  <input type="number" min="0" class="form-control form-control-sm"
                    v-model.number="getPayroll(emp.id).leaveDeductions"
                    @input="updateRealtime(emp.id)" />
                </td>

                <!-- Gross Pay -->
                <td>R {{ realtime[emp.id]?.gross?.toLocaleString() }}</td>

                <!-- Net Pay -->
                <td><strong>R {{ realtime[emp.id]?.net?.toLocaleString() }}</strong></td>

                <!-- Generate Payslip -->
                <td>
                  <button class="btn btn-primary btn-sm"
                    @click="openPayslip(emp.id)">
                    Generate Payslip
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Payslip Modal -->
      <div v-if="payslipModal" class="modal-mask">
        <div class="modal-container">

          <h4>Payslip — {{ currentSlip.name }}</h4>
          <p class="text-muted">{{ currentSlip.period }}</p>

          <table class="table table-sm mt-3">
            <tr><th>Hours Worked:</th><td>{{ currentSlip.hoursWorked }}</td></tr>
            <tr><th>Leave Deductions:</th><td>{{ currentSlip.leaveDeductions }}</td></tr>
            <tr><th>Gross Pay:</th><td>R {{ currentSlip.gross.toLocaleString() }}</td></tr>
            <tr><th>Tax (18%):</th><td>R {{ currentSlip.tax.toLocaleString() }}</td></tr>
            <tr><th>Pension (7%):</th><td>R {{ currentSlip.pension.toLocaleString() }}</td></tr>
            <tr><th><strong>NET PAY:</strong></th>
                <td><strong>R {{ currentSlip.net.toLocaleString() }}</strong></td>
            </tr>
          </table>

          <button class="btn btn-success mt-3 me-2"
            @click="hr.downloadPayslip(currentSlip)">
            Download Payslip
          </button>

          <button class="btn btn-secondary mt-3"
            @click="payslipModal = false">
            Close
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import NavBar from "../components/NavBar.vue"
import { ref, reactive } from "vue"
import { useHrStore } from "../store/hrStore"

const hr = useHrStore()

// real-time payroll values
const realtime = reactive({})

// modal states
const payslipModal = ref(false)
const currentSlip = ref({})

// read payroll row from store
function getPayroll(empId) {
  return hr.payroll.find(p => p.employeeId === empId)
}

// recalculates real-time salary on typing
function updateRealtime(empId) {
  const calc = hr.calculatePayroll(empId)
  realtime[empId] = calc
}

// open payslip modal
function openPayslip(empId) {
  const period = new Date().toISOString().split("T")[0]

  const slip = hr.generatePayslip(empId, period)
  if (!slip) return alert("No payroll data found")

  currentSlip.value = slip
  payslipModal.value = true
}

// load initial realtime values
hr.employees.forEach(e => {
  updateRealtime(e.id)
})
</script>

<style>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-container {
  background: white;
  width: 450px;
  padding: 20px;
  border-radius: 12px;
}
</style>

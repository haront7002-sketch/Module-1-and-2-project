<template>
  <div class="modal fade" id="payslipModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content payslip-print">
        <div class="modal-header">
          <h5 class="modal-title">Payslip — {{ payslip.name }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <strong>Employee:</strong> {{ payslip.name }}<br/>
              <strong>Period:</strong> {{ payslip.period }}<br/>
              <strong>Hours worked:</strong> {{ payslip.hoursWorked }}<br/>
            </div>
            <div class="col-md-6 text-end">
              <strong>Gross:</strong> R {{ payslip.gross.toLocaleString() }}<br/>
              <strong>Leave ded:</strong> R {{ payslip.leaveDeductionAmount.toLocaleString() }}<br/>
              <strong>Tax:</strong> R {{ payslip.tax.toLocaleString() }}<br/>
              <strong>Pension:</strong> R {{ payslip.pension.toLocaleString() }}<br/>
              <strong>Allowance:</strong> R {{ payslip.allowance.toLocaleString() }}<br/>
              <h5 class="mt-2">Net: R {{ payslip.net.toLocaleString() }}</h5>
            </div>
          </div>

          <hr/>
          <div class="small text-muted">This is a demo, generated from local data.</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="print">Print Payslip</button>
          <button class="btn btn-outline-secondary" @click="download">Download</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHrStore } from '../store/hrStore'
const props = defineProps({ initialPayslip: Object })
const hr = useHrStore()
const payslip = ref(props.initialPayslip || {})

function print() {
  // small delay for modal to fully render
  setTimeout(()=> window.print(), 150)
}
function download() {
  hr.downloadPayslipFile(payslip.value)
}
</script>

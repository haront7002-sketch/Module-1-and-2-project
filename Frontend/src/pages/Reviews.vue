<template>
  <div>
    <NavBar />

    <div class="container">
      <h2 class="mb-3">Performance Reviews</h2>

      <div class="card p-3 mb-4">
        <h5>Add Review</h5>

        <div class="row g-2">
          <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="empId">
              <option disabled value="">Select Employee</option>
              <option v-for="e in hr.employees" :value="e.id">{{ e.firstName }} {{ e.lastName }}</option>
            </select>
          </div>

          <div class="col-md-8">
            <input class="form-control form-control-sm" v-model="comment" placeholder="Review comment" />
          </div>
        </div>

        <button class="btn btn-primary btn-sm mt-3" @click="add">Add Review</button>
      </div>

      <div class="card p-3">
        <h5>Recent Reviews</h5>
        <ul class="list-group">
          <li v-for="r in hr.reviews" :key="r.id" class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">{{ getName(r.employeeId) }}</div>
              <span class="text-muted small">{{ formatDate(r.date) }}</span>
              <div class="mt-1">{{ r.comment }}</div>
            </div>
            <button 
              class="btn btn-outline-danger btn-sm" 
              @click="deleteReview(r.id)"
              title="Delete Review"
            >
              <i class="bi bi-trash"></i>
            </button>
          </li>
          
          <li v-if="hr.reviews.length === 0" class="list-group-item text-muted text-center">
            No reviews yet. Add your first review above.
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import { useHrStore } from '../store/hrStore'

const hr = useHrStore()
const empId = ref("")
const comment = ref("")

function add() {
  if (!empId.value || !comment.value) {
    alert("Please select an employee and enter a comment")
    return
  }
  
  hr.addReview({
    employeeId: empId.value,
    comment: comment.value
  })
  empId.value = ""
  comment.value = ""
}

function getName(id) {
  const employee = hr.employees.find(e => e.id === id)
  return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown Employee"
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function deleteReview(reviewId) {
  if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
    hr.deleteReview(reviewId)
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
}

.list-group-item {
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}
</style>
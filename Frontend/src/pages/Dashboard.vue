<template>
  <div>
    <NavBar />

    <div class="container py-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="page-title">Dashboard</h2>
        <div>
          <small class="text-muted">Welcome back — HR</small>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-3" v-for="c in cards" :key="c.title">
          <div class="card card-dashboard p-3 h-100">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1">{{ c.title }}</h6>
                <p class="mb-2 small text-muted">{{ c.subtitle }}</p>
                <h3 class="mb-0">{{ c.value }}</h3>
              </div>
              <div class="icon-wrap">
                <i :class="c.icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mt-3">
        <div class="col-lg-8">
          <div class="card p-3 card-dashboard">
            <h6>HR Calendar & Tasks</h6>
            <div class="calendar-container">
              <!-- Calendar header -->
              <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
                <button class="btn btn-sm btn-outline-light" @click="prevMonth">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h5 class="mb-0">{{ currentMonth }}</h5>
                <button class="btn btn-sm btn-outline-light" @click="nextMonth">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
              
              <!-- Calendar days -->
              <div class="calendar-grid">
                <div class="calendar-weekdays">
                  <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
                       :key="day" class="calendar-weekday">
                    {{ day }}
                  </div>
                </div>
                <div class="calendar-days">
                  <div v-for="day in calendarDays" 
                       :key="day.date"
                       :class="['calendar-day', { 
                         'other-month': !day.isCurrentMonth,
                         'today': day.isToday,
                         'has-tasks': day.tasks.length > 0
                       }]"
                       @click="selectDay(day)">
                    <div class="day-number">{{ day.number }}</div>
                    <div v-if="day.tasks.length > 0" class="day-tasks">
                      <div class="task-indicator" 
                           :class="{'pending': task.status === 'pending', 'urgent': task.priority === 'high'}"
                           v-for="task in day.tasks" 
                           :key="task.id">
                        {{ task.title.substring(0, 15) }}{{ task.title.length > 15 ? '...' : '' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Selected day tasks -->
              <div v-if="selectedDay" class="selected-day-tasks mt-4">
                <h6>Tasks for {{ selectedDay.date }}</h6>
                <div class="task-list">
                  <div v-for="task in selectedDay.tasks" :key="task.id" 
                       class="task-item d-flex justify-content-between align-items-center p-2 mb-2 rounded"
                       :class="{'pending-task': task.status === 'pending', 'completed-task': task.status === 'completed'}">
                    <div>
                      <strong>{{ task.title }}</strong>
                      <div class="small">{{ task.description }}</div>
                      <span class="badge" :class="{
                        'bg-warning': task.priority === 'high',
                        'bg-info': task.priority === 'medium',
                        'bg-secondary': task.priority === 'low'
                      }">{{ task.priority }}</span>
                    </div>
                    <div>
                      <button class="btn btn-sm btn-success me-1" 
                              @click="markTaskComplete(task.id)"
                              v-if="task.status === 'pending'">
                        <i class="fa-solid fa-check"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" 
                              @click="deleteTask(task.id)">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div v-if="selectedDay.tasks.length === 0" class="text-muted text-center p-3">
                    No tasks scheduled for this day
                  </div>
                </div>
                
                <!-- Add new task form -->
                <div class="add-task-form mt-3">
                  <input v-model="newTask.title" 
                         type="text" 
                         class="form-control mb-2" 
                         placeholder="Task title"
                         @keyup.enter="addTask">
                  <textarea v-model="newTask.description" 
                            class="form-control mb-2" 
                            placeholder="Description"
                            rows="2"></textarea>
                  <div class="row g-2">
                    <div class="col">
                      <select v-model="newTask.priority" class="form-control">
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <div class="col">
                      <button class="btn btn-primary w-100" @click="addTask">
                        Add Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card p-3 card-dashboard">
            <h6>Pending Leave Requests</h6>
            <div class="pending-leaves mt-2">
              <div v-for="request in pendingLeaves" :key="request.id" 
                   class="leave-item p-2 mb-2 rounded">
                <div class="d-flex justify-content-between">
                  <strong>{{ request.employeeName }}</strong>
                  <span class="badge bg-warning">{{ request.type }}</span>
                </div>
                <div class="small">{{ request.startDate }} to {{ request.endDate }}</div>
                <div class="small text-muted">{{ request.reason }}</div>
                <div class="mt-2">
                  <button class="btn btn-sm btn-success me-1" 
                          @click="approveLeave(request.id)">
                    Approve
                  </button>
                  <button class="btn btn-sm btn-danger" 
                          @click="rejectLeave(request.id)">
                    Reject
                  </button>
                </div>
              </div>
              <div v-if="pendingLeaves.length === 0" class="text-center text-muted p-3">
                No pending leave requests
              </div>
            </div>
            
            <div class="mt-4">
              <h6>Quick Stats</h6>
              <div class="stats-grid">
                <div class="stat-item">
                  <small class="text-muted">Pending Reviews</small>
                  <div class="h4">{{ pendingReviews }}</div>
                </div>
                <div class="stat-item">
                  <small class="text-muted">This Month Payroll</small>
                  <div class="h4">R {{ totalPayroll }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { onMounted, ref, computed } from 'vue'
import { useHrStore } from '../store/hrStore'

const hr = useHrStore()

const cards = [
  { title: 'Employees', subtitle: 'Active staff', value: hr.employees.length, icon: 'fa-solid fa-users' },
  { title: 'Payslips', subtitle: 'Saved payslips', value: hr.payslips.length, icon: 'fa-solid fa-file-invoice-dollar' },
  { title: 'Leave req', subtitle: 'Pending requests', value: hr.timeoff.filter(t=>t.status==='Pending').length, icon: 'fa-solid fa-calendar-check' },
  { title: 'Departments', subtitle: 'Unique departments', value: new Set(hr.employees.map(e=>e.department)).size, icon: 'fa-solid fa-building' }
]

// Calendar functionality
const currentDate = ref(new Date())
const selectedDay = ref(null)
const tasks = ref(loadTasks())
const newTask = ref({
  title: '',
  description: '',
  priority: 'medium'
})

function loadTasks() {
  const stored = localStorage.getItem('hr_calendar_tasks')
  return stored ? JSON.parse(stored) : [
    { id: 1, date: getTodayString(), title: 'Monthly Payroll Processing', description: 'Calculate and process payroll for all employees', priority: 'high', status: 'pending' },
    { id: 2, date: getTodayString(), title: 'Team Meeting', description: 'Weekly HR team sync', priority: 'medium', status: 'pending' },
    { id: 3, date: getDateString(addDays(new Date(), 2)), title: 'Performance Reviews', description: 'Schedule quarterly reviews', priority: 'high', status: 'pending' },
    { id: 4, date: getDateString(addDays(new Date(), 5)), title: 'New Hire Onboarding', description: 'Orientation for new hires', priority: 'medium', status: 'pending' }
  ]
}

function saveTasks() {
  localStorage.setItem('hr_calendar_tasks', JSON.stringify(tasks.value))
}

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

function getDateString(date) {
  return date.toISOString().split('T')[0]
}

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDay = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  const days = []
  const today = new Date()
  const todayString = getTodayString()
  
  // Previous month days
  for (let i = 0; i < startDay; i++) {
    const date = new Date(year, month, -i)
    days.unshift({
      date: getDateString(date),
      number: date.getDate(),
      isCurrentMonth: false,
      isToday: false,
      tasks: getTasksForDate(getDateString(date))
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dateString = getDateString(date)
    days.push({
      date: dateString,
      number: i,
      isCurrentMonth: true,
      isToday: dateString === todayString,
      tasks: getTasksForDate(dateString)
    })
  }
  
  // Next month days
  const totalCells = 42 // 6 weeks
  const remaining = totalCells - days.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date: getDateString(date),
      number: i,
      isCurrentMonth: false,
      isToday: false,
      tasks: getTasksForDate(getDateString(date))
    })
  }
  
  return days
})

function getTasksForDate(dateString) {
  return tasks.value.filter(task => task.date === dateString)
}

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function selectDay(day) {
  selectedDay.value = day
  newTask.value = {
    title: '',
    description: '',
    priority: 'medium'
  }
}

function addTask() {
  if (!newTask.value.title.trim() || !selectedDay.value) return
  
  const task = {
    id: Date.now(),
    date: selectedDay.value.date,
    title: newTask.value.title,
    description: newTask.value.description,
    priority: newTask.value.priority,
    status: 'pending'
  }
  
  tasks.value.push(task)
  saveTasks()
  
  // Update the selected day's tasks
  selectedDay.value.tasks = getTasksForDate(selectedDay.value.date)
  
  // Reset form
  newTask.value = {
    title: '',
    description: '',
    priority: 'medium'
  }
}

function markTaskComplete(taskId) {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = 'completed'
    saveTasks()
    if (selectedDay.value) {
      selectedDay.value.tasks = getTasksForDate(selectedDay.value.date)
    }
  }
}

function deleteTask(taskId) {
  tasks.value = tasks.value.filter(t => t.id !== taskId)
  saveTasks()
  if (selectedDay.value) {
    selectedDay.value.tasks = getTasksForDate(selectedDay.value.date)
  }
}

// Pending leave requests
const pendingLeaves = computed(() => {
  return hr.timeoff
    .filter(t => t.status === 'Pending')
    .slice(0, 3) // Show only 3 most recent
    .map(leave => ({
      ...leave,
      employeeName: hr.employees.find(e => e.id === leave.employeeId)?.firstName || 'Unknown'
    }))
})

function approveLeave(leaveId) {
  hr.setTimeOffStatus(leaveId, 'Approved')
}

function rejectLeave(leaveId) {
  hr.setTimeOffStatus(leaveId, 'Rejected')
}

// Stats
const pendingReviews = computed(() => {
  return hr.reviews.filter(r => !r.completed).length
})

const totalPayroll = computed(() => {
  return hr.employees.reduce((sum, emp) => sum + emp.salary, 0)
})

onMounted(() => {
  // Select today by default
  const todayString = getTodayString()
  const todayDay = calendarDays.value.find(day => day.date === todayString)
  if (todayDay) {
    selectDay(todayDay)
  }
})
</script>

<style scoped>
.page-title { 
  background: linear-gradient(90deg,#031227,#0aa5ff); 
  background-clip:text; 
  color: transparent; 
  font-weight:700;
}
.card-dashboard { 
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); 
  border: none; 
  border-radius:12px; 
  box-shadow: 0 8px 30px rgba(13, 24, 35, 0.06); 
}
.icon-wrap i { 
  font-size:26px; 
  color:#fff; 
  background: linear-gradient(90deg,#031227,#0aa5ff); 
  padding:10px; 
  border-radius:10px; 
}

/* Calendar styles */
.calendar-header {
  background: rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
}

.calendar-grid {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: rgba(139, 92, 246, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.calendar-weekday {
  padding: 10px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 80px;
  padding: 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s;
}

.calendar-day:hover {
  background: rgba(139, 92, 246, 0.1);
}

.calendar-day.other-month {
  opacity: 0.4;
}

.calendar-day.today {
  background: rgba(0, 170, 255, 0.1);
  border: 2px solid #0aa5ff;
}

.calendar-day.has-tasks {
  background: rgba(139, 92, 246, 0.05);
}

.day-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.day-tasks {
  max-height: 60px;
  overflow: hidden;
}

.task-indicator {
  font-size: 0.7rem;
  padding: 2px 4px;
  margin: 2px 0;
  border-radius: 4px;
  background: rgba(139, 92, 246, 0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-indicator.pending {
  background: rgba(255, 193, 7, 0.2);
}

.task-indicator.urgent {
  background: rgba(220, 53, 69, 0.2);
}

/* Task list styles */
.task-item {
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #0aa5ff;
}

.task-item.pending-task {
  border-left-color: #ffc107;
}

.task-item.completed-task {
  opacity: 0.7;
  border-left-color: #198754;
}

/* Leave requests */
.leave-item {
  background: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.stat-item .h4 {
  margin-top: 5px;
  color: #0aa5ff;
}

.add-task-form {
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 8px;
}
</style>
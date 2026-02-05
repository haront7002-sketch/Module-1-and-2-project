// store/hrStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

// -------------------------------
// LOAD JSON FILES FROM src/data/
// -------------------------------
import employeeJSON from '../data/employee_info.json'
import attendanceJSON from '../data/attendance.json'
import payrollJSON from '../data/payroll_data.json'

// -------------------------------
// LOCALSTORAGE HELPERS
// -------------------------------
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
function load(key, fallback) {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : fallback
}

// -------------------------------
// AUTH STORE
// -------------------------------
export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(sessionStorage.getItem("ht_auth") === "true")

  function login(user, pass) {
    if (user === "hradmin" && pass === "Password123") {
      sessionStorage.setItem("ht_auth", "true")
      isAuthenticated.value = true
      return true
    }
    return false
  }

  function logout() {
    sessionStorage.removeItem("ht_auth")
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
})


// -------------------------------
// HR STORE (SINGLE DEFINITION)
// -------------------------------
export const useHrStore = defineStore('hr', () => {

  // EMPLOYEES
  const employees = ref(
    load(
      "ht_employees",
      employeeJSON.employeeInformation.map(emp => ({
        id: emp.employeeId,
        firstName: emp.name.split(" ")[0],
        lastName: emp.name.split(" ").slice(1).join(" "),
        position: emp.position,
        department: emp.department,
        salary: emp.salary,
        email: emp.contact,
        history: emp.employmentHistory
      }))
    )
  )

  // ATTENDANCE + LEAVE REQUESTS
  const attendance = ref(
    load("ht_attendance", attendanceJSON.attendanceAndLeave)
  )

  // PAYROLL (hours worked, deductions)
  const payroll = ref(
    load("ht_payroll", payrollJSON.payrollData)
  )

  // TIME OFF REQUESTS
  const timeoff = ref(
    load("ht_timeoff", [])
  )

  // REVIEWS
  const reviews = ref(
    load("ht_reviews", [])
  )

  // GENERATED PAYSLIPS
  const payslips = ref(
    load("ht_payslips", [])
  )

  // -------------------------------
  // SAVE ALL
  // -------------------------------
  function saveAll() {
    save("ht_employees", employees.value)
    save("ht_attendance", attendance.value)
    save("ht_payroll", payroll.value)
    save("ht_timeoff", timeoff.value)
    save("ht_reviews", reviews.value)
    save("ht_payslips", payslips.value)
  }

  // -------------------------------
  // TIME OFF
  // -------------------------------
  function requestTimeOff(obj) {
    const id = Date.now()
    timeoff.value.push({ id, status: "Pending", ...obj })
    saveAll()
  }

  function setTimeOffStatus(id, status) {
    const item = timeoff.value.find(t => t.id === id)
    if (item) item.status = status
    saveAll()
  }

  // -------------------------------
  // REVIEWS
  // -------------------------------
  function addReview(obj) {
    reviews.value.push({
      id: Date.now(),
      date: new Date().toISOString(),
      ...obj
    })
    saveAll()
  }

  // ADD DELETE REVIEW FUNCTION HERE
  function deleteReview(reviewId) {
    const index = reviews.value.findIndex(review => review.id === reviewId)
    if (index !== -1) {
      reviews.value.splice(index, 1)
      saveAll() // Save to localStorage after deletion
    }
  }

  // -------------------------------
  // ATTENDANCE HELPERS
  // -------------------------------
  function getAttendanceForEmployee(id) {
    return attendance.value.find(a => a.employeeId === id)
  }

  function countPresent(id) {
    const rec = getAttendanceForEmployee(id)
    return rec ? rec.attendance.filter(a => a.status === "Present").length : 0
  }

  function countAbsent(id) {
    const rec = getAttendanceForEmployee(id)
    return rec ? rec.attendance.filter(a => a.status === "Absent").length : 0
  }

  // -------------------------------
  // PAYROLL CALCULATOR (REAL-TIME)
  // -------------------------------
  function calculatePayroll(empId) {
    const emp = employees.value.find(e => e.id === empId)
    const pay = payroll.value.find(p => p.employeeId === empId)

    if (!emp || !pay) return null

    // Base salary from employee JSON
    const baseSalary = emp.salary
    
    // Example calculation:
    const hourlyRate = baseSalary / 160
    const hoursPay = hourlyRate * pay.hoursWorked

    const leaveDeductionAmount = hourlyRate * pay.leaveDeductions
    const gross = hoursPay - leaveDeductionAmount

    // Deductions
    const tax = Math.round(gross * 0.18)
    const pension = Math.round(gross * 0.07)
    const net = Math.round(gross - tax - pension)

    return {
      employeeId: empId,
      name: emp.firstName + " " + emp.lastName,
      hoursWorked: pay.hoursWorked,
      leaveDeductions: pay.leaveDeductions,
      gross,
      tax,
      pension,
      net
    }
  }

  // -------------------------------
  // GENERATE A PAYSLIP (PRINTABLE)
  // -------------------------------
  function generatePayslip(empId, period) {
    const calc = calculatePayroll(empId)
    if (!calc) return null

    const slip = {
      id: Date.now(),
      period,
      ...calc
    }

    payslips.value.push(slip)
    saveAll()
    return slip
  }

  // -------------------------------
  // DOWNLOAD PAYSLIP AS A FILE
  // -------------------------------
  function downloadPayslip(p) {
    const content = `
PAYSLIP — ${p.name}
Period: ${p.period}
================================
Hours Worked: ${p.hoursWorked}
Leave Deductions: ${p.leaveDeductions}
================================
GROSS PAY: R ${p.gross}
TAX (18%): R ${p.tax}
PENSION (7%): R ${p.pension}
================================
NET PAY: R ${p.net}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")

    a.href = url
    a.download = `Payslip_${p.name.replaceAll(" ", "_")}_${p.period}.txt`
    a.click()

    URL.revokeObjectURL(url)
  }

  // -------------------------------
  // RETURN PUBLIC FUNCTIONS
  // -------------------------------
  return {
    employees,
    attendance,
    payroll,
    timeoff,
    reviews,
    payslips,

    saveAll,
    requestTimeOff,
    setTimeOffStatus,
    addReview,
    deleteReview, // Make sure this is exported

    getAttendanceForEmployee,
    countPresent,
    countAbsent,

    calculatePayroll,
    generatePayslip,
    downloadPayslip
  }
})
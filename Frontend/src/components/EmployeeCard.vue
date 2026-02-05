<template>
<div class="card p-3 h-100">
<div class="d-flex align-items-center">
<div class="me-3 avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center">{{ initials }}</div>
<div class="flex-grow-1">
<h6 class="mb-0">{{ employee.firstName }} {{ employee.lastName }}</h6>
<small class="text-muted">{{ employee.position }} • {{ employee.email }}</small>
</div>
<div class="ms-3 text-end">
<div class="small text-muted">R {{ employee.salary.toLocaleString() }}</div>
<button class="btn btn-sm btn-outline-primary mt-2" @click="$emit('edit', employee)">Edit</button>
</div>
</div>
</div>
</template>


<script setup>
const props = defineProps({ employee: Object })
const initials = ((props.employee.firstName?.[0]||'') + (props.employee.lastName?.[0]||'')).toUpperCase()
</script>


<style >
.avatar { width:54px; height:54px; }
</style>
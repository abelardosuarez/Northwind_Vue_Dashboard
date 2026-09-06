<script setup>
defineProps({
  title: String,
  value: [String, Number]
})
</script>

<template>
  <div class="kpi-card">
    <h2>{{ title }}</h2>
    <p>{{ value }}</p>
  </div>
</template>

<style scoped>
.kpi-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.kpi-card h2 {
  font-size: 16px;
  margin-bottom: 10px;
}

.kpi-card p {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}
</style>
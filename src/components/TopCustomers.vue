<script setup>
const props = defineProps({
  customers: Array
})
</script>

<template>
  <section class="top-customers">
    <h2>Top Customers</h2>

    <ul>
      <li v-for="customer in props.customers" :key="customer.CustomerName">
        {{ customer.CustomerName }} —
        ${{ customer.TotalSales.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) }}
      </li>
    </ul>
  </section>
</template>

<style scoped>

.top-customers {
  margin-top: 0;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  box-sizing: border-box;
  height: 100%;
}

.top-customers h2 {
  font-size: 20px;
  margin: 0 0 12px;
}

.top-customers li {
  margin-bottom: 4px;
  font-size: 13px;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import KpiCard from './components/KpiCard.vue'
import TopCustomers from './components/TopCustomers.vue'
import MonthlySalesTrend from './components/MonthlySalesTrend.vue'
import TopProducts from './components/TopProducts.vue'
import TopCategories from './components/TopCategories.vue'

const dashboardData = ref(null)
const topCustomers = ref([])
const monthlySales = ref([])
const topProducts = ref([])
const topCategories = ref([])

const selectedYear = ref('All Years')
async function loadDashboard(year) {
  try {
    const url =
      year === 'All Years'
        ? 'http://localhost:3000/api/dashboard'
        : `http://localhost:3000/api/dashboard?year=${year}`

    const response = await fetch(url)
    const data = await response.json()

    dashboardData.value = data[0]

    const customersResponse = await fetch(
      year === 'All Years'
        ? 'http://localhost:3000/api/top-customers'
        : `http://localhost:3000/api/top-customers?year=${year}`
    )

    const customersData = await customersResponse.json()

    topCustomers.value = customersData

        const monthlySalesResponse = await fetch(
      year === 'All Years'
        ? 'http://localhost:3000/api/monthly-sales'
        : `http://localhost:3000/api/monthly-sales?year=${year}`
    )

    const monthlySalesData = await monthlySalesResponse.json()

    monthlySales.value = monthlySalesData

        const topProductsResponse = await fetch(
      year === 'All Years'
        ? 'http://localhost:3000/api/top-products'
        : `http://localhost:3000/api/top-products?year=${year}`
    )

    const topProductsData = await topProductsResponse.json()

    topProducts.value = topProductsData

    const categoriesResponse = await fetch(
      year === 'All Years'
      ? 'http://localhost:3000/api/top-categories'
      : `http://localhost:3000/api/top-categories?year=${year}`
    )

    const categoriesData = await categoriesResponse.json()

    topCategories.value = categoriesData

    console.log('Dashboard loaded:', dashboardData.value)
  } catch (error) {
    console.error('Dashboard API error:', error)
  }
}

const averageOrderValue = computed(() => {
  if (!dashboardData.value || dashboardData.value.TotalOrders === 0) {
    return 0
  }

  return dashboardData.value.TotalSales / dashboardData.value.TotalOrders
})

loadDashboard(selectedYear.value)
</script>

<template>
  <main class="dashboard">

    <header class="dashboard-header">
      <h1>Northwind Sales Analytics</h1>
      <p>Sales performance dashboard</p>
    </header>

    <div class="year-filter">
      <label for="year">Year:</label>

      <select
        id="year"
        v-model="selectedYear"
        @change="loadDashboard(selectedYear)"
      >
        <option>All Years</option>
        <option>1996</option>
        <option>1997</option>
        <option>1998</option>
      </select>
    </div>

    <p class="selected-period">
      Selected period: {{ selectedYear }}
    </p>

    <section class="kpi-grid">

      <KpiCard
        title="Total Sales"
        :value="
          dashboardData
            ? `$${dashboardData.TotalSales.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`
            : 'Loading...'
        "
      />

      <KpiCard
        title="Total Orders"
        :value="dashboardData ? dashboardData.TotalOrders : 'Loading...'"
      />

      <KpiCard
        title="Customers"
        :value="dashboardData ? dashboardData.Customers : 'Loading...'"
      />

      <KpiCard
        title="Products"
        :value="dashboardData ? dashboardData.Products : 'Loading...'"
      />

      <KpiCard
        title="Average Order Value"
        :value="`$${averageOrderValue.toFixed(2)}`"
      />

    </section>

    <div class="analytics-grid">

      <TopCustomers
        class="customers-panel"
        :customers="topCustomers"
      />

     <MonthlySalesTrend
        class="sales-trend-panel"
        :sales="monthlySales"
      />

     <TopProducts
       class="products-panel"
       :products="topProducts"
     />

     <TopCategories
      class="categories-panel"
      :categories="topCategories"
     />

    </div>

  </main>
</template>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
  background: #f5f7fa;
}

.dashboard-header {
  margin-bottom: 16px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 30px;
}

.dashboard-header p {
  margin: 6px 0 0;
  color: #666;
}

.year-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.year-filter select {
  padding: 7px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
}

.selected-period {
  margin: 0 0 16px;
  color: #666;
  font-size: 12px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-areas:
    "customers trend"
    "products categories";
  gap: 16px;
}

.customers-panel {
  grid-area: customers;
}

.sales-trend-panel {
  grid-area: trend;
}

.products-panel {
  grid-area: products;
}

.categories-panel {
  grid-area: categories;
}

@media (max-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .analytics-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "customers"
      "trend"
      "products"
      "categories";
  }
}

@media (max-width: 700px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .dashboard {
    padding: 16px;
  }
}
</style>

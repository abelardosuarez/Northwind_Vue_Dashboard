<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  categories: Array
})

const chartData = computed(() => {
  return {
    labels: props.categories.map(category => category.CategoryName),

    datasets: [
      {
        label: 'Sales',
        data: props.categories.map(category => category.TotalSales)
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  indexAxis: 'y',

  plugins: {
    legend: {
      display: true
    },

  datalabels: {
    anchor: 'end',
    align: 'right',
    formatter: value => {
      return `$${Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`
    },
    font: {
      size: 10
    }
  },

  tooltip: {
    callbacks: {
      label: context => {
        return `$${context.parsed.x.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
          })}`
        }
      }
    }
  },

  scales: {
    x: {
      beginAtZero: true,

      ticks: {
        callback: value => {
          return `$${Number(value).toLocaleString('en-US')}`
        }
      }
    }
  }
}
</script>

<template>
  <section class="top-categories">
    <h2>Top Categories by Sales</h2>

    <div class="chart-container">
      <Bar
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </section>
</template>

<style scoped>
.top-categories {
  margin-top: 0;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  box-sizing: border-box;
  height: 100%;
}

.top-categories h2 {
  margin: 0 0 10px;
  font-size: 20px;
}

.chart-container {
  position: relative;
  height: 220px;
}
</style>

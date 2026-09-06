<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  sales: Array
})

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const chartData = computed(() => {
  return {

    labels: props.sales.map(item => {
      const month = monthNames[item.SalesMonth - 1]

      if (item.SalesYear) {
        return `${month}-${String(item.SalesYear).slice(-2)}`
      }

      return month
    }),

    datasets: [
      {
          label: 'Sales',
        data: props.sales.map(item => item.TotalSales),
        tension: 0.3
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    datalabels: {
      display: false
    },

    legend: {
      display: true
    },

  tooltip: {
      callbacks: {
        label: context => {
          return `$${context.parsed.y.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        }
      }
    }
  },

  scales: {
    x: {
      ticks: {
        maxRotation: 0,
        minRotation: 0
      }
    },
    y: {
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
  <section class="monthly-sales">
    <h2>Monthly Sales Trend</h2>

    <div class="chart-container">
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </section>
</template>

<style scoped>
.monthly-sales {
  margin-top: 0;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  box-sizing: border-box;
  height: 100%;
}

.monthly-sales h2 {
  margin: 0 0 10px;
  font-size: 20px;
}

.chart-container {
  position: relative;
  height: 220px;
}
</style>

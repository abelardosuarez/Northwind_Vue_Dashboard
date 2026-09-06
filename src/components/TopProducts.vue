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
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)
const props = defineProps({
  products: Array
})

const chartData = computed(() => {
  return {
    labels: props.products.map(product => product.ProductName),

    datasets: [
      {
        label: 'Sales',
        data: props.products.map(product => product.TotalSales)
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  indexAxis: 'y',

  categoryPercentage: 0.8,
  barPercentage: 0.7,

  layout: {
    padding: {
      right: 45
    }
  },

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
  y: {
    ticks: {
      autoSkip: false
    }
  },

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
  <section class="top-products">
    <h2>Top Products by Sales</h2>

    <div class="chart-container">
      <Bar
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </section>
</template>

<style scoped>
.top-products {
  margin-top: 0;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  box-sizing: border-box;
  height: 100%;
}

.top-products h2 {
  margin: 0 0 10px;
  font-size: 20px;
}

.chart-container {
  position: relative;
  height: 220px;
}
</style>

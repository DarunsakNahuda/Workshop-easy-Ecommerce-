<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue"
import { onMounted } from "vue"
import { useAdminDashboardStore } from '@/stores/admin/dashboard'

const dashboardStore = useAdminDashboardStore()

const priceChart = {
  options: {
    chart: {
      id: "vuechart-example",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
    
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ]
}

const category = {
  options: {},
  series: [44, 55, 41, 17, 15]
}

onMounted(async () => {
  await dashboardStore.loadDashboard()
})
</script>

<template>
  <AdminLayout>
    <div class="text-3xl font-bold my-4">Dashboard</div>

    <div class="stats stats-vertical lg:stats-horizontal shadow w-full mb-4">
      <div class="stat">
        <div class="stat-title">Orders</div>
        <div class="stat-value">{{ dashboardStore.stats.order }}</div>
      </div>

      <div class="stat">
        <div class="stat-title">Products</div>
        <div class="stat-value">{{ dashboardStore.stats.product }}</div>
      </div>

      <div class="stat">
        <div class="stat-title">Users</div>
        <div class="stat-value">{{ dashboardStore.stats.user }}</div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row w-full gap-4 overflow-x-auto">
      <div class="flex-1 p-4 w-full min-w-0">
        <apexchart
          class="w-full max-w-full h-[300px]"
          type="bar"
          :options="priceChart.options"
          :series="priceChart.series"
        ></apexchart>
      </div>
      <div class="flex-1 p-4 w-full min-w-0">
        <apexchart 
          class="w-full max-w-full h-[300px]"
          type="donut" 
          :options="category.options" 
          :series="category.series"
        ></apexchart>
      </div>
    </div>
  </AdminLayout>
</template>

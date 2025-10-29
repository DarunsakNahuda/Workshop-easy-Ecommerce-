<script setup>
import { onMounted } from 'vue'
import {RouterLink} from 'vue-router'
import { useAdminOrderStore } from '@/stores/admin/order'
import AdminLayout from '@/layouts/AdminLayout.vue'

import Table from '@/components/Table.vue'

const adminOrderStore= useAdminOrderStore()

onMounted(async () => {
  await adminOrderStore.loadOrder()
})
</script>
<template>
  <AdminLayout>
    <div class="flex flex-col sm:flex-row items-center justify-between my-4 px-4 sm:px-0">
      <div class="text-3xl font-bold mb-2 sm:mb-0">Order</div>
    </div>

    <div class="overflow-x-auto px-4 sm:px-0">
      <Table :headers="['Customer Name', 'Price', 'Status', 'Updated At', '']">
        <tr
          v-for="(order, index) in adminOrderStore.list"
          :key="order.orderId || index"
          class="border-b last:border-0"
        >
          <td class="whitespace-nowrap px-2 py-3">{{ order.name }}</td>
          <td class="whitespace-nowrap px-2 py-3">{{ order.totalPrice }}</td>
          <td class="whitespace-nowrap px-2 py-3">{{ order.status }}</td>
          <td class="whitespace-nowrap px-2 py-3">{{ order.createdAt }}</td>
          <td class="whitespace-nowrap px-2 py-3">
            <RouterLink
              :to="{ name: 'admin-orders-detail', params: { id: order.orderId } }"
              class="btn btn-sm btn-primary whitespace-nowrap"
              >SEE DETAIL</RouterLink
            >
          </td>
        </tr>
      </Table>
    </div>
  </AdminLayout>
</template>

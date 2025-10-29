<script setup>
import {ref,onMounted  } from 'vue'
import {useRoute,useRouter} from 'vue-router'

import { useAdminOrderStore } from '@/stores/admin/order'
import AdminLayout from '@/layouts/AdminLayout.vue'


const orderIndex = ref(-1)
const orderData = ref({
  products:[]
})
const route=useRoute()
const adminOrderStore=useAdminOrderStore()

onMounted(async()=>{
  if(route.params.id){
    orderIndex.value=route.params.id
    const selectedOrder= await adminOrderStore.getOrder(orderIndex.value)
    orderData.value = selectedOrder
  }
})
</script>
<template>
  <AdminLayout>
    <div class="shadow-xl p-6 sm:p-8 mt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-3xl font-bold mb-4">Order Details id: {{ orderIndex }}</div>
      <div class="divider"></div>

      <!-- Order info grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <div class="font-bold mb-1">Order Date</div>
          <div>{{ orderData.createdAt }}</div>
        </div>
        <div>
          <div class="font-bold mb-1">Order Number</div>
          <div>{{ orderData.orderId }}</div>
        </div>
        <div>
          <div class="font-bold mb-1">Payment Method</div>
          <div>{{ orderData.paymentMethod }}</div>
        </div>
        <div>
          <div class="font-bold mb-1">Address</div>
          <div>{{ orderData.address }}</div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Products list -->
      <div class="overflow-x-auto">
        <div
          v-for="product in orderData.products"
          :key="product.productId || product.name"
          class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center py-3 border-b last:border-0"
        >
          <div class="mx-auto sm:mx-0">
            <img
              class="p-2 w-24 h-24 object-cover rounded-md"
              :src="product.imageUrl"
              alt="product image"
            />
          </div>
          <div>
            <b class="block text-lg">{{ product.name }}</b>
            <div class="text-sm text-gray-600">{{ product.description }}</div>
          </div>
          <div class="text-center sm:text-left text-gray-700">
            จำนวน {{ product.quantity }} ชิ้น
          </div>
          <div class="text-center sm:text-left font-semibold text-gray-900">
            {{ product.price }} บาท
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Total price -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 font-semibold text-lg mb-6">
        <div>ราคาสินค้าทั้งหมด</div>
        <div></div>
        <div></div>
        <div class="text-right sm:text-left">{{ orderData.totalPrice }} บาท</div>
      </div>

      <!-- Back button -->
      <div class="flex justify-end">
        <RouterLink
          :to="{ name: 'admin-orders-list' }"
          class="btn btn-ghost px-6 py-2"
          >Back</RouterLink
        >
      </div>
    </div>
  </AdminLayout>
</template>

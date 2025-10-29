<script setup>
import {RouterLink} from 'vue-router'
import { onMounted,ref } from 'vue'
import { useAdminProductStore } from '@/stores/admin/product'
import AdminLayout from '@/layouts/AdminLayout.vue'

import Edit from '@/components/icons/Edit.vue'
import Trash from '@/components/icons/Trash.vue'
import Table from '@/components/Table.vue'
import Pagination from '@/components/Pagination.vue'

const currentPage = ref(1)

const adminProductStore  =  useAdminProductStore()

onMounted(async()=>{
 await adminProductStore.loadProducts()
})
const searchProduct = async()=>{
    await adminProductStore.loadProducts()
}

const changeStatusFilter = async (newStatus) =>{
    adminProductStore.filter.status =newStatus
    await adminProductStore.loadProducts()
}

const changeSortUpdateAt = async (newSort)=>{
    adminProductStore.filter.sort.updatedAt =newSort
    await adminProductStore.loadProducts()
}

const changePage = async(newPage)=>{
    if ( newPage<currentPage.value) {
        await adminProductStore.loadNextProduct('previous')
    } else if (newPage>currentPage.value){
        await adminProductStore.loadNextProduct('next')
    }
    currentPage.value = newPage
}

const removeProduct=async(index)=>{
 await adminProductStore.removeProduct(index)
 await adminProductStore.loadProducts()
}

</script>
<template>
  <AdminLayout>
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between my-6 gap-4 sm:gap-0"
    >
      <div class="text-4xl font-extrabold text-gray-800">Product</div>
      <div>
        <RouterLink
          :to="{ name: 'admin-products-create' }"
          class="btn btn-neutral px-6 py-2 text-base hover:bg-gray-700 transition"
        >
          Add New
        </RouterLink>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-center justify-between"
    >
      <div class="w-full sm:w-1/4">
        <input
          v-model="adminProductStore.filter.search"
          placeholder="Search products..."
          class="input input-bordered w-full px-4 py-2 text-sm sm:text-base"
        />
      </div>

      <div
        class="w-full sm:w-1/4 flex items-center space-x-2 text-sm sm:text-base font-medium"
      >
        <div>Updated At:</div>
        <div class="join">
          <button
            @click="changeSortUpdateAt('asc')"
            class="btn join-item px-4 py-1"
            :class="adminProductStore.filter.sort.updatedAt === 'asc' ? 'btn-active' : ''"
          >
            ASC
          </button>
          <button
            @click="changeSortUpdateAt('desc')"
            class="btn join-item px-4 py-1"
            :class="adminProductStore.filter.sort.updatedAt === 'desc' ? 'btn-active' : ''"
          >
            DESC
          </button>
        </div>
      </div>

      <div
        class="w-full sm:w-1/4 flex items-center space-x-2 text-sm sm:text-base font-medium"
      >
        <div>Status:</div>
        <div class="join">
          <button
            @click="changeStatusFilter('open')"
            class="btn join-item px-4 py-1"
            :class="adminProductStore.filter.status === 'open' ? 'btn-active' : ''"
          >
            Open
          </button>
          <button
            @click="changeStatusFilter('close')"
            class="btn join-item px-4 py-1"
            :class="adminProductStore.filter.status === 'close' ? 'btn-active' : ''"
          >
            Close
          </button>
        </div>
      </div>

      <div class="w-full sm:w-auto">
        <button
          @click="searchProduct()"
          class="btn px-6 py-2 text-base hover:bg-gray-700 transition w-full sm:w-auto"
        >
          Search
        </button>
      </div>
    </div>

    <!-- Table scroll wrapper -->
    <div
      class="overflow-x-auto shadow-lg rounded-lg border border-gray-200"
      style="min-width: 100%;"
    >
      <Table
        :headers="['Name', 'Image', 'Price', 'Quantity', 'Status', 'Updated At', '']"
      >
        <tr
          v-for="(product, index) in adminProductStore.list"
          :key="product.productId"
          class="hover:bg-gray-50 transition"
        >
          <td class="py-3 px-4 whitespace-nowrap font-semibold text-gray-800">
            {{ product.name }}
          </td>
          <td class="py-3 px-4">
            <img
              class="w-12 h-12 object-cover rounded-md shadow-sm"
              :src="product.imageUrl"
              alt="product image"
            />
          </td>
          <td class="py-3 px-4 text-gray-700">{{ product.price }}</td>
          <td class="py-3 px-4 text-gray-700">
            {{ product.remainQuantity }} / {{ product.quantity }}
          </td>
          <td class="py-3 px-4">
            <div
              class="badge px-3 py-1 text-sm"
              :class="product.status === 'open' ? 'badge-success' : 'badge-error'"
            >
              {{ product.status }}
            </div>
          </td>
          <td class="py-3 px-4 text-gray-600 text-sm">{{ product.updatedAt }}</td>
          <td class="py-3 px-4">
            <div class="flex gap-2">
              <RouterLink
                :to="{ name: 'admin-products-update', params: { id: product.productId } }"
                class="btn btn-ghost p-1 hover:bg-gray-200 transition rounded"
                title="Edit"
              >
                <edit />
              </RouterLink>
              <div
                @click="removeProduct(product.productId)"
                class="btn btn-ghost p-1 hover:bg-red-100 transition rounded cursor-pointer"
                title="Delete"
              >
                <trash />
              </div>
            </div>
          </td>
        </tr>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="mt-6">
      <Pagination
        :activePage="currentPage"
        :maxPage="adminProductStore.totalPage"
        :changePage="changePage"
      />
    </div>
  </AdminLayout>
</template>



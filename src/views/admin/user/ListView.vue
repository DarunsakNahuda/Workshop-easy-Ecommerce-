<script setup>
import { onMounted } from 'vue'
import {RouterLink} from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAdminUserStore } from '@/stores/admin/user'

import Table from '@/components/Table.vue'

const adminUserStore = useAdminUserStore()

onMounted(async()=>{
  await adminUserStore.loadUser()
})

const changeStatus = async(index)=>{
  let selectedUser = adminUserStore.list[index]
  selectedUser.status = selectedUser.status === 'active'?'inactive' :'active'
   await adminUserStore.updateUser(selectedUser.uid,selectedUser)
}

</script>
<template>
  <AdminLayout>
    <div class="text-3xl font-bold mb-4 px-4 sm:px-0">User</div>
    <div class="overflow-x-auto px-4 sm:px-0">
      <Table :headers="['Name', 'Role', 'Status', 'Update At', '']">
        <tr
          v-for="(user, index) in adminUserStore.list"
          :key="user.uid || index"
          class="border-b last:border-0"
        >
          <td class="whitespace-nowrap px-2 py-3">{{ user.fullname }}</td>
          <td class="whitespace-nowrap px-2 py-3">{{ user.role }}</td>
          <td class="whitespace-nowrap px-2 py-3">{{ user.status }}</td>
          <td class="whitespace-nowrap px-2 py-3">{{ user.updatedAt }}</td>
          <td class="whitespace-nowrap px-2 py-3">
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <RouterLink
                :to="{ name: 'admin-users-update', params: { id: user.uid } }"
                class="btn btn-sm whitespace-nowrap"
                >Edit</RouterLink
              >
              <button
                class="btn btn-sm whitespace-nowrap"
                @click="changeStatus(index)"
              >
                {{ user.status === 'active' ? 'Disable' : 'Enable' }}
              </button>
            </div>
          </td>
        </tr>
      </Table>
    </div>
  </AdminLayout>
</template>


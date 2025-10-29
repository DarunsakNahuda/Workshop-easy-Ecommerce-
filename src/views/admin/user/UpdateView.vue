<script setup>
import { ref,reactive,onMounted } from 'vue'
import {useRouter,useRoute,RouterLink} from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAdminUserStore } from '@/stores/admin/user'
import { useEventStore } from '@/stores/event'

const formData = [
  { 
    name: 'Name',
    field:'fullname',
    type:'text'
  },
  {
    name: 'Role',
    field:'role',
    type:'select',
    dropdownList:['admin','moderator','user']
  },
  {
    name: 'Status',
    field:'status',
    type:'select',
    dropdownList:['active','inactive']
  },
]
const eventStore = useEventStore()
const adminUserStore = useAdminUserStore()
const router = useRouter()
const route = useRoute()

const userIndex=ref(-1)

const userData =reactive({
  fullname:'',
  role:'',
  status:''
})

const updateUser= async()=>{
  await adminUserStore.updateUser( userIndex.value,userData)
  eventStore.popupMessage('info','Update user successful')
  router.push({name:'admin-users-list'})
}

onMounted(async()=>{
  if(route.params.id){
    userIndex.value=route.params.id
    const selectedUser = await adminUserStore.getUser(userIndex.value)
 
    userData.fullname=selectedUser.fullname
    userData.role=selectedUser.role
    userData.status=selectedUser.status
  }
})



</script>
<template>
    <AdminLayout>
      <div class=" shadow-xl p-8 mt-4">
        <div class="text-1xl font-bold">Update User</div>
        <div class=" divider"></div>
        <div class=" grid grid-cols-1 gap-2">
        <div v-for="form in formData" class="form-control w-full">
          <label class="label">
            <span class="label-text">{{form.name}}</span>
          </label>
          <input 
          v-if="form.type === 'text'"
          v-model="userData[form.field]"
          type="text" 
          class="input input-bordered w-full"
          />
          <select 
          v-if="form.type === 'select'"
          v-model="userData[form.field]"
          type="text" 
          class="input input-bordered w-full"
          >
          <option v-for="item in form.dropdownList">
            {{ item }}
          </option>
          </select>
        </div>
      </div>
        <div class=" flex mt-4 justify-end">
      <RouterLink :to="{name:'admin-users-list'}" class="btn btn-ghost">Back</RouterLink>
      <button class="btn btn-neutral" @click="updateUser()">Update</button>
    </div>
      </div>
    </AdminLayout>
</template>
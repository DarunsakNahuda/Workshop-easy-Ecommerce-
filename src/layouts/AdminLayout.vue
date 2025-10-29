<script setup>
import { ref,onMounted } from 'vue'
import { RouterLink, useRoute,useRouter} from 'vue-router'
import { useAccountStore } from '@/stores/account';

const menus =[
  {
    name :'Dashboard',
    routeName:'admin-dashboard'
  },
  {
    name :'User',
    routeName:'admin-users-list'
  },
  {
  name :'Product',
    routeName:'admin-products-list'
  },
  {
  name :'Order',
    routeName:'admin-orders-list'
  },

]

const route = useRoute()
const router= useRouter()
const accountStore=useAccountStore()
const activeMenu  = ref('')

onMounted(()=>{
  activeMenu.value =route.name
})

const logout =async()=>{
  try {
    await accountStore.logout()
    router.push({name:'login'})
  } catch (error) {
    console.log('error',error)
  }
}
</script>
<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    
    <!-- Page content -->
    <div class="drawer-content flex flex-col mx-4">
      <!-- Mobile menu button -->
      <div class="lg:hidden p-2">
        <label for="my-drawer-2" class="btn btn-primary btn-sm">
          ☰ Menu
        </label>
      </div>
      <slot></slot>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 text-base-content min-h-full w-60 p-4">
        <li class="text-3xl font-bold">
          <a>Admin</a>
        </li>
        <li v-for="menu in menus" :key="menu.routeName">
          <RouterLink
            :to="{ name: menu.routeName }"
            :class="menu.routeName === activeMenu ? 'active' : ''"
          >
            {{ menu.name }}
          </RouterLink>
        </li>
        <li>
          <a @click="logout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</template>


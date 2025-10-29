<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

import { useCartStore } from '@/stores/user/cart'
import { useAccountStore } from '@/stores/account'
import { useEventStore } from '@/stores/event'

const cartStore = useCartStore()
const accountStore = useAccountStore()
const eventStore = useEventStore()

const router = useRouter()

const searchText = ref('')

onMounted(() => {
  eventStore.loadBanner()
})

const login = async () => {
  try {
    await accountStore.signInWithGoogle()
    window.location.reload()
  } catch (error) {
    console.log('error', error)
  }
}
const logout = async () => {
  try {
    await accountStore.logout()
    window.location.reload()
  } catch (error) {
    console.log('error', error)
  }
}
const handleSearch = (event) => {
  if (event.key === 'Enter') {
    router.push({
      name: 'Search',
      query: {
        q: searchText.value
      }
    })
  }
}
</script>

<template>
  <div class="container mx-auto px-4 max-w-screen-xl">
<div class="navbar bg-base-100 flex flex-wrap items-center justify-between gap-y-2">
  <div class="flex-1 min-w-[180px]">
    <RouterLink :to="{ name: 'Home' }" class="btn btn-ghost text-lg sm:text-xl whitespace-nowrap">
      Chunchun-ShopTest
    </RouterLink>
  </div>

  <div class="flex-none flex flex-row items-center gap-2 w-full sm:w-auto">
    <!-- Search Input -->
    <div class="form-control flex-1 min-w-0">
      <input
        type="text"
        placeholder="Search"
        class="input input-bordered w-full sm:w-40"
        v-model="searchText"
        @keyup="handleSearch"
      />
    </div>

    <!-- Cart -->
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <div class="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="badge badge-sm indicator-item">{{ cartStore.summaryQuantity }}</span>
        </div>
      </div>
      <div tabindex="0"
           class="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
        <div class="card-body">
          <span class="text-sm font-bold">{{ cartStore.summaryQuantity }} Items</span>
          <span class="text-info text-sm">Subtotal: {{ cartStore.summaryPrice }}</span>
          <div class="card-actions">
            <RouterLink :to="{ name: 'Cart' }" class="btn btn-primary btn-block btn-sm">
              View cart
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Login / Avatar -->
    <button @click="login" v-if="!accountStore.isLoggedIn" class="btn btn-ghost btn-sm">
      Login
    </button>
    <div v-else class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img :src="accountStore.profile.imageUrl || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'" />
        </div>
      </div>
      <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow">
        <li>
          <RouterLink :to="{ name: 'Profile' }" class="justify-between">
            Profile
          </RouterLink>
        </li>
        <li><a @click="logout">Logout</a></li>
      </ul>
    </div>
  </div>
</div>


    <!-- Banner -->
    <div v-if="eventStore.banner.display" class="mt-2">
      <a :href="eventStore.banner.link" target="_blank">
        <img class="w-full h-auto rounded-lg" :src="eventStore.banner.imageUrl" />
      </a>
    </div>

    <!-- Main Content -->
    <slot></slot>

    <!-- Footer -->
    <footer class="footer bg-neutral text-neutral-content p-6 sm:p-10 flex flex-col sm:flex-row justify-between text-sm">
   <aside class="flex items-center gap-4 justify-center sm:justify-start mb-4 sm:mb-0">
  <svg width="40" height="40" viewBox="0 0 24 24"
       xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
       clip-rule="evenodd" class="fill-current">
    <path
      d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z">
    </path>
  </svg>
  <p class="text-center sm:text-left text-lg mb-2">
    Contact.<br />
    darunsaknahuda@gmail.com
  </p>
</aside>

      <nav>
        <h6 class="footer-title mb-2">Social</h6>
        <div class="grid grid-flow-col gap-4">
          <a href="https://twitter.com" target="_blank" class="link link-hover">Twitter</a>
          <a href="https://facebook.com" target="_blank" class="link link-hover">Facebook</a>
          <a href="https://instagram.com" target="_blank" class="link link-hover">Instagram</a>
          <a href="https://github.com" target="_blank" class="link link-hover">GitHub</a>
        </div>
      </nav>
    </footer>
  </div>
</template>

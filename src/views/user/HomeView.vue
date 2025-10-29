<script setup>
import { useRouter } from 'vue-router'
import UserLayout from'@/layouts/UserLayout.vue'
import Product from'@/components/Product.vue'

import{useProductStore} from '@/stores/user/product'
import{useCartStore} from '@/stores/user/cart'

const router = useRouter() 
const productStore = useProductStore()
const cartStore = useCartStore()

const addTocart = (product)=>{
 cartStore.addTocart(product)
 router.push({name:'Cart'})
}


</script>

<template>
    <UserLayout>
      <div class="hero bg-base-200 min-h-96">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-2xl font-bold"> Welcome to Chunchun-ShopTest</h1>
          <p class="py-6">
            Discover our unique  collection of adorable art toys perfect for collectors, decorators, or anyone who loves a touch of charm in their space.
          </p>
          <RouterLink :to="{ name: 'Cart' }"  class="btn btn-primary" >Go To Shop</RouterLink>
        </div>
      </div>
    </div>

      <!-- Product sheif-->
      <Product
      :products= "productStore.list"
      :addTocart="addTocart"
      ></Product>
    </UserLayout>
</template>

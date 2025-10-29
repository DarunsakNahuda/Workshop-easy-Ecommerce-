<script setup>
import {useRoute,useRouter } from 'vue-router'
import { ref, watch, computed } from 'vue'

import UserLayout from'@/layouts/UserLayout.vue'
import Product from'@/components/Product.vue'

import{useProductStore} from '@/stores/user/product'
import{useCartStore} from '@/stores/user/cart'

const productStore = useProductStore()

const router = useRouter() 
const route = useRoute()
const searchText = ref('')
const cartStore = useCartStore()

const addTocart = (product)=>{
 cartStore.addTocart(product)
 router.push({name:'Cart'})
}


watch(()=> route.query.q,(newSearchText)=>{
    searchText.value=newSearchText
},{immediate: true})


const filterProducts= computed(()=>{
    return productStore.filterProducts(searchText.value)
})
</script>
<template>
    <UserLayout>
        <div class=" text-2xl m-4">Search:{{searchText}}</div>
       <product
        :products="filterProducts"
        :addTocart="addTocart">
        
       </product>
    </UserLayout>
</template>

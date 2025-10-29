<script setup>
import { RouterLink } from 'vue-router'
import UserLayout from'@/layouts/UserLayout.vue'
import Close from'@/components/icons/Close.vue'

import {useCartStore} from '@/stores/user/cart'

const cartStore = useCartStore()

const ChangeQuantity=(event,index)=>{
    const newquantity = parseInt(event.target.value)
    cartStore.updateQuantity(index,newquantity)
}
</script>
<template>
    <UserLayout>
       <h1 class="text-3xl font-bold m-4 text-center sm:text-left">Shopping Cart</h1>
       <div class="flex flex-col lg:flex-row"> <!-- responsive -->
            <div class="w-full lg:w-2/3 text-3xl p-4">
                <div v-if="cartStore.items.length===0">
                    Cart is empty
                </div>
                <div v-else v-for="(items,index) in cartStore.items" class="flex flex-col sm:flex-row mb-6 border p-2 rounded">
                    <div class="flex-shrink-0">
                        <img class="w-24 h-24 object-cover rounded mx-auto sm:mx-0" :src="items.imageUrl">
                    </div>
                    <div class="flex-1 mt-4 sm:mt-0 sm:ml-4">
                        <div class="flex flex-col justify-between h-full">
                            <div>
                              <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <div><b>{{ items.name }}</b></div>
                                    <div><b>{{ items.about }}</b></div>
                                    <div><b>{{ items.price }}</b></div> 
                                </div>
                                <div>
                                    <select v-model="items.quantity" class="w-full sm:w-1/2 p-2 sm:p-4 border" @change="ChangeQuantity($event,index)">
                                        <option v-for="quantity in [1,2,3,4,5]">
                                            {{quantity }}
                                        </option>
                                    </select>
                                </div>
                                <div @click="cartStore.removeItemInCart(index)" class="absolute top-0 right-0 cursor-pointer">
                                    <Close></Close>
                                </div>
                             </div>
                            </div>
                            <div class="mt-2 sm:mt-0"><b>In Stock</b></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-1/3 text-xl p-4 bg-base-200">
               <div class="text-xl font-bold text-center sm:text-left">Order Summary</div>
               <div class="my-4 divide-y divide-black">
                   <div class="flex justify-between py-2">
                        <div>ราคาสินค้าทั้งหมด</div>
                        <div>{{cartStore.summaryPrice}}</div>
                   </div>
                   <div class="flex justify-between py-2">
                        <div>ค่าส่ง</div>
                        <div>0</div>
                   </div>
                   <div class="flex justify-between py-2">
                        <div>ราคารวมทั้งหมด</div>
                        <div>{{cartStore.summaryPrice}}</div>
                   </div>
                   <div>
                        <RouterLink :to="{name:'Checkout'}" class="btn btn-neutral w-full mt-4">ชำระเงิน</RouterLink>
                   </div>
               </div>
            </div>
       </div>
    </UserLayout>
</template>

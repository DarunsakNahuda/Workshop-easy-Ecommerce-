<script setup>
import{reactive, onMounted} from 'vue'
import { RouterLink,useRouter } from 'vue-router'
import UserLayout from'@/layouts/UserLayout.vue'
import {useCartStore} from '@/stores/user/cart'





const router = useRouter()
const cartStore = useCartStore()

const FormData =[
    {
        name:'Email address',
        field:'email'
    },
    {
        name:'Name',
        field:'name'
    },
    {
        name:'Address',
        field:'address'
    },
    {
        name:'Note',
        field:'note'
    },
]

const userFormData= reactive({
    email:'',
    name:'',
    address:'',
    note:''
})

const payment=async()=>{
   
   const responseData =  await cartStore.placeorder(userFormData)
    location.href = responseData.redirectUrl
}


</script>
<template>
    <UserLayout>
        <h1 class="text-3xl font-bold m-4">Check Out</h1>
        <div class=" flex">
            <section class=" flex-auto w-64 text-3xl p-4">
                <div v-for="form in FormData" class="form-control w-full  ">
                    <label class="label">
                        <span class="label-text">{{ form.name }}</span>
                    </label>
                    <input v-model="userFormData[form.field]" type="text" placeholder="Type here" class="input input-bordered w-full " />
                </div>
                <button @click="payment" class="btn btn-neutral w-full mt-4">ชำระเงิน</button>
            </section>
            
            <section class=" flex-auto w-32 text-3xl p-4 bg-base-200">
                <div v-for="item in cartStore.items" class="flex bg-slate-100 m-8 py-4">
                    <div class="flex-1">
                        <img :src="item.imageUrl" class="p-8 w-full">
                    </div>
                    <div class="flex-1">
                        <div class=" flex flex-col justify-between h-full">
                        <div>
                            <div><b>{{ item.name }}</b></div>
                            <div><b>จำนวนสินค้า{{ item.quantity}}</b></div>
                            <div><b>{{ item.price }}</b></div> 
                        </div>
                        <RouterLink :to="{name : 'Cart'}">Edit</RouterLink>
                        </div>
                    </div>
                </div>
                <div class=" divider"></div>
                <div class="p-4">
                    <div><b>Order Summary</b></div>
                    <div class="flex justify-between p-4">
                        <div>ราคาสินค้าทั้งหมด</div> 
                        <div>{{cartStore.summaryPrice}}</div> 
                    </div>
                    <div class="flex justify-between p-4">
                        <div>ค่าส่ง</div> 
                        <div>0</div> 
                    </div>
                </div>
                <div class=" divider"></div>
                <div>
                    <div><b>Order Summary</b></div>
                    <div class="flex justify-between p-4 mb-4">
                        <div>ราคารวมทั้งหมด</div> 
                        <div>{{cartStore.summaryPrice}}</div> 
                    </div>
                </div>
            </section>
        </div>
       
    </UserLayout>
</template>

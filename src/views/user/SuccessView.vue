<script setup>
import { ref,onMounted} from 'vue'
import {useRoute}  from 'vue-router'
import UserLayout from'@/layouts/UserLayout.vue'
import {useCartStore} from '@/stores/user/cart'

const route = useRoute()
const cartStore = useCartStore()
const orderData = ref({})


onMounted(async () => {
    const orderId = route.query.order_id
    if (orderId) {
        try {
            orderData.value = await cartStore.loadCheckout(orderId)
            
            
        } catch (error) {
            alert('order unsuccessful !!!')
            location.href = '/' 
        }
    }
})

</script>
<template>
    <UserLayout>
        <div class=" max-w-2xl mx-auto border border-base-200 shadow-xl p-8 my-4">
            <div>
                <div class=" text-2xl font-bold"> You Order is Successfull!</div>
                <div>Hi {{ orderData.name }}</div>
                <div>เตรียมรอรับสินค้าได้เลย</div>
            </div>
            <div class=" divider"></div>
            <div class=" grid grid-cols-4 gap-2">
                <div>
                    <div>Order data</div>
                    <div>{{ orderData.createdAt }}</div>
                </div>
                <div>
                    <div>Order Number</div>
                    <div>{{ orderData.orderNumber }}</div>
                </div>
                <div>
                    <div>Payment</div>
                    <div>{{ orderData.PaymentMethod }}</div>
                </div>
                <div>
                    <div>Order data</div>
                    <div>{{ orderData.address}}</div>
                </div>
            </div>
            <div class=" divider"></div>
            <div v-for="product in orderData.products" class=" grid grid-cols-4 gap-2 mb-4 items-center text-center">
                <div>
                    <div>
                        <img :src="product.imageUrl" class="w-full  ">
                    </div>
                </div>
                <div>
                    <div>ชื่อสินค้า</div>
                    <div>{{ product.name}}</div>
                </div>
                <div>
                    <div>จำนวนสินค้า</div>
                    <div>{{ product.quantity }}</div>
                </div>
                <div>
                    <div>ราคารวมสินค้า</div>
                    <div>{{ product.price*product.quantity}}</div>
                </div>
            </div>
            <div class=" divider"></div>
            <div class=" flex justify-between mt-2">
                    <div class=" font-bold">ราคารวมทั้งหมด</div>
                    <div>{{ orderData.totalPrice}}</div>
                </div>
            <div class=" flex justify-between mt-2">
                    <div class=" font-bold">ค่าส่ง</div>
                    <div>0</div>
                </div>
            <div class=" divider"></div>
            <div class=" flex justify-between mt-2">
                    <div class=" font-bold">ราคารวมทั้งหมด</div>
                    <div>{{ orderData.totalPrice}}</div>
                </div>
            <div class=" divider"></div>
            <div>ขอบคุณที่ซื้อสินค้า</div>
        </div>
    </UserLayout>
</template>

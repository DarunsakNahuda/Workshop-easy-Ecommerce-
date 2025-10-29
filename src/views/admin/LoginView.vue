<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account';
import { useEventStore } from '@/stores/event';

const router = useRouter()
const accountStore = useAccountStore()
const eventStore = useEventStore()


const email = ref('')
const password = ref('')

const login = async () =>{
    try{
        await accountStore.signInAdmin(email.value,password.value)
        router.push({name: 'admin-dashboard'})
    }catch(error){
        eventStore.popupMessage('error',error.message)
    }
}
</script>
<template>
    <div class=" h-screen flex items-center">
        <div class=" flex-1 max-w-2xl shadow-xl mx-auto my-4 p-8">
            <div class="flex flex-col items-center">
                <div class="text-3xl font-bold">Login</div>
                <div class="form-control w-full  ">
                <label class="label ">
                    <span class="label-text">Email</span>
                </label>
                <input v-model="email" type="text" placeholder="Your Email" class="input input-bordered w-full " />
                </div>
            <div class="form-control w-full  ">
                <label class="label ">
                    <span class="label-text">Password</span>
                </label>
                <input v-model="password" type="password" placeholder="Your Password" class="input input-bordered w-full " />
            </div>
            <button @click="login" class="btn btn-neutral w-full mt-4">
                Login
            </button>
            </div>
        </div>
    </div>
    
</template>

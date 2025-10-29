<script setup>
import { ref,onMounted } from 'vue'
import UserLayout from'@/layouts/UserLayout.vue'

import { useAccountStore } from '@/stores/account'

import { storage } from '@/firebase'

import { ref as storageRef,uploadBytes,getDownloadURL } from 'firebase/storage'

const accountStore = useAccountStore()

const profileImageUrl=ref()
const email = ref('')
const fullname = ref('')


const handleFileUpload = async (event)=>{
const file = event.target.files[0]
    if(file){
      const uploadRef = storageRef(
        storage,
        `user/${accountStore.user.uid}/${file.name}`
      )
      const snapshot = await uploadBytes(uploadRef,file)
      const downloadUrl = await getDownloadURL(snapshot.ref)
        profileImageUrl.value = downloadUrl
    }
}
const updateprofile= async ()=> {
    try {
            const profileData={
        imageUrl:profileImageUrl.value,
        fullname: fullname.value,
        email:email.value
    }
     await accountStore.updateProfile(profileData)

    } catch (error) {
        console.log ('error',error)
    }

}
onMounted(()=>{
    const profileData=accountStore.profile
        profileImageUrl.value= (profileData.imageUrl || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp')
        fullname .value=profileData.fullname
        email.value= profileData.email
    
})

</script>
<template>
    <UserLayout>
        <div class=" max-w-2xl mx-auto border border-base-200 shadow-xl p-8 my-4">
            <div class=" text-2xl font-bold"> Your Profile</div>
            <div class="flex flex-col items-center">
                <div class="flex flex-col items-center">
                <div class="avatar">
                <div class="w-24 rounded-full">
                    <img :src="profileImageUrl" />
                </div>
                </div>
                <input type="file" @change="handleFileUpload">
            </div>
                    <div class="form-control w-full ">
                    <label class="label">
                        <span class="label-text">Email</span>
                    </label>
                    <input  type="text" placeholder="Type here" class="input input-bordered w-full " :value="email"disabled />
                    </div>
                    <div class="form-control w-full ">
                    <label class="label">
                        <span class="label-text">Name</span>
                    </label>
                    <input v-model="fullname" type="text" placeholder="Type here" class="input input-bordered w-full " />
                    </div>
                    <button @click="updateprofile" class="btn btn-neutral w-full mt-4">Update Profile</button>
                </div>
            </div>
    </UserLayout>
</template>

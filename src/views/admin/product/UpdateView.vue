<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue'
import {useRouter,useRoute,RouterLink} from 'vue-router'
import { reactive , onMounted,ref } from 'vue'
import { useAdminProductStore } from '@/stores/admin/product'
import { storage } from '@/firebase'

import { ref as storageRef,uploadBytes,getDownloadURL } from 'firebase/storage'

const formData =[
  {
    name: 'Name',
    field:'name'
  },
  {
    name: 'Image',
    field:'imageUrl',
    type: 'upload-image'
  },
  {
    name: 'Price',
    field:'price'
  },
  {
    name: 'Quantity',
    field:'quantity'
  },
  {
    name: 'About',
    field:'about'
  },
]
const  adminProductStore = useAdminProductStore()
const router = useRouter()
const route = useRoute()

const productIndex = ref(-1)
const mode = ref('ADD')

const productData =reactive({
  name:'',
  imageUrl:'',
  price:'0',
  quantity:'0',
  about:'',
  status:'',
})

const updateProduct =async()=>{
  try{
  if(mode.value==='EDIT'){
    await  adminProductStore.updatedProduct(productIndex.value , productData)
  }
  else{
    await  adminProductStore.addProduct(productData)    
  }
  router.push({name:'admin-products-list'})
  }
  catch(error){
            console.log('error',error)
        }
}
const handleFileUpload = async (event)=>{
const file = event.target.files[0]

    let mainpath = ''
    if(productIndex.value !== -1){
        mainpath = productIndex.value + '-'
    }

    if(file){
      const uploadRef = storageRef(
        storage,
        `products/${mainpath}${file.name}`
      )
      const snapshot = await uploadBytes(uploadRef,file)
      const downloadUrl = await getDownloadURL(snapshot.ref)
        productData.imageUrl = downloadUrl
    }
}

onMounted(async()=>{
if(route.params.id){
  productIndex.value =route.params.id
  mode.value='EDIT'

  const selectedProduct = await adminProductStore.getProduct(productIndex.value)
  
  productData.name = selectedProduct.name
  productData.imageUrl = selectedProduct.imageUrl
  productData.price = selectedProduct.price
  productData.quantity = selectedProduct.quantity
  productData.about = selectedProduct.about
  productData.status = selectedProduct.status
}
})
</script>
<template>
    <AdminLayout>
      <div class=" shadow-xl p-8 mt-4">
        <div class="text-1xl font-bold">{{mode}}</div>
        <div class=" divider"></div>
        <div class=" grid grid-cols-2 gap-2">
        <div v-for="from in formData" class="form-control w-full">
          <label class="label">
            <span class="label-text">{{from.name}}</span>
          </label>
          <input 
          v-if="from.type !=='upload-image'"
          type="text" 
          class="input input-bordered w-full"
          v-model="productData[from.field]" 
          />
          <div v-else>
            <div class="avatar">
                <div class="w-24 rounded-xl">
                    <img :src="productData[from.field]" />
                </div>
                </div>
                <div>
                  <input type="file" @change="handleFileUpload">
                </div>
                
          </div>
        
        </div>
      </div>
      <div class=" divider"></div>
    <div class=" grid grid-cols-2 gap-2">
      <div class="form-control w-full ">
          <label class="label">
            <span class="label-text">Status</span>
          </label>
          <select v-model="productData.status" class="select select-bordered">
            <option disabled selected>Choose Status</option>
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
      </div>
    </div>
    <div class=" flex mt-4 justify-end">
      <RouterLink :to="{name:'admin-products-list'}" class="btn btn-ghost">Back</RouterLink>
      <button class="btn btn-neutral" @click="updateProduct()">{{mode}}</button>
    </div>
      </div>
    </AdminLayout>
</template>

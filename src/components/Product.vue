<script setup>
import { defineProps } from 'vue'

defineProps({
  products: Array,
  addTocart: Function
})
</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-3">
    <div
      v-for="product in products"
      :key="product.id"
      class="card card-compact bg-base-100 w-full max-w-sm shadow-xl"
    >
      <!-- Image Container -->
      <figure class="aspect-square overflow-hidden bg-gray-100">
        <img
          :src="product.imageUrl"
          alt="product image"
          class="object-contain w-full h-full"
        />
      </figure>

      <!-- Card Body -->
      <div class="card-body">
        <h2 class="card-title">{{ product.name }}</h2>
        <p>{{ product.about }}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="addTocart(product)">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
    activePage: Number,
    maxPage: Number,
    changePage: Function
})
</script>

<template>
    <div class="join">
      
        <button 
            v-if="activePage > 1"
            @click="changePage(activePage - 1)" 
            class="join-item btn">
            ←
        </button>

       
        <button
            class="join-item btn btn-active">
            Page {{ activePage }} / {{ maxPage }}
        </button>

       
        <button 
            v-if="activePage < maxPage"
            @click="changePage(activePage + 1)" 
            class="join-item btn">
            →
        </button>
    </div>
</template>

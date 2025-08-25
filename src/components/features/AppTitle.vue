<template>
    <h1 :class="[styles, sizeClass]">
        {{ title }}
    </h1>
</template>


<script setup lang="ts">
import { computed } from 'vue'

const { title, size } = defineProps<{
    title: string
    size: 'sm' | 'md' | 'lg' | 'xl'
}>()

const styles = "font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 leading-tight"

const sizeClass = computed(() => {
    switch (size) {
        case 'sm':
            return 'text-2xl'
        case 'md':
            return 'text-4xl'
        case 'lg':
            return 'text-6xl'
        case 'xl':
            return 'text-7xl'
    }
})
</script>
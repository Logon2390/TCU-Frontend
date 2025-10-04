<script setup lang="ts">
import logo from '@/../public/logo.webp'
defineProps({
    width: {
        type: Number,
        default: 40
    },
    height: {
        type: Number,
        default: 40
    }
})
</script>

<template>
    <img :src="logo" alt="CCPP Logo" :class="`w-${width} h-${height}`" />
</template>

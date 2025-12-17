<script setup lang="ts">
defineProps({
    src: {
        type: String,
        default: ''
    },
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
    <img :src="src" alt="Icon" :class="`w-${width} h-${height}`" />
</template>

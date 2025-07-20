<template>
    <div class="flex flex-col items-center justify-center p-12 text-gray-500">
        <div class="mb-4">
            <span class="icon-[lucide--loader-2] w-8 h-8 animate-spin text-blue-500" aria-hidden="true" />
        </div>
        <p class="text-sm font-medium">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
import type { LoaderProps } from '@/types/component.types'

withDefaults(defineProps<LoaderProps>(), {
    message: 'Cargando...'
})
</script>

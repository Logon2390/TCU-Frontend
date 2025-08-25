<template>
    <div class="relative inline-block" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
        <slot />
        <Transition name="tooltip">
            <div v-if="showTooltip" :class="[
                'absolute z-50 px-4 py-3 text-sm text-white bg-gray-900 rounded-lg shadow-xl',
                sizeClass,
                'break-words whitespace-normal leading-relaxed',
                positionClasses
            ]">
                {{ content }}
                <div :class="[
                    'absolute w-2 h-2 bg-gray-900 transform rotate-45',
                    arrowClasses
                ]" />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    content: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
    position: 'top',
    size: 'lg'
})

const showTooltip = ref(false)

const positionClasses = computed(() => {
    switch (props.position) {
        case 'top':
            return 'bottom-full right-0 mb-3'
        case 'bottom':
            return 'top-full right-0 mt-3'
        case 'left':
            return 'right-full top-0 mr-3'
        case 'right':
            return 'left-full top-0 ml-3'
        default:
            return 'bottom-full right-0 mb-3'
    }
})

const arrowClasses = computed(() => {
    switch (props.position) {
        case 'top':
            return 'top-full right-4 -mt-1'
        case 'bottom':
            return 'bottom-full right-4 -mb-1'
        case 'left':
            return 'left-full top-4 -ml-1'
        case 'right':
            return 'right-full top-4 -mr-1'
        default:
            return 'top-full right-4 -mt-1'
    }
})

const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'max-w-sm'
        case 'md':
            return 'max-w-md'
        case 'lg':
            return 'max-w-lg'
        case 'xl':
            return 'max-w-xl'
        default:
            return 'max-w-lg'
    }
})
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
    transition: opacity 0.2s;
}

.tooltip-enter-from,
.tooltip-leave-to {
    opacity: 0;
}
</style>

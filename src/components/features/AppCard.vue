<script setup lang="ts">
import { computed } from 'vue'

export interface AppCardProps {
    variant?: 'default' | 'elevated' | 'outlined' | 'gradient'
    padding?: 'sm' | 'md' | 'lg' | 'xl'
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    clickable?: boolean
    hover?: boolean
}

const props = withDefaults(defineProps<AppCardProps>(), {
    variant: 'default',
    padding: 'md',
    rounded: 'lg',
    clickable: false,
    hover: true
})

const cardClasses = computed(() => {
    const classes = ['transition-all', 'duration-300', 'ease-in-out']

    const roundedMap = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl'
    }
    classes.push(roundedMap[props.rounded])

    const paddingMap = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
    }
    classes.push(paddingMap[props.padding])

    switch (props.variant) {
        case 'default':
            classes.push(
                'bg-background-secondary',
                'border',
                'border-text-secondary/20',
                'shadow-md'
            )
            break
        case 'elevated':
            classes.push(
                'bg-background-secondary',
                'border',
                'border-text-secondary/20',
                'shadow-2xl',
                'shadow-black/25'
            )
            break
        case 'outlined':
            classes.push(
                'bg-transparent',
                'border-2',
                'border-text-secondary/30',
                'backdrop-blur-sm'
            )
            break
        case 'gradient':
            classes.push(
                'bg-gradient-to-br',
                'from-primary/10',
                'to-info/10',
                'border',
                'border-text-secondary/30',
                'backdrop-blur-sm'
            )
            break
    }

    if (props.hover) {
        switch (props.variant) {
            case 'default':
            case 'elevated':
                classes.push('hover:border-text-secondary/40')
                break
            case 'outlined':
                classes.push('hover:border-text-secondary/40', 'hover:bg-background-secondary/20')
                break
            case 'gradient':
                classes.push('hover:border-text-secondary/40')
                break
        }
    }

    if (props.clickable) {
        classes.push(
            'cursor-pointer',
            'hover:transform',
            'hover:-translate-y-1',
            'hover:shadow-xl',
            'active:transform',
            'active:translate-y-0'
        )
    }

    return classes.join(' ')
})
</script>

<template>
    <div :class="cardClasses">
        <div v-if="$slots.header" class="mb-4">
            <slot name="header" />
        </div>

        <div>
            <slot />
        </div>

        <div v-if="$slots.footer" class="mt-4">
            <slot name="footer" />
        </div>
    </div>
</template>

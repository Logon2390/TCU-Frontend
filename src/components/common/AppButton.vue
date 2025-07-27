<template>
    <button type="submit" :disabled="buttonProps.loading || buttonProps.disabled"
        :class="[computedStyle, customStyle, buttonProps.disabled ? disabledStyle : 'cursor-pointer']"
        @click="buttonProps.onClick" :aria-label="buttonProps.text" aria-role="button"
        :aria-disabled="buttonProps.loading">
        <span v-if="buttonProps.icon && !buttonProps.loading" :class="buttonProps.icon" class="text-primary"></span>
        <span v-if="buttonProps.loading" class="icon-[lucide--loader-circle] animate-spin text-primary text-xl"></span>
        <span v-else>{{ buttonProps.text }}</span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps } from '@/types/component.types';

const props = defineProps<{
    buttonProps: ButtonProps;
    customStyle?: string;
}>();

const baseStyle = 'w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:scale-99 transition-all duration-200 text-white font-medium focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800';
const disabledStyle = 'cursor-not-allowed opacity-50';

const defaultStyle = 'bg-primary hover:bg-primary/80';
const secondaryStyle = 'bg-secondary hover:bg-secondary/80';
const dangerStyle = 'bg-error hover:bg-error/80';

const computedStyle = computed(() => {
    switch (props.buttonProps.variant) {
        case 'primary':
            return `${baseStyle} ${defaultStyle}`;
        case 'secondary':
            return `${baseStyle} ${secondaryStyle}`;
        case 'danger':
            return `${baseStyle} ${dangerStyle}`;
        case 'custom':
            return '';
        default:
            return `${baseStyle} ${defaultStyle}`;
    }
});
</script>
<template>
    <div class="radio-group">
        <label v-if="labelProps.label" :class="['flex items-center gap-2 text-sm font-medium mb-2', labelProps.class]">
            <span v-if="labelProps.icon" :class="labelProps.icon" class="text-primary"></span>
            {{ labelProps.label }}
        </label>
        <div :class="[
            'flex gap-4',
            radioProps.direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        ]">
            <label v-for="option in radioProps.options" :key="option.value" :class="[
                'flex items-center gap-2 cursor-pointer transition-all',
                radioProps.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary'
            ]">
                <input type="radio" :name="radioProps.name" :value="option.value"
                    :checked="$attrs.modelValue === option.value" @change="handleChange" :required="radioProps.required"
                    :disabled="radioProps.disabled" :class="[
                        'w-4 h-4 cursor-pointer',
                        'accent-primary',
                        radioProps.disabled ? 'cursor-not-allowed' : ''
                    ]" />
                <span class="text-sm">{{ option.label }}</span>
            </label>
        </div>
        <p v-if="errorProps?.onError" class="text-error text-sm mt-1">{{ errorProps?.message }}</p>
    </div>
</template>

<script setup lang="ts">
import type { LabelProps, RadioGroupProps, ErrorProps } from '@/types/component.types';

const props = defineProps<{
    labelProps: LabelProps;
    radioProps: RadioGroupProps;
    errorProps?: ErrorProps;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};
</script>

<style scoped>
input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--color-secondary);
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
}

input[type="radio"]:checked {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
}

input[type="radio"]:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: white;
}

input[type="radio"]:hover:not(:disabled) {
    border-color: var(--color-primary);
}

input[type="radio"]:focus {
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
}

input[type="radio"]:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>

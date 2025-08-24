<template>
    <div class="relative">
        <label v-if="labelProps.label" :for="labelProps.id"
            :class="['flex items-center gap-2 text-sm font-medium mb-1', labelProps.class]">
            <span v-if="labelProps.icon" :class="labelProps.icon" class="text-text-secondary"></span>
            {{ labelProps.label }}
        </label>
        <div class="relative">
            <input v-bind="$attrs" :type="currentInputType" :placeholder="inputProps.placeholder"
                :value="$attrs.modelValue" @input="handleInput"
                :class="[baseStyle, props.customStyle || defaultStyle, errorProps?.onError ? borderErrorStyle : borderStyle]"
                :id="labelProps.id" :required="inputProps.required" :disabled="inputProps.disabled" />

            <button v-if="isPasswordType" type="button" @click="togglePasswordVisibility"
                class="absolute text-text-secondary hover:text-text-primary focus:outline-none right-3 top-1/2 -translate-y-1/2 p-0 bg-transparent border-0 h-5 w-5 flex items-center justify-center">
                <span v-if="showPassword" class="icon-[lucide--eye]"></span>
                <span v-else class="icon-[lucide--eye-off]"></span>
            </button>
            <span v-else-if="inputProps.icon || isDateType" :class="inputProps.icon || 'icon-[lucide--calendar]'"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-primary"></span>
        </div>
        <p v-if="errorProps?.onError" class="text-error text-sm mt-1">{{ errorProps?.message }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ErrorProps, LabelProps, InputProps } from '@/types/component.types';

const props = defineProps<{
    labelProps: LabelProps;
    inputProps: InputProps;
    errorProps?: ErrorProps;
    customStyle?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const baseStyle =
    'w-full py-2 px-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-text-secondary';

const defaultStyle = 'bg-background';
const borderStyle = 'border-2 border-secondary';
const borderErrorStyle = 'border-2 border-error';

const showPassword = ref(false);
const isPasswordType = computed(() => props.inputProps.type === 'password');
const isDateType = computed(() => props.inputProps.type === 'date');
const currentInputType = computed(() => {
    if (isPasswordType.value) {
        return showPassword.value ? 'text' : 'password';
    }
    return props.inputProps.type;
});

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};
</script>

<style scoped>
/* Hide native date input calendar icon */
input[type="date"]::-webkit-calendar-picker-indicator {
    background: transparent;
    color: transparent;
    cursor: pointer;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
}

/* Firefox */
input[type="date"]::-moz-calendar-picker-indicator {
    background: transparent;
    color: transparent;
    cursor: pointer;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
}

/* Edge */
input[type="date"]::-ms-clear,
input[type="date"]::-ms-expand {
    display: none;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px var(--color-background) inset !important;
    -webkit-text-fill-color: var(--color-text-primary) !important;
    border-color: var(--color-text-primary) !important;
    transition: background-color 5000s ease-in-out 0s;
}

/* Firefox autocomplete */
input:-moz-autofill {
    background-color: var(--color-background) !important;
    color: var(--color-text-primary) !important;
}

/* General autocomplete styles */
input:autofill {
    background-color: var(--color-background) !important;
    color: var(--color-text-primary) !important;
}
</style>
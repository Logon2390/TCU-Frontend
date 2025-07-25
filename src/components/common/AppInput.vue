<template>
    <div class="relative">
        <label v-if="labelProps.label" :for="labelProps.id"
            class="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <span v-if="labelProps.icon" :class="labelProps.icon" class="text-gray-300"></span>
            {{ labelProps.label }}
        </label>
        <div class="relative">
            <input v-bind="$attrs" :type="currentInputType" :placeholder="inputProps.placeholder"
                :value="$attrs.modelValue" @input="handleInput"
                :class="[baseStyle, props.customStyle || defaultStyle, errorProps?.onError ? borderErrorStyle : borderStyle]"
                :id="labelProps.id" :required="inputProps.required" :disabled="inputProps.disabled" />

            <button v-if="isPasswordType" type="button" @click="togglePasswordVisibility"
                class="absolute text-gray-400 hover:text-gray-200 focus:outline-none right-3 top-1/2 -translate-y-1/2 p-0 bg-transparent border-0 h-5 w-5 flex items-center justify-center">
                <span v-if="showPassword" class="icon-[lucide--eye]"></span>
                <span v-else class="icon-[lucide--eye-off]"></span>
            </button>
            <span v-else-if="inputProps.icon || isDateType" :class="inputProps.icon || 'icon-[lucide--calendar]'"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"></span>
        </div>
        <p v-if="errorProps?.onError" class="text-red-500 text-sm mt-1">{{ errorProps?.message }}</p>
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
    'w-full py-2 px-3 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400';

const defaultStyle = 'bg-gray-700';
const borderStyle = 'border border-gray-600';
const borderErrorStyle = 'border-2 border-red-500';

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
</style>
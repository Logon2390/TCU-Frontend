<template>
    <div :class="['flex flex-col', customStyle]">
        <label v-if="labelProps.label" :for="labelProps.id"
            class="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <span v-if="labelProps.icon" :class="labelProps.icon" class="text-gray-300"></span>
            {{ labelProps.label }}
        </label>

        <div class="relative">
            <template v-if="isMobile">
                <button type="button" :class="[
                    'flex items-center justify-center w-full h-10 rounded-md border border-gray-700',
                    'bg-gray-900 text-gray-300 text-xl focus:outline-none focus:ring-1 focus:ring-gray-700'
                ]" :disabled="selectProps.disabled" :tabindex="0"
                    :aria-label="selectProps.placeholder || 'Open select'">
                    <span v-if="selectProps.icon" :class="selectProps.icon" class="text-white"></span>
                    <span class="icon-[lucide--chevron-down] h-4 w-4 ml-1"></span>
                </button>

                <select ref="selectRef" v-bind="$attrs" :disabled="selectProps.disabled"
                    :aria-disabled="selectProps.disabled" :value="$attrs.modelValue"
                    class="absolute left-0 top-0 w-full h-full opacity-0" :tabindex="-1" @change="selectProps.onChange">
                    <option v-if="selectProps.placeholder" value="" disabled>{{ selectProps.placeholder }}</option>
                    <option v-for="option in selectProps.options" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </template>

            <template v-else>
                <div v-if="selectProps.icon"
                    class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                    <span
                        :class="['flex items-center justify-center text-gray-500', selectProps.disabled ? 'opacity-50' : '']">
                        <span v-if="selectProps.icon" :class="selectProps.icon" class="text-white"></span>
                    </span>
                </div>

                <select v-bind="$attrs" :disabled="selectProps.disabled" :aria-disabled="selectProps.disabled"
                    :value="$attrs.modelValue"
                    :class="[baseStyles, errorStyles, iconStyles, disabledStyles ? disabledStyles : 'cursor-pointer']"
                    @mousedown="!selectProps.disabled && setIsOpen(true)" @blur="setIsOpen(false)"
                    @change="selectProps.onChange">
                    <option v-if="selectProps.placeholder" value="" disabled>{{ selectProps.placeholder }}</option>
                    <option v-for="option in selectProps.options" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>

                <div class="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-3">
                    <span :class="[
                        'icon-[lucide--chevron-down] h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200',
                        selectProps.disabled ? 'opacity-50' : '',
                        isOpen ? 'rotate-180' : ''
                    ]" />
                </div>
            </template>
        </div>

        <p v-if="errorProps.onError" class="mt-1 text-sm text-red-500" :aria-label="errorProps.message">
            {{ errorProps.message }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { SelectProps, LabelProps, ErrorProps } from '@/types/component.types'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
    labelProps: LabelProps,
    selectProps: SelectProps,
    errorProps: ErrorProps,
    customStyle?: string
}>()

const isOpen = ref(false)
const isMobile = ref(false)
const selectRef = ref<HTMLSelectElement | null>(null)

const baseStyles = computed(() =>
    'w-full rounded-md border border-gray-700 bg-gray-900 text-sm font-medium text-gray-300 h-10 flex items-center appearance-none'
)

const errorStyles = computed(() =>
    props.errorProps.onError
        ? 'not-focus:border-red-500 placeholder:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500'
        : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
)

const startPadding = computed(() => props.selectProps.icon ? 'pl-10' : 'pl-3')
const iconStyles = computed(() => `${startPadding.value}`)

const disabledStyles = computed(() =>
    props.selectProps.disabled
        ? 'opacity-50 cursor-not-allowed bg-gray-100'
        : ''
)

const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
}

const setIsOpen = (value: boolean) => {
    isOpen.value = value
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>

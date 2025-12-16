<template>
    <div class="w-full">
        <label v-if="labelProps.label" :for="labelProps.id"
            :class="['flex items-center gap-2 text-sm font-medium mb-2', labelProps.class]">
            <span v-if="labelProps.icon" :class="labelProps.icon" class="text-primary"></span>
            {{ labelProps.label }}
        </label>
        <div class="flex gap-2 md:gap-4">
            <div class="flex-1 flex flex-col">
                <AppInput :label-props="{ id: `${labelProps.id}-day`, label: 'Día' }" :input-props="{
                    type: 'number',
                    placeholder: 'DD',
                    required: dateProps.required,
                    disabled: dateProps.disabled
                }" :error-props="{ onError: false }" :custom-style="'date-input-custom'" v-model="dayString"
                    @input="handleDayInput" />
            </div>
            <div class="flex-1 flex flex-col">
                <AppInput :label-props="{ id: `${labelProps.id}-month`, label: 'Mes' }" :input-props="{
                    type: 'number',
                    placeholder: 'MM',
                    required: dateProps.required,
                    disabled: dateProps.disabled
                }" :error-props="{ onError: false }" :custom-style="'date-input-custom'" v-model="monthString"
                    @input="handleMonthInput" />
            </div>
            <div class="flex-1 flex flex-col">
                <AppInput :label-props="{ id: `${labelProps.id}-year`, label: 'Año' }" :input-props="{
                    type: 'number',
                    placeholder: 'YYYY',
                    required: dateProps.required,
                    disabled: dateProps.disabled
                }" :error-props="{ onError: false }" :custom-style="'date-input-custom'" v-model="yearString"
                    @input="handleYearInput" />
            </div>
        </div>
        <p v-if="errorMessage" class="text-error text-sm mt-1">{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, useAttrs } from 'vue';
import AppInput from '@/components/common/AppInput.vue';
import type { LabelProps, DateInputProps, ErrorProps } from '@/types/component.types';

const props = defineProps<{
    labelProps: LabelProps;
    dateProps: DateInputProps;
    errorProps?: ErrorProps;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const attrs = useAttrs();

const dayString = ref<string>('');
const monthString = ref<string>('');
const yearString = ref<string>('');
const errorMessage = ref<string>('');

// Computed number values for validation
const day = computed(() => dayString.value ? parseInt(dayString.value, 10) : null);
const month = computed(() => monthString.value ? parseInt(monthString.value, 10) : null);
const year = computed(() => yearString.value ? parseInt(yearString.value, 10) : null);

const currentYear = new Date().getFullYear();
const minYear = computed(() => props.dateProps.minYear || currentYear - 100);
const maxYear = computed(() => props.dateProps.maxYear || currentYear);

const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const getMaxDaysInMonth = (month: number, year: number): number => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) {
        return 29;
    }
    return daysInMonth[month - 1] || 31;
};

const validateDate = (): boolean => {
    errorMessage.value = '';

    const dayNum = day.value;
    const monthNum = month.value;
    const yearNum = year.value;

    if (dayNum === null || monthNum === null || yearNum === null) {
        return false;
    }

    // Validate month
    if (monthNum < 1 || monthNum > 12) {
        errorMessage.value = 'El mes debe estar entre 1 y 12';
        return false;
    }

    // Validate year
    if (yearNum < minYear.value || yearNum > maxYear.value) {
        errorMessage.value = `El año debe estar entre ${minYear.value} y ${maxYear.value}`;
        return false;
    }

    // Validate day based on month and year
    const maxDays = getMaxDaysInMonth(monthNum, yearNum);
    if (dayNum < 1 || dayNum > maxDays) {
        errorMessage.value = `El día debe estar entre 1 y ${maxDays} para el mes seleccionado`;
        return false;
    }

    return true;
};

const handleDateChange = () => {
    const dayNum = day.value;
    const monthNum = month.value;
    const yearNum = year.value;

    if (dayNum !== null && monthNum !== null && yearNum !== null) {
        if (validateDate()) {
            // Format as yyyy-mm-dd for backend
            const formattedDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            emit('update:modelValue', formattedDate);
        } else {
            emit('update:modelValue', '');
        }
    } else {
        emit('update:modelValue', '');
    }
};

// Individual input handlers
const handleDayInput = () => {
    handleDateChange();
};

const handleMonthInput = () => {
    handleDateChange();
};

const handleYearInput = () => {
    handleDateChange();
};

// Watch for external value changes (e.g., from API autocomplete)
watch(() => attrs.modelValue, (newValue) => {
    if (newValue && typeof newValue === 'string' && newValue.includes('-')) {
        const parts = newValue.split('-');
        if (parts.length === 3) {
            const [yearPart, monthPart, dayPart] = parts;
            yearString.value = yearPart;
            monthString.value = monthPart.replace(/^0/, '');
            dayString.value = dayPart.replace(/^0/, '');
        }
    } else if (!newValue) {
        dayString.value = '';
        monthString.value = '';
        yearString.value = '';
    }
}, { immediate: true });

</script>

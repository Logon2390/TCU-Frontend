<template>
    <div class="p-6 border-b border-gray-700">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-xl font-semibold text-white">{{ stepperProps.title }}</h1>
            <span class="text-sm text-gray-400">{{ stepperProps.currentStep }}/{{ stepperProps.steps.length }}</span>
        </div>

        <div class="w-full bg-gray-700 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                :style="{ width: `${(stepperProps.currentStep / stepperProps.steps.length) * 100}%` }"></div>
        </div>

        <div class="flex justify-between mt-4">
            <div v-for="step in stepperProps.steps" :key="step.id" class="flex flex-col items-center">
                <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                    step.isCompleted ? 'bg-green-600 text-white' :
                        step.isActive ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                ]">
                    <span v-if="step.isCompleted" class="icon-[lucide--check] w-4 h-4"></span>
                    <span v-else>{{ step.id }}</span>
                </div>
                <span class="text-xs text-gray-400 mt-1 text-center">{{ step.title }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { StepperProps } from '@/types/component.types'

defineProps<{
    stepperProps: StepperProps
}>()
</script>

<template>
    <div class="p-6">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-xl font-semibold text-text-primary">{{ stepperProps.title }}</h1>
            <span class="text-sm text-text-secondary">{{ stepperProps.currentStep }}/{{ stepperProps.steps.length
            }}</span>
        </div>

        <div class="w-full bg-secondary rounded-full h-2">
            <div class="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
                :style="{ width: `${(stepperProps.currentStep / stepperProps.steps.length) * 100}%` }"></div>
        </div>

        <div class="flex justify-between mt-4">
            <div v-for="step in stepperProps.steps" :key="step.id" class="flex flex-col items-center">
                <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                    step.isCompleted ? 'bg-success text-white' :
                        step.isActive ? 'bg-primary text-white' : 'bg-secondary text-white'
                ]">
                    <span v-if="step.isCompleted" class="icon-[lucide--check] w-4 h-4"></span>
                    <span v-else>{{ step.id }}</span>
                </div>
                <span class="text-xs text-text-secondary mt-1 text-center">{{ step.title }}</span>
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

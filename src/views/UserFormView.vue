<template>
    <div class="h-[calc(100vh-60px)] bg-gray-900 flex">
        <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <img :src="images.registration.hero" :alt="images.registration.alt" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/50"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-700/20"></div>
            <div class="absolute inset-0 flex items-end p-8 z-30">
                <div class="text-white">
                    <h2 class="text-3xl font-bold mb-2 text-white drop-shadow-lg">Bienvenido</h2>
                    <p class="text-gray-100 text-lg drop-shadow-md">Regístrate para acceder a nuestros servicios</p>
                </div>
            </div>
        </div>

        <div class="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
            <div class="w-full max-w-md md:max-w-lg bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                <AppStepper :stepper-props="{
                    title: 'Registro de Usuario',
                    currentStep,
                    steps
                }" />

                <div class="p-6">
                    <form @submit.prevent="handleSubmit">
                        <div v-show="currentStep === 1" :class="[
                            'transition-all duration-300',
                            currentStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        ]">
                            <h2 class="text-lg font-medium text-white mb-4">Identificación</h2>

                            <div class="space-y-4">
                                <AppSelect :label-props="{ id: 'identificationType', label: 'Tipo de identificación' }"
                                    :select-props="{
                                        placeholder: 'Seleccione tipo de identificación',
                                        options: identificationTypes,
                                        onChange: handleIdentificationTypeChange
                                    }" :error-props="{ onError: false }" v-model="userRecord.user.document" />

                                <AppInput :label-props="{ id: 'documentNumber', label: 'Número de documento' }"
                                    :input-props="{
                                        type: 'text',
                                        placeholder: 'Ingrese su número de documento',
                                        required: true
                                    }" :error-props="{ onError: false }" v-model="userRecord.user.document" />
                            </div>
                        </div>

                        <div v-show="currentStep === 2" :class="[
                            'transition-all duration-300',
                            currentStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        ]">
                            <h2 class="text-lg font-medium text-white mb-4">Datos Personales</h2>

                            <div class="space-y-4">
                                <AppInput :label-props="{ id: 'fullName', label: 'Nombre completo' }" :input-props="{
                                    type: 'text',
                                    placeholder: 'Ingrese su nombre completo',
                                    required: true
                                }" :error-props="{ onError: false }" v-model="userRecord.user.fullName" />

                                <AppInput :label-props="{ id: 'birthDate', label: 'Fecha de nacimiento' }" :input-props="{
                                    type: 'date',
                                    required: true
                                }" :error-props="{ onError: false }" v-model="userRecord.user.birthDate" />

                                <AppSelect :label-props="{ id: 'gender', label: 'Género' }" :select-props="{
                                    placeholder: 'Seleccione su género',
                                    options: genderOptions,
                                    onChange: handleGenderChange
                                }" :error-props="{ onError: false }" v-model="userRecord.user.gender" />
                            </div>
                        </div>

                        <div v-show="currentStep === 3" :class="[
                            'transition-all duration-300',
                            currentStep === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        ]">
                            <h2 class="text-lg font-medium text-white mb-4">Propósito de Visita</h2>

                            <div class="space-y-4">
                                <AppSelect :label-props="{ id: 'purpose', label: 'Propósito de su visita' }"
                                    :select-props="{
                                        placeholder: 'Seleccione el propósito de su visita',
                                        options: visitPurposes,
                                        onChange: handlePurposeChange
                                    }" :error-props="{ onError: false }" v-model="userRecord.module" />
                            </div>
                        </div>
                    </form>
                </div>

                <div class="px-6 py-4 border-t border-gray-700 flex justify-center gap-8">
                    <AppButton v-if="currentStep > 1" :button-props="{
                        variant: 'secondary',
                        text: 'Anterior',
                        onClick: previousStep
                    }" />

                    <AppButton v-if="currentStep < steps.length" :button-props="{
                        variant: 'primary',
                        text: 'Siguiente',
                        onClick: nextStep,
                        disabled: !isCurrentStepValid
                    }" />
                    <AppButton v-else :button-props="{
                        variant: 'primary',
                        text: 'Enviar',
                        onClick: submitForm,
                        disabled: !isCurrentStepValid
                    }" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppStepper from '@/components/features/AppStepper.vue'
import { images } from '@/config/images.config'
import type { StepperStep } from '@/types/component.types'
import type { Registration } from '@/types/user.types'
import { IDENTIFICATION_TYPES, GENDER_OPTIONS, VISIT_PURPOSES } from '@/types/form.types'

const identificationTypes = [...IDENTIFICATION_TYPES]
const genderOptions = [...GENDER_OPTIONS]
const visitPurposes = [...VISIT_PURPOSES]
const currentStep = ref(1)
const userRecord = ref<Registration>({
    user: {
        document: '',
        fullName: '',
        birthDate: '',
        gender: ''
    },
    date: new Date().toISOString().split('T')[0],
    module: ''
});

const steps = computed<StepperStep[]>(() => [
    {
        id: 1,
        title: 'Identificación',
        isCompleted: currentStep.value > 1,
        isActive: currentStep.value === 1
    },
    {
        id: 2,
        title: 'Datos Personales',
        isCompleted: currentStep.value > 2,
        isActive: currentStep.value === 2
    },
    {
        id: 3,
        title: 'Propósito',
        isCompleted: currentStep.value > 3,
        isActive: currentStep.value === 3
    },
])

const isCurrentStepValid = computed(() => {
    switch (currentStep.value) {
        case 1:
            return userRecord.value.user.document && userRecord.value.user.document.trim()
        case 2:
            return userRecord.value.user.fullName.trim() && userRecord.value.user.birthDate && userRecord.value.user.gender
        case 3:
            return userRecord.value.module
        default:
            return false
    }
})

const nextStep = () => {
    if (currentStep.value < steps.value.length && isCurrentStepValid.value) {
        currentStep.value++
    }
}

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}

const handleIdentificationTypeChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    userRecord.value.user.document = target.value
}

const handleGenderChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    userRecord.value.user.gender = target.value
}

const handlePurposeChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    userRecord.value.module = target.value
}

const submitForm = () => {
    if (isCurrentStepValid.value) {
        alert('enviando')
        console.log('Datos del formulario:', userRecord.value)
    }
}

const handleSubmit = () => {
    if (currentStep.value === steps.value.length) {
        submitForm()
    } else {
        nextStep()
    }
}
</script>

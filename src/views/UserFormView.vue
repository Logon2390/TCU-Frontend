<template>
    <div class="h-[calc(100vh-60px)] bg-background flex">
        <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <img :src="images.registration.hero" :alt="images.registration.alt" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/50"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-700/20"></div>
            <div class="absolute inset-0 flex items-end p-8 z-30">
                <div class="text-white">
                    <h2 class="text-3xl font-bold mb-2black drop-shadow-lg">Bienvenido</h2>
                    <p class="text-lg drop-shadow-md">Regístrate para acceder a nuestros servicios</p>
                </div>
            </div>
        </div>

        <div class="w-full lg:w-1/2 flex items-start justify-center p-6">
            <div class="w-full">
                <AppStepper class="border border-gray-700 rounded-xl shadow-xl mb-10" :stepper-props="{
                    title: 'Registro de visitante',
                    currentStep,
                    steps
                }" />

                <div class=" p-0">
                    <form @submit.prevent="handleSubmit">

                        <Transition :name="transitionName" mode="out-in">
                            <div :key="currentStep">
                                <div v-if="currentStep === 1" :class="[
                                    'transition-all duration-300',
                                    currentStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                ]">
                                    <h2 class="text-lg font-medium text-black mb-4">Identificación</h2>
                                    <div class="space-y-4">
                                        <AppInput :label-props="{ id: 'documentNumber', label: 'Número de documento' }"
                                            :input-props="{
                                                type: 'text ',
                                                placeholder: 'Ingrese su número de documento',
                                                required: true,
                                                icon: 'icon-[lucide--id-card]'
                                            }" :error-props="{ onError: false }" v-model="userRecord.user.document" />
                                    </div>
                                </div>

                                <div v-if="currentStep === 2" :class="[
                                    'transition-all duration-300',
                                    currentStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                ]">
                                    <h2 class="text-lg font-medium text-black mb-4">Datos Personales</h2>

                                    <div class="space-y-4">
                                        <AppInput :label-props="{ id: 'fullName', label: 'Nombre completo' }"
                                            :input-props="{
                                                type: 'text',
                                                placeholder: 'Ingrese su nombre completo',
                                                required: true,
                                                icon: 'icon-[lucide--user-round]'
                                            }" :error-props="{ onError: false }" v-model="userRecord.user.name" />

                                        <AppInput :label-props="{ id: 'birthDate', label: 'Fecha de nacimiento' }"
                                            :input-props="{
                                                type: 'date',
                                                required: true
                                            }" :error-props="{ onError: false }" v-model="userRecord.user.birthday" />

                                        <AppSelect :label-props="{ id: 'gender', label: 'Género' }" :select-props="{
                                            placeholder: 'Seleccione su género',
                                            options: genderOptions.map(option => option.label),
                                            onChange: handleGenderChange
                                        }" :error-props="{ onError: false }" v-model="userRecord.user.gender" />
                                    </div>
                                </div>

                                <div v-if="currentStep === 3" :class="[
                                    'transition-all duration-300',
                                    currentStep === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                ]">
                                    <h2 class="text-lg font-medium text-black mb-4">Propósito de Visita</h2>

                                    <div class="space-y-4">
                                        <AppSelect
                                            :label-props="{ id: 'purpose', label: 'Que describe mejor tu propósito de visita', icon: 'icon-[lucide--user-round]' }"
                                            :select-props="{
                                                icon: 'icon-[lucide--info]',
                                                placeholder: 'Selecciona una opción',
                                                options: visitPurposes.map(module => module.name),
                                                onChange: handlePurposeChange
                                            }" :error-props="{ onError: false }" v-model="selectedModuleName" />


                                        <div
                                            class="flex flex-col items-start justify-center gap-2 text-gray-400 text-sm mt-4">
                                            <span class="flex items-center gap-2 text-sm text-blue-500 font-medium">
                                                <span class="icon-[lucide--info] size-4"></span>
                                                <span>Porque requerimos esta información</span>
                                            </span>
                                            <span>
                                                Los datos que proporciones nos ayudarán a gestionar tu visita de manera
                                                más
                                                eficiente.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </form>
                </div>

                <div class="flex justify-between gap-8 mt-6">
                    <AppButton v-if="currentStep > 1" :button-props="{
                        variant: 'secondary',
                        text: 'Anterior',
                        onClick: previousStep,
                        type: 'button'
                    }" />

                    <AppButton v-if="currentStep < steps.length" :button-props="{
                        variant: 'primary',
                        text: 'Siguiente',
                        onClick: nextStep,
                        loading: isLoading,
                        disabled: !isCurrentStepValid,
                        type: 'button'
                    }" />
                    <AppButton v-else :button-props="{
                        variant: 'primary',
                        text: 'Enviar',
                        onClick: submitForm,
                        loading: isSubmitting,
                        disabled: !isCurrentStepValid,
                        type: 'button'
                    }" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// Components
import AppInput from '@/components/common/AppInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppStepper from '@/components/features/AppStepper.vue'

//hooks
import { useRouter } from 'vue-router'
import { useModal } from '@/composables/useModal'
import { useFetching } from '@/composables/useFetching'

//types & config
import { images } from '@/config/images.config'
import type { StepperStep } from '@/types/component.types'
import type { Registration } from '@/types/form.types'
import { GENDER_OPTIONS } from '@/types/form.types'
import type { Module } from '@/types/modules.types'

//services
import RecordService from '@/service/Record.service'
import ModulesService from '@/service/Modules.service'
import userService from '@/service/User.service'

const modal = useModal()
const router = useRouter()
const genderOptions = [...GENDER_OPTIONS]
const visitPurposes = ref<Module[]>([])
const currentStep = ref(1)
const selectedModuleName = ref('')
const transitionName = ref<'slide-left' | 'slide-right'>('slide-left')
const userRecord = ref<Registration>({
    user: {
        document: '',
        name: '',
        birthday: '',
        gender: '',
        lastRecord: new Date()
    },
    date: new Date(),
    moduleId: 0
});

const { isLoading, execute } = useFetching(userService.getUserByDocument)
const { isLoading: isSubmitting, execute: executeSubmit } = useFetching(RecordService.createRecord)

const getUserByDocument = async () => {
    const document = userRecord.value.user.document.trim()
    const response = await execute(document)
    if (response?.success && response.data) {
        const apiUser = response.data as any
        const genderLabel = genderOptions.find(option => option.value === apiUser.gender)?.label || ''

        userRecord.value.user = {
            document: apiUser.document,
            name: apiUser.name || '',
            birthday: apiUser.birthday || new Date(),
            gender: genderLabel,
            lastRecord: new Date()
        }
    } else {
    }
    return response
}

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
            return userRecord.value.user.document?.trim() && userRecord.value.user.document.length > 1
        case 2:
            return userRecord.value.user.name?.trim() && userRecord.value.user.birthday && userRecord.value.user.gender
        case 3:
            return selectedModuleName.value.trim() !== '' && userRecord.value.moduleId > 0
        default:
            return false
    }
})

const nextStep = async (event?: Event) => {
    event?.preventDefault()

    if (currentStep.value < steps.value.length && isCurrentStepValid.value) {
        transitionName.value = 'slide-left'
        if (currentStep.value === 1) {
            await getUserByDocument()
        }
        currentStep.value++
    } else {
    }
}

const previousStep = (event?: Event) => {
    event?.preventDefault()
    if (currentStep.value > 1) {
        transitionName.value = 'slide-right'
        currentStep.value--
    }
}

const handleGenderChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const selectedLabel = target.value
    userRecord.value.user.gender = selectedLabel
}

const handlePurposeChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const moduleName = target.value
    selectedModuleName.value = moduleName
    const selectedModule = visitPurposes.value.find(module => module.name === moduleName)
    userRecord.value.moduleId = selectedModule?.id || 0
}

const submitForm = async (event?: Event) => {
    event?.preventDefault()
    if (isCurrentStepValid.value) {
        try {
            const genderValue = genderOptions.find(option => option.label === userRecord.value.user.gender)?.value || ''
            const recordToSubmit = {
                ...userRecord.value,
                user: {
                    ...userRecord.value.user,
                    gender: genderValue
                }
            }

            const response = await executeSubmit(recordToSubmit)
            if (response?.success) {
                modal.showToast('success', 'El registro se ha realizado correctamente')
                router.push('/')
            } else {
                modal.showToast('error', 'Error al registrar el visitante')
            }
        } catch (error) {
            modal.showToast('error', 'Error al registrar el visitante')
            console.error(error)
        }
    }
}

const handleSubmit = () => {
    if (currentStep.value === steps.value.length) {
        submitForm()
    } else {
        nextStep()
    }
}

onMounted(async () => {
    const modules = await ModulesService.getModules()
    if (modules.success) {
        visitPurposes.value = modules.data
    }
})
</script>
<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 300ms ease;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(16px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-16px);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-16px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(16px);
}
</style>
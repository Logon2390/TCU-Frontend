<template>
    <div></div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import type { ModalConfig, ModalResult } from '@/types/Modals.types'

const getDefaultConfig = (type: string): Partial<ModalConfig> => {
    const baseConfig = {
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#EF4444',
        allowOutsideClick: true,
        allowEscapeKey: true,
        customClass: {
            popup: 'rounded-lg shadow-2xl',
            title: 'text-xl font-semibold text-gray-800',
            content: 'text-gray-600',
            confirmButton: 'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
            cancelButton: 'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg'
        }
    }

    switch (type) {
        case 'success':
            return {
                ...baseConfig,
                confirmButtonColor: '#10B981',
                confirmButtonText: 'Aceptar'
            }
        case 'error':
            return {
                ...baseConfig,
                confirmButtonColor: '#EF4444',
                confirmButtonText: 'Entendido'
            }
        case 'warning':
            return {
                ...baseConfig,
                confirmButtonColor: '#F59E0B',
                confirmButtonText: 'Continuar'
            }
        case 'question':
            return {
                ...baseConfig,
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }
        case 'info':
        default:
            return {
                ...baseConfig,
                confirmButtonText: 'Aceptar'
            }
    }
}

const useModal = () => {
    const showInfo = async (title: string, text?: string, config?: Partial<ModalConfig>): Promise<ModalResult> => {
        const defaultConfig = getDefaultConfig('info')
        const result = await Swal.fire({
            icon: 'info',
            title,
            text,
            ...defaultConfig,
            ...config
        })

        return {
            isConfirmed: result.isConfirmed,
            isDenied: result.isDenied,
            isDismissed: result.isDismissed,
            value: result.value
        }
    }

    const showSuccess = async (title: string, text?: string, config?: Partial<ModalConfig>): Promise<ModalResult> => {
        const defaultConfig = getDefaultConfig('success')
        const result = await Swal.fire({
            icon: 'success',
            title,
            text,
            ...defaultConfig,
            ...config
        })

        return {
            isConfirmed: result.isConfirmed,
            isDenied: result.isDenied,
            isDismissed: result.isDismissed,
            value: result.value
        }
    }

    const showError = async (title: string, text?: string, config?: Partial<ModalConfig>): Promise<ModalResult> => {
        const defaultConfig = getDefaultConfig('error')
        const result = await Swal.fire({
            icon: 'error',
            title,
            text,
            ...defaultConfig,
            ...config
        })

        return {
            isConfirmed: result.isConfirmed,
            isDenied: result.isDenied,
            isDismissed: result.isDismissed,
            value: result.value
        }
    }

    const showWarning = async (title: string, text?: string, config?: Partial<ModalConfig>): Promise<ModalResult> => {
        const defaultConfig = getDefaultConfig('warning')
        const result = await Swal.fire({
            icon: 'warning',
            title,
            text,
            ...defaultConfig,
            ...config
        })

        return {
            isConfirmed: result.isConfirmed,
            isDenied: result.isDenied,
            isDismissed: result.isDismissed,
            value: result.value
        }
    }

    const showConfirmation = async (
        title: string,
        text?: string,
        config?: Partial<ModalConfig>
    ): Promise<ModalResult> => {
        const defaultConfig = getDefaultConfig('question')
        const result = await Swal.fire({
            icon: 'question',
            title,
            text,
            ...defaultConfig,
            ...config
        })

        return {
            isConfirmed: result.isConfirmed,
            isDenied: result.isDenied,
            isDismissed: result.isDismissed,
            value: result.value
        }
    }

    const showInput = async (
        title: string,
        inputType: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' = 'text',
        placeholder?: string,
        value?: string
    ): Promise<ModalResult> => {
        const result = await Swal.fire({
            title,
            input: inputType,
            inputPlaceholder: placeholder,
            inputValue: value,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#EF4444',
            customClass: {
                popup: 'rounded-lg shadow-2xl',
                input: 'rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
                confirmButton: 'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
                cancelButton: 'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Este campo es requerido'
                }
                return null
            }
        })

        return {
            isConfirmed: result.isConfirmed,
            isDenied: result.isDenied,
            isDismissed: result.isDismissed,
            value: result.value
        }
    }

    const showToast = (
        type: 'success' | 'error' | 'warning' | 'info',
        text: string,
        timer: number = 3000
    ) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            customClass: {
                popup: 'rounded-lg shadow-lg'
            }
        })

        Toast.fire({
            icon: type,
            title: text
        })
    }

    return {
        showInfo,
        showSuccess,
        showError,
        showWarning,
        showConfirmation,
        showInput,
        showToast
    }
}

const modal = useModal()

defineExpose({
    ...modal,
    useModal
})
</script>

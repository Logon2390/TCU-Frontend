import Swal from 'sweetalert2'
import type { ModalConfig, ModalResult, FormConfig, FormResult } from '@/types/Modals.types'

const getDefaultConfig = (type: string): Partial<ModalConfig> => {
  const baseConfig = {
    confirmButtonColor: '#3B82F6',
    cancelButtonColor: '#EF4444',
    allowOutsideClick: true,
    allowEscapeKey: true,
    customClass: {
      popup: 'rounded-lg shadow-2xl',
      content: 'text-gray-600',
      confirmButton: 'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
      cancelButton: 'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
    },
  }

  switch (type) {
    case 'success':
      return {
        ...baseConfig,
        confirmButtonColor: '#10B981',
        confirmButtonText: 'Aceptar',
      }
    case 'error':
      return {
        ...baseConfig,
        confirmButtonColor: '#EF4444',
        confirmButtonText: 'Entendido',
      }
    case 'warning':
      return {
        ...baseConfig,
        confirmButtonColor: '#F59E0B',
        confirmButtonText: 'Continuar',
      }
    case 'question':
      return {
        ...baseConfig,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }
    case 'info':
    default:
      return {
        ...baseConfig,
        confirmButtonText: 'Aceptar',
      }
  }
}

export const useModal = () => {
  const showInfo = async (
    title: string,
    text?: string,
    config?: Partial<ModalConfig>,
  ): Promise<ModalResult> => {
    const defaultConfig = getDefaultConfig('info')
    const result = await Swal.fire({
      icon: 'info',
      title,
      text,
      ...defaultConfig,
      ...config,
    })

    return {
      isConfirmed: result.isConfirmed,
      isDenied: result.isDenied,
      isDismissed: result.isDismissed,
      value: result.value,
    }
  }

  const showSuccess = async (
    title: string,
    text?: string,
    config?: Partial<ModalConfig>,
  ): Promise<ModalResult> => {
    const defaultConfig = getDefaultConfig('success')
    const result = await Swal.fire({
      icon: 'success',
      title,
      text,
      ...defaultConfig,
      ...config,
    })

    return {
      isConfirmed: result.isConfirmed,
      isDenied: result.isDenied,
      isDismissed: result.isDismissed,
      value: result.value,
    }
  }

  const showError = async (
    title: string,
    text?: string,
    config?: Partial<ModalConfig>,
  ): Promise<ModalResult> => {
    const defaultConfig = getDefaultConfig('error')
    const result = await Swal.fire({
      icon: 'error',
      title,
      text,
      ...defaultConfig,
      ...config,
    })

    return {
      isConfirmed: result.isConfirmed,
      isDenied: result.isDenied,
      isDismissed: result.isDismissed,
      value: result.value,
    }
  }

  const showWarning = async (
    title: string,
    text?: string,
    config?: Partial<ModalConfig>,
  ): Promise<ModalResult> => {
    const defaultConfig = getDefaultConfig('warning')
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      ...defaultConfig,
      ...config,
    })

    return {
      isConfirmed: result.isConfirmed,
      isDenied: result.isDenied,
      isDismissed: result.isDismissed,
      value: result.value,
    }
  }

  const showConfirmation = async (
    title: string,
    text?: string,
    config?: Partial<ModalConfig>,
  ): Promise<ModalResult> => {
    const defaultConfig = getDefaultConfig('question')
    const result = await Swal.fire({
      icon: 'question',
      title,
      text,
      ...defaultConfig,
      ...config,
    })

    return {
      isConfirmed: result.isConfirmed,
      isDenied: result.isDenied,
      isDismissed: result.isDismissed,
      value: result.value,
    }
  }

  const showInput = async (
    title: string,
    inputType: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' = 'text',
    placeholder?: string,
    defaultValue?: string,
  ): Promise<ModalResult> => {
    const result = await Swal.fire({
      title,
      input: inputType,
      inputPlaceholder: placeholder,
      inputValue: defaultValue,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      customClass: {
        popup: 'rounded-lg shadow-2xl',
        input:
          'rounded-lg border border-gray-300 px-3 py-2',
        confirmButton:
          'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        cancelButton:
          'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido'
        }
        return null
      },
    })

    return {
      isConfirmed: result.isConfirmed,
      isDenied: result.isDenied,
      isDismissed: result.isDismissed,
      value: result.value,
    }
  }

  const showToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    timer: number = 3000,
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
        popup: 'rounded-lg shadow-lg',
      },
    })

    Toast.fire({
      icon: type,
      text: message,
    })
  }

  const showForm = async (
    config: FormConfig, 
    onSubmit?: (values: Record<string, string>) => Promise<boolean>
  ): Promise<FormResult> => {
    const generateFormHTML = () => {
      let formHTML = '<div class="space-y-4">'
      
      config.fields.forEach(field => {
        formHTML += '<div class="text-left">'
        formHTML += `<label for="${field.id}" class="block text-sm font-medium text-gray-700 mb-2">${field.label}${field.required ? ' *' : ''}</label>`
        
        if (field.type === 'select' && field.options) {
          formHTML += `<select id="${field.id}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">`
          formHTML += `<option value="">${field.placeholder || 'Seleccione una opción'}</option>`
          field.options.forEach(option => {
            const selected = field.value === option ? 'selected' : ''
            formHTML += `<option value="${option}" ${selected}>${option}</option>`
          })
          formHTML += '</select>'
        } else {
          formHTML += `<input 
            type="${field.type}" 
            id="${field.id}" 
            placeholder="${field.placeholder || ''}" 
            value="${field.value || ''}"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            ${field.required ? 'required' : ''}
          />`
        }
        
        formHTML += '</div>'
      })
      
      formHTML += '</div>'
      return formHTML
    }

    const validateForm = (formData: Record<string, string>) => {
      const errors: string[] = []
      
      config.fields.forEach(field => {
        const value = formData[field.id] || ''
        
        if (field.required && !value.trim()) {
          errors.push(`${field.label} es requerido`)
          return
        }
        
        if (field.validation) {
          const error = field.validation(value)
          if (error) {
            errors.push(error)
          }
        }
      })
      
      return errors
    }

    const result = await Swal.fire({
      title: config.title,
      html: generateFormHTML(),
      showCancelButton: true,
      confirmButtonText: config.confirmButtonText || 'Guardar',
      cancelButtonText: config.cancelButtonText || 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      showLoaderOnConfirm: !!onSubmit,
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        popup: 'rounded-lg shadow-2xl',
        title: 'text-xl font-semibold text-gray-800 mb-4',
        htmlContainer: 'text-left',
        confirmButton: 'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        cancelButton: 'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
      },
      focusConfirm: false,
      preConfirm: async () => {
        const formData: Record<string, string> = {}
        
        config.fields.forEach(field => {
          const element = document.getElementById(field.id) as HTMLInputElement | HTMLSelectElement
          if (element) {
            formData[field.id] = element.value
          }
        })
        
        const errors = validateForm(formData)
        if (errors.length > 0) {
          Swal.showValidationMessage(errors.join('<br>'))
          return false
        }
        
        if (onSubmit) {
          try {
            const success = await onSubmit(formData)
            if (!success) {
              return false
            }
          } catch (error) {
            Swal.showValidationMessage('Error al procesar la solicitud')
            return false
          }
        }
        
        return formData
      }
    })

    return {
      isConfirmed: result.isConfirmed,
      isDenied: result.isDenied,
      isDismissed: result.isDismissed,
      values: result.value as Record<string, string>
    }
  }

  return {
    showInfo,
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
    showInput,
    showToast,
    showForm,
  }
}

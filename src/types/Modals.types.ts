export type ModalType = 'info' | 'success' | 'warning' | 'error' | 'question'

export type ModalConfig = {
  type: ModalType
  title: string
  text?: string
  html?: string
  confirmButtonText?: string
  cancelButtonText?: string
  showCancelButton?: boolean
  allowOutsideClick?: boolean
  allowEscapeKey?: boolean
  timer?: number
  timerProgressBar?: boolean
  confirmButtonColor?: string
  cancelButtonColor?: string
  customClass?: {
    popup?: string
    title?: string
    content?: string
    confirmButton?: string
    cancelButton?: string
  }
}

export type ModalResult = {
  isConfirmed: boolean
  isDenied: boolean
  isDismissed: boolean
  value?: unknown
}

export type ModalProps = {
  config: ModalConfig
  onConfirm?: (result: ModalResult) => void
  onCancel?: () => void
  onDismiss?: () => void
}

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'input-with-action'

export type ActionButtonResult = {
  success: boolean
  message: string
}

export type FormFieldActionButton = {
  icon: string
  title: string
  onClick: () => Promise<void | boolean | ActionButtonResult> | void | boolean | ActionButtonResult
  loadingIcon?: string
}

export type FormField = {
  id: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  value?: string
  options?: string[]
  validation?: (value: string) => string | null
  actionButton?: FormFieldActionButton
  inputClass?: string
  helperText?: string
}

export type FormConfig = {
  title: string
  fields: FormField[]
  confirmButtonText?: string
  cancelButtonText?: string
  loading?: boolean
}

export type FormResult = {
  isConfirmed: boolean
  isDenied: boolean
  isDismissed: boolean
  values?: Record<string, string>
}

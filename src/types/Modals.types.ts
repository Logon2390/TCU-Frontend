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

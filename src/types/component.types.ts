export type LabelProps = {
  id: string
  label?: string
  icon?: string
  for?: string
}

export type InputProps = {
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  icon?: string
}

export type ButtonProps = {
  variant: 'primary' | 'secondary' | 'danger'
  text: string
  icon?: string
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export type ErrorProps = {
  onError: boolean
  message?: string
}

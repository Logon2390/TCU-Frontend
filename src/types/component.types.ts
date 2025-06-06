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

export type ErrorProps = {
  onError: boolean
  message?: string
}

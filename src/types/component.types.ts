import type { ChartType } from 'chart.js'

export type LoaderProps = {
  message?: string
}

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

export type SelectProps = Omit<InputProps, 'type'> & {
  options: string[]
  onChange?: (event: Event) => void
}

export type ButtonProps = {
  variant: 'primary' | 'secondary' | 'danger' | 'custom'
  text: string
  icon?: string
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export type ChartProps = {
  type: ChartType
  data: any
  options?: any
  width?: number
  height?: number
  responsive?: boolean
}

export type PaginationProps = {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  showPageNumbers?: boolean
  showItemsPerPageSelector?: boolean
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export type ErrorProps = {
  onError: boolean
  message?: string
}

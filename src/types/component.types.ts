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
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event?: Event) => void
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

export type TableColumn = {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any) => string
}

export type PaginationConfig = {
  enabled: boolean
  itemsPerPage?: number
  showPageNumbers?: boolean
  showItemsPerPageSelector?: boolean
  pageSizeOptions?: number[]
}

export type TableProps = {
  columns: TableColumn[]
  data: Record<string, any>[]
  loading?: boolean
  responsive?: boolean
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  pagination?: PaginationConfig
  emptyMessage?: string
  onRowClick?: (row: Record<string, any>) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
}

export type StepperStep = {
  id: number
  title: string
  isCompleted: boolean
  isActive: boolean
}

export type StepperProps = {
  title: string
  currentStep: number
  steps: StepperStep[]
}

export type ErrorProps = {
  onError: boolean
  message?: string
}

export type AppCardProps = {
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  clickable?: boolean
  hover?: boolean
}

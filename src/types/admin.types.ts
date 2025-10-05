export type Admin = {
  id?: number
  name: string
  email: string
  role: 'M' | 'A'
  code?: string
  createdAt?: string
  updatedAt?: string
}

export const ROLE_OPTIONS = [
  {
    label: 'Admin',
    value: 'A',
    description: 'Acceso a funciones del sistema'
  },
  {
    label: 'Master',
    value: 'M',
    description: 'Acceso completo incluyendo gestión de administradores'
  }
] as const

export type RoleOption = (typeof ROLE_OPTIONS)[number]

import type { User } from './user.types'

export const GENDER_OPTIONS = [
  {
    label: 'Femenino',
    value: 'F',
  },
  {
    label: 'Masculino',
    value: 'M',
  },
  {
    label: 'Otro',
    value: 'O',
  },
] as const

export type Registration = {
  user: User
  date: Date
  moduleId: number
}

export type GenderOption = (typeof GENDER_OPTIONS)[number]
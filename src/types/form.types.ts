export const GENDER_OPTIONS = [
  { id: 'F', name: 'Femenino' },
  { id: 'M', name: 'Masculino' },
  { id: 'O', name: 'Otro' },
] as const
export const VISIT_PURPOSES = [
  { id: 1, name: 'Biblioteca' },
  { id: 2, name: 'Teatro' },
  { id: 3, name: 'Otro' },
] as const

export type GenderOption = (typeof GENDER_OPTIONS)[number]

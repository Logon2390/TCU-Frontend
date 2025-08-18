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
export type GenderOption = (typeof GENDER_OPTIONS)[number]

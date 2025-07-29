export const GENDER_OPTIONS = ['Femenino', 'Masculino', 'Otro'] as const
export const VISIT_PURPOSES = ['Biblioteca', 'Teatro', 'Otro'] as const

export type GenderOption = (typeof GENDER_OPTIONS)[number]
export type VisitPurpose = (typeof VISIT_PURPOSES)[number]

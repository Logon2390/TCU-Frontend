export type User = {
  document: string
  name: string
  birthDate: string
  gender: '' | 'F' | 'M' | 'O'
}

export type Registration = {
  user: User
  date: string
  moduleId: number | ''
}

export type User = {
  document: string
  name: string
  birthDate: string
  gender: string
}

export type Registration = {
  user: User
  date: string
  module: string
}

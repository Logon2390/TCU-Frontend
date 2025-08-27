export type StatsPeriod = 'today' | 'month' | 'year'

export type GenderDistribution = {
  F: number
  M: number
  O: number
}

export type AgeRangeDistribution = {
  infancia: number
  juventud: number
  adultez_joven: number
  adultez_media: number
  vejez: number
}

export type VisitByDate = {
  date: string
  count: number
}

export type TopUser = {
  userId: number
  userName: string
  visitCount: number
}

export type TopModule = {
  name: string
  visitCount: number
}

export type Statistic = {
  totalVisits: number
  totalUsers: number
  genderDistribution: GenderDistribution
  ageRangeDistribution: AgeRangeDistribution
  averageAge: number
  visitsByDate: VisitByDate[]
  topUsers: TopUser[]
  topModules: TopModule[]
}
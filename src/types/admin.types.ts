export type GenderId = 'F' | 'M' | 'O'

export type DateRange = {
  start: string // ISO date: YYYY-MM-DD
  end: string // ISO date: YYYY-MM-DD
}

export type VisitRecord = {
  id: string
  date: string // ISO date
  age: number
  gender: GenderId
}

export type AgeBandId = '0-14' | '15-24' | '25-44' | '45-64' | '65+'

export type AgeBand = {
  id: AgeBandId
  name: string
  min: number
  max: number | null
}

export const AGE_BANDS: AgeBand[] = [
  { id: '0-14', name: 'Infancia (0-14)', min: 0, max: 14 },
  { id: '15-24', name: 'Juventud (15-24)', min: 15, max: 24 },
  { id: '25-44', name: 'Adultez joven (25-44)', min: 25, max: 44 },
  { id: '45-64', name: 'Adultez media (45-64)', min: 45, max: 64 },
  { id: '65+', name: 'Vejez (65+)', min: 65, max: null },
]

export type StatsQuery = {
  range: DateRange
  gender?: '' | GenderId
  exactAge?: number | null
  ageBandId?: '' | AgeBandId
}

export type GenderStats = {
  F: number
  M: number
  O: number
}

export type AgeBandStats = Record<AgeBandId, number>

export type TimeSeriesPoint = {
  date: string
  count: number
}

export type StatsResult = {
  gender: GenderStats
  ageBands: AgeBandStats
  timeSeries: TimeSeriesPoint[]
  total: number
}

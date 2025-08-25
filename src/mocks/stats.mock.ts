import {
  AGE_BANDS,
  type VisitRecord,
  type GenderId,
  type DateRange,
  type AgeBandId,
  type StatsQuery,
  type StatsResult,
  type GenderStats,
  type AgeBandStats,
} from '@/types/admin.types'

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const generateMockVisits = (range: DateRange, count = 500): VisitRecord[] => {
  const start = new Date(range.start)
  const end = new Date(range.end)
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

  const genders: GenderId[] = ['F', 'M', 'O']

  const records: VisitRecord[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + random(0, days))
    const age = random(5, 85)
    const gender = genders[random(0, genders.length - 1)]
    records.push({ id: `v_${i}`, date: d.toISOString().slice(0, 10), age, gender })
  }
  return records
}

export const filterRecords = (records: VisitRecord[], query: StatsQuery): VisitRecord[] => {
  const start = new Date(query.range.start).getTime()
  const end = new Date(query.range.end).getTime()

  return records.filter((r) => {
    const t = new Date(r.date).getTime()
    if (t < start || t > end) return false
    if (query.gender && r.gender !== query.gender) return false
    if (typeof query.exactAge === 'number' && query.exactAge >= 0 && r.age !== query.exactAge)
      return false
    if (query.ageBandId) {
      const band = AGE_BANDS.find((b) => b.id === query.ageBandId)
      if (!band) return false
      const belowMax = band.max == null ? true : r.age <= band.max
      if (!(r.age >= band.min && belowMax)) return false
    }
    return true
  })
}

export const aggregateStats = (records: VisitRecord[]): StatsResult => {
  const gender: GenderStats = { F: 0, M: 0, O: 0 }
  const ageBands: AgeBandStats = {
    '0-14': 0,
    '15-24': 0,
    '25-44': 0,
    '45-64': 0,
    '65+': 0,
  }

  const timeMap = new Map<string, number>()

  for (const r of records) {
    gender[r.gender]++
    const band = AGE_BANDS.find((b) => r.age >= b.min && (b.max == null || r.age <= b.max))!
    ageBands[band.id]++
    timeMap.set(r.date, (timeMap.get(r.date) || 0) + 1)
  }

  const timeSeries = Array.from(timeMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }))

  return {
    gender,
    ageBands,
    timeSeries,
    total: records.length,
  }
}

import api from './api'
import type { ApiResponse } from '../types/api.types'
import type { StatsPeriod, Statistic } from '../types/stats.types'


export const statsService = {
  getStatsByPeriod: async (period: StatsPeriod): Promise<ApiResponse<Statistic>> => {
    try {
      const response = await api.get(`/reports/${period}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
}


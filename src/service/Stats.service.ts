import api from './api'
import type { ApiResponse } from '../types/api.types'
import type { StatsPeriod, Statistic, GenerateReportBody } from '../types/stats.types'


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
  getCustomStats: async (params: GenerateReportBody): Promise<ApiResponse<Statistic>> => {
    try {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
        ) as Record<string, string>
      ).toString()
      const response = await api.get(`/reports/custom?${query}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
}


import api from './api'
import type { ApiResponse } from '@/types/api.types'
import type { Module } from '@/types/modules.types'

export const modulesService = {
  getModules: async (): Promise<ApiResponse<Module[]>> => {
    try {
      const response = await api.get<ApiResponse<Module[]>>('/modules')
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: [] }
    }
  },
}

export default modulesService

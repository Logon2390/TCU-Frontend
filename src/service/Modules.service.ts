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


  getPublicModules: async (): Promise<ApiResponse<Module[]>> => {
    try {
      const response = await api.get<ApiResponse<Module[]>>('/modules/public')
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: [] }
    }
  },

  createModule: async (dto: Module): Promise<ApiResponse<Module>> => {
    try {
      const response = await api.post<ApiResponse<Module>>('/modules', dto)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Error al crear el módulo', data: {} as Module }
    }
  },

  getModuleById: async (id: number): Promise<ApiResponse<Module>> => {
    try {
      const response = await api.get<ApiResponse<Module>>(`/modules/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Error al obtener el módulo', data: {} as Module }
    }
  },

  updateModule: async (id: number, dto: Module): Promise<ApiResponse<Module>> => {
    try {
      const response = await api.patch<ApiResponse<Module>>(`/modules/${id}`, dto)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Error al actualizar el módulo', data: {} as Module }
    }
  },

  deleteModule: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/modules/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Error al eliminar el módulo', data: undefined as any }
    }
  },
}

export default modulesService

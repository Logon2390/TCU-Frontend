import api from './api'
import type { Registration } from '../types/form.types'
import type { ApiResponse, PaginatedResponse } from '../types/api.types'

const RECORD_URL = '/records'

export default {
  createRecord: async (record: Registration) => {
    try {
      const response = await api.post(RECORD_URL, record)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },
  
  getRecordsByUser: async (userId: number): Promise<ApiResponse<Registration[]>> => {
    try {
      const response = await api.get<ApiResponse<Registration[]>>(`${RECORD_URL}/records/${userId}`)
      return response.data
    } catch (error) {
      console.error(error)
      return {
        success: false,
        data: [],
        message: 'Error al obtener los registros del usuario',
      }
    }
  },

  getRecordsByUserPaginated: async (userId: number, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<any>>>(`${RECORD_URL}/records/${userId}?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error(error)
      return {
        success: false,
        data: { items: [], meta: { totalItems: 0, itemCount: 0, itemsPerPage: limit, totalPages: 0, currentPage: page } },
        message: 'Error al obtener los registros del usuario',
      }
    }
  },

  getRecordsByModule: async (moduleId: number): Promise<ApiResponse<any[]>> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(`${RECORD_URL}/module/${moduleId}`)
      return response.data
    } catch (error) {
      console.error(error)
      return {
        success: false,
        data: [],
        message: 'Error al obtener los registros del módulo',
      }
    }
  },

  getRecordsByModulePaginated: async (moduleId: number, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<any>>>(`${RECORD_URL}/module/${moduleId}?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error(error)
      return {
        success: false,
        data: { items: [], meta: { totalItems: 0, itemCount: 0, itemsPerPage: limit, totalPages: 0, currentPage: page } },
        message: 'Error al obtener los registros del módulo',
      }
    }
  },
}

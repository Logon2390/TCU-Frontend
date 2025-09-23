import api from './api'
import type { Registration } from '../types/form.types'
import type { ApiResponse } from '../types/api.types'

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
}

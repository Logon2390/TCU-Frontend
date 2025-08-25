import api from './api'
import type { Registration } from '../types/form.types'

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
}

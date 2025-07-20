import api from '../api'
import type { Registration } from '../../types/user.types'

const RECORD_URL = '/records'

export const createRecord = async (record: Registration) => {
  try {
    const response = await api.post(RECORD_URL, record)
    return response.data
  } catch (error) {
    throw error
  }
}

import type { ApiResponse } from '@/types/api.types'
import api from './api'
import type { User } from '@/types/user.types'

export const userService = {
  getUserByDocument: async (document: string) => {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/document/${document}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null }
    }
  },
}

export default userService

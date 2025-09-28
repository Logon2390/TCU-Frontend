import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types'
import api from './api'
import type { User } from '@/types/user.types'

export const userService = {
  getUsers: async (params?: PaginationParams) => {
    try {
      if (params?.page || params?.limit) {
        const page = params.page || 1
        const limit = params.limit || 10
        const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/users?page=${page}&limit=${limit}`)
        return response.data
      } else {
        const response = await api.get<ApiResponse<User[]>>('/users')
        return response.data
      }
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al obtener usuarios' }
    }
  },

  getUsersPaginated: async (page = 1, limit = 10) => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/users?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al obtener usuarios' }
    }
  },

  getUserById: async (id: number) => {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al obtener usuario' }
    }
  },

  getUserByDocument: async (document: string) => {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/document/${document}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Usuario no encontrado' }
    }
  },

  createUser: async (user: Omit<User, 'id' | 'lastRecord'>) => {
    try {
      const userData = { ...user, lastRecord: null }
      const response = await api.post<ApiResponse<User>>('/users', userData)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al crear usuario' }
    }
  },

  updateUser: async (id: number, user: Omit<User, 'id' | 'lastRecord'>) => {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, user)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al actualizar usuario' }
    }
  },

  deleteUser: async (id: number) => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Error al eliminar usuario' }
    }
  },
}

export default userService

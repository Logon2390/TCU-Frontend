import type { ApiResponse } from '@/types/api.types'
import api from './api'
import type { Admin } from '@/types/admin.types'
import axios from 'axios'

export const adminService = {
  getAdmins: async () => {
    try {
      const response = await api.get<ApiResponse<Admin[]>>('/admins')
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al obtener administradores' }
    }
  },

  getAdminById: async (id: number) => {
    try {
      const response = await api.get<ApiResponse<Admin>>(`/admins/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al obtener administrador' }
    }
  },

  createAdmin: async (admin: Admin) => {
    try {
      const response = await api.post<ApiResponse<Admin>>('/admins', admin)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al crear administrador' }
    }
  },

  updateAdmin: async (id: number, admin: Admin) => {
    try {
      const response = await api.put<ApiResponse<Admin>>(`/admins/${id}`, admin)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, data: null, message: 'Error al actualizar administrador' }
    }
  },

  deleteAdmin: async (id: number) => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/admins/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Error al eliminar administrador' }
    }
  },
}

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post(`/admins/requestReset`, { email }, { withCredentials: true })
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Error al solicitar restablecimiento de contraseña')
  }
}

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post(
      `/admins/resetPassword`,
      { token, newPassword },
      { withCredentials: true },
    )
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Error al restablecer contraseña')
  }
}

export default adminService

// src/service/auth/Auth.service.ts
import api from './api'
import { AxiosError } from 'axios'

const AUTH_URL = '/admins'

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`${AUTH_URL}/login`, { email, password })
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Error en login')
  }
}

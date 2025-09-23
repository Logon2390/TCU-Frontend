import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useModal } from '@/composables/useModal'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'token') {
      return decodeURIComponent(value)
    }
  }
  return null
}

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth().logout()
      useRouter().push('/')
      useModal().showToast('error', 'Sesión expirada, por favor inicie sesión nuevamente')
    }
    return Promise.reject(error)
  },
)

export default api

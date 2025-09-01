import api from './api'

const AUTH_URL = '/admins'

export default {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post(`${AUTH_URL}/login`, { email, password })
      const data = response.data
      return data
    } catch (error) {
      console.error(error)
    }
  },
  logout: async () => {
    try {
      const response = await api.get(`${AUTH_URL}/logout`)
      const data = response.data
      return data
    } catch (error) {
      console.error(error)
    }
  },
  verifyCode: async (email: string, accessCode: string) => {
    try {
      const response = await api.post(`${AUTH_URL}/verifyAccessCode`, { email, accessCode })
      const data = response.data
      return data
    } catch (error) {
      console.error(error)
    }
  },
}

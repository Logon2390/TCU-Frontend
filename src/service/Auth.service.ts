import api from './api'

const AUTH_URL = '/admins'

export default {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post(`${AUTH_URL}/login`, { email, password })
      return response.data
    } catch (error) {
      console.error(error)
    }
  },
}

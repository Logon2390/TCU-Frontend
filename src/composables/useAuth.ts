import { ref, computed } from 'vue'
import AuthService from '@/service/Auth.service'

const user = ref<any>(null)

const initializeAuth = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (error) {
      console.error('Error parsing stored user data:', error)
      localStorage.removeItem('user')
    }
  }
}

initializeAuth()

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value)

  const login = (userData: any) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    AuthService.logout()
    user.value = null
    localStorage.removeItem('user')
  }

  const getUser = () => user.value

  return {
    isAuthenticated,
    user: computed(() => user.value),
    login,
    logout,
    getUser
  }
}

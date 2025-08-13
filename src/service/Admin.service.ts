import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/admins/requestReset`,
      { email },
      { withCredentials: true },
    )
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
    const response = await axios.post(
      `${API_URL}/admins/resetPassword`,
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

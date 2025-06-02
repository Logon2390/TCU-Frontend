// src/service/auth/Auth.service.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/admins/login`,
      { email, password },
      { withCredentials: true } //necesario para que la cookie se guarde
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error en login');
  }
};
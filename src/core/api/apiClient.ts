import axios, { type AxiosInstance } from 'axios';
import { AuthService } from '@/core/auth/services/auth.service';

export function createAxiosClient(baseUrl: string): AxiosInstance {
  const apiClient = axios.create({
    baseURL: baseUrl
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = AuthService.getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return apiClient;
}

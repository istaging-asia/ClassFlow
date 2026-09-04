import { apiClient } from './client';
import type { ApiResponse, TokenResponse, User } from '../types/api';

export interface LoginParams {
  login_id: string;
  password: string;
}

export const authApi = {
  login: async (params: LoginParams): Promise<TokenResponse> => {
    const res = await apiClient.post<ApiResponse<TokenResponse>>('/auth/login', params);
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('classflow_access_token');
      localStorage.removeItem('classflow_user');
    }
  },
};

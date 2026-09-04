import { apiClient } from './client';
import type { ApiResponse, User } from '../types/api';

export interface ProfileUpdateParams {
  phone?: string | null;
  intro?: string | null;
}

export interface InstructorCreateParams {
  login_id: string;
  password: string;
  name: string;
  dept?: string | null;
  phone?: string | null;
  role: 'ADMIN' | 'INSTRUCTOR';
  color?: string | null;
}

export interface InstructorUpdateParams {
  name?: string;
  dept?: string | null;
  phone?: string | null;
  intro?: string | null;
  color?: string | null;
  role?: 'ADMIN' | 'INSTRUCTOR';
  is_active?: boolean;
}

export const usersApi = {
  getInstructors: async (search?: string): Promise<User[]> => {
    const params = search ? { search } : {};
    const res = await apiClient.get<ApiResponse<User[]>>('/instructors', { params });
    return res.data.data;
  },

  updateMyProfile: async (params: ProfileUpdateParams): Promise<User> => {
    const res = await apiClient.put<ApiResponse<User>>('/users/me', params);
    return res.data.data;
  },

  createInstructor: async (params: InstructorCreateParams): Promise<User> => {
    const res = await apiClient.post<ApiResponse<User>>('/admin/instructors', params);
    return res.data.data;
  },

  updateInstructor: async (id: number, params: InstructorUpdateParams): Promise<User> => {
    const res = await apiClient.put<ApiResponse<User>>(`/admin/instructors/${id}`, params);
    return res.data.data;
  },

  deleteInstructor: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<{ id: number; deleted: boolean }>>(`/admin/instructors/${id}`);
  },
};

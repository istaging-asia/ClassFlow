import { apiClient } from './client';
import type { ApiResponse, Course } from '../types/api';

export interface CourseCreateParams {
  name: string;
  description?: string | null;
  color?: string | null;
  thumbnail_url?: string | null;
}

export interface CourseUpdateParams {
  name?: string;
  description?: string | null;
  color?: string | null;
  thumbnail_url?: string | null;
  is_active?: boolean;
}

export const coursesApi = {
  getCourses: async (search?: string): Promise<Course[]> => {
    const params = search ? { search } : {};
    const res = await apiClient.get<ApiResponse<Course[]>>('/courses', { params });
    return res.data.data;
  },

  getCourseDetail: async (id: number): Promise<Course> => {
    const res = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`);
    return res.data.data;
  },

  createCourse: async (params: CourseCreateParams): Promise<Course> => {
    const res = await apiClient.post<ApiResponse<Course>>('/admin/courses', params);
    return res.data.data;
  },

  updateCourse: async (id: number, params: CourseUpdateParams): Promise<Course> => {
    const res = await apiClient.put<ApiResponse<Course>>(`/admin/courses/${id}`, params);
    return res.data.data;
  },

  deleteCourse: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<{ id: number; deleted: boolean }>>(`/admin/courses/${id}`);
  },
};

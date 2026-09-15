import { apiClient } from './client';
import type { ApiResponse, Course } from '../types/api';

export interface CourseCreateParams {
  name: string;
  description?: string | null;
  color?: string | null;
  thumbnail_url?: string | null;
  student_count?: number;
}

export interface CourseUpdateParams {
  name?: string;
  description?: string | null;
  color?: string | null;
  thumbnail_url?: string | null;
  student_count?: number;
  is_active?: boolean;
}

export const coursesApi = {
  getCourses: async (search?: string): Promise<Course[]> => {
    const params = search ? { search } : {};
    const res = await apiClient.get<ApiResponse<Course[]>>('/courses', { params });
    return res.data.data;
  },

  /* ADMIN 페이지
  1. 특정 강사에게 할당된 과정 목록 조회 GET
  2. 특정 강사에게 과정 할당 PUT
  */
  getInstructorCourses: async (instructor_id: number): Promise<Course[]> => {
    const res = await apiClient.get<ApiResponse<Course[]>>(
      `/admin/instructors/${instructor_id}/courses`,
    );
    return res.data.data;
  },

  assignInstructorCourses: async (
    instructor_id: number,
    course_ids: number[],
  ): Promise<Course[]> => {
    const res = await apiClient.put<ApiResponse<Course[]>>(
      `/admin/instructors/${instructor_id}/courses`,
      { course_ids: course_ids },
    );
    return res.data.data;
  },

  // 강사 본인이 할당된 과정 목록 조회 GET
  getMyCourses: async (): Promise<Course[]> => {
    const res = await apiClient.get<ApiResponse<Course[]>>('/courses/my');
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

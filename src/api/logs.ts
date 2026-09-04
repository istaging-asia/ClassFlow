import { apiClient } from './client';
import type { ApiResponse, LectureLog, PaginatedResponse } from '../types/api';

export interface LogCreateParams {
  date: string; // YYYY-MM-DD
  course_id?: number | null;
  course_name: string;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  student_count: number;
  content: string;
}

export interface LogUpdateParams {
  date?: string;
  course_id?: number | null;
  course_name?: string;
  start_time?: string;
  end_time?: string;
  student_count?: number;
  content?: string;
}

export interface MyLogsFilterParams {
  year?: number;
  month?: number;
  start_date?: string;
  end_date?: string;
}

export interface AdminLogsFilterParams {
  start_date?: string;
  end_date?: string;
  instructor_id?: number;
  course_id?: number;
  page?: number;
  limit?: number;
}

export const logsApi = {
  getMyLogs: async (params?: MyLogsFilterParams): Promise<LectureLog[]> => {
    const res = await apiClient.get<ApiResponse<LectureLog[]>>('/logs/my', { params });
    return res.data.data;
  },

  createLog: async (params: LogCreateParams): Promise<LectureLog> => {
    const res = await apiClient.post<ApiResponse<LectureLog>>('/logs', params);
    return res.data.data;
  },

  getLogDetail: async (id: number): Promise<LectureLog> => {
    const res = await apiClient.get<ApiResponse<LectureLog>>(`/logs/${id}`);
    return res.data.data;
  },

  updateLog: async (id: number, params: LogUpdateParams): Promise<LectureLog> => {
    const res = await apiClient.put<ApiResponse<LectureLog>>(`/logs/${id}`, params);
    return res.data.data;
  },

  deleteLog: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<{ id: number; deleted: boolean }>>(`/logs/${id}`);
  },

  adminSearchLogs: async (params?: AdminLogsFilterParams): Promise<PaginatedResponse<LectureLog>> => {
    const res = await apiClient.get<PaginatedResponse<LectureLog>>('/admin/logs', { params });
    return res.data;
  },

  exportAdminLogs: async (params?: Omit<AdminLogsFilterParams, 'page' | 'limit'>): Promise<void> => {
    const res = await apiClient.get('/admin/logs/export', {
      params,
      responseType: 'blob',
    });
    
    // 파일 다운로드 브라우저 트리거
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const nowStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.setAttribute('download', `classflow_logs_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

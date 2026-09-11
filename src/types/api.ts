export type UserRole = 'ADMIN' | 'INSTRUCTOR';

export interface User {
  id: number;
  login_id: string;
  name: string;
  dept?: string | null;
  phone?: string | null;
  intro?: string | null;
  avatar_url?: string | null;
  color: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  name: string;
  description?: string | null;
  thumbnail_url?: string | null;
  color: string;
  student_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LectureLog {
  id: number;
  instructor_id: number;
  instructor_name?: string | null;
  course_id?: number | null;
  course_name: string;
  date: string; // YYYY-MM-DD
  total_hours: number; // 총 수업 시간 (시간 단위)
  student_count: number;
  content: string;
  start_time?: string | null; // 레거시 호환
  end_time?: string | null;   // 레거시 호환
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string }>;
  };
}

export interface PaginationMeta {
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

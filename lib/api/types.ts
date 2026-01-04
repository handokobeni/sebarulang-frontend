/**
 * API Response Types
 * Standard response format from backend
 */

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


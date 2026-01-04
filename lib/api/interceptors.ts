/**
 * API Interceptors
 * Handles token refresh, error handling, and retry logic
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import apiClient from "./client";
import { env } from "@/lib/env";
import { useAuthStore } from "@/lib/auth/store";

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response) => {
    // Success response - just return it
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request jika sedang refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry original request (cookies sudah di-update oleh refresh)
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token (refresh_token diambil dari httpOnly cookie otomatis)
        // No body needed - refresh_token di cookie
        await axios.post(`${env.apiUrl}/auth/refresh`, {}, {
          withCredentials: true, // Include cookies
        });

        // Backend akan:
        // 1. Validate refresh_token dari cookie
        // 2. Generate access_token baru (5 menit)
        // 3. Generate refresh_token baru (preserve sisa waktu expired)
        // 4. Set kedua cookies (access_token dan refresh_token) di httpOnly cookies

        // Cookies sudah di-update oleh backend (access_token dan refresh_token baru)
        processQueue(null);

        // Retry original request (cookies sudah di-update)
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // ✅ Best Practice: Better handling untuk refresh token expired
        const errorData = (refreshError as AxiosError<{ error?: { message?: string; details?: { reason?: string } } }>).response?.data;
        const errorMessage = errorData?.error?.message || "Session expired";

        // Clear user state (Zustand store)
        useAuthStore.getState().logout();

        // Clear any local storage/session storage
        if (typeof window !== "undefined") {
          sessionStorage.clear();
          // Cookies akan di-clear oleh backend
        }

        // Show user-friendly message (toast will be added later)
        if (env.isDevelopment) {
          console.error("Session expired:", errorMessage);
        }

        // Redirect to login dengan return URL
        if (typeof window !== "undefined") {
          const returnUrl = encodeURIComponent(
            window.location.pathname + window.location.search
          );
          window.location.href = `/login?redirect=${returnUrl}&reason=session_expired`;
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (env.isDevelopment) {
      console.error("[API Error]", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// Export configured client
export { apiClient };


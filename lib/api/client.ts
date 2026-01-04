/**
 * API Client
 * Axios instance configured for httpOnly cookies authentication
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "@/lib/env";

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true, // CRITICAL: Include httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for logging (development only)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (env.isDevelopment) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor will be added in interceptors.ts
// This is to avoid circular dependencies

export default apiClient;


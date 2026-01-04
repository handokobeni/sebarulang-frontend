/**
 * API Module Index
 * Exports API client and ensures interceptors are initialized
 */

// Import interceptors to ensure they're set up
import "./interceptors";

// Export API client
export { default as apiClient } from "./client";
export type { ApiResponse, ApiError, PaginatedResponse } from "./types";


/**
 * Test Helpers
 * Utility functions for testing
 */

/**
 * Mock API response helper
 */
export function createMockResponse<T>(data: T, status = 200) {
  return {
    data: {
      data,
    },
    status,
    statusText: "OK",
    headers: {},
    config: {},
  };
}

/**
 * Mock API error response
 */
export function createMockErrorResponse(
  message: string,
  status = 400,
  code?: string
) {
  return {
    response: {
      data: {
        error: {
          message,
          code,
        },
      },
      status,
      statusText: "Bad Request",
      headers: {},
    },
    config: {},
    message,
  };
}


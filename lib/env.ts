/**
 * Environment variable validation
 * Ensures all required environment variables are present
 * Provides defaults for development
 */

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Get API URL with fallback for development
const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    if (isDevelopment) {
      // Provide default for development
      console.warn(
        "⚠️  NEXT_PUBLIC_API_URL not set. Using default: http://localhost:8080"
      );
      return "http://localhost:8080";
    }
    // Throw error in production
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_API_URL. Please check your .env.local file."
    );
  }
  
  return apiUrl;
};

// Type-safe environment variables
export const env = {
  // Required (with default for development)
  apiUrl: getApiUrl(),
  
  // Optional
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    serverDsn: process.env.SENTRY_DSN,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  isDevelopment,
  isProduction,
} as const;


/**
 * Application Constants
 * Centralized constants for consistent usage across the app
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
    VERIFY_EMAIL: "/api/auth/verify-email",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  USERS: {
    PROFILE: "/api/users/profile",
    UPDATE_PROFILE: "/api/users/update-profile",
    UPDATE_PREFERENCES: "/api/users/update-preferences",
  },
  FITNESS: {
    WORKOUTS: "/api/fitness/workouts",
    PROGRESS: "/api/fitness/progress",
    EXERCISES: "/api/fitness/exercises",
  },
  CHAT: {
    AI_COACH: "/api/chat/ai-coach",
  },
} as const;

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
} as const;

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",
  AUTH_USER_ALREADY_EXISTS: "AUTH_USER_ALREADY_EXISTS",
  AUTH_PASSWORD_RESET_EXPIRED: "AUTH_PASSWORD_RESET_EXPIRED",
  AUTH_INVALID_TOKEN: "AUTH_INVALID_TOKEN",
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  INVALID_INPUT: "INVALID_INPUT",

  // Database
  DB_ERROR: "DB_ERROR",
  DB_CONFLICT: "DB_CONFLICT",
  DB_NOT_FOUND: "DB_NOT_FOUND",

  // Server
  SERVER_ERROR: "SERVER_ERROR",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// FITNESS CONSTANTS
// ============================================================================

export const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export const TRAINING_GOALS = [
  "Build Muscle",
  "Lose Fat",
  "Improve Strength",
  "Increase Endurance",
  "Maintain Fitness",
  "Improve Flexibility",
] as const;

export const TRAINING_EXPERIENCE = ["beginner", "intermediate", "advanced"] as const;

export const AVAILABLE_EQUIPMENT = ["home", "gym", "both"] as const;

export const DEFAULT_TRAINING_DAYS = 4;
export const MIN_TRAINING_DAYS = 1;
export const MAX_TRAINING_DAYS = 6;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  ENABLE_AI_COACH: process.env.NEXT_PUBLIC_ENABLE_AI_COACH === "true",
  ENABLE_SOCIAL_FEATURES: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_FEATURES === "true",
  ENABLE_SUBSCRIPTIONS: process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS === "true",
} as const;

// ============================================================================
// CACHE DURATIONS (in seconds)
// ============================================================================

export const CACHE_DURATIONS = {
  USER_PROFILE: 300, // 5 minutes
  EXERCISES: 3600, // 1 hour
  WORKOUTS: 600, // 10 minutes
  PROGRESS: 300, // 5 minutes
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const;

// ============================================================================
// TIME CONSTANTS
// ============================================================================

export const TIME = {
  MILLISECONDS_PER_SECOND: 1000,
  MILLISECONDS_PER_MINUTE: 60 * 1000,
  MILLISECONDS_PER_HOUR: 60 * 60 * 1000,
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
  PASSWORD_RESET_TOKEN_EXPIRY_MINUTES: 60,
  EMAIL_VERIFICATION_TOKEN_EXPIRY_MINUTES: 60,
} as const;

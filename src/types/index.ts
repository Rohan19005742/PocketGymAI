/**
 * Core Type Definitions
 * Central hub for all shared types across the application
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  fitnessLevel: string;
  goal: string;
  onboardingComplete: boolean;
  completedWorkouts: number;
  streakDays: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload extends AuthCredentials {
  name: string;
}

export interface AuthResponse {
  success: boolean;
  data?: AuthUser;
  error?: string;
}

export type FitnessLevel = "Beginner" | "Intermediate" | "Advanced";
export type TrainingExperience = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  fitnessLevel: FitnessLevel;
  goal: string;
  trainingExperience: TrainingExperience | null;
  onboardingComplete: boolean;
  preferredTrainingDays: number | null;
  exercisePreferences: string[] | null;
  dietaryPreferences: string[] | null;
  availableEquipment: string | null;
  completedWorkouts: number;
  streakDays: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FITNESS & WORKOUT TYPES
// ============================================================================

export interface WorkoutProgress {
  id: string;
  userId: string;
  workoutName: string;
  date: Date;
  duration: number; // in minutes
  calories: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightProgress {
  id: string;
  userId: string;
  weight: number;
  date: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressQueryParams {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
}

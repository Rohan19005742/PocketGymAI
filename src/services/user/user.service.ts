/**
 * User Service
 * User profile management, preferences, and tracking
 */

import { prisma } from "@/lib/prisma";
import { UserProfile, ProgressQueryParams, WorkoutProgress, WeightProgress } from "@/src/types";
import { NotFoundError, ValidationError } from "@/src/utils/errors";
import { FITNESS_LEVELS, TRAINING_EXPERIENCE, AVAILABLE_EQUIPMENT } from "@/src/constants";

// ============================================================================
// USER PROFILE SERVICE
// ============================================================================

export class UserService {
  /**
   * Get complete user profile
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return this.mapToUserProfile(user);
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<{
      name: string;
      age: number;
      weight: number;
      height: number;
      fitnessLevel: string;
      goal: string;
      trainingExperience: string;
    }>
  ): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const updateData: Record<string, unknown> = {};

    if (updates.name) {
      updateData.name = updates.name;
    }
    if (updates.age !== undefined) {
      updateData.age = updates.age;
    }
    if (updates.weight !== undefined) {
      updateData.weight = updates.weight;
    }
    if (updates.height !== undefined) {
      updateData.height = updates.height;
    }
    if (updates.fitnessLevel) {
      if (!FITNESS_LEVELS.includes(updates.fitnessLevel as any)) {
        throw new ValidationError(`Invalid fitness level: ${updates.fitnessLevel}`);
      }
      updateData.fitnessLevel = updates.fitnessLevel;
    }
    if (updates.goal) {
      updateData.goal = updates.goal;
    }
    if (updates.trainingExperience) {
      if (!TRAINING_EXPERIENCE.includes(updates.trainingExperience as any)) {
        throw new ValidationError(`Invalid training experience: ${updates.trainingExperience}`);
      }
      updateData.trainingExperience = updates.trainingExperience;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.mapToUserProfile(updatedUser);
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(
    userId: string,
    preferences: {
      preferredTrainingDays?: number;
      exercisePreferences?: string[];
      dietaryPreferences?: string[];
      availableEquipment?: string;
    }
  ): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const updateData: Record<string, unknown> = {};

    if (preferences.preferredTrainingDays !== undefined) {
      if (preferences.preferredTrainingDays < 1 || preferences.preferredTrainingDays > 6) {
        throw new ValidationError("Preferred training days must be between 1 and 6");
      }
      updateData.preferredTrainingDays = preferences.preferredTrainingDays;
    }

    if (preferences.exercisePreferences) {
      updateData.exercisePreferences = JSON.stringify(preferences.exercisePreferences);
    }

    if (preferences.dietaryPreferences) {
      updateData.dietaryPreferences = JSON.stringify(preferences.dietaryPreferences);
    }

    if (preferences.availableEquipment) {
      if (!AVAILABLE_EQUIPMENT.includes(preferences.availableEquipment as any)) {
        throw new ValidationError(`Invalid equipment: ${preferences.availableEquipment}`);
      }
      updateData.availableEquipment = preferences.availableEquipment;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.mapToUserProfile(updatedUser);
  }

  /**
   * Complete onboarding
   */
  static async completeOnboarding(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { onboardingComplete: true },
    });

    return this.mapToUserProfile(updatedUser);
  }

  /**
   * Get workout progress
   */
  static async getWorkoutProgress(params: ProgressQueryParams): Promise<WorkoutProgress[]> {
    const { userId, startDate, endDate, limit = 50 } = params;

    const where: Record<string, unknown> = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        (where.date as Record<string, unknown>).gte = startDate;
      }
      if (endDate) {
        (where.date as Record<string, unknown>).lte = endDate;
      }
    }

    const progress = await prisma.workoutProgress.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit,
    });

    return progress.map(p => ({
      id: p.id,
      userId: p.userId,
      workoutName: p.workoutName,
      date: p.date,
      duration: p.duration,
      calories: p.calories,
      notes: p.notes,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  /**
   * Add workout progress entry
   */
  static async addWorkoutProgress(
    userId: string,
    data: {
      workoutName: string;
      duration: number;
      calories?: number;
      notes?: string;
    }
  ): Promise<WorkoutProgress> {
    const workoutProgress = await prisma.workoutProgress.create({
      data: {
        userId,
        workoutName: data.workoutName,
        duration: data.duration,
        calories: data.calories,
        notes: data.notes,
      },
    });

    return this.mapToWorkoutProgress(workoutProgress);
  }

  /**
   * Get weight progress
   */
  static async getWeightProgress(params: ProgressQueryParams): Promise<WeightProgress[]> {
    const { userId, startDate, endDate, limit = 50 } = params;

    const where: Record<string, unknown> = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        (where.date as Record<string, unknown>).gte = startDate;
      }
      if (endDate) {
        (where.date as Record<string, unknown>).lte = endDate;
      }
    }

    const progress = await prisma.weightProgress.findMany({
      where,
      orderBy: { date: "asc" },
      take: limit,
    });

    return progress.map(p => ({
      id: p.id,
      userId: p.userId,
      weight: p.weight,
      date: p.date,
      notes: p.notes,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  /**
   * Add weight progress entry
   */
  static async addWeightProgress(
    userId: string,
    data: { weight: number; notes?: string }
  ): Promise<WeightProgress> {
    const weightProgress = await prisma.weightProgress.create({
      data: {
        userId,
        weight: data.weight,
        notes: data.notes,
      },
    });

    return this.mapToWeightProgress(weightProgress);
  }

  /**
   * Increment workout completion counter
   */
  static async incrementWorkoutCount(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        completedWorkouts: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Update streak days
   */
  static async updateStreakDays(userId: string, days: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { streakDays: days },
    });
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  private static mapToUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      weight: user.weight,
      height: user.height,
      fitnessLevel: user.fitnessLevel,
      goal: user.goal,
      trainingExperience: user.trainingExperience,
      onboardingComplete: user.onboardingComplete,
      preferredTrainingDays: user.preferredTrainingDays,
      exercisePreferences: user.exercisePreferences ? JSON.parse(user.exercisePreferences) : null,
      dietaryPreferences: user.dietaryPreferences ? JSON.parse(user.dietaryPreferences) : null,
      availableEquipment: user.availableEquipment,
      completedWorkouts: user.completedWorkouts,
      streakDays: user.streakDays,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private static mapToWorkoutProgress(progress: any): WorkoutProgress {
    return {
      id: progress.id,
      userId: progress.userId,
      workoutName: progress.workoutName,
      date: progress.date,
      duration: progress.duration,
      calories: progress.calories,
      notes: progress.notes,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  private static mapToWeightProgress(progress: any): WeightProgress {
    return {
      id: progress.id,
      userId: progress.userId,
      weight: progress.weight,
      date: progress.date,
      notes: progress.notes,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }
}

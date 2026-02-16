/**
 * Authentication Service
 * Core authentication logic including login, signup, and password management
 */

import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AuthUser, AuthCredentials, SignUpPayload } from "@/src/types";
import {
  ValidationError,
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "@/src/utils/errors";
import { sanitizeEmail } from "@/src/utils/validation";
import { securityConfig, TIME } from "@/src/config";

// ============================================================================
// CORE AUTHENTICATION SERVICE
// ============================================================================

export class AuthenticationService {
  /**
   * Authenticate user with email and password
   */
  static async login(credentials: AuthCredentials): Promise<AuthUser> {
    const { email, password } = credentials;

    const sanitizedEmail = sanitizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user || !user.password) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    return this.mapToAuthUser(user);
  }

  /**
   * Register a new user
   */
  static async signup(payload: SignUpPayload): Promise<AuthUser> {
    const { email, password, name } = payload;

    const sanitizedEmail = sanitizeEmail(email);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      throw new ConflictError("An account with this email already exists");
    }

    // Hash password
    const hashedPassword = await hash(password, securityConfig.bcryptRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        name,
        password: hashedPassword,
      },
    });

    return this.mapToAuthUser(user);
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<string> {
    const sanitizedEmail = sanitizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    // Generate reset token
    const resetToken = this.generateToken();
    const resetTokenExpiry = new Date(
      Date.now() + TIME.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES * TIME.MILLISECONDS_PER_MINUTE
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    return resetToken;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      throw new NotFoundError("Reset token");
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new ValidationError("Reset token has expired");
    }

    const hashedPassword = await hash(newPassword, securityConfig.bcryptRounds);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return this.mapToAuthUser(updatedUser);
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new NotFoundError("User");
    }

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError("Current password is incorrect");
    }

    const hashedPassword = await hash(newPassword, securityConfig.bcryptRounds);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return this.mapToAuthUser(updatedUser);
  }

  /**
   * Verify password
   */
  static async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return false;
    }

    return compare(password, user.password);
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user ? this.mapToAuthUser(user) : null;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<AuthUser | null> {
    const sanitizedEmail = sanitizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    return user ? this.mapToAuthUser(user) : null;
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  /**
   * Map Prisma user to AuthUser
   */
  private static mapToAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      fitnessLevel: user.fitnessLevel,
      goal: user.goal,
      onboardingComplete: user.onboardingComplete,
      completedWorkouts: user.completedWorkouts,
      streakDays: user.streakDays,
    };
  }

  /**
   * Generate random token
   */
  private static generateToken(): string {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }
}

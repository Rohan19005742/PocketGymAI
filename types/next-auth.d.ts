import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: DefaultSession["user"] & {
      id?: string;
      avatar?: string;
      fitnessLevel?: string;
      goal?: string;
      onboardingComplete?: boolean;
      completedWorkouts?: number;
      streakDays?: number;
      subscription?: {
        plan: string;
        status: string;
        currentPeriodEnd?: Date;
        cancelAtPeriodEnd?: boolean;
      };
    };
  }

  interface User {
    id?: string;
    avatar?: string;
    fitnessLevel?: string;
    goal?: string;
    onboardingComplete?: boolean;
    completedWorkouts?: number;
    streakDays?: number;
    subscription?: {
      plan: string;
      status: string;
      currentPeriodEnd?: Date;
      cancelAtPeriodEnd?: boolean;
    };
  }
}

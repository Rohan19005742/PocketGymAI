import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: DefaultSession["user"] & {
      id?: string;
      avatar?: string;
      fitnessLevel?: string;
      goal?: string;
      completedWorkouts?: number;
      streakDays?: number;
    };
  }

  interface User {
    id?: string;
    avatar?: string;
    fitnessLevel?: string;
    goal?: string;
    completedWorkouts?: number;
    streakDays?: number;
  }
}

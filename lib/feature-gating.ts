import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface FeatureGatingResult {
  allowed: boolean;
  plan: string;
  remaining?: number;
  resetTime?: Date;
  error?: string;
}

export async function checkAIMessageLimit(
  email: string
): Promise<FeatureGatingResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
        usageTracking: true,
      },
    });

    if (!user) {
      return {
        allowed: false,
        plan: "FREE",
        error: "User not found",
      };
    }

    const subscription = user.subscription || {
      plan: "FREE",
      status: "active",
    };

    // PRO and PREMIUM have unlimited messages
    if (
      subscription.plan === "PRO" ||
      subscription.plan === "PREMIUM"
    ) {
      return {
        allowed: true,
        plan: subscription.plan,
      };
    }

    // FREE tier: limit to 10 messages per day
    let usageTracking = user.usageTracking;

    if (!usageTracking) {
      usageTracking = await prisma.usageTracking.create({
        data: {
          userId: user.id,
          messagesUsedToday: 0,
          lastResetDate: new Date(),
        },
      });
    }

    // Check if we need to reset
    const lastReset = new Date(usageTracking.lastResetDate);
    const now = new Date();
    const daysSinceReset =
      (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceReset >= 1) {
      // Reset daily counter
      usageTracking = await prisma.usageTracking.update({
        where: { id: usageTracking.id },
        data: {
          messagesUsedToday: 0,
          lastResetDate: now,
        },
      });
    }

    const dailyLimit = 10;
    const remaining = Math.max(0, dailyLimit - usageTracking.messagesUsedToday);

    if (usageTracking.messagesUsedToday >= dailyLimit) {
      return {
        allowed: false,
        plan: "FREE",
        remaining: 0,
        resetTime: new Date(lastReset.getTime() + 24 * 60 * 60 * 1000),
        error: "Daily message limit reached. Upgrade to Pro for unlimited messages.",
      };
    }

    return {
      allowed: true,
      plan: "FREE",
      remaining,
      resetTime: new Date(lastReset.getTime() + 24 * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error("Feature gating error:", error);
    return {
      allowed: false,
      plan: "FREE",
      error: "Failed to check AI message limit",
    };
  }
}

export async function incrementAIMessageCount(
  email: string
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { usageTracking: true },
    });

    if (!user) return;

    let usageTracking = user.usageTracking;

    if (!usageTracking) {
      usageTracking = await prisma.usageTracking.create({
        data: {
          userId: user.id,
          messagesUsedToday: 1,
          lastResetDate: new Date(),
        },
      });
    } else {
      // Check if we need to reset
      const lastReset = new Date(usageTracking.lastResetDate);
      const now = new Date();
      const daysSinceReset =
        (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceReset >= 1) {
        // Reset and set to 1
        await prisma.usageTracking.update({
          where: { id: usageTracking.id },
          data: {
            messagesUsedToday: 1,
            lastResetDate: now,
          },
        });
      } else {
        // Increment
        await prisma.usageTracking.update({
          where: { id: usageTracking.id },
          data: {
            messagesUsedToday: usageTracking.messagesUsedToday + 1,
          },
        });
      }
    }
  } catch (error) {
    console.error("Failed to increment message count:", error);
  }
}

export async function hasFeature(
  email: string,
  feature: "analytics" | "grocery_lists" | "wearable_integration" | "macro_tracking"
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    if (!user) return false;

    const plan = user.subscription?.plan || "FREE";

    const featureMap: Record<string, string[]> = {
      FREE: [],
      PRO: [
        "analytics",
        "grocery_lists",
        "macro_tracking",
      ],
      PREMIUM: [
        "analytics",
        "grocery_lists",
        "macro_tracking",
        "wearable_integration",
      ],
    };

    return featureMap[plan]?.includes(feature) || false;
  } catch (error) {
    console.error("Feature check error:", error);
    return false;
  }
}

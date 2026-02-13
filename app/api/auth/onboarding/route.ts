import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      fitnessLevel,
      goal,
      age,
      weight,
      height,
      trainingExperience,
      preferredTrainingDays,
      exercisePreferences,
      dietaryPreferences,
      availableEquipment,
    } = await req.json();

    // Update user with onboarding data
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        fitnessLevel: fitnessLevel || "Beginner",
        goal: goal || "Build Muscle",
        age: age || null,
        weight: weight || null,
        height: height || null,
        trainingExperience: trainingExperience || null,
        preferredTrainingDays: preferredTrainingDays || null,
        exercisePreferences: exercisePreferences || null,
        dietaryPreferences: dietaryPreferences || null,
        availableEquipment: availableEquipment || null,
        onboardingComplete: true,
      },
    });

    return NextResponse.json(
      { message: "Onboarding completed successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}

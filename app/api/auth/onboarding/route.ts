import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Get the session token from cookies
    const cookies = req.cookies;
    const sessionToken = cookies.get("next-auth.session-token")?.value || 
                        cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No valid session found" },
        { status: 401 }
      );
    }

    // Find the session in database
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
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
        fitnessLevel: fitnessLevel || "0-1",
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
      { error: "Failed to save onboarding data: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

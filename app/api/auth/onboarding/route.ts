import { NextRequest } from "next/server";
import { UserService, AuthenticationService } from "@/src/services";
import { ApiResponseBuilder, parseRequestBody } from "@/src/utils/api";
import { ValidationBuilder } from "@/src/utils/validation";
import { errorResponse } from "@/src/utils/errors";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Extract session
    const cookies = req.cookies;
    const sessionToken =
      cookies.get("next-auth.session-token")?.value ||
      cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      return ApiResponseBuilder.unauthorized("No valid session found");
    }

    // Find user from session
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user?.id) {
      return ApiResponseBuilder.unauthorized("Session expired or invalid");
    }

    // Parse and validate payload
    const body = await parseRequestBody<Record<string, unknown>>(req);

    const validation = new ValidationBuilder()
      .validateString(String(body.fitnessLevel || ""), "fitnessLevel")
      .validateString(String(body.goal || ""), "goal")
      .build();

    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity("Validation failed", validation.errors);
    }

    // Update user profile with preferences
    const user = await UserService.updatePreferences(session.user.id, {
      preferredTrainingDays: body.preferredTrainingDays
        ? parseInt(String(body.preferredTrainingDays))
        : undefined,
      exercisePreferences: Array.isArray(body.exercisePreferences)
        ? (body.exercisePreferences as string[])
        : undefined,
      dietaryPreferences: Array.isArray(body.dietaryPreferences)
        ? (body.dietaryPreferences as string[])
        : undefined,
      availableEquipment: body.availableEquipment ? String(body.availableEquipment) : undefined,
    });

    // Update fitness profile
    const updatedUser = await UserService.updateProfile(session.user.id, {
      age: body.age ? parseInt(String(body.age)) : undefined,
      weight: body.weight ? parseFloat(String(body.weight)) : undefined,
      height: body.height ? parseFloat(String(body.height)) : undefined,
      fitnessLevel: body.fitnessLevel ? String(body.fitnessLevel) : undefined,
      goal: body.goal ? String(body.goal) : undefined,
      trainingExperience: body.trainingExperience
        ? String(body.trainingExperience)
        : undefined,
    });

    // Mark onboarding as complete
    await UserService.completeOnboarding(session.user.id);

    return ApiResponseBuilder.success(updatedUser, 200, "Onboarding completed successfully");
  } catch (error) {
    return errorResponse(error, { endpoint: "/api/auth/onboarding", method: "POST" });
  }
}

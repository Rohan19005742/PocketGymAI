import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { UserService } from "@/src/services";
import { ApiResponseBuilder, parseRequestBody } from "@/src/utils/api";
import { validateUpdateProfilePayload } from "@/src/utils/validation";
import { errorResponse } from "@/src/utils/errors";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return ApiResponseBuilder.unauthorized("Not authenticated");
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return ApiResponseBuilder.notFound("User");
    }

    // Parse and validate payload
    const body = await parseRequestBody<Record<string, unknown>>(request);
    const validation = validateUpdateProfilePayload(body);

    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity("Validation failed", validation.errors);
    }

    // Update profile
    const updatedUser = await UserService.updateProfile(user.id, {
      name: body.name ? String(body.name) : undefined,
      age: body.age ? parseInt(String(body.age)) : undefined,
      weight: body.weight ? parseFloat(String(body.weight)) : undefined,
      height: body.height ? parseFloat(String(body.height)) : undefined,
      fitnessLevel: body.fitnessLevel ? String(body.fitnessLevel) : undefined,
      goal: body.goal ? String(body.goal) : undefined,
    });

    return ApiResponseBuilder.success(updatedUser, 200, "Profile updated successfully");
  } catch (error) {
    return errorResponse(error, { endpoint: "/api/auth/update-profile", method: "POST" });
  }
}

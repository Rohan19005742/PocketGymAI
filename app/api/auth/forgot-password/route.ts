import { NextRequest } from "next/server";
import { AuthenticationService } from "@/src/services";
import { ApiResponseBuilder, parseRequestBody } from "@/src/utils/api";
import { ValidationBuilder } from "@/src/utils/validation";
import { errorResponse } from "@/src/utils/errors";
import { appConfig } from "@/src/config";

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<Record<string, unknown>>(request);

    // Validate email
    const validation = new ValidationBuilder()
      .validateEmail(String(body.email || ""))
      .build();

    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity("Validation failed", validation.errors);
    }

    // Request password reset
    const resetToken = await AuthenticationService.requestPasswordReset(body.email as string);

    // In a real app, send the token via email. For development, return it.
    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(body.email as string)}`;

    return ApiResponseBuilder.success(
      {
        message: "If this email exists, a reset link will be sent",
        resetLink: appConfig.isDevelopment ? resetLink : undefined,
      },
      200
    );
  } catch (error) {
    return errorResponse(error, { endpoint: "/api/auth/forgot-password", method: "POST" });
  }
}

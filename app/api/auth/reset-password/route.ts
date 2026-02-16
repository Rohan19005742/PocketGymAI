import { NextRequest } from "next/server";
import { AuthenticationService } from "@/src/services";
import { ApiResponseBuilder, parseRequestBody } from "@/src/utils/api";
import { ValidationBuilder } from "@/src/utils/validation";
import { errorResponse } from "@/src/utils/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<Record<string, unknown>>(request);

    // Validate input
    const validation = new ValidationBuilder()
      .validateRequired(body.token, "token")
      .validateRequired(body.email, "email")
      .validatePassword(String(body.password || ""))
      .build();

    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity("Validation failed", validation.errors);
    }

    // Reset password
    const user = await AuthenticationService.resetPassword(
      body.token as string,
      body.password as string
    );

    return ApiResponseBuilder.success(user, 200, "Password reset successfully");
  } catch (error) {
    return errorResponse(error, { endpoint: "/api/auth/reset-password", method: "POST" });
  }
}

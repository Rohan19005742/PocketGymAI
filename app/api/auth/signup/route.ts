import { NextRequest } from "next/server";
import { AuthenticationService } from "@/src/services";
import { ApiResponseBuilder, parseRequestBody } from "@/src/utils/api";
import { validateSignUpPayload } from "@/src/utils/validation";
import { errorResponse } from "@/src/utils/errors";
import { HTTP_STATUS } from "@/src/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<Record<string, unknown>>(request);

    // Validate input
    const validation = validateSignUpPayload(body);
    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity("Validation failed", validation.errors);
    }

    // Create new user
    const user = await AuthenticationService.signup({
      email: body.email as string,
      password: body.password as string,
      name: body.name as string,
    });

    return ApiResponseBuilder.created(user, "User created successfully");
  } catch (error) {
    return errorResponse(error, { endpoint: "/api/auth/signup", method: "POST" });
  }
}

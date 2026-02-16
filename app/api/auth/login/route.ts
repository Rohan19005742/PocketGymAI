import { NextRequest } from "next/server";
import { AuthenticationService } from "@/src/services";
import { ApiResponseBuilder, parseRequestBody } from "@/src/utils/api";
import { validateAuthCredentials } from "@/src/utils/validation";
import { errorResponse } from "@/src/utils/errors";
import { HTTP_STATUS } from "@/src/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<Record<string, unknown>>(request);

    // Validate input
    const validation = validateAuthCredentials(body);
    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity("Validation failed", validation.errors);
    }

    // Authenticate user
    const user = await AuthenticationService.login({
      email: body.email as string,
      password: body.password as string,
    });

    return ApiResponseBuilder.success(user, HTTP_STATUS.OK);
  } catch (error) {
    return errorResponse(error, { endpoint: "/api/auth/login", method: "POST" });
  }
}

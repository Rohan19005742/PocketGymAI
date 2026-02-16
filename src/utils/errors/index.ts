/**
 * Error Handling Utilities
 * Centralized error handling, logging, and formatting
 */

import { AppError } from "@/src/types";
import { ERROR_CODES, HTTP_STATUS } from "@/src/constants";
import { NextResponse } from "next/server";

// ============================================================================
// ERROR FACTORY FUNCTIONS
// ============================================================================

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed", details?: Record<string, unknown>) {
    super(ERROR_CODES.AUTH_UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, message, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: Record<string, unknown>) {
    super(ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(
      ERROR_CODES.DB_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND,
      `${resource} not found`
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(ERROR_CODES.DB_CONFLICT, HTTP_STATUS.CONFLICT, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", details?: Record<string, unknown>) {
    super(ERROR_CODES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, message, details);
  }
}

// ============================================================================
// ERROR LOGGING
// ============================================================================

interface LogContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  [key: string]: unknown;
}

export class ErrorLogger {
  static logError(error: unknown, context: LogContext = {}): void {
    const timestamp = new Date().toISOString();

    if (error instanceof AppError) {
      console.error(JSON.stringify({
        timestamp,
        level: "error",
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
        context,
      }));
    } else if (error instanceof Error) {
      console.error(JSON.stringify({
        timestamp,
        level: "error",
        message: error.message,
        stack: error.stack,
        context,
      }));
    } else {
      console.error(JSON.stringify({
        timestamp,
        level: "error",
        message: "Unknown error occurred",
        error: String(error),
        context,
      }));
    }
  }

  static logWarning(message: string, context: LogContext = {}): void {
    const timestamp = new Date().toISOString();
    console.warn(JSON.stringify({
      timestamp,
      level: "warning",
      message,
      context,
    }));
  }

  static logInfo(message: string, context: LogContext = {}): void {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
      timestamp,
      level: "info",
      message,
      context,
    }));
  }
}

// ============================================================================
// ERROR RESPONSE FORMATTING
// ============================================================================

export function formatErrorResponse(
  error: unknown,
  context: LogContext = {}
): {
  statusCode: number;
  response: { success: false; error: { code: string; message: string; details?: Record<string, unknown> } };
} {
  ErrorLogger.logError(error, context);

  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      response: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  // Fallback for unexpected errors
  return {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    response: {
      success: false,
      error: {
        code: ERROR_CODES.SERVER_ERROR,
        message: "An unexpected error occurred",
      },
    },
  };
}

// ============================================================================
// NEXT.JS RESPONSE HELPERS
// ============================================================================

export function errorResponse(
  error: unknown,
  context: LogContext = {}
): NextResponse {
  const { statusCode, response } = formatErrorResponse(error, context);
  return NextResponse.json(response, { status: statusCode });
}

export function successResponse<T>(
  data: T,
  statusCode: number = HTTP_STATUS.OK,
  message?: string
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode }
  );
}

// ============================================================================
// ASYNC ERROR WRAPPER
// ============================================================================

/**
 * Wraps async route handlers to catch errors automatically
 * Usage: export const POST = catchAsync(async (req) => { ... })
 */
export function catchAsync(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

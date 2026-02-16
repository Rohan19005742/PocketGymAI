/**
 * API Middleware for Request/Response Handling
 * Centralized request logging, error handling, and response formatting
 */

import { NextRequest, NextResponse } from "next/server";
import { ErrorLogger } from "@/src/utils/errors";
import { generateRequestId } from "@/src/utils/api";

interface RequestMetadata {
  requestId: string;
  method: string;
  endpoint: string;
  startTime: number;
  userAgent?: string;
}

/**
 * Middleware to add request metadata and logging
 */
export function withRequestLogging(
  handler: (req: NextRequest, metadata: RequestMetadata) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = generateRequestId();
    const url = new URL(req.url);

    const metadata: RequestMetadata = {
      requestId,
      method: req.method,
      endpoint: url.pathname,
      startTime,
      userAgent: req.headers.get("user-agent") || undefined,
    };

    try {
      // Log incoming request (only in development or for specific endpoints)
      if (process.env.NODE_ENV === "development") {
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          type: "request_received",
          requestId,
          method: metadata.method,
          endpoint: metadata.endpoint,
          userAgent: metadata.userAgent,
        }));
      }

      const response = await handler(req, metadata);
      const duration = Date.now() - startTime;

      // Log successful response (only in development)
      if (process.env.NODE_ENV === "development") {
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          type: "request_completed",
          requestId,
          statusCode: response.status,
          duration: `${duration}ms`,
        }));
      }

      // Add request ID to response headers
      const responseWithHeaders = new NextResponse(response.body, response);
      responseWithHeaders.headers.set("X-Request-ID", requestId);
      responseWithHeaders.headers.set("X-Response-Time", `${duration}ms`);

      return responseWithHeaders;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log errors via centralized logger
      ErrorLogger.logError(error, {
        requestId,
        method: metadata.method,
        endpoint: metadata.endpoint,
        duration: `${duration}ms`,
      });

      // Return error response with request ID
      const errorResponse = NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
            requestId,
          },
        },
        { status: 500 }
      );

      errorResponse.headers.set("X-Request-ID", requestId);
      return errorResponse;
    }
  };
}

/**
 * Wrapper for async route handlers with automatic error handling
 */
export function asyncRoute(
  handler: (req: NextRequest, metadata: RequestMetadata) => Promise<NextResponse>
) {
  return withRequestLogging(handler);
}

/**
 * Extract metadata from request
 */
export function extractMetadata(req: NextRequest): {
  userId?: string;
  isAuthenticated: boolean;
} {
  const sessionToken = req.cookies.get("next-auth.session-token")?.value;

  return {
    userId: undefined, // Would be extracted from sessionToken in real app
    isAuthenticated: !!sessionToken,
  };
}

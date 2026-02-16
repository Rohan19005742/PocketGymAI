/**
 * API Response Utilities
 * Standardized response formatting and helpers
 */

import { NextResponse } from "next/server";
import { HTTP_STATUS } from "@/src/constants";
import { ApiSuccessResponse, ApiErrorResponse } from "@/src/types";

// ============================================================================
// RESPONSE BUILDERS
// ============================================================================

export class ApiResponseBuilder {
  /**
   * Build a success response
   */
  static success<T>(
    data: T,
    statusCode: number = HTTP_STATUS.OK,
    message?: string
  ): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      },
      { status: statusCode }
    );
  }

  /**
   * Build a creation success response (201)
   */
  static created<T>(data: T, message?: string): NextResponse<ApiSuccessResponse<T>> {
    return this.success(data, HTTP_STATUS.CREATED, message ?? "Resource created successfully");
  }

  /**
   * Build an error response
   */
  static error(
    code: string,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    details?: Record<string, unknown>
  ): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          details,
        },
      },
      { status: statusCode }
    );
  }

  /**
   * Build an invalid request response (422)
   */
  static unprocessableEntity(
    message: string = "Validation failed",
    details?: Record<string, unknown>
  ): NextResponse<ApiErrorResponse> {
    return this.error(
      "VALIDATION_ERROR",
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details
    );
  }

  /**
   * Build an unauthorized response (401)
   */
  static unauthorized(message: string = "Unauthorized"): NextResponse<ApiErrorResponse> {
    return this.error("AUTH_UNAUTHORIZED", message, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Build a forbidden response (403)
   */
  static forbidden(message: string = "Forbidden"): NextResponse<ApiErrorResponse> {
    return this.error("FORBIDDEN", message, HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Build a not found response (404)
   */
  static notFound(resource: string = "Resource"): NextResponse<ApiErrorResponse> {
    return this.error(
      "NOT_FOUND",
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND
    );
  }

  /**
   * Build a conflict response (409)
   */
  static conflict(message: string = "Resource already exists"): NextResponse<ApiErrorResponse> {
    return this.error("CONFLICT", message, HTTP_STATUS.CONFLICT);
  }

  /**
   * Build an internal server error response (500)
   */
  static internalServerError(
    message: string = "Internal server error"
  ): NextResponse<ApiErrorResponse> {
    return this.error("SERVER_ERROR", message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

export interface PaginationParams {
  limit?: number | string;
  offset?: number | string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export function parsePaginationParams(
  limit?: number | string,
  offset?: number | string
): { limit: number; offset: number } {
  const DEFAULT_LIMIT = 20;
  const MAX_LIMIT = 100;

  let parsedLimit = DEFAULT_LIMIT;
  let parsedOffset = 0;

  if (limit) {
    parsedLimit = Math.min(parseInt(String(limit)), MAX_LIMIT);
    if (parsedLimit < 1) parsedLimit = DEFAULT_LIMIT;
  }

  if (offset) {
    parsedOffset = Math.max(0, parseInt(String(offset)));
  }

  return { limit: parsedLimit, offset: parsedOffset };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      limit,
      offset,
      total,
      hasMore: offset + limit < total,
    },
  };
}

// ============================================================================
// REQUEST BODY PARSING
// ============================================================================

export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch (error) {
    throw new Error("Invalid JSON in request body");
  }
}

export async function parseAndValidateBody<T>(
  request: Request,
  validator: (data: unknown) => boolean
): Promise<T> {
  const body = await parseRequestBody<T>(request);

  if (!validator(body)) {
    throw new Error("Request body validation failed");
  }

  return body;
}

// ============================================================================
// QUERY PARAMETER PARSING
// ============================================================================

export function parseQueryParams(searchParams: URLSearchParams): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  }

  return params;
}

// ============================================================================
// RESPONSE METADATA
// ============================================================================

export interface ResponseMetadata {
  timestamp: string;
  version: string;
  requestId: string;
}

export function getResponseMetadata(requestId?: string): ResponseMetadata {
  return {
    timestamp: new Date().toISOString(),
    version: "1.0",
    requestId: requestId || generateRequestId(),
  };
}

export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

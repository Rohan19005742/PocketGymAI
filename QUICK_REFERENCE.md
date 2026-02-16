# Phase 1 Quick Reference Card

## File Locations (Memorize These!)

```
Types & Constants:
  src/types/index.ts              ← All type definitions
  src/constants/index.ts          ← All constants and magic strings
  src/config/index.ts             ← Environment configuration

Utilities:
  src/utils/errors/index.ts       ← Error handling, logging, responses
  src/utils/validation/index.ts   ← Input validation and sanitization
  src/utils/api/index.ts          ← API response builders
  src/utils/api/middleware.ts     ← Request logging wrapper

Services:
  src/services/auth/authentication.service.ts  ← Auth logic
  src/services/user/user.service.ts            ← User/profile logic
  src/services/index.ts                        ← Service exports

API Routes (Refactored Examples):
  app/api/auth/login/route.ts                  ← Use as template
  app/api/auth/signup/route.ts                 ← Use as template
```

## Common Imports (Copy-Paste Ready)

```typescript
// Types
import type { AuthUser, AuthCredentials, SignUpPayload, UserProfile, WorkoutProgress, WeightProgress, ApiSuccessResponse, ApiErrorResponse } from '@/src/types'

// Services
import { AuthenticationService } from '@/src/services/auth/authentication.service'
import { UserService } from '@/src/services/user/user.service'

// Utilities
import { ApiResponseBuilder } from '@/src/utils/api'
import { ValidationBuilder } from '@/src/utils/validation'
import { errorResponse, ErrorLogger } from '@/src/utils/errors'
import { withRequestLogging } from '@/src/utils/api/middleware'

// Constants
import { API_ENDPOINTS, ERROR_CODES, HTTP_STATUS, VALIDATION, FEATURE_FLAGS } from '@/src/constants'

// Config
import { appConfig, authConfig, aiConfig } from '@/src/config'
```

## Creating a New API Endpoint (Template)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponseBuilder } from '@/src/utils/api'
import { ValidationBuilder } from '@/src/utils/validation'
import { errorResponse } from '@/src/utils/errors'
import { AuthenticationService } from '@/src/services'
import type { AuthCredentials } from '@/src/types'

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request
    const payload = await req.json()
    
    // 2. Validate input
    const validation = new ValidationBuilder()
      .validateEmail(payload.email)
      .validatePassword(payload.password)
      // .validate*(...) for other fields
      .build()
    
    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity(validation.errors)
    }
    
    // 3. Call service
    const result = await AuthenticationService.login(payload)
    
    // 4. Return success response
    return ApiResponseBuilder.success(result)
  } catch (error) {
    // 5. Handle errors (all logged automatically)
    return errorResponse(error, { route: '/api/your/route' })
  }
}
```

## Creating a New Service (Template)

```typescript
import { prisma } from '@/lib/prisma'
import { errorResponse } from '@/src/utils/errors'
import type { YourType } from '@/src/types'
import { VALIDATION } from '@/src/constants'

export class YourService {
  /**
   * Method description
   * @param param1 - Description
   * @returns Typed result
   */
  static async methodName(param1: string): Promise<YourType> {
    try {
      // Validate input
      if (!param1) {
        throw new Error('param1 is required')
      }
      
      // Query database
      const result = await prisma.yourModel.findUnique({
        where: { id: param1 }
      })
      
      if (!result) {
        throw new Error('Not found')
      }
      
      return result
    } catch (error) {
      throw errorResponse(error, { method: 'YourService.methodName' })
    }
  }
}
```

## Response Format Cheat Sheet

```typescript
// Success (200)
ApiResponseBuilder.success(data)
// Returns: { success: true, data, requestId, timestamp }

// Created (201)
ApiResponseBuilder.created(data)
// Returns: { success: true, data, requestId, timestamp, statusCode: 201 }

// Validation Error (422)
ApiResponseBuilder.unprocessableEntity(errors)
// Returns: { success: false, error: { code, message, details: errors }, requestId }

// Auth Error (401)
ApiResponseBuilder.unauthorized()
// Returns: { success: false, error: { code: 'UNAUTHORIZED', ... }, requestId }

// Not Found (404)
ApiResponseBuilder.notFound()
// Returns: { success: false, error: { code: 'NOT_FOUND', ... }, requestId }

// Conflict (409)
ApiResponseBuilder.conflict()
// Returns: { success: false, error: { code: 'CONFLICT', ... }, requestId }

// Server Error (500)
ApiResponseBuilder.internalServerError()
// Returns: { success: false, error: { code: 'INTERNAL_ERROR', ... }, requestId }
```

## Validation Patterns

```typescript
// Single field
new ValidationBuilder()
  .validateEmail(email)
  .build()

// Multiple fields
new ValidationBuilder()
  .validateEmail(email)
  .validatePassword(password)
  .validateName(name)
  .validateNumber(age, { min: 18, max: 120 })
  .validateArray(goals, { enum: ['goal1', 'goal2'] })
  .build()

// Result usage
const { valid, errors } = validation
if (!valid) {
  return ApiResponseBuilder.unprocessableEntity(errors)
}

// Type: { valid: true } | { valid: false, errors: Record<string, string[]> }
```

## Error Handling Patterns

```typescript
// Catching and re-throwing
try {
  const user = await prisma.user.findUnique(...)
  if (!user) throw new Error('User not found')
  return user
} catch (error) {
  ErrorLogger.logError(error, { userId })
  throw error
}

// Responding to errors
try {
  // code
} catch (error) {
  return errorResponse(error, { 
    route: '/api/endpoint',
    userId: 'optional-for-context'
  })
}

// Custom errors (already defined in src/types)
new ValidationError('Invalid input', { field: 'email' })
new AuthenticationError('Credentials invalid')
new NotFoundError('User not found', { userId })
new ConflictError('User already exists', { email })
new InternalServerError('Database error')
```

## Constants You'll Use Most

```typescript
// Validation rules
VALIDATION.EMAIL_PATTERN
VALIDATION.PASSWORD_RULES
VALIDATION.NAME_RULES

// HTTP status codes
HTTP_STATUS.OK           // 200
HTTP_STATUS.CREATED      // 201
HTTP_STATUS.BAD_REQUEST  // 400
HTTP_STATUS.UNAUTHORIZED // 401
HTTP_STATUS.NOT_FOUND    // 404
HTTP_STATUS.CONFLICT     // 409

// Fitness data
FITNESS_LEVELS          // ["beginner", "intermediate", "advanced"]
TRAINING_GOALS          // ["weight_loss", "muscle_gain", "endurance", ...]

// API endpoints (for consistency)
API_ENDPOINTS.AUTH
API_ENDPOINTS.USER
API_ENDPOINTS.FITNESS
```

## Configuration Access

```typescript
// Current environment
appConfig.environment        // 'development' or 'production'
appConfig.name              // 'PocketGymAI'
appConfig.version           // from package.json

// Security
authConfig.bcryptRounds     // 10 (for password hashing)
authConfig.jwtSecret        // from .env.local
authConfig.sessionExpiry    // token lifetime in seconds

// AI/LangChain
aiConfig.apiKey             // OpenAI key
aiConfig.model              // 'gpt-4-turbo'
aiConfig.temperature        // 0.7 (creativity level)

// Feature flags (enable/disable features)
FEATURE_FLAGS.enableAICoach
FEATURE_FLAGS.enableRAG
```

## Debugging with Request IDs

```typescript
// Every error response includes requestId
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "requestId": "req-1705-abcd-1234"  ← Use this to search logs
  }
}

// Search server logs for this ID to see:
- Full request details (method, path, headers)
- Execution time
- Full error stack trace
- Database queries
- Any logs within that request context
```

## Phase 2 Pattern Preview

All services follow this pattern:
```typescript
export class YourService {
  static async methodName(params): Promise<ReturnType> {
    try {
      // Validate, query, process
      return result
    } catch (error) {
      throw error  // Will be caught by route handler
    }
  }
}
```

Just follow AuthenticationService and UserService examples!

---

## Remember These 3 Rules

1. **Every new endpoint** must use ApiResponseBuilder for responses
2. **Every mutation endpoint** must validate input with ValidationBuilder first
3. **Every service method** must have a single responsibility (do one thing)

You're ready to extend this architecture! 🚀

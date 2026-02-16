# PocketGymAI - Architecture & Refactoring Guide

## Overview

This document outlines the refactored architecture of PocketGymAI, designed for maintainability, scalability, and ease of development.

## Project Structure

```
PocketGymAI/
├── app/                           # Next.js app directory
│   ├── api/                      # API routes
│   │   └── auth/                # Authentication endpoints
│   ├── auth/                     # Auth pages (login, signup, etc.)
│   ├── chat/                     # Chat page
│   ├── dashboard/                # User dashboard
│   ├── onboarding/               # Onboarding flow
│   └── layout.tsx                # Root layout
│
├── components/                    # React components
│   ├── ui/                       # Base UI components (button, card, etc.)
│   └── [feature]/                # Feature-specific components
│
├── src/                          # NEW: Core application logic
│   ├── config/                   # Configuration management
│   │   └── index.ts             # App config, env vars, feature flags
│   │
│   ├── constants/                # Application constants
│   │   └── index.ts             # API endpoints, error codes, validation rules
│   │
│   ├── types/                    # Shared type definitions
│   │   └── index.ts             # Core types for auth, fitness, API
│   │
│   ├── services/                 # Business logic layer
│   │   ├── auth/
│   │   │   └── authentication.service.ts  # Auth operations
│   │   ├── user/
│   │   │   └── user.service.ts          # User profile & progress ops
│   │   └── fitness/              # Future: fitness-specific logic
│   │
│   └── utils/                    # Utility functions
│       ├── errors/               # Error handling & logging
│       ├── api/                  # API response building, pagination
│       └── validation/           # Input validation & sanitization
│
├── lib/                          # LEGACY: To be refactored
│   ├── ai-coach-agent.ts        # AI agent logic
│   ├── rag-agent.ts             # RAG setup
│   ├── exercises/               # Exercise architecture
│   └── prisma.ts                # Database client
│
├── prisma/                       # Database
│   ├── schema.prisma            # Data models
│   └── migrations/              # Database migrations
│
└── types/                        # Additional type definitions
    └── next-auth.d.ts           # NextAuth type extensions
```

## Architecture Principles

### 1. **Separation of Concerns**

```
┌─────────────────────────────────────────────────────┐
│                   API Routes                        │
│            (Thin HTTP layer)                        │
├─────────────────────────────────────────────────────┤
│                   Services                          │
│       (Business logic, validates data)              │
├─────────────────────────────────────────────────────┤
│                   Utilities                         │
│         (Validation, error handling)                │
├─────────────────────────────────────────────────────┤
│                   Database                          │
│            (Prisma ORM)                             │
└─────────────────────────────────────────────────────┘
```

### 2. **Service Layer Pattern**

Services encapsulate all business logic:

```typescript
// HTTP Routes are thin
export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request);
    const validation = validateSignUpPayload(body);
    
    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity(...);
    }
    
    // Delegate to service
    const user = await AuthenticationService.signup({...});
    return ApiResponseBuilder.created(user);
  } catch (error) {
    return errorResponse(error);
  }
}

// Services contain all logic
export class AuthenticationService {
  static async signup(payload: SignUpPayload): Promise<AuthUser> {
    // Hash password
    // Check for duplicates
    // Create user
    // Return typed result
  }
}
```

### 3. **Centralized Error Handling**

All errors are typed and handled consistently:

```typescript
// Custom error types
export class ValidationError extends AppError { ... }
export class AuthenticationError extends AppError { ... }
export class NotFoundError extends AppError { ... }

// Used in services
if (existingUser) {
  throw new ConflictError("User already exists");
}

// Caught and formatted by middleware
export function errorResponse(error: unknown) {
  const { statusCode, response } = formatErrorResponse(error);
  return NextResponse.json(response, { status: statusCode });
}
```

### 4. **Type Safety First**

Shared types across the entire application:

```typescript
// src/types/index.ts - Single source of truth
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  // ...
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Used everywhere
const user: AuthUser = await AuthenticationService.login(credentials);
return ApiResponseBuilder.success<AuthUser>(user);
```

### 5. **Configuration Management**

All configuration centralized:

```typescript
// src/config/index.ts
export const appConfig = { name, version, isDevelopment };
export const authConfig = { secret, url, providers };
export const aiConfig = { modelName, temperature, maxTokens };
export const featuresConfig = { aiCoach, socialFeatures };

// src/constants/index.ts
export const API_ENDPOINTS = { AUTH, USERS, FITNESS, CHAT };
export const ERROR_CODES = { AUTH_*, VALIDATION_*, DB_* };
export const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];
```

## Refactoring Phases

### Phase 1: Foundation ✅
- Created `src/` folder structure
- Centralized types, constants, and config
- Built utility layers (errors, validation, API)

### Phase 2: Services ✅
- Extracted `AuthenticationService`
- Extracted `UserService`
- Migrated API routes to use services
- Added request/response middleware

### Phase 3: Components (In Progress)
- Remove business logic from components
- Implement proper prop drilling solutions
- Create component hierarchy documentation

### Phase 4: Code Quality
- Remove scattered console.logs
- Fix TypeScript strict mode violations
- Add dead code detection

### Phase 5: Performance
- Implement request caching
- Add database query optimization
- Profile and optimize hot paths

### Phase 6: Testing & Documentation
- Add unit tests for services
- Create integration test suite
- Document API contracts
- Add developer onboarding guide

## Key Features of New Architecture

### ✅ **Testability**
Services are pure functions that can be tested independently:
```typescript
it("should reject duplicate email", async () => {
  // Setup
  await prisma.user.create({ email: "test@example.com" });
  
  // Test
  await expect(
    AuthenticationService.signup({
      email: "test@example.com",
      password: "Test123!@",
      name: "Test",
    })
  ).rejects.toThrow(ConflictError);
});
```

### ✅ **Maintainability**
Changes are localized to specific layers:
- Add new feature? Create service + API route
- Fix bug in auth? Check `AuthenticationService`
- Update validation? Edit `ValidationBuilder`

### ✅ **Scalability**
Services can be extracted to microservices:
```typescript
// Now: Local service
import { UserService } from "@/src/services";

// Future: Microservice call
const user = await microserviceClient.get("/users", id);
```

### ✅ **Type Safety**
Full TypeScript coverage prevents runtime errors:
```typescript
// This will fail at compile time
const user: AuthUser = {
  // Missing required 'id' field
  email: "test@example.com",
};
```

### ✅ **Error Handling**
Consistent error responses across the app:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "email": ["Invalid email format"]
    }
  }
}
```

## Development Workflow

### Adding a New Feature

1. **Define Types** (`src/types/index.ts`)
   ```typescript
   export interface NewFeature {
     id: string;
     // ...
   }
   ```

2. **Add Constants** (`src/constants/index.ts`)
   ```typescript
   export const NEW_FEATURE_ERROR_CODE = "NEW_FEATURE_ERROR";
   ```

3. **Create Service** (`src/services/newfeature/new-feature.service.ts`)
   ```typescript
   export class NewFeatureService {
     static async create(data: NewFeatureInput): Promise<NewFeature> {
       // Business logic
     }
   }
   ```

4. **Create API Route** (`app/api/newfeature/route.ts`)
   ```typescript
   export async function POST(request: NextRequest) {
     const body = await parseRequestBody(request);
     const data = await NewFeatureService.create(body);
     return ApiResponseBuilder.created(data);
   }
   ```

5. **Use in Component**
   ```typescript
   const { data } = await fetch("/api/newfeature", { method: "POST" });
   ```

## Next Steps

1. **Extract More Services**
   - `FitnessService` for workouts and exercises
   - `AICoachService` for AI interactions
   - `NotificationService` for alerts

2. **Implement Caching**
   - Redis for session cache
   - Query result caching
   - Exercise metadata caching

3. **Add Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (Datadog)
   - Analytics tracking

4. **Optimize Database**
   - Add indexes
   - Optimize queries
   - Implement pagination

5. **Deploy & Scale**
   - Add environment-specific configs
   - Implement rate limiting
   - Setup CI/CD pipeline

## Migration Checklist

- [x] Create folder structure
- [x] Extract types
- [x] Centralize constants
- [x] Extract services
- [x] Refactor API routes
- [ ] Refactor components
- [ ] Remove console.logs
- [ ] Add error handling middleware
- [ ] Add monitoring
- [ ] Write tests
- [ ] Update documentation
- [ ] Deploy to production

## References

- [Folder Structure Best Practices](https://nextjs.org/docs/getting-started/project-structure)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)
- [Service Pattern](https://refactoring.guru/design-patterns/service-locator)
- [Error Handling](https://nodejs.org/en/docs/guides/nodejs-error-handling/)

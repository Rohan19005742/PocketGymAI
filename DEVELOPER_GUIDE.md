# PocketGymAI - Developer Guide

## Quick Start

### First Time Setup
1. Read this guide and `ARCHITECTURE.md`
2. Understand the folder structure in `src/`
3. Review `src/types/index.ts` for shared types
4. Review `src/constants/index.ts` for constants

### Typical Workflow

```bash
# 1. Create new feature
git checkout -b feat/my-feature

# 2. Define types in src/types/index.ts
# 3. Add constants in src/constants/index.ts
# 4. Create service in src/services/feature/
# 5. Create API route in app/api/feature/
# 6. Test and commit

npm run build  # Verify TypeScript
git add .
git commit -m "feat: add my feature"
git push
```

---

## Architecture 101

### The Four Layers

```
┌─────────────────────────────────────────┐
│  UI Layer (components/)                 │
│  - React components                     │
│  - Presentation only                    │
│  - No business logic                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  API Layer (app/api/)                   │
│  - HTTP endpoints                       │
│  - Request validation                   │
│  - Response formatting                  │
│  - Error handling                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Service Layer (src/services/)          │
│  - Business logic                       │
│  - Database operations                  │
│  - Type-safe operations                 │
│  - Error handling                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Data Layer (lib/prisma.ts)             │
│  - Prisma ORM                           │
│  - Database access                      │
│  - Query execution                      │
└─────────────────────────────────────────┘
```

### Data Flow

```
Component
   │ event/click
   ▼
API Route (/api/feature)
   │ fetch, validate
   ▼
Service (FeatureService)
   │ business logic
   ▼
Database (Prisma)
   │ query result
   ▼
Service (map result)
   │ type conversion
   ▼
API Route (format response)
   │ JSON response
   ▼
Component (receives JSON)
```

---

## File Organization

### Where to Put Things

| What | Where | Example |
|------|-------|---------|
| Type definitions | `src/types/index.ts` | `export interface User { ... }` |
| Constants | `src/constants/index.ts` | `export const API_ENDPOINTS = { ... }` |
| Configuration | `src/config/index.ts` | `export const appConfig = { ... }` |
| Business logic | `src/services/*/` | `AuthenticationService.login()` |
| Error classes | `src/utils/errors/` | `ValidationError`, `AuthenticationError` |
| Validation logic | `src/utils/validation/` | `validateEmail()`, `ValidationBuilder` |
| API response helpers | `src/utils/api/` | `ApiResponseBuilder.success()` |
| HTTP endpoints | `app/api/*/` | `POST /api/auth/login` |
| React components | `components/` | Button, Card, features, etc. |
| Page components | `app/[page]/` | dashboard, profile, etc. |

---

## Common Tasks

### Adding a New API Endpoint

#### 1. Define Types

**File: `src/types/index.ts`**
```typescript
export interface CreateWorkoutPayload {
  name: string;
  duration: number;
  exercises: string[];
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  duration: number;
  exercises: string[];
  createdAt: Date;
}
```

#### 2. Add Constants

**File: `src/constants/index.ts`**
```typescript
export const API_ENDPOINTS = {
  // ... existing
  WORKOUTS: {
    CREATE: "/api/workouts",
    GET: "/api/workouts/:id",
    LIST: "/api/workouts",
  },
};

export const ERROR_CODES = {
  // ... existing
  WORKOUT_NOT_FOUND: "WORKOUT_NOT_FOUND",
  INVALID_WORKOUT: "INVALID_WORKOUT",
};
```

#### 3. Create Validation (if needed)

**File: `src/utils/validation/index.ts`**
```typescript
export function validateCreateWorkoutPayload(data: unknown): ValidationResult {
  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: { body: ["Invalid request body"] } };
  }

  const { name, duration, exercises } = data as Record<string, unknown>;

  return new ValidationBuilder()
    .validateString(String(name), "name", 1, 255)
    .validateNumber(duration, "duration", 1, 300)
    .validateArray(exercises, "exercises", 1)
    .build();
}
```

#### 4. Create Service

**File: `src/services/fitness/workout.service.ts`**
```typescript
export class WorkoutService {
  static async createWorkout(
    userId: string,
    payload: CreateWorkoutPayload
  ): Promise<Workout> {
    const workout = await prisma.workout.create({
      data: {
        userId,
        name: payload.name,
        duration: payload.duration,
        exercises: JSON.stringify(payload.exercises),
      },
    });

    return this.mapToWorkout(workout);
  }

  private static mapToWorkout(workout: any): Workout {
    return {
      id: workout.id,
      userId: workout.userId,
      name: workout.name,
      duration: workout.duration,
      exercises: JSON.parse(workout.exercises),
      createdAt: workout.createdAt,
    };
  }
}
```

#### 5. Create API Route

**File: `app/api/workouts/route.ts`**
```typescript
import { NextRequest } from "next/server";
import { WorkoutService } from "@/src/services/fitness/workout.service";
import { ApiResponseBuilder, parseRequestBody } from "@/src/utils/api";
import { validateCreateWorkoutPayload } from "@/src/utils/validation";
import { errorResponse } from "@/src/utils/errors";

export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const session = await getServerSession();
    if (!session?.user?.id) {
      return ApiResponseBuilder.unauthorized();
    }

    // Parse and validate
    const body = await parseRequestBody(request);
    const validation = validateCreateWorkoutPayload(body);

    if (!validation.valid) {
      return ApiResponseBuilder.unprocessableEntity("Validation failed", validation.errors);
    }

    // Create workout
    const workout = await WorkoutService.createWorkout(session.user.id, body);

    return ApiResponseBuilder.created(workout);
  } catch (error) {
    return errorResponse(error, { endpoint: "/api/workouts", method: "POST" });
  }
}
```

#### 6. Use in Component

**File: `components/workout-form.tsx`**
```typescript
"use client";
import { API_ENDPOINTS } from "@/src/constants";

export function WorkoutForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: CreateWorkoutPayload) {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.WORKOUTS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
      }

      const result = await response.json();
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // Form JSX
  );
}
```

---

### Fixing a Bug

1. **Identify the layer**
   - UI bug? → Check `components/`
   - API error? → Check `app/api/`
   - Business logic? → Check `src/services/`
   - Validation? → Check `src/utils/validation/`

2. **Create test case** (reproduce the bug)

3. **Locate the code**
   - Search service layer first
   - Then API routes
   - Then utilities

4. **Fix the code**
   - Make minimal, focused change
   - Ensure types are correct
   - Add error handling if needed

5. **Test the fix**
   ```bash
   npm run build
   npm run dev
   # Test in browser or with curl
   ```

6. **Commit with descriptive message**
   ```bash
   git commit -m "fix: specific description of bug and solution"
   ```

---

### Adding Error Handling

Create custom error class in `src/utils/errors/index.ts`:

```typescript
export class WorkoutNotFoundError extends AppError {
  constructor() {
    super(
      ERROR_CODES.WORKOUT_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND,
      "Workout not found"
    );
  }
}
```

Use in service:

```typescript
export class WorkoutService {
  static async getWorkout(id: string): Promise<Workout> {
    const workout = await prisma.workout.findUnique({ where: { id } });

    if (!workout) {
      throw new WorkoutNotFoundError();
    }

    return this.mapToWorkout(workout);
  }
}
```

Error automatically formatted by `errorResponse()`:

```json
{
  "success": false,
  "error": {
    "code": "WORKOUT_NOT_FOUND",
    "message": "Workout not found"
  }
}
```

---

## Important Patterns

### ✅ DO

```typescript
// ✅ Use services for business logic
const user = await AuthenticationService.login(credentials);

// ✅ Validate input with ValidationBuilder
const validation = new ValidationBuilder()
  .validateEmail(email)
  .validatePassword(password)
  .build();

// ✅ Return consistent error responses
if (!validation.valid) {
  return ApiResponseBuilder.unprocessableEntity(..., validation.errors);
}

// ✅ Use type-safe operations
const result: AuthUser = await AuthenticationService.login(credentials);

// ✅ Use custom error classes
throw new AuthenticationError("Invalid credentials");

// ✅ Use ApiResponseBuilder
return ApiResponseBuilder.success(data);
return ApiResponseBuilder.created(data);
return ApiResponseBuilder.notFound("Resource");

// ✅ Import from src modules
import { AuthenticationService } from "@/src/services";
import { ApiResponseBuilder } from "@/src/utils/api";
import { ValidationBuilder } from "@/src/utils/validation";
```

### ❌ DON'T

```typescript
// ❌ No direct Prisma in API routes
const user = await prisma.user.findUnique({ where: { id } });

// ❌ No manual error responses
return NextResponse.json({ error: "Something failed" }, { status: 500 });

// ❌ No generic error objects
throw new Error("Login failed");

// ❌ No console.error in production code
console.error("Login error:", error);

// ❌ No scattered constants
const API_URL = "http://localhost:3000/api/auth";

// ❌ No inline validation
if (!email.includes("@")) {
  // ...
}

// ❌ No returning different response shapes
return NextResponse.json({ user: { ... } });  // Different from payload
return NextResponse.json({ data: { ... } });  // Different again
```

---

## Debugging

### Viewing Logs

Development logs are structured JSON:
```json
{
  "timestamp": "2026-02-16T10:30:00.000Z",
  "level": "error",
  "code": "AUTH_UNAUTHORIZED",
  "message": "Invalid email or password",
  "statusCode": 401,
  "context": {
    "endpoint": "/api/auth/login",
    "method": "POST"
  }
}
```

### Using ErrorLogger

```typescript
import { ErrorLogger } from "@/src/utils/errors";

// Log error with context
ErrorLogger.logError(error, {
  userId: user.id,
  endpoint: "/api/auth/login",
  method: "POST",
});

// Log warning
ErrorLogger.logWarning("This behavior will change in v2", { endpoint });

// Log info
ErrorLogger.logInfo("User logged in successfully", { userId: user.id });
```

### Building & Type Checking

```bash
# Full build (compiles and type checks)
npm run build

# Development server
npm run dev

# Just lint/type check without building
npm run lint
```

---

## Performance Tips

### Don't

```typescript
// ❌ N+1 queries
for (const workout of workouts) {
  const exercises = await prisma.exercise.findMany({
    where: { workoutId: workout.id },
  });
}

// ❌ Loading unnecessary data
const users = await prisma.user.findMany(); // Loads all fields

// ❌ Calling same endpoint multiple times
const user1 = await getUserProfile(userId);
const user2 = await getUserProfile(userId);
```

### Do

```typescript
// ✅ Batch queries
const workouts = await prisma.workout.findMany({
  include: { exercises: true }, // Load related data in one query
});

// ✅ Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true },
});

// ✅ Cache results
const cachedUser = cache.get(userId) || await getUserProfile(userId);
```

---

## Testing Locally

### Manual Testing with curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@"}'

# Create workout
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Push","duration":60,"exercises":["Bench"]}'
```

### Using Postman

1. Create collection "PocketGym"
2. Add requests for each endpoint
3. Use environment variables for URLs and auth tokens
4. Test error cases too

---

## TypeScript Tips

### Type Definitions

```typescript
// ✅ Good: Specific types
interface Workout extends BaseModel {
  userId: string;
  name: string;
  duration: number;
}

// ❌ Bad: Generic types
interface Workout {
  [key: string]: any;
}
```

### Strict Mode

All files use TypeScript strict mode. This means:

```typescript
// ❌ Error: Parameter 'id' implicitly has type 'any'
function getUser(id) { }

// ✅ OK: Parameter typed
function getUser(id: string) { }

// ❌ Error: Property might not exist
const name = user.name; // Could be undefined

// ✅ OK: Check before access
const name = user?.name ?? "Unknown";
```

---

## Common Errors & Solutions

### "No valid session found"
**Problem**: Trying to access protected endpoint without auth  
**Solution**: Include auth token, check session cookie
```bash
# Add to request headers:
Cookie: next-auth.session-token=YOUR_TOKEN
```

### "Validation failed"
**Problem**: Request payload doesn't match schema  
**Solution**: Check error details for which field failed
```json
{
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### "Type 'X' is not assignable to type 'Y'"
**Problem**: Type mismatch
**Solution**: Check types in `src/types/index.ts`
```typescript
// ❌ Wrong
const user: AuthUser = { email: "test@example.com" }; // Missing required fields

// ✅ Correct
const user: AuthUser = {
  id: "123",
  email: "test@example.com",
  name: "Test",
  // ... all required fields
};
```

### "Cannot read property 'x' of undefined"
**Problem**: Accessing property of null/undefined value
**Solution**: Add null checks
```typescript
// ❌ Problem
const name = user.profile.name; // user.profile might be null

// ✅ Solution
const name = user?.profile?.name ?? "Unknown";
```

---

## Quick Reference

### Imports

```typescript
// Types
import type { AuthUser, Workout } from "@/src/types";

// Services
import { AuthenticationService, UserService } from "@/src/services";

// Utils
import { ApiResponseBuilder } from "@/src/utils/api";
import { ValidationBuilder } from "@/src/utils/validation";
import { ErrorLogger, errorResponse } from "@/src/utils/errors";

// Constants
import { API_ENDPOINTS, ERROR_CODES, HTTP_STATUS } from "@/src/constants";

// Config
import { appConfig, authConfig } from "@/src/config";
```

### API Response Examples

```typescript
// Success
return ApiResponseBuilder.success(data);                        // 200
return ApiResponseBuilder.created(data);                        // 201
return ApiResponseBuilder.success(data, 202, "Processing");     // 202

// Errors
return ApiResponseBuilder.unauthorized("Not authenticated");     // 401
return ApiResponseBuilder.forbidden("Access denied");           // 403
return ApiResponseBuilder.notFound("Resource");                 // 404
return ApiResponseBuilder.conflict("Already exists");           // 409
return ApiResponseBuilder.unprocessableEntity("Invalid data"...) // 422
```

### Validation Examples

```typescript
new ValidationBuilder()
  .validateEmail(email)
  .validatePassword(password)
  .validateString(name, "name", 2, 100)
  .validateNumber(age, "age", 1, 120)
  .validateArray(items, "items", 1)
  .validateRequired(value, "fieldName")
  .validateEnum(status, "status", ["active", "inactive"])
  .build()
```

---

## Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Changes made
- [ROADMAP.md](./ROADMAP.md) - Future improvements
- [src/types/index.ts](./src/types/index.ts) - Type definitions
- [src/constants/index.ts](./src/constants/index.ts) - Constants
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs/)

---

**Last Updated**: February 16, 2026  
**Maintained By**: Development Team  
**Questions?** Check ARCHITECTURE.md or ask in #dev channel


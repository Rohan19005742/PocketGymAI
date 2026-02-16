/**
 * Exercise Architecture - File Index & Quick Links
 * 
 * A guide to the 4-layer modular exercise system for scalable AI fitness apps
 */

# Exercise Architecture - Complete Implementation

## 📚 Files Overview

This is a production-ready architecture for exercises in a scalable fitness application. Here's what was created:

### 1. **[types.ts](types.ts)** - Type Definitions
**What**: TypeScript interfaces and types for all 4 layers
**Why**: Ensures type safety across the application
**Use**: `import type { ExerciseCoreMetadata, ... } from '@/lib/exercises/types'`
**Key Exports**:
- `ExerciseCoreMetadata` - Layer 1: Static classification
- `ExerciseProgrammingProfile` - Layer 2: Training parameters
- `ExerciseProgression` - Layer 3: Exercise relationships
- `SafetyConstraint` - Layer 4: Injury considerations
- `ExerciseSearchFilters` - Common query filter type

### 2. **[examples.ts](examples.ts)** - Real-World Examples
**What**: Concrete example data for actual exercises
**Why**: Shows how data looks across all 4 layers
**Use**: Reference for structuring your own exercise data
**Examples**:
- Barbell Bench Press (full context)
- Incline Dumbbell Bench Press (comparison)
- Progression chains
- Bulk exercise data format

### 3. **[queries.ts](queries.ts)** - Query Functions
**What**: Ready-to-use functions for querying exercises
**Why**: Encapsulate common operations, layer-independent queries
**Use**: `import { searchExercises, buildWorkout } from '@/lib/exercises/queries'`
**Functions**:
- **Layer 1**: `findExercisesByMuscle()`, `findExercisesByEquipment()`, `searchExercises()`
- **Layer 2**: `getRepRange()`, `getRestTime()`, `findExercisesByDifficulty()`
- **Layer 3**: `findProgressions()`, `getNextProgression()`, `buildProgressionChain()`
- **Layer 4**: `isExerciseSafe()`, `filterSafeExercises()`, `getExerciseRiskScore()`
- **Cross-Layer**: `buildWorkout()` - Complete workout generator

### 4. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Design Documentation
**What**: Comprehensive guide to the architecture
**Why**: Explains design decisions, patterns, and best practices
**Use**: Reference for understanding/extending the system
**Contains**:
- Problem statement (monolithic object limitations)
- 4-layer architecture deep dive
- Database schema (SQL)
- Implementation patterns
- Scalability advantages
- Best practices

### 5. **[README.md](README.md)** - Quick Reference
**What**: Quick start guide and summary
**Why**: Get up to speed quickly
**Use**: First stop for new developers
**Contains**:
- Quick start examples
- Architecture comparison
- Database integration guide
- Example: AI workout generator
- Next steps

---

## 🎯 The 4 Layers Explained

### Layer 1: Core Metadata (What IS it?)
**Purpose**: Static classification data
**Never Changes**: During workout, rarely in system
**Fields**: id, name, muscle groups, equipment, movement pattern
**Use**: Finding exercises, filtering by muscle/equipment, volume tracking
**Example**:
```typescript
{
  id: 1,
  name: "Barbell Bench Press",
  primaryMuscle: "chest",
  mechanics: "free_weight",
  requiredEquipment: ["barbell", "bench", "rack"]
}
```

### Layer 2: Programming Profile (How to PROGRAM it?)
**Purpose**: Training parameters and behavior
**Changes**: Periodically as science evolves or coach preferences change
**Fields**: Rep ranges, rest times, difficulty, fatigue impact, recovery
**Use**: Generating workouts, selecting reps/rest for goal, fatigue management
**Example**:
```typescript
{
  exerciseId: 1,
  recommendedRepRanges: {
    strength: [3, 6],
    hypertrophy: [8, 12],
    endurance: [15, 20]
  },
  fatigueScore: 8,
  minimumRecovery: 48  // hours
}
```

### Layer 3: Progression Graph (What's NEXT?)
**Purpose**: Relationships between exercises
**Changes**: When new exercises added or progression paths discovered
**Fields**: from/to exercise IDs, progression type, difficulty delta
**Use**: Auto-scaling difficulty, finding alternatives, progression planning
**Example**:
```typescript
{
  fromExerciseId: 1,      // Barbell Bench Press
  toExerciseId: 4,        // Close-Grip Bench Press
  progressionType: "progression",
  difficulty_delta: 1,
  recommendedWait: 4      // weeks
}
```

### Layer 4: Safety Constraints (Who can do it?)
**Purpose**: Injury prevention and risk management
**Changes**: Frequently (as user conditions change)
**Fields**: Exclusions, cautions, modifications, risk scores
**Use**: Filter by user injuries, show warnings, prevent unsafe exercises
**Example**:
```typescript
{
  exerciseId: 1,
  avoidIf: ["shoulder_impingement", "rotator_cuff_injury"],
  cautionIf: ["wrist_pain"],
  modifications: [
    {
      condition: "wrist_pain",
      modification: "Use wrist wraps"
    }
  ]
}
```

---

## 🚀 How to Use

### Import Types
```typescript
import type {
  ExerciseCoreMetadata,
  ExerciseProgrammingProfile,
  ExerciseProgression,
  SafetyConstraint,
  TrainingGoal,
} from "@/lib/exercises/types";
```

### Import Functions
```typescript
import {
  searchExercises,
  filterSafeExercises,
  buildWorkout,
  getRepRange,
  findProgressionsUp,
} from "@/lib/exercises/queries";
```

### Common Operations

**Find chest exercises**:
```typescript
const chest = findExercisesByMuscle(exercises, "chest");
```

**What can I do with dumbbells?**:
```typescript
const dumbbellExercises = findExercisesByEquipment(exercises, ["dumbbells"]);
```

**Get hypertrophy rep range**:
```typescript
const [minReps, maxReps] = getRepRange(profile, "hypertrophy");
// Returns: [8, 12]
```

**Is exercise safe for user?**:
```typescript
const safe = filterSafeExercises(exercises, ["wrist_pain", "lower_back_pain"]);
```

**What's the next progression?**:
```typescript
const nextStep = getNextProgression(progressions, benchPressId);
```

**Build entire workout**:
```typescript
const workout = buildWorkout({
  contexts: allExercises,
  userConditions: ["wrist_pain"],
  goal: "hypertrophy",
  targetMuscles: ["chest"],
  availableEquipment: ["dumbbells", "bench"],
  sessionDuration: 60,
});
```

---

## 💾 Database Setup

Use the SQL schemas in [ARCHITECTURE.md](ARCHITECTURE.md):

```sql
-- 4 main tables
CREATE TABLE exercise_core_metadata { ... }
CREATE TABLE exercise_programming_profile { ... }
CREATE TABLE exercise_progressions { ... }
CREATE TABLE exercise_safety_constraints { ... }
```

Then populate with data structured like [examples.ts](examples.ts).

---

## 📊 Architecture Comparison

| Aspect | Monolithic | Modular (This) |
|--------|-----------|----------------|
| **Fields per object** | 20+ mixed | 4 × 5-12 organized |
| **Scaling to 1000 exercises** | ❌ Arrays become unwieldy | ✅ Graph structure |
| **Updating programming** | ❌ Might break relationships | ✅ Independent layer |
| **AI reasoning** | ❌ Mixed concerns | ✅ Clear separation |
| **Type safety** | ❌ Generic "any" | ✅ Strict types |
| **Code reuse** | ❌ Monolithic queries | ✅ Layer-specific functions |

---

## 🎓 Learning Path

1. **Start Here**: [README.md](README.md) - Quick overview
2. **Understand**: Read this file for layer descriptions
3. **See Examples**: Check [examples.ts](examples.ts) for realistic data
4. **Learn Queries**: Review [queries.ts](queries.ts) function signatures
5. **Deep Dive**: [ARCHITECTURE.md](ARCHITECTURE.md) for full design rationale
6. **Implement**: Use types from [types.ts](types.ts) in your code

---

## ✨ Key Features

✅ **Separation of Concerns**
- Classification doesn't mix with training logic
- Safety is user-specific, not exercise property
- Relationships stored as graph, not nested arrays

✅ **Type Safe**
- Full TypeScript support
- Catch errors at compile time
- Clear interfaces for each layer

✅ **Scalable Design**
- Handles 1000+ exercises efficiently
- Graph structure for unlimited relationships
- Layer composition prevents tight coupling

✅ **AI-Friendly**
- Clear data structures for ML models
- Each layer represents distinct domain
- Easy to add new constraints/rules

✅ **Extensible**
- Add new layers without modifying existing ones
- Optional fields throughout
- Compatible with relational and NoSQL databases

---

## 🔍 Quick Function Reference

### Layer 1 (Metadata)
- `findExercisesByMuscle(exercises, muscleGroup)` - Find by muscle
- `findExercisesByEquipment(exercises, equipment)` - Find by gear
- `findExercisesByMovement(exercises, pattern)` - Find by movement
- `searchExercises(exercises, filters)` - Complex search with multiple filters

### Layer 2 (Programming)
- `getRepRange(profile, goal)` - Get reps for goal
- `getRestTime(profile, goal)` - Get rest time for goal
- `findExercisesByDifficulty(profiles, maxLevel)` - Find by difficulty
- `findExercisesByFatigue(profiles, maxScore)` - Find low-impact exercises

### Layer 3 (Progressions)  
- `findProgressionsUp(progressions, id)` - Find harder versions
- `findRegressions(progressions, id)` - Find easier versions
- `getNextProgression(progressions, id)` - Recommended next step
- `buildProgressionChain(progressions, id, depth)` - Full progression path
- `findVariations(progressions, id)` - Alternatives at same difficulty

### Layer 4 (Safety)
- `isExerciseSafe(constraint, conditions)` - Boolean safety check
- `filterSafeExercises(contexts, conditions)` - Filter by user conditions
- `getExerciseWarnings(constraint, conditions)` - Get cautions
- `getExerciseRiskScore(constraint, conditions)` - Numeric risk (0-100)

### Cross-Layer
- `buildWorkout(options)` - Generate complete workout respecting all layers
- `createExerciseLookup(contexts)` - Build lookup index for performance

---

## 📋 Database Schema Cheat Sheet

```sql
-- Layer 1: Core Metadata
exercise_core_metadata (id, name, primary_muscle, secondary_muscles, 
                        mechanics, required_equipment, ...)

-- Layer 2: Programming Profile
exercise_programming_profile (id, exercise_id, difficulty_level, 
                              recommended_rep_ranges (JSON), 
                              recommended_rest_times (JSON), ...)

-- Layer 3: Progressions
exercise_progressions (id, from_exercise_id, to_exercise_id, 
                       progression_type, difficulty_delta, ...)

-- Layer 4: Safety
exercise_safety_constraints (id, exercise_id, avoid_if (JSON), 
                             caution_if (JSON), modifications (JSON), ...)
```

---

## 🎯 Use Cases

✅ **"Show me chest exercises"** → Layer 1 search
✅ **"Generate hypertrophy workout"** → Layer 2 + 1
✅ **"What's harder than this?"** → Layer 3
✅ **"Safe for wrist pain?"** → Layer 4
✅ **"Build personalized program"** → All 4 layers
✅ **"Adaptive difficulty scaling"** → Layers 2 + 3

---

## 📖 File Structure

```
lib/
└── exercises/
    ├── types.ts              ← Type definitions
    ├── examples.ts           ← Real-world examples
    ├── queries.ts            ← Query functions
    ├── ARCHITECTURE.md       ← Deep design docs
    └── README.md             ← Quick reference
```

All files are in `/lib/exercises/` for easy importing:
```typescript
import type { ExerciseCoreMetadata } from "@/lib/exercises/types";
import { searchExercises } from "@/lib/exercises/queries";
```

---

## 🚀 Next Steps

1. Read [README.md](README.md) for quick start
2. Study [types.ts](types.ts) to understand data structures  
3. Review [examples.ts](examples.ts) for realistic implementations
4. Explore [queries.ts](queries.ts) query functions
5. Deep dive [ARCHITECTURE.md](ARCHITECTURE.md) for complete design
6. Implement in your database
7. Build API endpoints around queries
8. Integrate with your AI workout generator

---

**This is a complete, production-ready exercise system for scalable AI fitness applications.**

Start building! 🏋️

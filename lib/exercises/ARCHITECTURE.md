/**
 * SCALABLE EXERCISE ARCHITECTURE
 * Comprehensive Design Documentation
 * 
 * This document explains the modular 4-layer exercise system designed for
 * large-scale AI-powered fitness applications.
 */

# Scalable Exercise Architecture

## Executive Summary

Instead of a monolithic exercise object mixing classification, programming logic, relationships, and safety constraints, this architecture splits exercises into **4 logical layers**:

1. **Core Metadata** - What the exercise IS
2. **Programming Profile** - How it BEHAVES in workouts
3. **Progression Graph** - How it RELATES to other exercises
4. **Safety Constraints** - Who CANNOT do it and why

**Benefits:**
- ✅ Scales to 1000+ exercises without coupling
- ✅ Flexible for AI-driven workout generation
- ✅ Independent layer updates (no cascading changes)
- ✅ Database-friendly (can be normalized or denormalized)
- ✅ Easy to add new features (add layers, don't modify existing ones)

---

## Architecture Overview

### Historical Problem: Monolithic Exercise Object

```typescript
{
  id: 21,
  name: "Decline Push-ups",
  movementPattern: "horizontal_push",
  primaryMuscle: "chest",
  secondaryMuscles: ["triceps"],
  mechanics: "bodyweight",
  forceType: "compound",
  difficulty: 4,
  stabilityDemand: "high",
  equipment: ["bench"],
  regressions: [19],              // ← Mixing relationship data
  progressions: [34],             // ← Hard to scale
  contraindications: ["wrist_pain"], // ← Safety mixed in
  recommendedRepRange: [6,12],    // ← Goal-specific logic
  restDefault: 90,
  tempoDefault: "2-0-1",
}
```

**Problems:**
- ❌ Coupling: Can't update programming without risking classification
- ❌ Hard to scale: progressions/regressions become unwieldy arrays
- ❌ Mixing concerns: Safety data buried with training data
- ❌ Not AI-friendly: Monolithic object hard to reason about programmatically
- ❌ DB inefficiency: Structured data shoehorned into flat objects

---

## Layer 1: Core Metadata

### Purpose

**Static exercise classification data** - defines what the exercise fundamentally IS.

This layer never changes during workout execution. It's used for:
- Searching exercises
- Filtering by muscle group or equipment
- Building program structure
- Tracking volume distribution
- Equipment availability checks

### Why Separate?

A workout generator's first question is always: **"What exercises can I choose from?"**

This layer answers that question without touching training parameters, progressions, or safety data.

### Key Design Decisions

**Muscle group hierarchy:**
- `primaryMuscle`: Single, clear focus area
- `secondaryMuscles`: Array of meaningfully involved muscles
- `tertiaryMuscles` (optional): Minor contributions (e.g., stabilizers)

**Why not weighted percentages?** Keeps data simple. If you need detailed EMG data, add an optional layer later.

**Movement patterns (not just exercises):**
Instead of storing "Barbell Bench Press" AND "Dumbbell Bench Press" as separate exercises with duplicate data, we classify both as `horizontal_push`. This let's the AI reason about movement patterns independently.

**Equipment as required vs. optional:**
- `requiredEquipment`: Must have ("barbell", "bench")
- `optionalEquipment`: Nice-to-have ("spotter")

Allows substitution logic: "User has dumbbells, can they substitute?"

**Plane of motion:**
Essential for movement balanced programming:
```
- Sagittal (bench press, squats)
- Frontal (lateral raises, lateral lunges)
- Transverse (rotations, wood chops)
- Multi-planar (Turkish getups)
```

### Example: Core Metadata

```typescript
{
  id: 1,
  name: "Barbell Bench Press",
  slug: "barbell-bench-press",
  
  // Kinesiological classification
  movementPattern: "horizontal_push",
  planeOfMotion: "sagittal",
  primaryMuscle: "chest",
  secondaryMuscles: ["anterior_deltoid", "triceps"],
  
  // Equipment and mechanics
  mechanics: "free_weight",
  requiredEquipment: ["barbell", "bench", "rack"],
  optionalEquipment: ["spotter"],
  
  // Movement characteristics
  isUnilateral: false,
  forceVector: "horizontal",
  
  // Metadata
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  isActive: true,
}
```

### Queries on This Layer

```typescript
// Show all chest exercises
searchExercises(exercises, { muscleGroups: ["chest"] })

// What can I do with just dumbbells?
findExercisesByEquipment(exercises, ["dumbbells", "bench"])

// Balance this program - add vertical pulling
findExercisesByMovement(exercises, "vertical_pull")

// Comprehensive search
searchExercises(exercises, {
  muscleGroups: ["back", "lats"],
  mechanics: "free_weight",
  excludeEquipment: ["cable_machine"],
  isUnilateral: false,
})
```

---

## Layer 2: Programming Profile

### Purpose

**Training parameters and behavioral characteristics** - defines HOW the exercise is programmed.

This layer encodes the training logic that determines:
- Rep ranges based on training goal
- Rest times between sets
- Expected fatigue impact
- Progression readiness
- Recovery requirements

### Why Separate?

The same movement (e.g., "horizontal push") can have different programming:
- **Barbell Bench Press**: Heavy, 3-6 reps, 3min rest, high CNS fatigue
- **Machine Chest Press**: Lighter, 10-15 reps, 60s rest, low skill demand
- **Push-ups**: Bodyweight, 15-25 reps, minimal fatigue

The metadata is almost identical, but the programming is **completely different**.

Separating this layer lets the AI:
1. Choose exercises by movement pattern (metadata)
2. Then select appropriate rep range for THIS GOAL (programming)
3. Without rebuilding the query each time

### Key Design Decisions

**Goal-specific rep ranges:**
```typescript
recommendedRepRanges: {
  strength: [3, 6],      // Heavy = fewer reps
  hypertrophy: [8, 12],  // Moderate weight, higher reps
  endurance: [15, 20],   // Light weight, many reps
  power: [3, 5],         // Explosive, very heavy
}
```

Why separate by goal? Because **the same exercise has different parameters for different adaptations**.

**Fatigue and recovery scoring:**
```typescript
fatigueScore: 8,                 // High fatigue impact
muscularDamagePotential: 7,      // How much DOMS
neuromuscularDemand: 6,          // CNS fatigue
minimumRecovery: 48,             // Hours needed
```

This enables intelligent workout spacing:
- High-fatigue exercises → more recovery time
- Used for "Can I train chest again?" logic
- Prevents overtraining on same muscle group

**Difficulty ≠ Weight:**
```typescript
difficultyLevel: 3,      // 1-5: Coach's assessment of exercise difficulty
forceType: "compound",   // Whether multi-joint or isolation
stabilityDemand: 4,      // How much balance/core required
skillDemand: 3,          // Technical learning curve
```

These are **coach perspective**, not absolute measures. A powerlifter might find bench press "easy" technically, but it's still a moderate-difficulty movement for most.

### Example: Programming Profile

```typescript
{
  exerciseId: 1,
  
  difficultyLevel: 3,
  forceType: "compound",
  stabilityDemand: 4,
  skillDemand: 3,
  
  recommendedRepRanges: {
    strength: [3, 6],
    hypertrophy: [8, 12],
    endurance: [12, 15],
    power: [3, 5],
  },
  
  recommendedRestTimes: {
    strength: 180,      // 3 min
    hypertrophy: 90,    // 90 sec
    endurance: 60,      // 1 min
    power: 120,         // 2 min
  },
  
  defaultTempo: "3-1-1-0",
  fatigueScore: 8,
  muscularDamagePotential: 7,
  neuromuscularDemand: 6,
  minimumRecovery: 48,
  optimalFrequency: 2,
  lifespan: 14,         // Days before detraining
  caloricDemand: 8,
  epocEffect: 6,
}
```

### Queries on This Layer

```typescript
// Get hypertrophy rep range for an exercise
getRepRange(profile, "hypertrophy") // Returns [8, 12]

// How long should user rest?
getRestTime(profile, "strength") // Returns 180

// What beginner exercises exist?
findExercisesByDifficulty(profiles, 2)

// I'm fatigued - what low-impact exercises?
findExercisesByFatigue(profiles, maxFatigue=5)

// When can I train this muscle group again?
calculateMinimumRecovery(chestExercises) // Returns 48 hours
```

---

## Layer 3: Progression Graph

### Purpose

**Inter-exercise relationships** as a flexible graph structure.

Defines:
- What exercise is harder/easier
- Progression stepping stones
- Variations for same difficulty
- Dependencies and prerequisites

### Why Separate?

The original design:
```typescript
regressions: [19, 23, 25],     // ← What do these numbers mean?
progressions: [34, 45, 67],    // ← In what order? With what gap?
```

Problems:
- ❌ Unclear ordering (which is the "next" step?)
- ❌ Hard to add metadata (why regress? what if user wants option A but not B?)
- ❌ No relationship types (is it a true progression or just a variation?)
- ❌ Can't express "Person A is ready for progression, but Person B isn't"

**Solution: Model as a directed graph**

```
Deck Push-ups (id: 2)
        ↓ [progression, +1 difficulty]
   Bench Press (id: 1) ← [variation] ← Incline Bench (id: 6)
        ↓ [progression, +2 difficulty]
  Close-Grip Bench (id: 4)
```

Each edge contains:
- `fromExerciseId`: Source
- `toExerciseId`: Target
- `progressionType`: Describes the relationship
- `difficulty_delta`: Quantifies the change
- `recommendedWait`: Prerequisites ("Wait 4 weeks")
- `readinessIndicators`: Subjective readiness

### Progression Types

**regression** - Make easier
- User finds exercise too hard
- Returning from injury
- Deload week
- Tech: Reduced load capacity, lower stabilizer demand

**progression** - Make harder
- User has mastered current exercise
- Ready for increased challenge
- Natural periodization progression
- Tech: Higher absolute load, increased complexity

**variation** - Alternative at same difficulty
- Equipment change (barbell → dumbbell)
- Angle change (flat → incline)
- Grip change (wide → narrow)
- Tech: Same difficulty, different stimulus

**substitution** - Forced replacement
- User has equipment limitation
- User has injury
- Temporary situation-based swap
- Tech: Maintains same difficulty, accepts different stimulus

**preparation** - Pre-activation warm-up
- Activate stabilizers before main lift
- Pre-exhaust muscles
- Neural activation
- Tech: Lower intensity, specific fiber recruitment

**complementary** - Program balance
- Opposing movement pattern (push ↔ pull)
- Antagonistic muscles (bench → rows)
- Not always performed together, but program needs balance
- Tech: Different pattern, related muscle groups

### Example: Progression Graph

```typescript
{
  id: 103,
  fromExerciseId: 1,      // Barbell Bench Press
  toExerciseId: 4,        // Close-Grip Bench
  progressionType: "progression",
  difficulty_delta: 1,    // Moderately harder
  recommendedWait: 4,     // Weeks before attempting
  order: 1,               // First progression option
  readinessIndicators: [
    "5x5 at RPE 7",
    "Confident form on heavy doubles",
  ],
  transitionCues: [
    "Reduce grip width by 2-4 inches",
    "Load may decrease 5-10%",
  ],
  notes: "Increased tricep demand",
}
```

### Queries on This Layer

```typescript
// What's harder than this exercise?
findProgressionsUp(progressions, exerciseId)

// What's easier?
findRegressions(progressions, exerciseId)

// What should I do next?
getNextProgression(progressions, exerciseId)

// Show the entire progression chain
buildProgressionChain(progressions, startId, depth=5)
// Returns: [id1 → id2 → id3 → id4 → id5]

// Get alternatives at same difficulty
findVariations(progressions, exerciseId)
```

### Why This Scales

**Old approach (arrays):**
- Barbell Bench Press → [24 regression options, 12 progression options]
- Can't distinguish between them
- Hard to update (array maintenance)
- Not database-friendly

**New approach (graph):**
- Each edge is a separate record
- Easy to add metadata to edges
- Can query: "Progressions that wait 4 weeks"
- Scales to 10,000+ edges easily
- Natural relational database structure

---

## Layer 4: Safety & Constraints

### Purpose

**Injury prevention and risk management** - defines WHO can safely perform the exercise.

Two approaches supported:

**Hard Exclusions** (Boolean):
```typescript
avoidIf: ["shoulder_impingement", "rotator_cuff_injury"]
// → User has ANY of these = Cannot perform exercise
```

**Soft Warnings** (Conditional):
```typescript
cautionIf: ["lower_back_pain"]
// → User has ANY of these = Can perform with modifications
```

**Risk Scoring** (Nuanced):
```typescript
riskScores: [
  { condition: "wrist_pain", riskScore: 30 },
  { condition: "shoulder_pain", riskScore: 60 },
]
// → Sum scores for user's conditions
// → Use for intelligent filtering (show lowest-risk exercises first)
```

### Why Separate?

Safety is a **user-specific** concern, not an exercise property.

The same exercise:
- Safe for Person A (no injuries)
- Cautionary for Person B (recovering from wrist issue)
- Forbidden for Person C (active rotator cuff injury)

By separating this layer:
- Exercise metadata never changes
- We add user context at query time
- New injury types don't require schema changes
- Modifications are data, not code

### Example: Safety Constraints

```typescript
{
  id: 1001,
  exerciseId: 1,
  
  avoidIf: [
    "shoulder_impingement",
    "rotator_cuff_injury"
  ],
  
  cautionIf: [
    "wrist_pain",
    "lower_back_pain",
    "shoulder_pain"
  ],
  
  modifications: [
    {
      condition: "wrist_pain",
      modification: "Use wrist wraps or reduce ROM",
      riskLevel: "caution",
    },
    {
      condition: "lower_back_pain",
      modification: "Reduce weight 20-30%, use spotter",
      riskLevel: "caution",
    },
  ],
  
  riskScores: [
    { condition: "wrist_pain", riskScore: 30 },
    { condition: "lower_back_pain", riskScore: 40 },
  ],
}
```

### Queries on This Layer

```typescript
// Is this safe for this user?
isExerciseSafe(safetyConstraint, userConditions) // Boolean

// What warnings should we show?
getExerciseWarnings(safetyConstraint, userConditions)
// Returns: [{condition: "wrist_pain", modification: "..."}]

// Build workout avoiding unsafe exercises
filterSafeExercises(allExercises, userConditions)

// Risk score for intelligent ranking
getExerciseRiskScore(safetyConstraint, userConditions)
// Returns: 0-100 (100 = excluded, 99 = too risky)
```

---

## Cross-Layer Example: Building an Intelligent Workout

Here's how the layers work together:

```typescript
const workout = buildWorkout({
  contexts: allExercises,         // Full context of each exercise
  userConditions: ["wrist_pain"], // User has wrist pain
  goal: "hypertrophy",            // Training goal
  targetMuscles: ["chest"],       // What to train today
  availableEquipment: ["dumbbells", "bench"],  // What's available
  sessionDuration: 60,            // Minutes
});
```

**Process:**

1. **Layer 4** (Safety): Filter out exercises with shoulder/rotator injury avoidance
2. **Layer 1** (Metadata): Keep only chest-focused exercises with available equipment
3. **Layer 2** (Programming): Get hypertrophy rep ranges and rest times
4. **Layer 3** (Progression): Check if user is ready for progressions
5. **Assemble**: Build workout with sets × reps × rest
6. **Warnings**: Show wrist pain cautions for remaining exercises

---

## Database Schema (Relational)

### Table 1: exercise_core_metadata
```sql
CREATE TABLE exercise_core_metadata (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  movement_pattern VARCHAR(50),
  plane_of_motion VARCHAR(50),
  primary_muscle VARCHAR(50),
  secondary_muscles JSON,  -- ["triceps", "shoulders"]
  mechanics VARCHAR(50),
  required_equipment JSON,
  optional_equipment JSON,
  is_unilateral BOOLEAN,
  force_vector VARCHAR(50),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Table 2: exercise_programming_profile
```sql
CREATE TABLE exercise_programming_profile (
  id INT PRIMARY KEY,
  exercise_id INT,
  difficulty_level INT,
  force_type VARCHAR(50),
  stability_demand INT,
  skill_demand INT,
  recommended_rep_ranges JSON,    -- {"strength": [3,6], ...}
  recommended_rest_times JSON,    -- {"strength": 180, ...}
  default_tempo VARCHAR(20),
  fatigue_score INT,
  muscular_damage_potential INT,
  neuromuscular_demand INT,
  minimum_recovery INT,
  optimal_frequency INT,
  lifespan INT,
  FOREIGN KEY (exercise_id) REFERENCES exercise_core_metadata(id)
);
```

### Table 3: exercise_progressions
```sql
CREATE TABLE exercise_progressions (
  id INT PRIMARY KEY,
  from_exercise_id INT,
  to_exercise_id INT,
  progression_type VARCHAR(50),  -- regression, progression, variation, etc.
  difficulty_delta INT,
  recommended_wait INT,          -- Weeks
  readiness_indicators JSON,
  transition_cues JSON,
  FOREIGN KEY (from_exercise_id) REFERENCES exercise_core_metadata(id),
  FOREIGN KEY (to_exercise_id) REFERENCES exercise_core_metadata(id),
  INDEX (from_exercise_id),
  INDEX (to_exercise_id)
);
```

### Table 4: exercise_safety_constraints
```sql
CREATE TABLE exercise_safety_constraints (
  id INT PRIMARY KEY,
  exercise_id INT,
  avoid_if JSON,              -- ["shoulder_impingement", ...]
  caution_if JSON,            -- ["wrist_pain", ...]
  modifications JSON,         -- [{condition, modification, risk_level}, ...]
  risk_scores JSON,           -- [{condition, riskScore}, ...]
  FOREIGN KEY (exercise_id) REFERENCES exercise_core_metadata(id)
);
```

---

## Implementation Patterns

### Loading Full Context

```typescript
// Get everything about an exercise
async function getFullExerciseContext(id: number) {
  const metadata = await db.query(
    "SELECT * FROM exercise_core_metadata WHERE id = ?",
    [id]
  );
  const programming = await db.query(
    "SELECT * FROM exercise_programming_profile WHERE exercise_id = ?",
    [id]
  );
  const progressions = await db.query(
    "SELECT * FROM exercise_progressions WHERE from_exercise_id = ?",
    [id]
  );
  const safety = await db.query(
    "SELECT * FROM exercise_safety_constraints WHERE exercise_id = ?",
    [id]
  );
  
  return {
    metadata: metadata[0],
    programmingProfile: programming[0],
    progressions,
    safetyConstraints: safety[0],
  };
}
```

### Bulk Loading

```typescript
// Load all exercises for workout generation
async function loadExercisesForWorkoutGen() {
  const metadata = await db.query(
    "SELECT * FROM exercise_core_metadata WHERE is_active = true"
  );
  const programming = await db.query(
    "SELECT * FROM exercise_programming_profile WHERE exercise_id IN (?)",
    [metadata.map(m => m.id)]
  );
  
  return metadata.map(m => ({
    metadata: m,
    programmingProfile: programming.find(
      p => p.exercise_id === m.id
    ),
  }));
}
```

### Caching Strategy

For performance with thousands of exercises:

```typescript
// Cache in memory/Redis
const exerciseCache = new Map();

async function getExerciseWithCache(id: number) {
  if (exerciseCache.has(id)) {
    return exerciseCache.get(id);
  }
  
  const context = await getFullExerciseContext(id);
  exerciseCache.set(id, context);
  return context;
}

// Invalidate on updates
async function updateExerciseMetadata(id: number, updates: any) {
  await db.update("exercise_core_metadata", updates, { id });
  exerciseCache.delete(id);  // Invalidate
}
```

---

## Adding New Features (No Retrofitting)

### Feature: "Track workouts this exercise typically takes"

**Old monolithic approach:**
- Modify exercise object
- Migrate all existing data
- Update all queries
- Risk breaking existing logic

**New modular approach:**
- Add optional `exerciseMeta` table:

```sql
CREATE TABLE exercise_meta (
  exercise_id INT PRIMARY KEY,
  typical_sets INT,
  typical_duration_minutes INT,
  FOREIGN KEY (exercise_id) REFERENCES exercise_core_metadata(id)
);
```

- Query:
```typescript
const meta = await db.query(
  "SELECT typical_duration_minutes FROM exercise_meta WHERE exercise_id = ?",
  [id]
);
```

**Zero impact on existing 4 layers.**

### Feature: "Predict readiness for progression"

- Add table:

```sql
CREATE TABLE exercise_readiness_metrics (
  id INT,
  exercise_id INT,
  metric_name VARCHAR(100),      -- "max_weight", "rpe_consistency", etc.
  metric_threshold FLOAT,        -- User's metric value
  readiness_score INT,           -- 0-100
  FOREIGN KEY (exercise_id) REFERENCES exercise_core_metadata(id)
);
```

- Affects only `findProgressionsUp()` logic, not the layer itself.

---

## Scalability Advantages

### Thousands of Exercises

This architecture handles scale because:

1. **Lazy Loading**: Load metadata first, programming/progressions only when needed
2. **Indexed Lookups**: Each layer can be indexed on `exercise_id`
3. **Graph Queries**: Progressions use standard graph algorithms (no nested objects)
4. **Independent Caching**: Cache each layer separately
5. **Pagination**: Query results in batches

### Millions of User-Exercise Combinations

```typescript
// Don't store user-specific safety data
// Compute at query time:
const safeExercises = exercises.filter(
  ex => !userConditions.intersect(ex.safetyConstraints.avoidIf)
);
```

Instead of storing "User1 can do Exercise1" for every user-exercise pair, compute on demand.

---

## Best Practices

### 1. Keep Metadata Immutable
Core metadata should rarely change. If it does, consider versioning.

### 2. Programming Profiles Are Recommendations
They're coach input, not gospel. AI should use these as defaults, not rules.

### 3. Progressions Are Flexible
A user can "skip" progressions or go sideways to variations. Graph structure supports all paths.

### 4. Safety is User-Centric
Constraints apply to users, not exercises. Same exercise, different safety for different people.

### 5. Add Layers, Don't Modify Existing Ones
When adding features (e.g., "energy system demands"), create a 5th layer rather than retrofitting.

### 6. Use TypeScript for Type Safety
With separate layers, TypeScript ensures you're querying the right data.

---

## TL;DR - Design Principles

| Layer | Purpose | Changes | Query Pattern |
|-------|---------|---------|---|
| **Metadata** | "What is this?" | Rarely | `findExercisesByMuscle()` |
| **Programming** | "How do I train it?" | Periodically | `getRepRange(goal)` |
| **Progressions** | "What's next?" | Training logs inform updates | `getNextProgression()` |
| **Safety** | "Who can't do it?" | User-specific, frequent | `filterSafeExercises()` |

**Result: Scalable, flexible, AI-friendly architecture for 1000+ exercises.**

---

## Next Steps

1. **Database**: Implement the 4 tables
2. **API Layer**: Create REST endpoints for each query type
3. **Cache Strategy**: Implement Redis caching for metadata
4. **Tests**: Write unit tests for query functions
5. **AI Integration**: Feed layer queries to LLM for workout generation
6. **Monitoring**: Track which exercises are used, which progressions are attempted


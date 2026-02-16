/**
 * Exercise Architecture - Query & Utility Functions
 * 
 * This file demonstrates how to work with the modular exercise system.
 * Shows examples of:
 * - Filtering exercises across multiple layers
 * - Building workout recommendations
 * - Finding progressions
 * - Applying safety constraints
 */

import type {
  ExerciseCoreMetadata,
  ExerciseProgrammingProfile,
  ExerciseProgression,
  SafetyConstraint,
  FullExerciseContext,
  ExerciseSearchFilters,
  TrainingGoal,
  InjuryCondition,
} from "./types";

// ===========================
// LAYER 1: METADATA QUERIES
// ===========================

/**
 * Find exercises by muscle group
 * Use case: "Show me all back exercises"
 */
export function findExercisesByMuscle(
  exercises: ExerciseCoreMetadata[],
  muscleGroup: string
): ExerciseCoreMetadata[] {
  return exercises.filter(
    (ex) =>
      ex.primaryMuscle === muscleGroup ||
      ex.secondaryMuscles?.includes(muscleGroup as any)
  );
}

/**
 * Find exercises by equipment availability
 * Use case: "What can I do with just dumbbells?"
 */
export function findExercisesByEquipment(
  exercises: ExerciseCoreMetadata[],
  availableEquipment: string[]
): ExerciseCoreMetadata[] {
  return exercises.filter((ex) =>
    ex.requiredEquipment.every((item) => availableEquipment.includes(item))
  );
}

/**
 * Find exercises by movement pattern
 * Use case: "Balance this program - add a vertical pull"
 */
export function findExercisesByMovement(
  exercises: ExerciseCoreMetadata[],
  movementPattern: string
): ExerciseCoreMetadata[] {
  return exercises.filter((ex) => ex.movementPattern === movementPattern);
}

/**
 * Comprehensive search with multiple filters
 */
export function searchExercises(
  exercises: ExerciseCoreMetadata[],
  filters: ExerciseSearchFilters
): ExerciseCoreMetadata[] {
  return exercises.filter((ex) => {
    // Muscle group filter
    if (filters.muscleGroups?.length) {
      const hasMuscle =
        filters.muscleGroups.includes(ex.primaryMuscle) ||
        ex.secondaryMuscles.some((m) => filters.muscleGroups?.includes(m));
      if (!hasMuscle) return false;
    }

    // Equipment filter
    if (filters.equipment?.length) {
      const hasAllEquipment = filters.equipment.every((item) =>
        ex.requiredEquipment.includes(item)
      );
      if (!hasAllEquipment) return false;
    }

    // Exclude equipment filter
    if (filters.excludeEquipment?.length) {
      const hasExcludedEquipment = ex.requiredEquipment.some((item) =>
        filters.excludeEquipment?.includes(item)
      );
      if (hasExcludedEquipment) return false;
    }

    // Movement pattern filter
    if (filters.movementPatterns?.length) {
      if (!filters.movementPatterns.includes(ex.movementPattern)) return false;
    }

    // Unilateral filter
    if (filters.isUnilateral !== undefined) {
      if (ex.isUnilateral !== filters.isUnilateral) return false;
    }

    return true;
  });
}

// ===========================
// LAYER 2: PROGRAMMING QUERIES
// ===========================

/**
 * Get rep range for a specific training goal
 * Use case: "What's the hypertrophy rep range for bench press?"
 */
export function getRepRange(
  programmingProfile: ExerciseProgrammingProfile,
  goal: TrainingGoal
): [number, number] {
  return programmingProfile.recommendedRepRanges[goal] || [8, 12];
}

/**
 * Get rest time for a training goal
 * Use case: Generate rest timers in workout
 */
export function getRestTime(
  programmingProfile: ExerciseProgrammingProfile,
  goal: TrainingGoal
): number {
  return programmingProfile.recommendedRestTimes[goal] || 90;
}

/**
 * Find exercises suitable for a specific difficulty level
 * Use case: "What are good beginner exercises?"
 */
export function findExercisesByDifficulty(
  programmingProfiles: ExerciseProgrammingProfile[],
  maxDifficulty: number
): ExerciseProgrammingProfile[] {
  return programmingProfiles.filter(
    (profile) => profile.difficultyLevel <= maxDifficulty
  );
}

/**
 * Find exercises by fatigue impact
 * Use case: "I'm fatigued - show me low-impact exercises"
 */
export function findExercisesByFatigue(
  programmingProfiles: ExerciseProgrammingProfile[],
  maxFatigueScore: number
): ExerciseProgrammingProfile[] {
  return programmingProfiles.filter(
    (profile) => profile.fatigueScore <= maxFatigueScore
  );
}

/**
 * Calculate workout recovery time
 * Use case: "How long until I can train chest again?"
 */
export function calculateMinimumRecovery(
  exercises: ExerciseProgrammingProfile[]
): number {
  return Math.max(...exercises.map((ex) => ex.minimumRecovery || 24));
}

// ===========================
// LAYER 3: PROGRESSION QUERIES
// ===========================

/**
 * Find progressions for an exercise
 * Use case: "What's harder than bench press?"
 */
export function findProgressions(
  progressions: ExerciseProgression[],
  fromExerciseId: number,
  type: "progression" | "regression" | "variation" | "all" = "all"
): ExerciseProgression[] {
  return progressions.filter(
    (prog) =>
      prog.fromExerciseId === fromExerciseId &&
      (type === "all" || prog.progressionType === type)
  );
}

/**
 * Find regressions (easier alternatives)
 * Use case: "This is too hard - what can I do instead?"
 */
export function findRegressions(
  progressions: ExerciseProgression[],
  exerciseId: number
): ExerciseProgression[] {
  return findProgressions(progressions, exerciseId, "regression");
}

/**
 * Find progressions (harder alternatives)
 * Use case: "I'm ready for a challenge"
 */
export function findProgressionsUp(
  progressions: ExerciseProgression[],
  exerciseId: number
): ExerciseProgression[] {
  return findProgressions(progressions, exerciseId, "progression");
}

/**
 * Find the next progression step
 * Use case: "What should I do after mastering this?"
 */
export function getNextProgression(
  progressions: ExerciseProgression[],
  exerciseId: number
): ExerciseProgression | undefined {
  const candidates = findProgressionsUp(progressions, exerciseId);
  // Return the smallest difficulty jump (not the hardest)
  return candidates.sort((a, b) => a.difficulty_delta - b.difficulty_delta)[0];
}

/**
 * Build a progression chain
 * Use case: "Show me the path from beginner to advanced for chest"
 */
export function buildProgressionChain(
  progressions: ExerciseProgression[],
  startExerciseId: number,
  depth: number = 5
): number[] {
  const chain = [startExerciseId];
  let currentId = startExerciseId;

  for (let i = 0; i < depth; i++) {
    const next = getNextProgression(progressions, currentId);
    if (!next) break;
    chain.push(next.toExerciseId);
    currentId = next.toExerciseId;
  }

  return chain;
}

/**
 * Find variations (alternatives at same difficulty)
 * Use case: "I'm bored - what else can I do at this level?"
 */
export function findVariations(
  progressions: ExerciseProgression[],
  exerciseId: number
): ExerciseProgression[] {
  return findProgressions(progressions, exerciseId, "variation");
}

// ===========================
// LAYER 4: SAFETY QUERIES
// ===========================

/**
 * Check if exercise is safe for a user
 * Use case: Validate before adding to workout
 */
export function isExerciseSafe(
  safetyConstraint: SafetyConstraint,
  userConditions: InjuryCondition[]
): boolean {
  // Hard exclusion check
  if (safetyConstraint.avoidIf.some((cond) => userConditions.includes(cond))) {
    return false;
  }
  return true;
}

/**
 * Get warnings for an exercise
 * Use case: "Show cautions before user performs exercise"
 */
export function getExerciseWarnings(
  safetyConstraint: SafetyConstraint,
  userConditions: InjuryCondition[]
): { condition: InjuryCondition; modification: string }[] {
  return (
    safetyConstraint.modifications?.filter((mod) =>
      userConditions.includes(mod.condition)
    ) || []
  );
}

/**
 * Filter exercises for user with conditions
 * Use case: "Show me safe exercises for this user"
 */
export function filterSafeExercises(
  contextList: FullExerciseContext[],
  userConditions: InjuryCondition[]
): FullExerciseContext[] {
  return contextList.filter((context) => {
    if (!context.safetyConstraints || context.safetyConstraints.length === 0) return true; // No constraints = safe
    // All constraints must pass the safety check
    return context.safetyConstraints.every((constraint) =>
      isExerciseSafe(constraint, userConditions)
    );
  });
}

/**
 * Get risk score for an exercise given user conditions
 * Use case: Nuanced filtering with risk assessment
 */
export function getExerciseRiskScore(
  safetyConstraint: SafetyConstraint,
  userConditions: InjuryCondition[]
): number {
  let riskScore = 0;

  // Hard exclusions = max risk
  const hardExclude = safetyConstraint.avoidIf.some((cond) =>
    userConditions.includes(cond)
  );
  if (hardExclude) return 100;

  // Score cautions
  safetyConstraint.riskScores?.forEach((risk) => {
    if (userConditions.includes(risk.condition)) {
      riskScore += risk.riskScore;
    }
  });

  return Math.min(riskScore, 99); // Cap at 99 (100 = excluded)
}

// ===========================
// CROSS-LAYER QUERIES
// ===========================

/**
 * Build a complete workout with intelligent recommendations
 * Demonstrates how layers work together
 */
export function buildWorkout(options: {
  contexts: FullExerciseContext[];
  userConditions: InjuryCondition[];
  goal: TrainingGoal;
  targetMuscles: string[];
  availableEquipment: string[];
  sessionDuration: number; // minutes
}): {
  exercises: FullExerciseContext[];
  estimatedDuration: number;
  warnings: string[];
} {
  // Filter safe exercises
  let candidates = filterSafeExercises(
    options.contexts,
    options.userConditions
  );

  // Filter by target muscles
  candidates = candidates.filter((context) =>
    options.targetMuscles.includes(context.metadata.primaryMuscle)
  );

  // Filter by available equipment
  candidates = candidates.filter((context) =>
    context.metadata.requiredEquipment.every((item) =>
      options.availableEquipment.includes(item)
    )
  );

  // Estimate duration (placeholder logic)
  let estimatedDuration = 0;
  const selectedExercises: FullExerciseContext[] = [];
  const warnings: string[] = [];

  for (const context of candidates) {
    if (estimatedDuration > options.sessionDuration) break;

    // Estimate time: 3 sets × (avg reps + rest time)
    const [minReps, maxReps] = getRepRange(
      context.programmingProfile,
      options.goal
    );
    const avgReps = (minReps + maxReps) / 2;
    const restTime = getRestTime(context.programmingProfile, options.goal);
    const exerciseTime = 3 * ((avgReps * 2 + restTime) / 60); // rough estimate

    selectedExercises.push(context);
    estimatedDuration += exerciseTime;

    // Add warnings if there are cautions
    if (context.safetyConstraints && Array.isArray(context.safetyConstraints)) {
      context.safetyConstraints.forEach((constraint) => {
        const cautions = getExerciseWarnings(constraint, options.userConditions);
        cautions.forEach((caution) => {
          warnings.push(
            `${context.metadata.name}: ${caution.modification}`
          );
        });
      });
    } else if (context.safetyConstraints) {
      const cautions = getExerciseWarnings(
        context.safetyConstraints,
        options.userConditions
      );
      cautions.forEach((caution) => {
        warnings.push(
          `${context.metadata.name}: ${caution.modification}`
        );
      });
    }
  }

  return {
    exercises: selectedExercises,
    estimatedDuration,
    warnings,
  };
}

// ===========================
// HELPER: Cache/Join Operations
// ===========================

/**
 * Create a lookup map for quick ID-based queries
 * Use case: Performance optimization for large datasets
 */
export function createExerciseLookup(contexts: FullExerciseContext[]): {
  byId: Record<number, FullExerciseContext>;
  byMuscle: Record<string, FullExerciseContext[]>;
  byMovement: Record<string, FullExerciseContext[]>;
} {
  const byId: Record<number, FullExerciseContext> = {};
  const byMuscle: Record<string, FullExerciseContext[]> = {};
  const byMovement: Record<string, FullExerciseContext[]> = {};

  contexts.forEach((context) => {
    const id = context.metadata.id;
    const muscle = context.metadata.primaryMuscle;
    const movement = context.metadata.movementPattern;

    byId[id] = context;
    byMuscle[muscle] = (byMuscle[muscle] || []).concat(context);
    byMovement[movement] = (byMovement[movement] || []).concat(context);
  });

  return { byId, byMuscle, byMovement };
}

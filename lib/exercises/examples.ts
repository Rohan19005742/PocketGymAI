/**
 * Exercise Architecture - Example Data
 * 
 * This file contains example implementations for a single exercise
 * across all 4 layers of the modular architecture.
 * 
 * Real implementation would load these from a database or structured JSON.
 */

// ===========================
// EXAMPLE 1: Barbell Bench Press
// ===========================

// LAYER 1: Core Metadata (Static classification)
export const benchPressCoreMetadata = {
  id: 1,
  name: "Barbell Bench Press",
  slug: "barbell-bench-press",
  movementPattern: "horizontal_push",
  planeOfMotion: "sagittal",
  primaryMuscle: "chest",
  secondaryMuscles: ["anterior_deltoid", "triceps"],
  tertiaryMuscles: ["serratus"],
  mechanics: "free_weight",
  requiredEquipment: ["barbell", "bench", "rack"],
  optionalEquipment: ["spotter"],
  isUnilateral: false,
  forceVector: "horizontal",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  isActive: true,
};

// LAYER 2: Programming Profile (How it's programmed)
export const benchPressProgrammingProfile = {
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
    strength: 180,    // 3 minutes
    hypertrophy: 90,  // 90 seconds
    endurance: 60,    // 1 minute
    power: 120,       // 2 minutes
  },
  defaultTempo: "3-1-1-0", // 3sec down, 1sec pause, 1sec up, no pause
  fatigueScore: 8,         // High fatigue
  muscularDamagePotential: 7,
  neuromuscularDemand: 6,
  minimumRecovery: 48,     // 48 hours
  optimalFrequency: 2,     // 2x per week
  lifespan: 14,            // 2 weeks before detraining
  caloricDemand: 8,
  epocEffect: 6,
  notes: "Foundational compound push. Requires solid technique. Monitor form degradation under fatigue.",
};

// LAYER 3: Progression Graph (Exercise relationships)
export const benchPressProgressions = [
  // REGRESSIONS (Make easier)
  {
    id: 101,
    fromExerciseId: 1,  // Barbell Bench Press
    toExerciseId: 2,    // Dumbbell Bench Press (example)
    progressionType: "regression",
    difficulty_delta: -1,
    recommendedWait: 0,
    order: 1,
    transitionCues: ["Switch to dumbbells for reduced grip demand"],
    notes: "Dumbbells increase ROM and stabilizer demand, but lower absolute load capacity",
  },
  {
    id: 102,
    fromExerciseId: 1,
    toExerciseId: 3,    // Machine Chest Press (example)
    progressionType: "regression",
    difficulty_delta: -2,
    transitionCues: ["Use guided path for reduced stability requirement"],
  },
  
  // PROGRESSIONS (Make harder)
  {
    id: 103,
    fromExerciseId: 1,
    toExerciseId: 4,    // Close-Grip Bench Press (example)
    progressionType: "progression",
    difficulty_delta: 1,
    recommendedWait: 4,
    readinessIndicators: ["5x5 at RPE 7", "Confident form on heavy doubles"],
    transitionCues: ["Reduce grip width by 2-4 inches", "Load may decrease 5-10%"],
  },
  {
    id: 104,
    fromExerciseId: 1,
    toExerciseId: 5,    // Reverse Band Bench Press (example)
    progressionType: "progression",
    difficulty_delta: 2,
    recommendedWait: 8,
    notes: "Advanced variation with accommodating resistance",
  },
  
  // VARIATIONS (Same level)
  {
    id: 105,
    fromExerciseId: 1,
    toExerciseId: 6,    // Incline Barbell Bench Press (example)
    progressionType: "variation",
    difficulty_delta: 0,
    muscle_demand_delta: -1, // Slightly less chest, more shoulder
    transitionCues: ["Adjust hand positioning for incline"],
  },
  
  // COMPLEMENTARY (For program balance)
  {
    id: 106,
    fromExerciseId: 1,
    toExerciseId: 7,    // Barbell Rows (example)
    progressionType: "complementary",
    difficulty_delta: 0,
    notes: "Pulling movement to balance horizontal pushing",
  },
];

// LAYER 4: Safety Constraints (Injury considerations)
export const benchPressSafetyConstraints = {
  id: 1001,
  exerciseId: 1,
  avoidIf: ["shoulder_impingement", "rotator_cuff_injury"],
  cautionIf: ["wrist_pain", "lower_back_pain", "shoulder_pain"],
  modifications: [
    {
      condition: "wrist_pain",
      modification: "Use wrist wraps or reduce range of motion slightly",
      riskLevel: "caution",
    },
    {
      condition: "lower_back_pain",
      modification: "Reduce weight 20-30%, focus on neutral spine, use spotter",
      riskLevel: "caution",
    },
    {
      condition: "shoulder_pain",
      modification: "Reduce range of motion, reduce weight, consider dumbbell variation",
      riskLevel: "caution",
    },
  ],
  riskScores: [
    { condition: "wrist_pain", riskScore: 30 },
    { condition: "lower_back_pain", riskScore: 40 },
    { condition: "elbow_tendinitis", riskScore: 35 },
  ],
  notes: "Monitor grip width for shoulder health. Full ROM requires good shoulder mobility.",
};

// ===========================
// EXAMPLE 2: Incline Dumbbell Bench Press (to show differences)
// ===========================

export const inclineDumbbellBenchPressCoreMetadata = {
  id: 21,
  name: "Incline Dumbbell Bench Press",
  slug: "incline-dumbbell-bench-press",
  movementPattern: "horizontal_push",
  planeOfMotion: "sagittal",
  primaryMuscle: "anterior_deltoid",
  secondaryMuscles: ["chest", "triceps"],
  mechanics: "dumbbell",
  requiredEquipment: ["dumbbells", "incline_bench"],
  optionalEquipment: [],
  isUnilateral: false,
  forceVector: "diagonal", // Angle between horizontal and vertical
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  isActive: true,
};

export const inclineDumbbellBenchPressProgrammingProfile = {
  exerciseId: 21,
  difficultyLevel: 2,
  forceType: "compound",
  stabilityDemand: 5, // Higher - dumbbells require more stabilization
  skillDemand: 2,
  recommendedRepRanges: {
    strength: [6, 8],
    hypertrophy: [10, 15],
    endurance: [15, 20],
  },
  recommendedRestTimes: {
    strength: 120,
    hypertrophy: 75,
    endurance: 45,
  },
  defaultTempo: "3-0-1-0",
  fatigueScore: 7,
  muscularDamagePotential: 8, // Higher stabilizer muscle recruitment
  neuromuscularDemand: 7,
  minimumRecovery: 48,
  optimalFrequency: 2,
  lifespan: 14,
  caloricDemand: 7,
  epocEffect: 7,
  notes: "Increased anterior deltoid involvement due to angle. Greater stabilizer activation than barbell.",
};

// ===========================
// COMBINED VIEW (Full Context)
// ===========================

export const benchPressFullContext = {
  metadata: benchPressCoreMetadata,
  programmingProfile: benchPressProgrammingProfile,
  progressions: benchPressProgressions,
  safetyConstraints: benchPressSafetyConstraints,
};

// ===========================
// EXAMPLE PROGRESSION CHAIN
// ===========================

export const chestProgressionChain = {
  exerciseIds: [3, 2, 1, 4, 5], // Machine → Dumbbells → Barbell → Close-grip → Advanced
  title: "Horizontal Push Progression Chain",
  description: "Training progression from beginner to advanced horizontal pressing",
  difficulty_range: [1, 5],
};

// ===========================
// BULK DATA EXAMPLE
// ===========================
// This shows how the data might look in a database query result

export const multiExerciseExample = [
  {
    metadata: benchPressCoreMetadata,
    programmingProfile: benchPressProgrammingProfile,
  },
  {
    metadata: inclineDumbbellBenchPressCoreMetadata,
    programmingProfile: inclineDumbbellBenchPressProgrammingProfile,
  },
  // ... more exercises
];

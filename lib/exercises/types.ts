/**
 * Exercise Architecture - Type Definitions
 * 
 * This file defines the modular exercise system split across 4 logical layers:
 * 1. Core Metadata - Static classification data
 * 2. Programming Profile - Training parameters and behaviors
 * 3. Progression Graph - Inter-exercise relationships
 * 4. Safety Constraints - Injury and risk management
 * 
 * Benefits:
 * - Scalable to thousands of exercises
 * - Flexible for AI-driven programming logic
 * - Easy to query and filter independently
 * - Loose coupling between layers
 */

// ===========================
// 1️⃣ EXERCISE CORE METADATA LAYER
// ===========================
// What the exercise IS - static classification data
// Used for: Filtering, search, equipment checks, muscle volume tracking

export type MovementPattern = 
  | "horizontal_push"
  | "vertical_push"
  | "horizontal_pull"
  | "vertical_pull"
  | "leg_press"
  | "leg_pull"
  | "carry"
  | "rotate"
  | "flexion"
  | "extension"
  | "isolation";

export type PlaneOfMotion = 
  | "sagittal"      // Forward/backward
  | "frontal"       // Side to side
  | "transverse"    // Rotational
  | "multi_planar"; // Multiple planes

export type MechanicsType = 
  | "bodyweight"
  | "free_weight"
  | "machine"
  | "cable"
  | "dumbbell"
  | "kettlebell"
  | "elastic"
  | "hybrid";

export type MuscleGroup = 
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "obliques"
  | "lower_back"
  | "traps"
  | "anterior_deltoid"
  | "lateral_deltoid"
  | "posterior_deltoid"
  | "serratus"
  | "lats";

export interface ExerciseCoreMetadata {
  // Primary identifiers
  id: number;
  name: string;
  slug: string; // URL-friendly identifier
  
  // Kinesiological classification
  movementPattern: MovementPattern;
  planeOfMotion: PlaneOfMotion;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[]; // Muscles significantly worked but not primary
  tertiaryMuscles?: MuscleGroup[]; // Minor muscle involvement
  
  // Equipment and mechanics
  mechanics: MechanicsType;
  requiredEquipment: string[]; // ["barbell", "bench", "rack"]
  optionalEquipment?: string[]; // Can be performed with alternatives
  
  // Movement characteristics
  isUnilateral: boolean; // One-sided vs bilateral
  forceVector?: "vertical" | "horizontal" | "diagonal" | "rotational";
  
  // Metadata
  createdAt: string; // ISO timestamp
  updatedAt: string;
  isActive: boolean; // Soft delete support
}

// ===========================
// 2️⃣ PROGRAMMING PROFILE LAYER
// ===========================
// How the exercise BEHAVES - training parameters and programming logic
// Used for: Workout generation, fatigue management, rep ranges, rest times

export type ExerciseDifficulty = 1 | 2 | 3 | 4 | 5;

export type ForceType = 
  | "compound"    // Multi-joint movements
  | "isolation"   // Single-joint movements
  | "hybrid";     // Mix (e.g., sled leg press - compound-like but machine)

export type TrainingGoal = "strength" | "hypertrophy" | "endurance" | "power";

export interface RepRangeByGoal {
  strength: [number, number];      // e.g., [3, 6]
  hypertrophy: [number, number];   // e.g., [8, 12]
  endurance: [number, number];     // e.g., [15, 20]
  power?: [number, number];        // e.g., [3, 5] for explosive work
}

export interface RestTimeByGoal {
  strength: number;      // Rest in seconds, e.g., 180
  hypertrophy: number;   // e.g., 90
  endurance: number;     // e.g., 45
  power?: number;        // e.g., 120
}

export interface ExerciseProgrammingProfile {
  // Exercise reference
  exerciseId: number;
  
  // Difficulty and complexity
  difficultyLevel: ExerciseDifficulty; // 1-5 scale for coach difficulty assessment
  forceType: ForceType;
  stabilityDemand: ExerciseDifficulty; // 1-5: how much stabilizer muscles required
  skillDemand: ExerciseDifficulty; // 1-5: technical difficulty / learning curve
  
  // Goal-based programming parameters
  recommendedRepRanges: RepRangeByGoal;
  recommendedRestTimes: RestTimeByGoal; // In seconds
  defaultTempo: string; // "2-0-1" format: eccentric-pause-concentric-pause
  
  // Fatigue and load management
  fatigueScore: number; // 1-10: relative fatigue impact
  muscularDamagePotential: number; // 1-10: risk of DOMS/muscle damage
  neuromuscularDemand: number; // 1-10: CNS fatigue impact
  
  // Programming logic
  minimumRecovery?: number; // Hours before same muscle group can be trained intensely
  optimalFrequency?: number; // Times per week for best results
  lifespan?: number; // Days: how long strength gains last without repetition
  
  // Metabolic impact
  caloricDemand: number; // Relative energy cost 1-10
  epocEffect: number; // Post-exercise oxygen consumption 1-10
  
  // Notes for programming
  notes?: string;
}

// ===========================
// 3️⃣ PROGRESSION GRAPH LAYER
// ===========================
// Inter-exercise relationships as a graph
// Used for: Auto-regression, auto-progression, scaling, progression chains

export type ProgressionType = 
  | "regression"     // Make easier
  | "progression"    // Make harder
  | "variation"      // Alternative at same difficulty
  | "substitution"   // Replace due to equipment/injury
  | "preparation"    // Pre-activation / warm-up
  | "complementary"; // Program balance

export interface ExerciseProgression {
  // Graph edge definition
  id: number;
  fromExerciseId: number;     // Source exercise
  toExerciseId: number;       // Target exercise
  progressionType: ProgressionType;
  
  // Progression metadata
  difficulty_delta: number; // -2 to +5: relative difficulty change
  muscle_demand_delta?: number; // Change in muscle group demand
  
  // Programming details
  recommendedWait?: number; // Weeks before attempting progression
  order?: number; // For multi-step progressions, execution order
  
  // Cues for transitioning
  readinessIndicators?: string[]; // "5x5 at RPE 7", "form is clean"
  transitionCues?: string[]; // "Rest 30s less", "Increase tempo"
  
  notes?: string;
}

// Helper: Build progression chains
export interface ProgressionChain {
  exerciseIds: number[];
  title: string;
  description?: string;
  difficulty_range: [from: ExerciseDifficulty, to: ExerciseDifficulty];
}

// ===========================
// 4️⃣ SAFETY & CONSTRAINT LAYER
// ===========================
// Injury prevention and risk management
// Used for: Filter exercises based on user conditions, provide risk warnings

export type InjuryCondition = 
  | "lower_back_pain"
  | "knee_pain"
  | "shoulder_impingement"
  | "elbow_tendinitis"
  | "wrist_pain"
  | "ankle_instability"
  | "hip_pain"
  | "neck_pain"
  | "rotator_cuff_injury"
  | "acl_recovery"
  | "herniated_disc";

export type RiskLevel = "safe" | "caution" | "avoid";

export interface SafetyConstraint {
  // Reference
  id: number;
  exerciseId: number;
  
  // Hard exclusions
  avoidIf: InjuryCondition[]; // User has ANY of these → exclude exercise
  
  // Soft warnings
  cautionIf: InjuryCondition[]; // User has ANY of these → show warning, allow with modifications
  
  // Modifications for specific conditions
  modifications?: {
    condition: InjuryCondition;
    modification: string; // e.g., "Reduce range of motion", "Use reduced weight"
    riskLevel: RiskLevel;
  }[];
  
  // Risk scoring (optional, for more nuanced filtering)
  riskScores?: {
    condition: InjuryCondition;
    riskScore: number; // 0-100: impact on injury recovery
  }[];
  
  // Additional notes
  notes?: string;
}

// ===========================
// COMPOSITE TYPES
// ===========================
// For convenience when loading full exercise context

export interface FullExerciseContext {
  metadata: ExerciseCoreMetadata;
  programmingProfile: ExerciseProgrammingProfile;
  progressions?: ExerciseProgression[];
  safetyConstraints?: SafetyConstraint[];
}

export interface ExerciseSearchFilters {
  muscleGroups?: MuscleGroup[];
  movementPatterns?: MovementPattern[];
  mechanics?: MechanicsType[];
  difficultyLevel?: ExerciseDifficulty | ExerciseDifficulty[];
  forceType?: ForceType;
  equipment?: string[];
  excludeEquipment?: string[];
  isUnilateral?: boolean;
  maxDifficultyLevel?: ExerciseDifficulty;
  minDifficultyLevel?: ExerciseDifficulty;
}

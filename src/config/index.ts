/**
 * Application Configuration
 * Environment-based and static configuration
 */

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================

const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXTAUTH_PROVIDER_GITHUB_ID",
  "NEXTAUTH_PROVIDER_GITHUB_SECRET",
] as const;

const validateEnvironment = (): void => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

// ============================================================================
// APPLICATION CONFIG
// ============================================================================

export const appConfig = {
  name: "PocketGymAI",
  version: "0.1.0",
  description: "AI-powered personal fitness coaching in your pocket",
  environment: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// ============================================================================
// DATABASE CONFIG
// ============================================================================

export const databaseConfig = {
  url: process.env.DATABASE_URL!,
  provider: "sqlite",
} as const;

// ============================================================================
// NEXTAUTH CONFIG
// ============================================================================

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET!,
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  providers: {
    github: {
      id: process.env.NEXTAUTH_PROVIDER_GITHUB_ID!,
      secret: process.env.NEXTAUTH_PROVIDER_GITHUB_SECRET!,
    },
  },
} as const;

// ============================================================================
// AI / LANGCHAIN CONFIG
// ============================================================================

export const aiConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.AI_MODEL_NAME || "gpt-4",
  temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || "2000"),
} as const;

// ============================================================================
// API CONFIG
// ============================================================================

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  requestTimeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// ============================================================================
// LOGGING CONFIG
// ============================================================================

export const loggingConfig = {
  level: process.env.LOG_LEVEL || (appConfig.isDevelopment ? "debug" : "info"),
  format: process.env.LOG_FORMAT || "json",
  enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== "false",
  enableErrorLogging: process.env.ENABLE_ERROR_LOGGING !== "false",
} as const;

// ============================================================================
// SECURITY CONFIG
// ============================================================================

export const securityConfig = {
  bcryptRounds: 12,
  tokenSigningKey: process.env.TOKEN_SIGNING_KEY || "dev-secret-key",
  corsOrigins: ["http://localhost:3000", "http://localhost:3001"],
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100,
} as const;

// ============================================================================
// FEATURES CONFIG
// ============================================================================

export const featuresConfig = {
  aiCoach: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_AI_COACH === "true",
    useRAG: process.env.AI_COACH_USE_RAG === "true",
  },
  socialFeatures: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_FEATURES === "true",
  },
  subscriptions: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS === "true",
    stripeKey: process.env.STRIPE_PUBLIC_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  },
} as const;

// ============================================================================
// INITIALIZE CONFIG
// ============================================================================

if (appConfig.isDevelopment) {
  validateEnvironment();
}

/**
 * Get a config value safely with type checking
 */
export function getConfig<T = unknown>(
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split(".");
  let value: any = {
    appConfig,
    databaseConfig,
    authConfig,
    aiConfig,
    apiConfig,
    loggingConfig,
    securityConfig,
    featuresConfig,
  };

  for (const key of keys) {
    value = value?.[key];
  }

  return value !== undefined ? (value as T) : defaultValue;
}

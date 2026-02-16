/**
 * Validation Utilities
 * Input validation, sanitization, and type guards
 */

import { VALIDATION, ERROR_CODES } from "@/src/constants";
import { ValidationResult, AuthCredentials, SignUpPayload } from "@/src/types";

// ============================================================================
// RESULT BUILDER
// ============================================================================

export class ValidationBuilder {
  private errors: Record<string, string[]> = {};

  private addError(field: string, message: string): this {
    if (!this.errors[field]) {
      this.errors[field] = [];
    }
    this.errors[field].push(message);
    return this;
  }

  private hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  build(): ValidationResult {
    return {
      valid: !this.hasErrors(),
      errors: this.hasErrors() ? this.errors : undefined,
    };
  }

  // ========================================================================
  // FIELD VALIDATORS
  // ========================================================================

  validateEmail(email: string, fieldName: string = "email"): this {
    if (!email || !VALIDATION.EMAIL_REGEX.test(email)) {
      this.addError(fieldName, "Invalid email format");
    }
    return this;
  }

  validatePassword(password: string, fieldName: string = "password"): this {
    if (!password) {
      this.addError(fieldName, "Password is required");
      return this;
    }

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      this.addError(
        fieldName,
        `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
      );
    }

    if (!VALIDATION.PASSWORD_REGEX.test(password)) {
      this.addError(
        fieldName,
        "Password must contain letters, numbers, and special characters"
      );
    }

    return this;
  }

  validateName(name: string, fieldName: string = "name"): this {
    if (!name) {
      this.addError(fieldName, "Name is required");
      return this;
    }

    if (name.length < VALIDATION.NAME_MIN_LENGTH) {
      this.addError(fieldName, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`);
    }

    if (name.length > VALIDATION.NAME_MAX_LENGTH) {
      this.addError(fieldName, `Name must not exceed ${VALIDATION.NAME_MAX_LENGTH} characters`);
    }

    return this;
  }

  validateRequired(value: unknown, fieldName: string): this {
    if (value === null || value === undefined || value === "") {
      this.addError(fieldName, `${fieldName} is required`);
    }
    return this;
  }

  validateNumber(value: unknown, fieldName: string, min?: number, max?: number): this {
    if (typeof value !== "number") {
      this.addError(fieldName, `${fieldName} must be a number`);
      return this;
    }

    if (min !== undefined && value < min) {
      this.addError(fieldName, `${fieldName} must be at least ${min}`);
    }

    if (max !== undefined && value > max) {
      this.addError(fieldName, `${fieldName} must not exceed ${max}`);
    }

    return this;
  }

  validateString(value: unknown, fieldName: string, minLength?: number, maxLength?: number): this {
    if (typeof value !== "string") {
      this.addError(fieldName, `${fieldName} must be a string`);
      return this;
    }

    if (minLength !== undefined && value.length < minLength) {
      this.addError(fieldName, `${fieldName} must be at least ${minLength} characters`);
    }

    if (maxLength !== undefined && value.length > maxLength) {
      this.addError(fieldName, `${fieldName} must not exceed ${maxLength} characters`);
    }

    return this;
  }

  validateArray(value: unknown, fieldName: string, minLength?: number): this {
    if (!Array.isArray(value)) {
      this.addError(fieldName, `${fieldName} must be an array`);
      return this;
    }

    if (minLength !== undefined && value.length < minLength) {
      this.addError(fieldName, `${fieldName} must have at least ${minLength} items`);
    }

    return this;
  }

  validateEnum(value: unknown, fieldName: string, validValues: readonly string[]): this {
    if (!validValues.includes(String(value))) {
      this.addError(fieldName, `${fieldName} must be one of: ${validValues.join(", ")}`);
    }
    return this;
  }

  validateUrl(url: string, fieldName: string = "url"): this {
    try {
      new URL(url);
    } catch {
      this.addError(fieldName, "Invalid URL format");
    }
    return this;
  }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateAuthCredentials(data: unknown): ValidationResult {
  if (typeof data !== "object" || data === null) {
    return {
      valid: false,
      errors: { body: ["Invalid request body"] },
    };
  }

  const { email, password } = data as Record<string, unknown>;

  return new ValidationBuilder()
    .validateEmail(String(email))
    .validatePassword(String(password))
    .build();
}

export function validateSignUpPayload(data: unknown): ValidationResult {
  if (typeof data !== "object" || data === null) {
    return {
      valid: false,
      errors: { body: ["Invalid request body"] },
    };
  }

  const { email, password, name } = data as Record<string, unknown>;

  return new ValidationBuilder()
    .validateEmail(String(email))
    .validatePassword(String(password))
    .validateName(String(name))
    .build();
}

export function validateUpdateProfilePayload(data: unknown): ValidationResult {
  if (typeof data !== "object" || data === null) {
    return {
      valid: false,
      errors: { body: ["Invalid request body"] },
    };
  }

  const { name, age, weight, height } = data as Record<string, unknown>;

  const builder = new ValidationBuilder();

  if (name !== undefined && name !== null) {
    builder.validateName(String(name));
  }

  if (age !== undefined && age !== null) {
    builder.validateNumber(age, "age", 1, 120);
  }

  if (weight !== undefined && weight !== null) {
    builder.validateNumber(weight, "weight", 1, 500);
  }

  if (height !== undefined && height !== null) {
    builder.validateNumber(height, "height", 30, 300);
  }

  return builder.build();
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isAuthCredentials(data: unknown): data is AuthCredentials {
  if (typeof data !== "object" || data === null) return false;
  const { email, password } = data as Record<string, unknown>;
  return typeof email === "string" && typeof password === "string";
}

export function isSignUpPayload(data: unknown): data is SignUpPayload {
  if (typeof data !== "object" || data === null) return false;
  const { email, password, name } = data as Record<string, unknown>;
  return typeof email === "string" && typeof password === "string" && typeof name === "string";
}

// ============================================================================
// SANITIZATION
// ============================================================================

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeString(str: string): string {
  return str.trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

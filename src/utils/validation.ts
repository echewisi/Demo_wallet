/**
 * Validation utilities for the Demo Credit Wallet Service
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (basic validation)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates amount (must be positive number)
 */
export const validateAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount > 0 && Number.isFinite(amount);
};

/**
 * Validates UUID format
 */
export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validates user registration data
 */
export const validateUserRegistration = (userData: {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!userData.name || userData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!userData.email || !validateEmail(userData.email)) {
    errors.push('Valid email is required');
  }

  if (!userData.phone || !validatePhone(userData.phone)) {
    errors.push('Valid phone number is required');
  }

  if (!userData.password || !validatePassword(userData.password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates wallet operation data
 */
export const validateWalletOperation = (operationData: {
  userId?: string;
  amount?: number;
  password?: string;
  recipientWalletId?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!operationData.userId || !validateUUID(operationData.userId)) {
    errors.push('Valid user ID is required');
  }

  if (!operationData.amount || !validateAmount(operationData.amount)) {
    errors.push('Valid amount is required (must be positive number)');
  }

  if (!operationData.password || operationData.password.trim().length === 0) {
    errors.push('Password is required');
  }

  if (operationData.recipientWalletId && !validateUUID(operationData.recipientWalletId)) {
    errors.push('Valid recipient wallet ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};


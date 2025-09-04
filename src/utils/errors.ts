/**
 * Custom error classes for the Demo Credit Wallet Service
 */

export class WalletError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 400, isOperational: boolean = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends WalletError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends WalletError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends WalletError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends WalletError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends WalletError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

export class InsufficientFundsError extends WalletError {
  constructor(message: string = 'Insufficient funds') {
    super(message, 400);
  }
}

export class BlacklistError extends WalletError {
  constructor(message: string = 'User is blacklisted') {
    super(message, 403);
  }
}

export class DatabaseError extends WalletError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, false);
  }
}

export class ExternalServiceError extends WalletError {
  constructor(message: string = 'External service error') {
    super(message, 502, false);
  }
}


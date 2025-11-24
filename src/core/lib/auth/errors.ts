/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  code: string;
  originalError?: any;
  
  constructor(message: string, code: string, originalError?: any) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.originalError = originalError;
    
    // Log detailed error server-side
    if (typeof window === 'undefined') {
      console.error('[AuthError]', {
        message,
        code,
        originalError,
      });
    }
  }
  
  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    return this.message;
  }
  
  /**
   * Get suggestion for resolving the error
   */
  getSuggestion(): string {
    switch (this.code) {
      case 'LOGIN_FAILED':
        return 'Please check your email and password and try again.';
      case 'EMAIL_EXISTS':
        return 'Try logging in or use a different email address.';
      case 'NOT_AUTHENTICATED':
        return 'Please log in to continue.';
      case 'RESET_FAILED':
        return 'Please check the email address and try again.';
      default:
        return 'Please try again or contact support if the problem persists.';
    }
  }
}

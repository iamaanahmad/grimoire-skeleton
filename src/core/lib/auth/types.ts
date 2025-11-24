/**
 * User role types for authorization
 */
export type Role = 'admin' | 'staff' | 'user';

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

/**
 * Password reset data
 */
export interface PasswordResetData {
  email: string;
}

/**
 * Password update data
 */
export interface PasswordUpdateData {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

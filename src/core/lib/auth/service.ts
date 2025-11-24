import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from '@/core/lib/appwrite';
import { ID } from 'appwrite';
import { User, LoginCredentials, RegisterData } from './types';
import { AuthError } from './errors';

/**
 * Log in a user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    await account.createEmailPasswordSession(credentials.email, credentials.password);
    return await getCurrentUser();
  } catch (error: any) {
    throw new AuthError(
      'Invalid email or password',
      'LOGIN_FAILED',
      error
    );
  }
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<User> {
  try {
    // Create account
    await account.create(
      ID.unique(),
      data.email,
      data.password,
      data.name
    );
    
    // Send verification email
    await account.createVerification(
      `${window.location.origin}/verify-email`
    );
    
    // Log in the user
    return await login({
      email: data.email,
      password: data.password,
    });
  } catch (error: any) {
    if (error.code === 409) {
      throw new AuthError(
        'An account with this email already exists',
        'EMAIL_EXISTS',
        error
      );
    }
    throw new AuthError(
      'Failed to create account',
      'REGISTRATION_FAILED',
      error
    );
  }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    throw new AuthError(
      'Failed to log out',
      'LOGOUT_FAILED',
      error
    );
  }
}

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const appwriteUser = await account.get();
    
    // Try to fetch user roles from database
    let roles: string[] = ['user'];
    try {
      const userDoc = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        appwriteUser.$id
      );
      roles = userDoc.roles || ['user'];
    } catch (dbError) {
      // If user document doesn't exist, use default role
      console.warn('User document not found, using default role');
    }
    
    return {
      id: appwriteUser.$id,
      email: appwriteUser.email,
      name: appwriteUser.name,
      roles: roles as any,
      emailVerified: appwriteUser.emailVerification,
      createdAt: new Date(appwriteUser.$createdAt),
      updatedAt: new Date(appwriteUser.$updatedAt),
    };
  } catch (error: any) {
    throw new AuthError(
      'Not authenticated',
      'NOT_AUTHENTICATED',
      error
    );
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await account.createRecovery(
      email,
      `${window.location.origin}/reset-password`
    );
  } catch (error: any) {
    throw new AuthError(
      'Failed to send password reset email',
      'RESET_FAILED',
      error
    );
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  oldPassword: string,
  newPassword: string
): Promise<void> {
  try {
    await account.updatePassword(newPassword, oldPassword);
  } catch (error: any) {
    throw new AuthError(
      'Failed to update password',
      'UPDATE_PASSWORD_FAILED',
      error
    );
  }
}

/**
 * Update user name
 */
export async function updateName(name: string): Promise<User> {
  try {
    await account.updateName(name);
    return await getCurrentUser();
  } catch (error: any) {
    throw new AuthError(
      'Failed to update name',
      'UPDATE_NAME_FAILED',
      error
    );
  }
}

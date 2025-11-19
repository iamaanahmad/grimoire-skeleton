# Design Document - Authentication & Authorization System

## Overview

The Authentication and Authorization System provides secure user authentication and role-based access control using Appwrite as the backend service. The design integrates seamlessly with Next.js App Router, supports Server-Side Rendering, and implements security best practices. The system consists of authentication services, React context for state management, protected route mechanisms, and middleware for server-side checks.

## Architecture

### High-Level Flow

```
User Registration Flow:
User → Register Form → Appwrite Auth → Email Verification → Login

User Login Flow:
User → Login Form → Appwrite Auth → Session Cookie → Protected Routes

Protected Route Access:
Request → Middleware → Session Check → Allow/Redirect

Role Check:
Component → useAuth Hook → User Roles → Permission Check → Show/Hide
```

### System Components

**Authentication Layer:**
- Appwrite client configuration
- Auth service functions (login, register, logout, etc.)
- Session management
- Error handling

**State Management Layer:**
- AuthContext for global auth state
- useAuth hook for component access
- Loading and error states

**Protection Layer:**
- withAuth HOC for component protection
- Middleware for route protection
- Permission checking utilities

**UI Layer:**
- Login page
- Register page
- Forgot password page
- Profile page


## Components and Interfaces

### Core Type Definitions

**src/core/lib/auth/types.ts:**

```typescript
/**
 * User object with authentication and profile information
 */
export interface User {
  $id: string;
  email: string;
  name: string;
  emailVerification: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Available user roles for access control
 */
export type Role = 'admin' | 'staff' | 'user';

/**
 * Authentication state for the application
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Credentials for user login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Data for user registration
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

/**
 * Data for password reset
 */
export interface PasswordResetData {
  email: string;
}

/**
 * Data for password update
 */
export interface PasswordUpdateData {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
```

### Appwrite Configuration

**src/core/lib/appwrite.ts:**

```typescript
import { Client, Account, Databases, Storage } from 'appwrite';

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error(
    'Missing Appwrite configuration. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID'
  );
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };
```

### Authentication Service

**src/core/lib/auth/service.ts:**

```typescript
import { account } from '@/core/lib/appwrite';
import { ID } from 'appwrite';
import type { User, LoginCredentials, RegisterData } from './types';

/**
 * Log in a user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    await account.createEmailSession(credentials.email, credentials.password);
    const user = await getCurrentUser();
    return user;
  } catch (error: any) {
    throw new AuthError(error.message || 'Login failed', error.code);
  }
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<User> {
  try {
    // Validate password confirmation
    if (data.password !== data.passwordConfirm) {
      throw new AuthError('Passwords do not match', 'password_mismatch');
    }
    
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
    throw new AuthError(error.message || 'Registration failed', error.code);
  }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    throw new AuthError(error.message || 'Logout failed', error.code);
  }
}

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const user = await account.get();
    
    // Fetch user roles from database
    const roles = await getUserRoles(user.$id);
    
    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
      emailVerification: user.emailVerification,
      roles,
      createdAt: user.$createdAt,
      updatedAt: user.$updatedAt,
    };
  } catch (error: any) {
    throw new AuthError(error.message || 'Failed to get user', error.code);
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
      error.message || 'Failed to send reset email',
      error.code
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
      error.message || 'Failed to update password',
      error.code
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
    throw new AuthError(error.message || 'Failed to update name', error.code);
  }
}

/**
 * Get user roles from database
 */
async function getUserRoles(userId: string): Promise<Role[]> {
  // This would query the users collection in Appwrite
  // For now, return default role
  return ['user'];
}

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'unknown') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}
```

### Authentication Context

**src/core/lib/auth/AuthContext.tsx:**

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, logout as logoutService } from './service';
import type { User, AuthState } from './types';

interface AuthContextValue extends AuthState {
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  
  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);
  
  async function loadUser() {
    try {
      const user = await getCurrentUser();
      setState({ user, loading: false, error: null });
    } catch (error) {
      setState({ user: null, loading: false, error: error as Error });
    }
  }
  
  function login(user: User) {
    setState({ user, loading: false, error: null });
  }
  
  async function logout() {
    try {
      await logoutService();
      setState({ user: null, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
      throw error;
    }
  }
  
  function updateUser(user: User) {
    setState((prev) => ({ ...prev, user }));
  }
  
  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    updateUser,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication state and functions
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
```

### Protected Route HOC

**src/core/lib/auth/withAuth.tsx:**

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import type { Role } from './types';

interface WithAuthOptions {
  requiredRoles?: Role[];
  redirectTo?: string;
}

/**
 * Higher-order component to protect routes
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function ProtectedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { requiredRoles = [], redirectTo = '/login' } = options;
    
    useEffect(() => {
      if (!loading) {
        // Not authenticated
        if (!user) {
          router.push(redirectTo);
          return;
        }
        
        // Check role requirements
        if (requiredRoles.length > 0) {
          const hasRequiredRole = requiredRoles.some((role) =>
            user.roles.includes(role)
          );
          
          if (!hasRequiredRole) {
            router.push('/access-denied');
            return;
          }
        }
      }
    }, [user, loading, router]);
    
    // Show loading state
    if (loading) {
      return <LoadingSpinner />;
    }
    
    // Show nothing while redirecting
    if (!user) {
      return null;
    }
    
    // Check roles
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) =>
        user.roles.includes(role)
      );
      
      if (!hasRequiredRole) {
        return null;
      }
    }
    
    // Render protected component
    return <Component {...props} />;
  };
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}
```

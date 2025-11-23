# Design Document - Authentication & Authorization System

## Overview

The Authentication and Authorization System provides secure user management using Appwrite as the backend service. The architecture integrates seamlessly with Next.js App Router, supporting both client-side and server-side authentication checks. The system implements role-based access control, session management, and protected routes while maintaining excellent user experience and security best practices.

## Architecture

### High-Level Flow

```
User Registration/Login
         ↓
Appwrite Authentication
         ↓
Session Cookie Created
         ↓
AuthContext Updates
         ↓
Protected Routes Check Session
         ↓
Role-Based Access Control
         ↓
Authorized Access Granted
```

### System Components

**Authentication Layer:**
- Appwrite client configuration
- Auth service (login, register, logout, password reset)
- Session management
- Error handling

**State Management Layer:**
- AuthContext for global auth state
- useAuth hook for component access
- Loading and error states

**Protection Layer:**
- withAuth HOC for route protection
- Middleware for server-side checks
- Permission checking utilities

**UI Layer:**
- Login page
- Register page
- Forgot password page
- Profile page
- Auth-related components


## Components and Interfaces

### Core Type Definitions

**src/core/lib/auth/types.ts:**

```typescript
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
```

### Appwrite Configuration

**src/core/lib/appwrite.ts:**

```typescript
import { Client, Account, Databases, Storage } from 'appwrite';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_APPWRITE_ENDPOINT is not defined');
}

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not defined');
}

/**
 * Appwrite client instance
 */
export const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

/**
 * Appwrite Account service for authentication
 */
export const account = new Account(client);

/**
 * Appwrite Databases service
 */
export const databases = new Databases(client);

/**
 * Appwrite Storage service
 */
export const storage = new Storage(client);

/**
 * Database and collection IDs
 */
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'grimoire';
export const USERS_COLLECTION_ID = 'users';
```

### Authentication Service

**src/core/lib/auth/service.ts:**

```typescript
import { account } from '@/core/lib/appwrite';
import { ID } from 'appwrite';
import { User, LoginCredentials, RegisterData } from './types';
import { AuthError } from './errors';

/**
 * Log in a user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    await account.createEmailSession(credentials.email, credentials.password);
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
    
    // Fetch user roles from database
    const userDoc = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      appwriteUser.$id
    );
    
    return {
      id: appwriteUser.$id,
      email: appwriteUser.email,
      name: appwriteUser.name,
      roles: userDoc.roles || ['user'],
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
```

### Authentication Context

**src/core/lib/auth/AuthContext.tsx:**

```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from './types';
import { getCurrentUser } from './service';

interface AuthContextValue extends AuthState {
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  
  const loadUser = async () => {
    try {
      const user = await getCurrentUser();
      setState({ user, loading: false, error: null });
    } catch (error) {
      setState({ user: null, loading: false, error: null });
    }
  };
  
  useEffect(() => {
    loadUser();
  }, []);
  
  const refreshUser = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await loadUser();
  };
  
  return (
    <AuthContext.Provider value={{ ...state, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication state
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
import { Role } from './types';

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
    const { requiredRoles, redirectTo = '/login' } = options;
    
    useEffect(() => {
      if (!loading) {
        // Not authenticated
        if (!user) {
          router.push(redirectTo);
          return;
        }
        
        // Check role requirements
        if (requiredRoles && requiredRoles.length > 0) {
          const hasRequiredRole = requiredRoles.some((role) =>
            user.roles.includes(role)
          );
          
          if (!hasRequiredRole) {
            router.push('/unauthorized');
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
    if (requiredRoles && requiredRoles.length > 0) {
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
```

### Permission Utilities

**src/core/lib/auth/permissions.ts:**

```typescript
import { User, Role } from './types';

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: Role): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.some((role) => user.roles.includes(role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: User | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.every((role) => user.roles.includes(role));
}

/**
 * Check if user can access a feature based on entity permissions
 */
export function canAccessFeature(
  user: User | null,
  requiredRoles: Role[]
): boolean {
  if (!user) return false;
  if (requiredRoles.length === 0) return true;
  return hasAnyRole(user, requiredRoles);
}

/**
 * Permission constants for common checks
 */
export const Permissions = {
  ADMIN_ONLY: ['admin'] as Role[],
  STAFF_AND_ADMIN: ['staff', 'admin'] as Role[],
  ALL_AUTHENTICATED: [] as Role[],
} as const;
```


### Error Handling

**src/core/lib/auth/errors.ts:**

```typescript
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
```

### Middleware

**src/middleware.ts:**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes that require authentication
 */
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/tournaments',
  '/appointments',
];

/**
 * Routes that should redirect to dashboard if authenticated
 */
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  // Check if route is auth-only (login/register)
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  // Get session from cookie
  const session = request.cookies.get('appwrite-session');
  
  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect to dashboard if accessing auth routes with session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

## Data Models

### User Document Structure (Appwrite)

```typescript
// Collection: users
{
  $id: string;              // User ID (matches Appwrite Auth user ID)
  email: string;            // User email
  name: string;             // User display name
  roles: string[];          // Array of role strings ['user', 'staff', 'admin']
  $createdAt: string;       // ISO timestamp
  $updatedAt: string;       // ISO timestamp
}
```

### Session Cookie Structure

```
Name: appwrite-session
Value: <encrypted session token>
HttpOnly: true
Secure: true (in production)
SameSite: Strict
Path: /
Max-Age: 31536000 (1 year)
```

## UI Components

### Login Page

**src/app/login/page.tsx:**

```typescript
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/core/lib/auth/service';
import { AuthError } from '@/core/lib/auth/errors';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login({ email, password });
      router.push(redirectTo);
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.getUserMessage());
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Enter the Grimoire</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Summoning...' : 'Summon Session'}
          </button>
        </form>
        
        <div className="auth-links">
          <a href="/forgot-password">Forgot your incantation?</a>
          <a href="/register">Join the coven</a>
        </div>
      </div>
    </div>
  );
}
```

### Register Page

**src/app/register/page.tsx:**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/core/lib/auth/service';
import { AuthError } from '@/core/lib/auth/errors';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.getUserMessage());
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Join the Grimoire</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoComplete="name"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              id="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              required
              autoComplete="new-password"
            />
          </div>
          
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Casting...' : 'Cast Registration Spell'}
          </button>
        </form>
        
        <div className="auth-links">
          <a href="/login">Already have an account?</a>
        </div>
      </div>
    </div>
  );
}
```

## Testing Strategy

### Unit Tests

**Authentication Service Tests:**
```typescript
describe('auth service', () => {
  it('should login with valid credentials', async () => {
    const user = await login({
      email: 'test@example.com',
      password: 'password123',
    });
    
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
  
  it('should throw error with invalid credentials', async () => {
    await expect(
      login({ email: 'test@example.com', password: 'wrong' })
    ).rejects.toThrow(AuthError);
  });
  
  it('should register new user', async () => {
    const user = await register({
      name: 'Test User',
      email: 'new@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    });
    
    expect(user).toBeDefined();
    expect(user.email).toBe('new@example.com');
  });
});
```

**Permission Tests:**
```typescript
describe('permissions', () => {
  it('should check if user has role', () => {
    const user: User = {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin',
      roles: ['admin'],
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    expect(hasRole(user, 'admin')).toBe(true);
    expect(hasRole(user, 'staff')).toBe(false);
  });
  
  it('should check if user has any role', () => {
    const user: User = {
      id: '1',
      email: 'staff@example.com',
      name: 'Staff',
      roles: ['staff'],
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    expect(hasAnyRole(user, ['admin', 'staff'])).toBe(true);
    expect(hasAnyRole(user, ['admin'])).toBe(false);
  });
});
```

## Design Decisions

### Why Appwrite?

- Complete authentication solution out of the box
- Email verification and password reset built-in
- Session management handled automatically
- Good TypeScript SDK
- Easy to set up and deploy

### Why HTTP-Only Cookies?

- More secure than localStorage (not accessible to JavaScript)
- Automatically sent with requests
- Works with SSR
- Protected against XSS attacks

### Why Context + HOC Pattern?

- Context provides global auth state
- HOC provides reusable route protection
- Separates concerns cleanly
- Easy to test and maintain

### Why Custom Error Class?

- Provides consistent error handling
- User-friendly messages separate from technical details
- Includes suggestions for resolution
- Enables proper logging

## Security Considerations

### Password Security
- Passwords hashed by Appwrite (bcrypt)
- Minimum 8 characters enforced
- Password strength indicator on registration
- Secure password reset flow

### Session Security
- HTTP-only cookies prevent XSS access
- Secure flag in production (HTTPS only)
- SameSite=Strict prevents CSRF
- Session expiration and refresh

### API Security
- Authentication required for protected endpoints
- Role-based authorization checks
- Rate limiting on auth endpoints
- Input validation and sanitization

### Error Messages
- Don't leak sensitive information
- Generic messages for security-critical errors
- Detailed logging server-side only
- Helpful suggestions without revealing system details

## Implementation Phases

### Phase 1: Foundation (Tasks 1-4)
- Appwrite configuration
- Core types
- Auth service
- Auth context

### Phase 2: UI (Tasks 5-7)
- Login page
- Register page
- Forgot password page

### Phase 3: Protection (Tasks 8-9, 11)
- withAuth HOC
- Permission utilities
- Middleware

### Phase 4: Profile & Session (Tasks 10, 12)
- Profile page
- Session management

### Phase 5: Error Handling & Docs (Tasks 13-15)
- Error handling
- Tests
- Documentation

## Success Metrics

- Authentication check completes in under 100ms
- Zero security vulnerabilities in auth flow
- Clear error messages for all failure cases
- Works seamlessly with SSR
- Easy to protect routes (single HOC wrapper)
- Comprehensive test coverage (>80%)

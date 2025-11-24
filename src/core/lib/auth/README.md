# Authentication System

The Grimoire authentication system provides secure user management using Appwrite as the backend service. It includes role-based access control, session management, and protected routes.

## Architecture

```
User → Login/Register → Appwrite Auth → Session Cookie → AuthContext → Protected Routes
```

## Quick Start

### 1. Setup Appwrite

1. Create an Appwrite project at https://cloud.appwrite.io
2. Copy your project ID and endpoint
3. Add them to `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=grimoire
```

### 2. Wrap Your App with AuthProvider

In your root layout (`src/app/layout.tsx`):

```tsx
import { AuthProvider } from '@/core/lib/auth/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Usage

### Accessing Auth State

Use the `useAuth` hook in any component:

```tsx
import { useAuth } from '@/core/lib/auth/AuthContext';

function MyComponent() {
  const { user, loading, error } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Protecting Routes

Use the `withAuth` HOC to protect entire pages:

```tsx
import { withAuth } from '@/core/lib/auth/withAuth';

function DashboardPage() {
  return <div>Protected Dashboard</div>;
}

// Require authentication
export default withAuth(DashboardPage);

// Require specific roles
export default withAuth(DashboardPage, {
  requiredRoles: ['admin', 'staff']
});
```

### Checking Permissions

Use permission utilities for fine-grained control:

```tsx
import { useAuth } from '@/core/lib/auth/AuthContext';
import { hasRole, hasAnyRole } from '@/core/lib/auth/permissions';

function AdminPanel() {
  const { user } = useAuth();
  
  if (!hasRole(user, 'admin')) {
    return <div>Admin access required</div>;
  }
  
  return <div>Admin Panel</div>;
}

function StaffFeature() {
  const { user } = useAuth();
  
  if (!hasAnyRole(user, ['admin', 'staff'])) {
    return null;
  }
  
  return <button>Staff Action</button>;
}
```

### Authentication Actions

```tsx
import { login, register, logout, resetPassword } from '@/core/lib/auth/service';

// Login
await login({ email: 'user@example.com', password: 'password123' });

// Register
await register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
});

// Logout
await logout();

// Reset password
await resetPassword('user@example.com');
```

## User Roles

The system supports three roles:

- **user**: Default role for all registered users
- **staff**: Elevated permissions for staff members
- **admin**: Full access to all features

Roles are stored in the Appwrite database in a `users` collection.

## Security Features

- **HTTP-only cookies**: Session tokens stored securely
- **Password hashing**: Handled by Appwrite (bcrypt)
- **CSRF protection**: SameSite cookie policy
- **Email verification**: Optional verification flow
- **Password reset**: Secure token-based reset

## Error Handling

All auth functions throw `AuthError` with user-friendly messages:

```tsx
try {
  await login(credentials);
} catch (err) {
  if (err instanceof AuthError) {
    console.log(err.getUserMessage()); // User-friendly message
    console.log(err.getSuggestion());  // Resolution hint
  }
}
```

## Troubleshooting

### "Not authenticated" errors

- Check that Appwrite endpoint and project ID are correct
- Verify session cookie is being set (check browser dev tools)
- Ensure AuthProvider wraps your app

### Middleware not working

- Check that `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is set
- Verify cookie name matches Appwrite's format
- Check middleware matcher configuration

### Role checks failing

- Ensure users collection exists in Appwrite
- Verify user document has `roles` array field
- Check that roles are assigned correctly

### CORS errors

- Add your domain to Appwrite's allowed origins
- Check that endpoint URL is correct
- Verify project ID matches

## API Reference

### Types

- `User`: Authenticated user data
- `Role`: 'admin' | 'staff' | 'user'
- `LoginCredentials`: { email, password }
- `RegisterData`: { name, email, password, passwordConfirm }

### Functions

- `login(credentials)`: Authenticate user
- `register(data)`: Create new account
- `logout()`: End session
- `getCurrentUser()`: Get authenticated user
- `resetPassword(email)`: Send reset email
- `updatePassword(old, new)`: Change password
- `updateName(name)`: Update user name

### Hooks

- `useAuth()`: Access auth state

### HOCs

- `withAuth(Component, options)`: Protect routes

### Utilities

- `hasRole(user, role)`: Check single role
- `hasAnyRole(user, roles)`: Check multiple roles
- `hasAllRoles(user, roles)`: Require all roles
- `canAccessFeature(user, roles)`: Entity permission check

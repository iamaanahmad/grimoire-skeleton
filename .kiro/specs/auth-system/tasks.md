# Implementation Plan - Authentication & Authorization System

- [ ] 1. Configure Appwrite client
  - [ ] 1.1 Create src/core/lib/appwrite.ts
    - Initialize Appwrite Client with endpoint and project ID from environment variables
    - Validate that required environment variables are present
    - Export Account service instance for authentication
    - Export Databases service instance for data access
    - Export Storage service instance for file management
    - Define and export DATABASE_ID and USERS_COLLECTION_ID constants
    - _Requirements: 1.2, 2.2, 8.2, 10.3_
  
  - [ ] 1.2 Add Appwrite environment variables to .env.local.example
    - Document NEXT_PUBLIC_APPWRITE_ENDPOINT
    - Document NEXT_PUBLIC_APPWRITE_PROJECT_ID
    - Document NEXT_PUBLIC_APPWRITE_DATABASE_ID
    - Add comments explaining each variable
    - _Requirements: 1.2, 2.2_

- [ ] 2. Create authentication type definitions
  - [ ] 2.1 Create src/core/lib/auth/types.ts
    - Define Role type as union of 'admin', 'staff', 'user'
    - Define User interface with id, email, name, roles, emailVerified, createdAt, updatedAt
    - Define AuthState interface with user, loading, error
    - Define LoginCredentials interface with email and password
    - Define RegisterData interface with name, email, password, passwordConfirm
    - Define PasswordResetData interface with email
    - Define PasswordUpdateData interface with oldPassword, newPassword, newPasswordConfirm
    - Add JSDoc comments to all types
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 9.1, 13.1_

- [ ] 3. Implement authentication service
  - [ ] 3.1 Create src/core/lib/auth/service.ts
    - Implement login function accepting LoginCredentials
    - Implement register function accepting RegisterData
    - Implement logout function to end session
    - Implement getCurrentUser function to fetch authenticated user
    - Implement resetPassword function accepting email
    - Implement updatePassword function accepting old and new passwords
    - Implement updateName function accepting new name
    - Handle Appwrite API errors and convert to AuthError
    - Add JSDoc comments to all functions
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 9.2, 9.3, 9.4_
  
  - [ ] 3.2 Integrate user roles from database
    - Fetch user document from users collection after authentication
    - Extract roles array from user document
    - Default to ['user'] role if no roles defined
    - _Requirements: 5.2, 5.3_

- [ ] 4. Create custom error handling
  - [ ] 4.1 Create src/core/lib/auth/errors.ts
    - Define AuthError class extending Error
    - Add code property for error type identification
    - Add originalError property for debugging
    - Implement getUserMessage method for user-friendly messages
    - Implement getSuggestion method for resolution hints
    - Add server-side logging in constructor
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 5. Build authentication context
  - [ ] 5.1 Create src/core/lib/auth/AuthContext.tsx
    - Create AuthContext with React.createContext
    - Implement AuthProvider component with state management
    - Implement loadUser function to fetch current user on mount
    - Implement refreshUser function to reload user data
    - Add useEffect to load user when provider mounts
    - Handle loading and error states appropriately
    - _Requirements: 8.1, 8.2, 8.3, 13.1, 13.2, 13.3, 13.4_
  
  - [ ] 5.2 Create useAuth hook
    - Implement useAuth hook that accesses AuthContext
    - Throw error if used outside AuthProvider
    - Return user, loading, error, and refreshUser
    - _Requirements: 13.2, 13.3_
  
  - [ ] 5.3 Optimize context to prevent unnecessary re-renders
    - Use useMemo or useCallback where appropriate
    - Ensure state updates don't cause cascading re-renders
    - _Requirements: 13.5_

- [ ] 6. Create login page
  - [ ] 6.1 Create src/app/login/page.tsx
    - Create form with email and password inputs
    - Implement form state management
    - Implement handleSubmit function calling login service
    - Display error messages from AuthError
    - Show loading state during submission
    - Redirect to dashboard (or redirect param) on success
    - Add links to register and forgot password pages
    - Apply spooky theme styling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.5, 11.1_
  
  - [ ] 6.2 Add form validation
    - Validate email format
    - Require password field
    - Show validation errors inline
    - _Requirements: 2.1_
  
  - [ ] 6.3 Make login page accessible
    - Add proper labels with htmlFor
    - Add ARIA attributes for errors
    - Support keyboard navigation
    - Add autocomplete attributes
    - _Requirements: 2.1_

- [ ] 7. Create register page
  - [ ] 7.1 Create src/app/register/page.tsx
    - Create form with name, email, password, and password confirmation inputs
    - Implement form state management
    - Implement handleSubmit function calling register service
    - Validate passwords match before submission
    - Validate password strength (minimum 8 characters)
    - Display error messages from AuthError
    - Show loading state during submission
    - Redirect to dashboard on success
    - Add link to login page
    - Apply spooky theme styling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 11.2_
  
  - [ ] 7.2 Add password strength indicator
    - Show visual indicator of password strength
    - Update as user types
    - Provide feedback on requirements
    - _Requirements: 1.5, 12.4_
  
  - [ ] 7.3 Make register page accessible
    - Add proper labels with htmlFor
    - Add ARIA attributes for errors
    - Support keyboard navigation
    - Add autocomplete attributes
    - _Requirements: 1.1_

- [ ] 8. Create forgot password page
  - [ ] 8.1 Create src/app/forgot-password/page.tsx
    - Create form with email input
    - Implement form state management
    - Implement handleSubmit function calling resetPassword service
    - Display success message after submission
    - Display error messages from AuthError
    - Show loading state during submission
    - Add link back to login page
    - Apply spooky theme styling
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [ ] 8.2 Make forgot password page accessible
    - Add proper labels
    - Add ARIA attributes
    - Support keyboard navigation
    - _Requirements: 3.1_

- [ ] 9. Implement protected route HOC
  - [ ] 9.1 Create src/core/lib/auth/withAuth.tsx
    - Create withAuth higher-order component accepting Component and options
    - Accept requiredRoles and redirectTo in options
    - Use useAuth hook to get authentication state
    - Use useRouter for navigation
    - Redirect to login if user is not authenticated
    - Redirect to unauthorized if user lacks required role
    - Show loading spinner while checking authentication
    - Return null while redirecting
    - Render wrapped component when authorized
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3_
  
  - [ ] 9.2 Create LoadingSpinner component
    - Create reusable loading component for auth checks
    - Apply spooky theme styling
    - _Requirements: 6.3_

- [ ] 10. Create permission utilities
  - [ ] 10.1 Create src/core/lib/auth/permissions.ts
    - Implement hasRole function checking if user has specific role
    - Implement hasAnyRole function checking if user has any of specified roles
    - Implement hasAllRoles function checking if user has all specified roles
    - Implement canAccessFeature function for entity permission integration
    - Define Permissions constants for common permission checks
    - Add JSDoc comments to all functions
    - _Requirements: 5.1, 5.3, 5.4, 5.5_

- [ ] 11. Create user profile page
  - [ ] 11.1 Create src/app/profile/page.tsx
    - Wrap page with withAuth HOC
    - Display user information (name, email, roles)
    - Create form to update name
    - Create form to change password
    - Implement handleUpdateName function
    - Implement handleUpdatePassword function
    - Add logout button
    - Display success/error messages
    - Apply spooky theme styling
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 11.2 Make profile page accessible
    - Add proper labels and ARIA attributes
    - Support keyboard navigation
    - Announce success/error messages to screen readers
    - _Requirements: 9.1_

- [ ] 12. Implement authentication middleware
  - [ ] 12.1 Create src/middleware.ts
    - Define protectedRoutes array with routes requiring authentication
    - Define authRoutes array with login/register routes
    - Implement middleware function checking pathname
    - Check for session cookie
    - Redirect to login if accessing protected route without session
    - Redirect to dashboard if accessing auth route with session
    - Preserve intended destination in redirect query parameter
    - Configure matcher to exclude API routes and static files
    - _Requirements: 6.1, 6.2, 6.5, 10.1, 10.2, 10.3, 14.1, 14.2, 14.3, 14.4_
  
  - [ ] 12.2 Test middleware with various routes
    - Test protected route without session
    - Test protected route with session
    - Test auth route with session
    - Test public routes
    - _Requirements: 14.5_

- [ ] 13. Implement session management
  - [ ] 13.1 Create src/core/lib/auth/session.ts
    - Implement getSession function to read session from cookies
    - Implement validateSession function to check session validity
    - Implement refreshSession function to extend session before expiration
    - Implement clearSession function for logout
    - Handle session expiration gracefully
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 13.2 Integrate session refresh into AuthContext
    - Check session expiration periodically
    - Refresh session automatically when needed
    - _Requirements: 8.5_

- [ ] 14. Add unauthorized page
  - [ ] 14.1 Create src/app/unauthorized/page.tsx
    - Display message explaining insufficient permissions
    - Add link to go back or return to dashboard
    - Apply spooky theme styling
    - _Requirements: 7.2, 7.3_

- [ ]* 15. Write authentication tests
  - [ ]* 15.1 Create src/core/lib/auth/__tests__/service.test.ts
    - Test login with valid credentials
    - Test login with invalid credentials
    - Test register with valid data
    - Test register with existing email
    - Test logout functionality
    - Test getCurrentUser
    - Test password reset
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3_
  
  - [ ]* 15.2 Create src/core/lib/auth/__tests__/permissions.test.ts
    - Test hasRole function
    - Test hasAnyRole function
    - Test hasAllRoles function
    - Test canAccessFeature function
    - _Requirements: 5.1, 5.3, 5.4, 5.5_
  
  - [ ]* 15.3 Create integration tests for auth flow
    - Test complete registration flow
    - Test complete login flow
    - Test protected route access
    - Test role-based access
    - _Requirements: 1.1, 2.1, 6.1, 7.1_

- [ ] 16. Create authentication documentation
  - [ ] 16.1 Create src/core/lib/auth/README.md
    - Explain authentication system architecture
    - Document how to protect routes with withAuth
    - Document how to check permissions
    - Provide code examples for common use cases
    - Document Appwrite setup steps
    - Add troubleshooting section for common issues
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ] 16.2 Add authentication section to main DEVELOPMENT.md
    - Link to auth README
    - Explain how to set up Appwrite project
    - Document environment variables
    - _Requirements: 15.4_

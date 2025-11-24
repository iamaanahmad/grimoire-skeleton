'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { Role } from './types';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

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

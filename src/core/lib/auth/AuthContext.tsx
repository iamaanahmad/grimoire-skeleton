'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
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
  
  const loadUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setState({ user, loading: false, error: null });
    } catch (error) {
      setState({ user: null, loading: false, error: null });
    }
  }, []);
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  const refreshUser = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await loadUser();
  }, [loadUser]);
  
  const value = useMemo(
    () => ({ ...state, refreshUser }),
    [state, refreshUser]
  );
  
  return (
    <AuthContext.Provider value={value}>
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

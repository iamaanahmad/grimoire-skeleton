'use client';

import { AuthProvider } from '@/core/lib/auth/AuthContext';
import { ThemeProvider } from '@/theme/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}

/**
 * useTheme Hook
 *
 * Custom React hook for accessing theme context.
 * Provides type-safe access to current theme and theme setter.
 */

'use client';

import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from './ThemeContext';

/**
 * Hook to access the current theme and theme setter function.
 * Must be used within a ThemeProvider component.
 *
 * @returns The theme context value with currentTheme and setTheme
 * @throws {Error} If used outside of a ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentTheme, setTheme } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Current theme: {currentTheme.name}</p>
 *       <button onClick={() => setTheme(getThemeById('bone_minimal'))}>
 *         Switch to Bone Minimal
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

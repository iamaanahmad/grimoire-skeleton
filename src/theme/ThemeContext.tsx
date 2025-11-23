/**
 * Theme Context
 *
 * React Context for managing theme state across the application.
 * Provides access to the current theme and a function to change themes.
 */

'use client';

import { createContext } from 'react';
import type { ThemeDefinition } from '@/core/types/theme';

/**
 * Theme context interface defining the shape of the context value.
 */
export interface ThemeContextValue {
  /**
   * The currently active theme definition.
   */
  currentTheme: ThemeDefinition;

  /**
   * Function to change the active theme.
   * Updates the theme state, saves to localStorage, and injects CSS variables.
   *
   * @param theme - The new theme definition to apply
   */
  setTheme: (theme: ThemeDefinition) => void;
}

/**
 * Theme Context for providing theme state to the component tree.
 * Must be used within a ThemeProvider.
 *
 * @example
 * ```typescript
 * const { currentTheme, setTheme } = useContext(ThemeContext);
 * ```
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

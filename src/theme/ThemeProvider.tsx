/**
 * Theme Provider Component
 *
 * Manages theme state and applies CSS variables to the document.
 * Handles localStorage persistence and SSR compatibility.
 * Prevents FOUC by applying theme before first paint.
 */

'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ThemeDefinition } from '@/core/types/theme';
import { ThemeContext } from './ThemeContext';
import { getDefaultTheme, getThemeById } from './skins';
import { generateThemeCSS } from './css-generator';

/**
 * Local storage key for persisting theme preference.
 */
const THEME_STORAGE_KEY = 'grimoire-theme';

/**
 * Injects CSS variables into the document root element.
 * This updates all theme-aware components instantly without re-renders.
 *
 * @param theme - The theme definition to apply
 */
function injectThemeVariables(theme: ThemeDefinition): void {
  if (typeof document === 'undefined') return;

  // Generate CSS variables from theme
  const css = generateThemeCSS(theme);

  // Find or create style element for theme variables
  let styleElement = document.getElementById('grimoire-theme-vars') as HTMLStyleElement;

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'grimoire-theme-vars';
    document.head.appendChild(styleElement);
  }

  // Update the style element content
  styleElement.textContent = css;

  // Also set data attribute for potential CSS selectors
  document.documentElement.setAttribute('data-theme', theme.id);
}

/**
 * Loads the saved theme preference from localStorage.
 * Returns the default theme if no preference is saved or if localStorage is unavailable.
 *
 * @returns The saved theme or the default theme
 */
function loadSavedTheme(): ThemeDefinition {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return getDefaultTheme();
  }

  try {
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeId) {
      const theme = getThemeById(savedThemeId);
      if (theme) {
        return theme;
      }
    }
  } catch (error) {
    // localStorage might be blocked or unavailable
    console.warn('Failed to load theme from localStorage:', error);
  }

  return getDefaultTheme();
}

/**
 * Saves the theme preference to localStorage.
 *
 * @param theme - The theme to save
 */
function saveTheme(theme: ThemeDefinition): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  } catch (error) {
    // localStorage might be blocked or full
    console.warn('Failed to save theme to localStorage:', error);
  }
}

/**
 * Props for the ThemeProvider component.
 */
export interface ThemeProviderProps {
  /**
   * Child components that will have access to the theme context.
   */
  children: ReactNode;

  /**
   * Optional initial theme to use instead of loading from localStorage.
   * Useful for testing or SSR scenarios.
   */
  initialTheme?: ThemeDefinition;
}

/**
 * ThemeProvider component that manages theme state and provides it to children.
 * Handles localStorage persistence, SSR compatibility, and CSS variable injection.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  // Initialize with the provided theme or load from storage
  const [currentTheme, setCurrentTheme] = useState<ThemeDefinition>(() => {
    if (initialTheme) {
      return initialTheme;
    }
    return loadSavedTheme();
  });

  // Apply theme on mount and when theme changes
  useEffect(() => {
    // Inject CSS variables into document
    injectThemeVariables(currentTheme);
  }, [currentTheme]);

  // Handle theme changes
  const setTheme = useCallback((theme: ThemeDefinition) => {
    setCurrentTheme(theme);
    saveTheme(theme);
  }, []);

  // Monitor prefers-reduced-motion changes
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    // Create media query for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Handler for when the preference changes
    const handleMotionPreferenceChange = (event: MediaQueryListEvent | MediaQueryList) => {
      const prefersReducedMotion = event.matches;
      
      // Update data attribute on document for CSS targeting
      document.documentElement.setAttribute(
        'data-reduced-motion',
        prefersReducedMotion ? 'true' : 'false'
      );
    };

    // Set initial state
    handleMotionPreferenceChange(mediaQuery);

    // Listen for changes (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionPreferenceChange);
      return () => mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMotionPreferenceChange);
      return () => mediaQuery.removeListener(handleMotionPreferenceChange);
    }
  }, []);

  // Prevent FOUC by applying theme before first paint
  // This runs synchronously during initial render
  useEffect(() => {
    // Only run on mount
    injectThemeVariables(currentTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

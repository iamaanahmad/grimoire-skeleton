/**
 * Theme System Exports
 *
 * Central export point for the Grimoire theme system.
 */

// Context and Provider
export { ThemeContext, type ThemeContextValue } from './ThemeContext';
export { ThemeProvider, type ThemeProviderProps } from './ThemeProvider';
export { useTheme } from './useTheme';

// Components
export { ThemeSwitcher, type ThemeSwitcherProps } from './ThemeSwitcher';
export {
  SkeletonLoader,
  SkeletonTable,
  SkeletonCard,
  type SkeletonLoaderProps,
  type SkeletonSize,
  type SkeletonShape,
} from '@/core/components/SkeletonLoader';

// Theme Registry
export {
  themeRegistry,
  DEFAULT_THEME_ID,
  getThemeById,
  getAllThemes,
  getDefaultTheme,
} from './skins';

// CSS Generator
export { generateThemeCSS, generateAllThemesCSS } from './css-generator';

// Contrast Checker
export {
  calculateContrastRatio,
  meetsWCAGAA,
  validateTheme,
  formatValidationReport,
  type ContrastCheckResult,
  type ThemeValidationReport,
} from './contrast-checker';

// Types
export type {
  ThemeDefinition,
  ColorPalette,
  AnimationConfig,
  EffectConfig,
  ThemeId,
  ThemeRegistry,
} from '@/core/types/theme';

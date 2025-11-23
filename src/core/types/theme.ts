/**
 * Theme System Types
 *
 * Defines the structure for Grimoire's spooky theme system.
 * All themes must implement these interfaces to ensure consistency.
 */

/**
 * Complete color palette for a theme.
 * Includes all color categories needed for a fully themed application.
 */
export interface ColorPalette {
  /**
   * Background colors for different surface levels
   */
  bg: {
    /** Primary background color (main surface) */
    primary: string;
    /** Secondary background color (elevated surfaces) */
    secondary: string;
    /** Tertiary background color (highest elevation) */
    tertiary: string;
  };

  /**
   * Text colors for different hierarchy levels
   */
  text: {
    /** Primary text color (main content) */
    primary: string;
    /** Secondary text color (supporting content) */
    secondary: string;
    /** Tertiary text color (disabled/placeholder) */
    tertiary: string;
  };

  /**
   * Accent colors for interactive elements and highlights
   */
  accent: {
    /** Primary accent color (main brand color) */
    primary: string;
    /** Secondary accent color (complementary brand color) */
    secondary: string;
    /** Glow color for special effects (typically with alpha) */
    glow: string;
  };

  /**
   * Status colors for feedback and states
   */
  status: {
    /** Success state color */
    success: string;
    /** Error state color */
    error: string;
    /** Warning state color */
    warning: string;
    /** Info state color */
    info: string;
  };

  /**
   * Border colors for outlines and dividers
   */
  border: {
    /** Primary border color */
    primary: string;
    /** Secondary border color (subtle dividers) */
    secondary: string;
  };
}

/**
 * Animation timing and special effects configuration.
 * Defines how elements should animate and transition within the theme.
 */
export interface AnimationConfig {
  /**
   * Animation durations for different speed requirements.
   * Values should be CSS time values (e.g., "150ms", "0.3s")
   */
  duration: {
    /** Fast animations (micro-interactions) */
    fast: string;
    /** Normal animations (standard transitions) */
    normal: string;
    /** Slow animations (dramatic effects) */
    slow: string;
  };

  /**
   * Default easing function for animations.
   * Should be a CSS easing value (e.g., "ease-in-out", "cubic-bezier(0.4, 0, 0.2, 1)")
   */
  easing: string;

  /**
   * Theme-specific special animations.
   * These reference CSS animation names that should be defined in the theme's stylesheet.
   */
  special?: {
    /** Animation name for hover effects */
    hover?: string;
    /** Animation name for loading states */
    loading?: string;
    /** Animation name for entrance transitions */
    entrance?: string;
  };
}

/**
 * Visual effects configuration.
 * Controls which effects are enabled and their intensity for the theme.
 */
export interface EffectConfig {
  /** Enable shadow effects on elevated elements */
  shadows: boolean;

  /** Enable glow effects on interactive elements */
  glows: boolean;

  /** Enable blur effects for depth and focus */
  blur: boolean;

  /**
   * Shadow intensity multiplier (0-1).
   * Higher values create more dramatic shadows.
   */
  shadowIntensity?: number;

  /**
   * Glow intensity multiplier (0-1).
   * Higher values create more prominent glows.
   */
  glowIntensity?: number;
}

/**
 * Complete theme definition including colors, animations, and effects.
 * This is the main interface that all themes must implement.
 */
export interface ThemeDefinition {
  /**
   * Unique theme identifier.
   * Should be lowercase with underscores (e.g., "nightmare_neon")
   */
  id: string;

  /**
   * Display name for the theme.
   * Human-readable name shown in the UI (e.g., "Nightmare Neon")
   */
  name: string;

  /**
   * Brief description of the theme's visual style.
   * Helps users understand the theme's aesthetic before applying it.
   */
  description: string;

  /**
   * Complete color palette for the theme.
   * All colors should be valid CSS color values.
   */
  colors: ColorPalette;

  /**
   * Animation configuration for the theme.
   * Defines timing and special animation names.
   */
  animations: AnimationConfig;

  /**
   * Visual effects configuration for the theme.
   * Controls which effects are enabled and their intensity.
   */
  effects: EffectConfig;
}

/**
 * Available theme IDs in the system.
 * Add new theme IDs here when creating additional themes.
 */
export type ThemeId = 'nightmare_neon' | 'bone_minimal' | 'blood_moon';

/**
 * Theme registry mapping IDs to theme definitions.
 * Used by the theme system to look up themes by ID.
 */
export type ThemeRegistry = Record<ThemeId, ThemeDefinition>;

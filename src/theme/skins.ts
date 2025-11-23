/**
 * Theme Registry System
 *
 * Central registry for all Grimoire themes.
 * Provides type-safe access to theme definitions and validation.
 *
 * Three spooky themes with excellent UX:
 * - nightmare_neon: Cyberpunk glitch vibes
 * - bone_minimal: Stark monochrome elegance
 * - blood_moon: Deep red gothic atmosphere
 *
 * All themes maintain WCAG AA contrast ratios and respect prefers-reduced-motion.
 */

import type { ThemeDefinition, ThemeId, ThemeRegistry } from '@/core/types/theme';
import { nightmareNeon } from './skins/nightmare-neon';
import { boneMinimal } from './skins/bone-minimal';
import { bloodMoon } from './skins/blood-moon';

/**
 * Validates a theme definition to ensure it has all required properties.
 * Throws an error if the theme is invalid.
 *
 * @param theme - The theme definition to validate
 * @throws {Error} If the theme is missing required properties
 */
function validateTheme(theme: ThemeDefinition): void {
  if (!theme.id || typeof theme.id !== 'string') {
    throw new Error('Theme must have a valid id');
  }
  if (!theme.name || typeof theme.name !== 'string') {
    throw new Error(`Theme ${theme.id} must have a valid name`);
  }
  if (!theme.description || typeof theme.description !== 'string') {
    throw new Error(`Theme ${theme.id} must have a valid description`);
  }
  if (!theme.colors || typeof theme.colors !== 'object') {
    throw new Error(`Theme ${theme.id} must have a colors object`);
  }
  if (!theme.animations || typeof theme.animations !== 'object') {
    throw new Error(`Theme ${theme.id} must have an animations object`);
  }
  if (!theme.effects || typeof theme.effects !== 'object') {
    throw new Error(`Theme ${theme.id} must have an effects object`);
  }
}

/**
 * Theme registry - all available themes mapped by their IDs.
 * Themes are validated on registration to ensure they meet requirements.
 */
export const themeRegistry: ThemeRegistry = {
  nightmare_neon: nightmareNeon,
  bone_minimal: boneMinimal,
  blood_moon: bloodMoon,
};

// Validate all themes on module load
Object.values(themeRegistry).forEach(validateTheme);

/**
 * Default theme ID used when no preference is saved.
 */
export const DEFAULT_THEME_ID: ThemeId = 'nightmare_neon';

/**
 * Get a theme by its unique ID.
 * Returns undefined if the theme doesn't exist.
 *
 * @param id - The theme ID to look up
 * @returns The theme definition, or undefined if not found
 *
 * @example
 * ```typescript
 * const theme = getThemeById('nightmare_neon');
 * if (theme) {
 *   console.log(theme.name); // "Nightmare Neon"
 * }
 * ```
 */
export function getThemeById(id: string): ThemeDefinition | undefined {
  return themeRegistry[id as ThemeId];
}

/**
 * Get all available themes as an array.
 * Useful for rendering theme selection UI.
 *
 * @returns Array of all theme definitions
 *
 * @example
 * ```typescript
 * const themes = getAllThemes();
 * themes.forEach(theme => {
 *   console.log(`${theme.name}: ${theme.description}`);
 * });
 * ```
 */
export function getAllThemes(): ThemeDefinition[] {
  return Object.values(themeRegistry);
}

/**
 * Get the default theme definition.
 * This is the theme used when no preference is saved or available.
 *
 * @returns The default theme definition
 *
 * @example
 * ```typescript
 * const defaultTheme = getDefaultTheme();
 * console.log(defaultTheme.name); // "Nightmare Neon"
 * ```
 */
export function getDefaultTheme(): ThemeDefinition {
  return themeRegistry[DEFAULT_THEME_ID];
}

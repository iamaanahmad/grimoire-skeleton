/**
 * CSS Variable Generator
 *
 * Converts ThemeDefinition objects into CSS custom properties.
 * Generates :root CSS with all color variables and animation settings.
 */

import type { ThemeDefinition, ColorPalette } from '@/core/types/theme';

/**
 * Converts a nested color object to CSS custom properties.
 * Handles nested objects with proper naming conventions.
 *
 * @param colors - The color palette object
 * @param prefix - Prefix for the CSS variable names (e.g., 'color')
 * @returns Array of CSS variable declarations
 *
 * @example
 * ```typescript
 * const colors = { bg: { primary: '#000' } };
 * generateColorVariables(colors, 'color');
 * // Returns: ['--color-bg-primary: #000;']
 * ```
 */
function generateColorVariables(
  colors: Record<string, any>,
  prefix: string = 'color'
): string[] {
  const variables: string[] = [];

  function processObject(obj: Record<string, any>, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Leaf node - create CSS variable
        const varName = `--${prefix}-${[...path, key].join('-')}`;
        variables.push(`  ${varName}: ${value};`);
      } else if (typeof value === 'object' && value !== null) {
        // Nested object - recurse
        processObject(value, [...path, key]);
      }
    }
  }

  processObject(colors);
  return variables;
}

/**
 * Generates CSS custom properties for animation configuration.
 *
 * @param animations - The animation configuration object
 * @returns Array of CSS variable declarations
 */
function generateAnimationVariables(
  animations: ThemeDefinition['animations']
): string[] {
  const variables: string[] = [];

  // Duration variables
  variables.push(`  --animation-duration-fast: ${animations.duration.fast};`);
  variables.push(`  --animation-duration-normal: ${animations.duration.normal};`);
  variables.push(`  --animation-duration-slow: ${animations.duration.slow};`);

  // Easing variable
  variables.push(`  --animation-easing: ${animations.easing};`);

  // Special animation names (if defined)
  if (animations.special?.hover) {
    variables.push(`  --animation-hover: ${animations.special.hover};`);
  }
  if (animations.special?.loading) {
    variables.push(`  --animation-loading: ${animations.special.loading};`);
  }
  if (animations.special?.entrance) {
    variables.push(`  --animation-entrance: ${animations.special.entrance};`);
  }

  return variables;
}

/**
 * Generates CSS custom properties for effect configuration.
 *
 * @param effects - The effect configuration object
 * @returns Array of CSS variable declarations
 */
function generateEffectVariables(
  effects: ThemeDefinition['effects']
): string[] {
  const variables: string[] = [];

  // Boolean flags as 0 or 1 for use in calc()
  variables.push(`  --effect-shadows: ${effects.shadows ? '1' : '0'};`);
  variables.push(`  --effect-glows: ${effects.glows ? '1' : '0'};`);
  variables.push(`  --effect-blur: ${effects.blur ? '1' : '0'};`);

  // Intensity values (default to 0.5 if not specified)
  const shadowIntensity = effects.shadowIntensity ?? 0.5;
  const glowIntensity = effects.glowIntensity ?? 0.5;
  variables.push(`  --effect-shadow-intensity: ${shadowIntensity};`);
  variables.push(`  --effect-glow-intensity: ${glowIntensity};`);

  return variables;
}

/**
 * Converts a ThemeDefinition to a complete CSS string with :root variables.
 * Generates all color, animation, and effect variables in a formatted CSS block.
 *
 * @param theme - The theme definition to convert
 * @returns Formatted CSS string with :root selector and all variables
 *
 * @example
 * ```typescript
 * const theme = getThemeById('nightmare_neon');
 * const css = generateThemeCSS(theme);
 * // Returns:
 * // :root {
 * //   --color-bg-primary: #0a0a0f;
 * //   --color-bg-secondary: #1a1a2e;
 * //   ...
 * // }
 * ```
 */
export function generateThemeCSS(theme: ThemeDefinition): string {
  const variables: string[] = [];

  // Add theme ID as a data attribute helper
  variables.push(`  --theme-id: ${theme.id};`);

  // Generate color variables
  variables.push('');
  variables.push('  /* Color Variables */');
  variables.push(...generateColorVariables(theme.colors, 'color'));

  // Generate animation variables
  variables.push('');
  variables.push('  /* Animation Variables */');
  variables.push(...generateAnimationVariables(theme.animations));

  // Generate effect variables
  variables.push('');
  variables.push('  /* Effect Variables */');
  variables.push(...generateEffectVariables(theme.effects));

  // Wrap in :root selector
  return `:root {\n${variables.join('\n')}\n}`;
}

/**
 * Generates CSS for all themes with data attribute selectors.
 * Useful for pre-generating all theme CSS at build time.
 *
 * @param themes - Array of theme definitions
 * @returns CSS string with all themes using [data-theme] selectors
 *
 * @example
 * ```typescript
 * const themes = getAllThemes();
 * const css = generateAllThemesCSS(themes);
 * // Returns CSS with [data-theme="nightmare_neon"], etc.
 * ```
 */
export function generateAllThemesCSS(themes: ThemeDefinition[]): string {
  return themes
    .map((theme) => {
      const variables = generateThemeCSS(theme)
        .replace(':root {', `[data-theme="${theme.id}"] {`)
        .replace(/\n}/g, '\n}');
      return variables;
    })
    .join('\n\n');
}

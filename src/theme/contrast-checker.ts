/**
 * Contrast Checker Utility
 *
 * Validates color contrast ratios according to WCAG AA standards.
 * Ensures all themes maintain accessibility requirements.
 */

import { ThemeDefinition, ColorPalette } from '@/core/types/theme';

/**
 * Result of a contrast validation check
 */
export interface ContrastCheckResult {
  /** Whether the contrast ratio meets WCAG AA standards */
  passes: boolean;
  /** The calculated contrast ratio */
  ratio: number;
  /** Foreground color being tested */
  foreground: string;
  /** Background color being tested */
  background: string;
  /** Description of what is being tested */
  description: string;
}

/**
 * Complete validation report for a theme
 */
export interface ThemeValidationReport {
  /** Theme ID being validated */
  themeId: string;
  /** Whether the entire theme passes validation */
  passes: boolean;
  /** Individual contrast check results */
  checks: ContrastCheckResult[];
  /** List of failing color combinations */
  failures: ContrastCheckResult[];
}

/**
 * Converts a hex color to RGB values
 * @param hex - Hex color string (e.g., "#ff0000" or "#f00")
 * @returns RGB values as [r, g, b] where each value is 0-255
 */
function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Handle 3-digit hex codes
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex;

  // Extract RGB components
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return [r, g, b];
}

/**
 * Calculates the relative luminance of a color according to WCAG formula
 * @param rgb - RGB values as [r, g, b] where each value is 0-255
 * @returns Relative luminance value between 0 and 1
 */
function calculateLuminance(rgb: [number, number, number]): number {
  // Convert RGB to sRGB
  const [r, g, b] = rgb.map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance using WCAG formula
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parses a color string and extracts RGB values
 * Supports hex colors and rgba colors (ignores alpha for contrast calculation)
 * @param color - Color string (hex or rgba)
 * @returns RGB values as [r, g, b]
 */
function parseColor(color: string): [number, number, number] {
  // Handle hex colors
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }

  // Handle rgba colors - extract RGB and ignore alpha
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbaMatch) {
    return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])];
  }

  // Fallback to black if color format is not recognized
  console.warn(`Unrecognized color format: ${color}, defaulting to black`);
  return [0, 0, 0];
}

/**
 * Calculates the contrast ratio between two colors using the WCAG formula
 * @param foreground - Foreground color (hex or rgba string)
 * @param background - Background color (hex or rgba string)
 * @returns Contrast ratio (1-21)
 */
export function calculateContrastRatio(foreground: string, background: string): number {
  const fgRgb = parseColor(foreground);
  const bgRgb = parseColor(background);

  const fgLuminance = calculateLuminance(fgRgb);
  const bgLuminance = calculateLuminance(bgRgb);

  // WCAG contrast ratio formula: (L1 + 0.05) / (L2 + 0.05)
  // where L1 is the lighter color and L2 is the darker color
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a contrast ratio meets WCAG AA standards
 * @param ratio - Contrast ratio to check
 * @param largeText - Whether this is large text (18pt+ or 14pt+ bold)
 * @returns Whether the ratio meets WCAG AA standards
 */
export function meetsWCAGAA(ratio: number, largeText: boolean = false): boolean {
  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  const requiredRatio = largeText ? 3.0 : 4.5;
  return ratio >= requiredRatio;
}

/**
 * Validates an entire theme definition for contrast compliance
 * @param theme - Theme definition to validate
 * @returns Detailed validation report
 */
export function validateTheme(theme: ThemeDefinition): ThemeValidationReport {
  const checks: ContrastCheckResult[] = [];
  const colors = theme.colors;

  // Helper to add a contrast check
  const addCheck = (
    foreground: string,
    background: string,
    description: string,
    largeText: boolean = false
  ) => {
    const ratio = calculateContrastRatio(foreground, background);
    const passes = meetsWCAGAA(ratio, largeText);

    checks.push({
      passes,
      ratio,
      foreground,
      background,
      description,
    });
  };

  // Check primary text on all backgrounds
  addCheck(colors.text.primary, colors.bg.primary, 'Primary text on primary background');
  addCheck(colors.text.primary, colors.bg.secondary, 'Primary text on secondary background');
  addCheck(colors.text.primary, colors.bg.tertiary, 'Primary text on tertiary background');

  // Check secondary text on all backgrounds
  addCheck(colors.text.secondary, colors.bg.primary, 'Secondary text on primary background');
  addCheck(colors.text.secondary, colors.bg.secondary, 'Secondary text on secondary background');
  addCheck(colors.text.secondary, colors.bg.tertiary, 'Secondary text on tertiary background');

  // Check tertiary text on all backgrounds (often used for disabled states)
  addCheck(colors.text.tertiary, colors.bg.primary, 'Tertiary text on primary background');
  addCheck(colors.text.tertiary, colors.bg.secondary, 'Tertiary text on secondary background');
  addCheck(colors.text.tertiary, colors.bg.tertiary, 'Tertiary text on tertiary background');

  // Check accent colors on backgrounds (for buttons, links, etc.)
  addCheck(colors.accent.primary, colors.bg.primary, 'Primary accent on primary background');
  addCheck(colors.accent.secondary, colors.bg.primary, 'Secondary accent on primary background');

  // Check status colors on backgrounds (for alerts, notifications, etc.)
  addCheck(colors.status.success, colors.bg.primary, 'Success status on primary background');
  addCheck(colors.status.error, colors.bg.primary, 'Error status on primary background');
  addCheck(colors.status.warning, colors.bg.primary, 'Warning status on primary background');
  addCheck(colors.status.info, colors.bg.primary, 'Info status on primary background');

  // Check text on accent backgrounds (for filled buttons)
  // Use background color as text on accent, since that's the typical pattern
  addCheck(colors.bg.primary, colors.accent.primary, 'Background text on primary accent button');
  addCheck(colors.bg.primary, colors.accent.secondary, 'Background text on secondary accent button');

  // Collect failures
  const failures = checks.filter((check) => !check.passes);

  return {
    themeId: theme.id,
    passes: failures.length === 0,
    checks,
    failures,
  };
}

/**
 * Formats a validation report as a human-readable string
 * @param report - Validation report to format
 * @returns Formatted report string
 */
export function formatValidationReport(report: ThemeValidationReport): string {
  const lines: string[] = [];

  lines.push(`Theme Validation Report: ${report.themeId}`);
  lines.push(`Overall Status: ${report.passes ? '✓ PASS' : '✗ FAIL'}`);
  lines.push(`Total Checks: ${report.checks.length}`);
  lines.push(`Failures: ${report.failures.length}`);
  lines.push('');

  if (report.failures.length > 0) {
    lines.push('Failing Color Combinations:');
    lines.push('');

    report.failures.forEach((failure, index) => {
      lines.push(`${index + 1}. ${failure.description}`);
      lines.push(`   Foreground: ${failure.foreground}`);
      lines.push(`   Background: ${failure.background}`);
      lines.push(`   Contrast Ratio: ${failure.ratio.toFixed(2)}:1`);
      lines.push(`   Required: 4.5:1 (WCAG AA)`);
      lines.push('');
    });
  } else {
    lines.push('All color combinations meet WCAG AA standards! 🎉');
  }

  return lines.join('\n');
}

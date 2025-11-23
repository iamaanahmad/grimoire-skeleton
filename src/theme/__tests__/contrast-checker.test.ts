/**
 * Tests for contrast checker utility
 */

import { describe, it, expect } from 'vitest';
import {
  calculateContrastRatio,
  meetsWCAGAA,
  validateTheme,
  formatValidationReport,
} from '../contrast-checker';
import { nightmareNeon } from '../skins/nightmare-neon';
import { boneMinimal } from '../skins/bone-minimal';
import { bloodMoon } from '../skins/blood-moon';

describe('calculateContrastRatio', () => {
  it('should calculate correct contrast ratio for black and white', () => {
    const ratio = calculateContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21, 1);
  });

  it('should calculate correct contrast ratio for same colors', () => {
    const ratio = calculateContrastRatio('#ff0000', '#ff0000');
    expect(ratio).toBeCloseTo(1, 1);
  });

  it('should handle 3-digit hex codes', () => {
    const ratio = calculateContrastRatio('#000', '#fff');
    expect(ratio).toBeCloseTo(21, 1);
  });

  it('should handle rgba colors', () => {
    const ratio = calculateContrastRatio('rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)');
    expect(ratio).toBeCloseTo(21, 1);
  });

  it('should calculate ratio regardless of color order', () => {
    const ratio1 = calculateContrastRatio('#000000', '#ffffff');
    const ratio2 = calculateContrastRatio('#ffffff', '#000000');
    expect(ratio1).toBeCloseTo(ratio2, 1);
  });

  it('should calculate correct ratio for neon green on dark background', () => {
    const ratio = calculateContrastRatio('#00ff41', '#0a0a0f');
    expect(ratio).toBeGreaterThan(4.5); // Should meet WCAG AA
  });
});

describe('meetsWCAGAA', () => {
  it('should pass for 4.5:1 ratio with normal text', () => {
    expect(meetsWCAGAA(4.5, false)).toBe(true);
  });

  it('should fail for 4.4:1 ratio with normal text', () => {
    expect(meetsWCAGAA(4.4, false)).toBe(false);
  });

  it('should pass for 3:1 ratio with large text', () => {
    expect(meetsWCAGAA(3.0, true)).toBe(true);
  });

  it('should fail for 2.9:1 ratio with large text', () => {
    expect(meetsWCAGAA(2.9, true)).toBe(false);
  });

  it('should pass for high contrast ratios', () => {
    expect(meetsWCAGAA(21, false)).toBe(true);
    expect(meetsWCAGAA(21, true)).toBe(true);
  });

  it('should default to normal text when largeText parameter is omitted', () => {
    expect(meetsWCAGAA(4.5)).toBe(true);
    expect(meetsWCAGAA(4.4)).toBe(false);
  });
});

describe('validateTheme', () => {
  it('should validate nightmare_neon theme', () => {
    const report = validateTheme(nightmareNeon);
    expect(report.themeId).toBe('nightmare_neon');
    expect(report.checks.length).toBeGreaterThan(0);
    expect(Array.isArray(report.failures)).toBe(true);
  });

  it('should validate bone_minimal theme', () => {
    const report = validateTheme(boneMinimal);
    expect(report.themeId).toBe('bone_minimal');
    expect(report.checks.length).toBeGreaterThan(0);
    expect(Array.isArray(report.failures)).toBe(true);
  });

  it('should validate blood_moon theme', () => {
    const report = validateTheme(bloodMoon);
    expect(report.themeId).toBe('blood_moon');
    expect(report.checks.length).toBeGreaterThan(0);
    expect(Array.isArray(report.failures)).toBe(true);
  });

  it('should include all required contrast checks', () => {
    const report = validateTheme(nightmareNeon);
    
    // Should check text on backgrounds
    const textChecks = report.checks.filter((c) =>
      c.description.includes('text on') && c.description.includes('background')
    );
    expect(textChecks.length).toBeGreaterThan(0);

    // Should check accent colors
    const accentChecks = report.checks.filter((c) => c.description.includes('accent'));
    expect(accentChecks.length).toBeGreaterThan(0);

    // Should check status colors
    const statusChecks = report.checks.filter((c) => c.description.includes('status'));
    expect(statusChecks.length).toBeGreaterThan(0);
  });

  it('should mark theme as passing when all checks pass', () => {
    const report = validateTheme(nightmareNeon);
    if (report.failures.length === 0) {
      expect(report.passes).toBe(true);
    }
  });

  it('should mark theme as failing when any check fails', () => {
    const report = validateTheme(nightmareNeon);
    if (report.failures.length > 0) {
      expect(report.passes).toBe(false);
    }
  });

  it('should include detailed information in check results', () => {
    const report = validateTheme(nightmareNeon);
    const firstCheck = report.checks[0];

    expect(firstCheck).toHaveProperty('passes');
    expect(firstCheck).toHaveProperty('ratio');
    expect(firstCheck).toHaveProperty('foreground');
    expect(firstCheck).toHaveProperty('background');
    expect(firstCheck).toHaveProperty('description');
    expect(typeof firstCheck.ratio).toBe('number');
  });

  it('should only include failing checks in failures array', () => {
    const report = validateTheme(nightmareNeon);
    report.failures.forEach((failure) => {
      expect(failure.passes).toBe(false);
    });
  });
});

describe('formatValidationReport', () => {
  it('should format a passing report', () => {
    const report = validateTheme(nightmareNeon);
    const formatted = formatValidationReport(report);

    expect(formatted).toContain(report.themeId);
    expect(formatted).toContain('Total Checks:');
    expect(formatted).toContain('Failures:');
  });

  it('should include failure details when checks fail', () => {
    const report = validateTheme(nightmareNeon);
    const formatted = formatValidationReport(report);

    if (report.failures.length > 0) {
      expect(formatted).toContain('Failing Color Combinations:');
      expect(formatted).toContain('Foreground:');
      expect(formatted).toContain('Background:');
      expect(formatted).toContain('Contrast Ratio:');
    }
  });

  it('should show success message when all checks pass', () => {
    const report = validateTheme(nightmareNeon);
    const formatted = formatValidationReport(report);

    if (report.failures.length === 0) {
      expect(formatted).toContain('All color combinations meet WCAG AA standards');
    }
  });

  it('should include pass/fail status', () => {
    const report = validateTheme(nightmareNeon);
    const formatted = formatValidationReport(report);

    if (report.passes) {
      expect(formatted).toContain('✓ PASS');
    } else {
      expect(formatted).toContain('✗ FAIL');
    }
  });
});

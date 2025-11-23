import { describe, it, expect } from 'vitest';
import {
  themeRegistry,
  DEFAULT_THEME_ID,
  getThemeById,
  getAllThemes,
  getDefaultTheme,
} from '../skins';
import type { ThemeDefinition } from '@/core/types/theme';

describe('Theme Registry', () => {
  describe('themeRegistry', () => {
    it('contains all three themes', () => {
      expect(Object.keys(themeRegistry)).toHaveLength(3);
      expect(themeRegistry).toHaveProperty('nightmare_neon');
      expect(themeRegistry).toHaveProperty('bone_minimal');
      expect(themeRegistry).toHaveProperty('blood_moon');
    });

    it('all themes have valid structure', () => {
      Object.values(themeRegistry).forEach((theme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('colors');
        expect(theme).toHaveProperty('animations');
        expect(theme).toHaveProperty('effects');
      });
    });

    it('all themes have complete color palettes', () => {
      Object.values(themeRegistry).forEach((theme) => {
        expect(theme.colors).toHaveProperty('bg');
        expect(theme.colors).toHaveProperty('text');
        expect(theme.colors).toHaveProperty('accent');
        expect(theme.colors).toHaveProperty('status');
        expect(theme.colors).toHaveProperty('border');
      });
    });
  });

  describe('getThemeById', () => {
    it('returns theme for valid ID', () => {
      const theme = getThemeById('nightmare_neon');
      expect(theme).toBeDefined();
      expect(theme?.id).toBe('nightmare_neon');
      expect(theme?.name).toBe('Nightmare Neon');
    });

    it('returns theme for all valid IDs', () => {
      expect(getThemeById('nightmare_neon')).toBeDefined();
      expect(getThemeById('bone_minimal')).toBeDefined();
      expect(getThemeById('blood_moon')).toBeDefined();
    });

    it('returns undefined for invalid ID', () => {
      const theme = getThemeById('nonexistent_theme');
      expect(theme).toBeUndefined();
    });

    it('returns type-safe theme definition', () => {
      const theme = getThemeById('bone_minimal');
      if (theme) {
        // TypeScript should recognize these properties
        expect(typeof theme.id).toBe('string');
        expect(typeof theme.name).toBe('string');
        expect(typeof theme.description).toBe('string');
        expect(typeof theme.colors).toBe('object');
      }
    });
  });

  describe('getAllThemes', () => {
    it('returns array of all themes', () => {
      const themes = getAllThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes).toHaveLength(3);
    });

    it('returns themes with correct IDs', () => {
      const themes = getAllThemes();
      const ids = themes.map((t) => t.id);
      expect(ids).toContain('nightmare_neon');
      expect(ids).toContain('bone_minimal');
      expect(ids).toContain('blood_moon');
    });

    it('each theme has all required properties', () => {
      const themes = getAllThemes();
      themes.forEach((theme: ThemeDefinition) => {
        expect(theme.id).toBeTruthy();
        expect(theme.name).toBeTruthy();
        expect(theme.description).toBeTruthy();
        expect(theme.colors).toBeTruthy();
        expect(theme.animations).toBeTruthy();
        expect(theme.effects).toBeTruthy();
      });
    });
  });

  describe('getDefaultTheme', () => {
    it('returns the default theme', () => {
      const theme = getDefaultTheme();
      expect(theme).toBeDefined();
      expect(theme.id).toBe(DEFAULT_THEME_ID);
    });

    it('default theme is nightmare_neon', () => {
      const theme = getDefaultTheme();
      expect(theme.id).toBe('nightmare_neon');
      expect(theme.name).toBe('Nightmare Neon');
    });

    it('default theme has complete structure', () => {
      const theme = getDefaultTheme();
      expect(theme.colors).toBeDefined();
      expect(theme.animations).toBeDefined();
      expect(theme.effects).toBeDefined();
    });
  });

  describe('Theme Validation', () => {
    it('nightmare_neon has correct properties', () => {
      const theme = getThemeById('nightmare_neon');
      expect(theme?.id).toBe('nightmare_neon');
      expect(theme?.name).toBe('Nightmare Neon');
      expect(theme?.description).toContain('Cyberpunk');
      expect(theme?.effects.glows).toBe(true);
      expect(theme?.effects.shadows).toBe(true);
    });

    it('bone_minimal has correct properties', () => {
      const theme = getThemeById('bone_minimal');
      expect(theme?.id).toBe('bone_minimal');
      expect(theme?.name).toBe('Bone Minimal');
      expect(theme?.description).toContain('monochrome');
      expect(theme?.effects.glows).toBe(false);
      expect(theme?.effects.shadows).toBe(false);
    });

    it('blood_moon has correct properties', () => {
      const theme = getThemeById('blood_moon');
      expect(theme?.id).toBe('blood_moon');
      expect(theme?.name).toBe('Blood Moon');
      expect(theme?.description).toContain('red');
      expect(theme?.effects.glows).toBe(true);
      expect(theme?.effects.shadows).toBe(true);
    });
  });
});

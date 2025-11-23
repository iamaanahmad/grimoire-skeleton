/**
 * CSS Generator Tests
 *
 * Tests for the CSS variable generation system.
 */

import { describe, it, expect } from 'vitest';
import { generateThemeCSS, generateAllThemesCSS } from '../css-generator';
import { nightmareNeon } from '../skins/nightmare-neon';
import { boneMinimal } from '../skins/bone-minimal';
import { bloodMoon } from '../skins/blood-moon';
import { getAllThemes } from '../skins';

describe('CSS Generator', () => {
  describe('generateThemeCSS', () => {
    it('should generate CSS with :root selector', () => {
      const css = generateThemeCSS(nightmareNeon);
      expect(css).toContain(':root {');
      expect(css).toContain('}');
    });

    it('should include theme ID variable', () => {
      const css = generateThemeCSS(nightmareNeon);
      expect(css).toContain('--theme-id: nightmare_neon;');
    });

    it('should generate color variables with proper naming', () => {
      const css = generateThemeCSS(nightmareNeon);
      
      // Background colors
      expect(css).toContain('--color-bg-primary: #0a0a0f;');
      expect(css).toContain('--color-bg-secondary: #1a1a2e;');
      expect(css).toContain('--color-bg-tertiary: #16213e;');
      
      // Text colors
      expect(css).toContain('--color-text-primary: #00ff41;');
      expect(css).toContain('--color-text-secondary: #b388ff;');
      
      // Accent colors
      expect(css).toContain('--color-accent-primary: #00ff41;');
      expect(css).toContain('--color-accent-glow: #00ff4180;');
      
      // Status colors
      expect(css).toContain('--color-status-success: #00ff41;');
      expect(css).toContain('--color-status-error: #ff0055;');
      
      // Border colors
      expect(css).toContain('--color-border-primary: #00ff4140;');
    });

    it('should generate animation variables', () => {
      const css = generateThemeCSS(nightmareNeon);
      
      expect(css).toContain('--animation-duration-fast: 150ms;');
      expect(css).toContain('--animation-duration-normal: 300ms;');
      expect(css).toContain('--animation-duration-slow: 500ms;');
      expect(css).toContain('--animation-easing: cubic-bezier(0.4, 0, 0.2, 1);');
    });

    it('should generate special animation names when defined', () => {
      const css = generateThemeCSS(nightmareNeon);
      
      expect(css).toContain('--animation-hover: glitch;');
      expect(css).toContain('--animation-loading: neon-pulse;');
      expect(css).toContain('--animation-entrance: glitch-in;');
    });

    it('should generate effect variables', () => {
      const css = generateThemeCSS(nightmareNeon);
      
      expect(css).toContain('--effect-shadows: 1;');
      expect(css).toContain('--effect-glows: 1;');
      expect(css).toContain('--effect-blur: 1;');
      expect(css).toContain('--effect-shadow-intensity: 0.8;');
      expect(css).toContain('--effect-glow-intensity: 0.9;');
    });

    it('should handle themes with disabled effects', () => {
      const css = generateThemeCSS(boneMinimal);
      
      expect(css).toContain('--effect-shadows: 0;');
      expect(css).toContain('--effect-glows: 0;');
      expect(css).toContain('--effect-blur: 0;');
    });

    it('should use default intensity values when not specified', () => {
      const css = generateThemeCSS(boneMinimal);
      
      // bone_minimal doesn't specify intensity values
      expect(css).toContain('--effect-shadow-intensity: 0.5;');
      expect(css).toContain('--effect-glow-intensity: 0.5;');
    });

    it('should include section comments for organization', () => {
      const css = generateThemeCSS(nightmareNeon);
      
      expect(css).toContain('/* Color Variables */');
      expect(css).toContain('/* Animation Variables */');
      expect(css).toContain('/* Effect Variables */');
    });

    it('should work with all three themes', () => {
      const themes = [nightmareNeon, boneMinimal, bloodMoon];
      
      themes.forEach(theme => {
        const css = generateThemeCSS(theme);
        expect(css).toContain(':root {');
        expect(css).toContain(`--theme-id: ${theme.id};`);
        expect(css).toContain('--color-bg-primary:');
        expect(css).toContain('--animation-duration-fast:');
        expect(css).toContain('--effect-shadows:');
      });
    });
  });

  describe('generateAllThemesCSS', () => {
    it('should generate CSS for all themes with data attributes', () => {
      const themes = getAllThemes();
      const css = generateAllThemesCSS(themes);
      
      expect(css).toContain('[data-theme="nightmare_neon"]');
      expect(css).toContain('[data-theme="bone_minimal"]');
      expect(css).toContain('[data-theme="blood_moon"]');
    });

    it('should include all theme variables in each section', () => {
      const themes = getAllThemes();
      const css = generateAllThemesCSS(themes);
      
      // Check that each theme has its own complete set of variables
      expect(css.match(/--color-bg-primary:/g)?.length).toBe(3);
      expect(css.match(/--animation-duration-fast:/g)?.length).toBe(3);
      expect(css.match(/--effect-shadows:/g)?.length).toBe(3);
    });

    it('should separate themes with blank lines', () => {
      const themes = getAllThemes();
      const css = generateAllThemesCSS(themes);
      
      // Should have separation between theme blocks
      expect(css).toContain('}\n\n[data-theme=');
    });
  });
});

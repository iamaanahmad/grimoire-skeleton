/**
 * Animation Keyframes Tests
 *
 * Tests to verify animation CSS file structure and content.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Animation Keyframes', () => {
  let animationsCSS: string;

  // Read the animations CSS file
  try {
    animationsCSS = readFileSync(
      join(__dirname, '../animations.css'),
      'utf-8'
    );
  } catch (error) {
    animationsCSS = '';
  }

  describe('Nightmare Neon Animations', () => {
    it('should define glitch keyframes', () => {
      expect(animationsCSS).toContain('@keyframes glitch');
      expect(animationsCSS).toContain('transform: translate');
    });

    it('should define neon-pulse keyframes', () => {
      expect(animationsCSS).toContain('@keyframes neon-pulse');
      expect(animationsCSS).toContain('opacity:');
      expect(animationsCSS).toContain('transform: scale');
    });

    it('should define glitch-in keyframes', () => {
      expect(animationsCSS).toContain('@keyframes glitch-in');
    });
  });

  describe('Bone Minimal Animations', () => {
    it('should define bone-rattle keyframes', () => {
      expect(animationsCSS).toContain('@keyframes bone-rattle');
      expect(animationsCSS).toContain('translateX');
    });

    it('should define bone-pulse keyframes', () => {
      expect(animationsCSS).toContain('@keyframes bone-pulse');
      expect(animationsCSS).toContain('opacity:');
    });

    it('should define fade-in keyframes', () => {
      expect(animationsCSS).toContain('@keyframes fade-in');
      expect(animationsCSS).toContain('translateY');
    });
  });

  describe('Blood Moon Animations', () => {
    it('should define blood-glow keyframes', () => {
      expect(animationsCSS).toContain('@keyframes blood-glow');
      expect(animationsCSS).toContain('transform: scale');
    });

    it('should define heartbeat keyframes', () => {
      expect(animationsCSS).toContain('@keyframes heartbeat');
      expect(animationsCSS).toContain('transform: scale');
    });

    it('should define fade-glow keyframes', () => {
      expect(animationsCSS).toContain('@keyframes fade-glow');
    });
  });

  describe('Performance Optimization', () => {
    it('should only use transform and opacity for 60fps performance', () => {
      // Check that we're not using expensive properties
      expect(animationsCSS).not.toContain('width:');
      expect(animationsCSS).not.toContain('height:');
      expect(animationsCSS).not.toContain('top:');
      expect(animationsCSS).not.toContain('left:');
      expect(animationsCSS).not.toContain('margin:');
      expect(animationsCSS).not.toContain('padding:');
      
      // Verify we're using performant properties
      expect(animationsCSS).toContain('transform:');
      expect(animationsCSS).toContain('opacity:');
    });
  });

  describe('Accessibility', () => {
    it('should include prefers-reduced-motion media query', () => {
      expect(animationsCSS).toContain('@media (prefers-reduced-motion: reduce)');
    });

    it('should disable animations for reduced motion', () => {
      expect(animationsCSS).toContain('animation-duration: 0.01ms !important');
      expect(animationsCSS).toContain('transition-duration: 0.01ms !important');
    });
  });

  describe('Utility Classes', () => {
    it('should define animate-hover utility class', () => {
      expect(animationsCSS).toContain('.animate-hover');
      expect(animationsCSS).toContain('var(--animation-hover');
    });

    it('should define animate-loading utility class', () => {
      expect(animationsCSS).toContain('.animate-loading');
      expect(animationsCSS).toContain('var(--animation-loading');
      expect(animationsCSS).toContain('infinite');
    });

    it('should define animate-entrance utility class', () => {
      expect(animationsCSS).toContain('.animate-entrance');
      expect(animationsCSS).toContain('var(--animation-entrance');
    });

    it('should use CSS variables for animation properties', () => {
      expect(animationsCSS).toContain('var(--animation-duration-normal');
      expect(animationsCSS).toContain('var(--animation-duration-slow');
      expect(animationsCSS).toContain('var(--animation-easing');
    });
  });

  describe('All Required Animations', () => {
    it('should include all 9 theme-specific animations', () => {
      const requiredAnimations = [
        'glitch',
        'neon-pulse',
        'glitch-in',
        'bone-rattle',
        'bone-pulse',
        'fade-in',
        'blood-glow',
        'heartbeat',
        'fade-glow',
      ];

      requiredAnimations.forEach(animation => {
        expect(animationsCSS).toContain(`@keyframes ${animation}`);
      });
    });
  });
});

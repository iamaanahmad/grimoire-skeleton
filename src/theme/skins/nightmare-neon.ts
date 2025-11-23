/**
 * Nightmare Neon Theme
 * 
 * Cyberpunk horror with neon green and purple glitch effects.
 * High-intensity visual effects with dramatic shadows and glows.
 */

import { ThemeDefinition } from '@/core/types/theme';

export const nightmareNeon: ThemeDefinition = {
  id: 'nightmare_neon',
  name: 'Nightmare Neon',
  description: 'Cyberpunk horror with neon green and purple glitch effects',
  
  colors: {
    bg: {
      primary: '#0a0a0f',
      secondary: '#1a1a2e',
      tertiary: '#16213e',
    },
    text: {
      primary: '#00ff41',
      secondary: '#b388ff',
      tertiary: '#8e8e93',
    },
    accent: {
      primary: '#00ff41',
      secondary: '#b388ff',
      glow: '#00ff4180',
    },
    status: {
      success: '#00ff41',
      error: '#ff0055',
      warning: '#ffaa00',
      info: '#00d4ff',
    },
    border: {
      primary: '#00ff4140',
      secondary: '#b388ff40',
    },
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    special: {
      hover: 'glitch',
      loading: 'neon-pulse',
      entrance: 'glitch-in',
    },
  },
  
  effects: {
    shadows: true,
    glows: true,
    blur: true,
    shadowIntensity: 0.8,
    glowIntensity: 0.9,
  },
};

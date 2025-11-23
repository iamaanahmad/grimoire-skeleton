/**
 * Blood Moon Theme
 * 
 * Elegant darkness with deep red accents and subtle glows.
 * Moderate visual effects creating a gothic, atmospheric experience.
 */

import { ThemeDefinition } from '@/core/types/theme';

export const bloodMoon: ThemeDefinition = {
  id: 'blood_moon',
  name: 'Blood Moon',
  description: 'Elegant darkness with deep red accents and subtle glows',
  
  colors: {
    bg: {
      primary: '#0f0a0a',
      secondary: '#1a0f0f',
      tertiary: '#2a1515',
    },
    text: {
      primary: '#f0e6e6',
      secondary: '#d4c4c4',
      tertiary: '#8c7a7a',
    },
    accent: {
      primary: '#8b0000',
      secondary: '#dc143c',
      glow: '#8b000080',
    },
    status: {
      success: '#6b8b6b',
      error: '#8b0000',
      warning: '#cd853f',
      info: '#4682b4',
    },
    border: {
      primary: '#8b000040',
      secondary: '#dc143c30',
    },
  },
  
  animations: {
    duration: {
      fast: '200ms',
      normal: '350ms',
      slow: '600ms',
    },
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    special: {
      hover: 'blood-glow',
      loading: 'heartbeat',
      entrance: 'fade-glow',
    },
  },
  
  effects: {
    shadows: true,
    glows: true,
    blur: true,
    shadowIntensity: 0.6,
    glowIntensity: 0.7,
  },
};

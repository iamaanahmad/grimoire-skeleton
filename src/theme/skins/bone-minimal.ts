/**
 * Bone Minimal Theme
 * 
 * Clean monochrome with bone-white and stark black.
 * Minimal animations and no visual effects for a clean, focused aesthetic.
 */

import { ThemeDefinition } from '@/core/types/theme';

export const boneMinimal: ThemeDefinition = {
  id: 'bone_minimal',
  name: 'Bone Minimal',
  description: 'Clean monochrome with bone-white and stark black',
  
  colors: {
    bg: {
      primary: '#0d0d0d',
      secondary: '#1a1a1a',
      tertiary: '#262626',
    },
    text: {
      primary: '#f5f5dc',
      secondary: '#d4d4c8',
      tertiary: '#8c8c7a',
    },
    accent: {
      primary: '#f5f5dc',
      secondary: '#d4d4c8',
      glow: '#f5f5dc60',
    },
    status: {
      success: '#c8d4c8',
      error: '#d4c8c8',
      warning: '#d4d4c8',
      info: '#c8d4d4',
    },
    border: {
      primary: '#f5f5dc30',
      secondary: '#d4d4c820',
    },
  },
  
  animations: {
    duration: {
      fast: '100ms',
      normal: '200ms',
      slow: '400ms',
    },
    easing: 'ease-in-out',
    special: {
      hover: 'bone-rattle',
      loading: 'bone-pulse',
      entrance: 'fade-in',
    },
  },
  
  effects: {
    shadows: false,
    glows: false,
    blur: false,
  },
};

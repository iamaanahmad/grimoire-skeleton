# Design Document - Theme Engine

## Overview

The Theme Engine is a CSS variable-based theming system that enables runtime theme switching without component re-renders. It provides three distinct spooky themes (nightmare_neon, bone_minimal, blood_moon), each with unique color palettes, animations, and visual effects. The system prioritizes accessibility, performance, and developer experience while creating a memorable visual identity for the Grimoire Skeleton framework.

## Architecture

### High-Level Flow

```
Theme Definition (TypeScript)
         ↓
Theme Registry
         ↓
CSS Variable Generator
         ↓
Inject into :root
         ↓
Components use CSS variables
         ↓
Theme Switch → Update CSS variables → Instant visual update
```

### System Components

**Type Layer:**
- ThemeDefinition interface
- ColorPalette interface
- AnimationConfig interface
- EffectConfig interface

**Theme Layer:**
- Individual theme definitions (nightmare_neon, bone_minimal, blood_moon)
- Theme registry for centralized access
- Default theme configuration

**Runtime Layer:**
- ThemeContext for React state management
- ThemeProvider component
- useTheme hook for component access
- CSS variable injection system

**UI Layer:**
- ThemeSwitcher component
- SkeletonLoader component
- Theme-aware core components

**Utility Layer:**
- CSS generator for converting themes to CSS
- Contrast checker for accessibility validation
- localStorage persistence
- SSR compatibility helpers


## Components and Interfaces

### Type Definitions

**src/theme/types.ts:**

```typescript
/**
 * Complete theme definition including colors, animations, and effects
 */
export interface ThemeDefinition {
  /** Unique theme identifier */
  id: string;
  /** Display name for the theme */
  name: string;
  /** Brief description of the theme's visual style */
  description: string;
  /** Complete color palette */
  colors: ColorPalette;
  /** Animation configuration */
  animations: AnimationConfig;
  /** Visual effects configuration */
  effects: EffectConfig;
}

/**
 * Complete color palette for a theme
 */
export interface ColorPalette {
  /** Background colors */
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  /** Text colors */
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  /** Accent colors */
  accent: {
    primary: string;
    secondary: string;
    glow: string;
  };
  /** Status colors */
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  /** Border colors */
  border: {
    primary: string;
    secondary: string;
  };
}

/**
 * Animation timing and special effects configuration
 */
export interface AnimationConfig {
  /** Animation durations */
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  /** Default easing function */
  easing: string;
  /** Theme-specific special animations */
  special?: {
    hover?: string;
    loading?: string;
    entrance?: string;
  };
}

/**
 * Visual effects configuration
 */
export interface EffectConfig {
  /** Enable shadow effects */
  shadows: boolean;
  /** Enable glow effects */
  glows: boolean;
  /** Enable blur effects */
  blur: boolean;
  /** Shadow intensity (0-1) */
  shadowIntensity?: number;
  /** Glow intensity (0-1) */
  glowIntensity?: number;
}
```

### Theme Definitions

**src/theme/skins/nightmare-neon.ts:**

```typescript
import { ThemeDefinition } from '../types';

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
```

**src/theme/skins/bone-minimal.ts:**

```typescript
import { ThemeDefinition } from '../types';

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
```

**src/theme/skins/blood-moon.ts:**

```typescript
import { ThemeDefinition } from '../types';

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
```

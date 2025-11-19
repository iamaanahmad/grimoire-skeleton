# Implementation Plan

- [ ] 1. Set up theme type system and core infrastructure
  - Create TypeScript interfaces for ThemeDefinition, ColorPalette, AnimationConfig, and EffectConfig
  - Add comprehensive JSDoc comments to all interfaces
  - Export all types from a central types.ts file
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 2. Create theme definitions
  - [ ] 2.1 Implement nightmare_neon theme definition
    - Define complete color palette with neon green (#00ff41) and purple (#b388ff)
    - Configure glitch animations and high-intensity effects
    - _Requirements: 1.1, 1.5, 7.2, 7.3_
  
  - [ ] 2.2 Implement bone_minimal theme definition
    - Define monochrome palette with bone-white (#f5f5dc) and black
    - Configure minimal animations and no effects
    - _Requirements: 1.1, 1.5, 7.2, 7.3_
  
  - [ ] 2.3 Implement blood_moon theme definition
    - Define dark palette with deep red accents (#8b0000, #dc143c)
    - Configure elegant animations and moderate effects
    - _Requirements: 1.1, 1.5, 7.2, 7.3_
  
  - [ ]* 2.4 Validate contrast ratios for all themes
    - Run contrast checker on all text/background combinations
    - Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 3. Build theme registry system
  - Create registry.ts that imports all theme definitions
  - Implement getThemeById function with type safety
  - Implement getAllThemes function returning array of themes
  - Implement getDefaultTheme function
  - Add theme validation on registration
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 4. Implement CSS variable generator
  - [ ] 4.1 Create CSS generator utility
    - Write function to convert ThemeDefinition to CSS custom properties
    - Generate :root CSS with all color variables (--color-bg-primary, etc.)
    - Handle nested color objects with proper naming
    - Return formatted CSS string
    - _Requirements: 6.1, 6.2, 6.5_
  
  - [ ] 4.2 Generate animation keyframes
    - Create keyframes for glitch effect (nightmare_neon)
    - Create keyframes for bone-pulse effect (bone_minimal)
    - Create keyframes for blood-glow and heartbeat effects (blood_moon)
    - Include all theme-specific animations
    - _Requirements: 7.1, 7.4, 7.5_

- [ ] 5. Create theme context and provider
  - [ ] 5.1 Implement ThemeContext
    - Create React Context with theme state and setter
    - Define context interface with currentTheme and setTheme
    - _Requirements: 6.3, 6.4_
  
  - [ ] 5.2 Implement ThemeProvider component
    - Load theme from localStorage on mount
    - Handle SSR case where localStorage is unavailable
    - Inject CSS variables into document :root on theme change
    - Save theme to localStorage when changed
    - Prevent FOUC by applying theme before first paint
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ] 5.3 Create useTheme hook
    - Provide access to current theme and setTheme function
    - Ensure type safety
    - _Requirements: 6.4_

- [ ] 6. Build ThemeSwitcher UI component
  - Create dropdown or button group showing all available themes
  - Display theme name and description for each option
  - Highlight currently active theme
  - Implement keyboard navigation (arrow keys, enter, escape)
  - Add proper ARIA attributes (aria-label, role, aria-expanded)
  - Apply smooth transition when switching themes (300ms max)
  - Make responsive for all screen sizes
  - _Requirements: 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 7. Implement spooky animations with accessibility
  - [ ] 7.1 Create animations.css with keyframes
    - Implement glitch effect for nightmare_neon hover states
    - Implement neon-pulse for nightmare_neon loading
    - Implement bone-rattle for bone_minimal hover states
    - Implement bone-pulse for bone_minimal loading
    - Implement blood-glow for blood_moon hover states
    - Implement heartbeat for blood_moon loading
    - Use only transform and opacity for 60fps performance
    - _Requirements: 3.5, 7.2, 7.3_
  
  - [ ] 7.2 Add prefers-reduced-motion support
    - Wrap all animations in @media (prefers-reduced-motion: no-preference)
    - Provide instant alternatives when reduced motion is preferred
    - Check prefers-reduced-motion on load and when it changes
    - _Requirements: 3.4, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Create SkeletonLoader component
  - Design bone/rib-shaped skeleton component
  - Implement pulse animation using theme colors
  - Make configurable with props for size and shape variants
  - Use theme-aware CSS variables for colors
  - Add aria-busy="true" and aria-label for accessibility
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 9. Make core components theme-aware
  - Update Button component to use CSS variables for colors
  - Update Card component to use theme effects (shadows, glows)
  - Update Table component to use theme animations
  - Update Form inputs to use theme colors
  - Remove all hardcoded colors from components
  - Ensure smooth transitions when theme changes
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 10. Build contrast checker utility
  - Implement calculateContrastRatio function using WCAG formula
  - Implement meetsWCAGAA function checking 4.5:1 for normal text
  - Implement validateTheme function checking entire theme definition
  - Return detailed report of failing color combinations
  - Provide clear error messages for accessibility violations
  - _Requirements: 4.4, 4.5, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 11. Create global styles
  - Set up globals.css with base styles using CSS variables
  - Define typography styles (font-family, sizes, line-heights)
  - Add utility classes for common patterns
  - Include CSS reset/normalize
  - Add smooth scrolling behavior
  - Ensure no conflicts with Tailwind CSS
  - _Requirements: 6.1, 6.5_

- [ ] 12. Integrate theme system into app
  - Wrap app with ThemeProvider in layout.tsx
  - Add ThemeSwitcher component to top navigation bar
  - Import theme CSS and animations
  - Handle Next.js SSR correctly to prevent hydration errors
  - Test theme persistence across page navigations
  - _Requirements: 14.1, 14.2, 14.3, 14.5_

- [ ]* 13. Write theme documentation
  - Create README.md explaining theme system architecture
  - Document how to add a new theme with step-by-step guide
  - Document how to use themes in components with code examples
  - Create color palette reference table for all themes
  - Create animation reference with visual examples
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 14. Create theme preview component
  - Build ThemePreview component showing all theme colors
  - Display example components (buttons, cards, inputs) in preview
  - Show all animations in action
  - Make useful for theme development and testing
  - _Requirements: 1.2, 1.5_

- [ ]* 15. Write comprehensive tests
  - Test theme switching functionality
  - Test localStorage persistence and retrieval
  - Test contrast ratio calculations
  - Test CSS variable generation
  - Test prefers-reduced-motion handling
  - Test SSR compatibility
  - _Requirements: 2.1, 2.2, 3.4, 4.1, 5.1, 14.1_

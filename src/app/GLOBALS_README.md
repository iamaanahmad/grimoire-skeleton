# Global Styles Documentation

## Overview

The `globals.css` file provides the foundation for the Grimoire Skeleton theme system. It includes:

- **CSS Reset/Normalize**: Modern reset for consistent cross-browser rendering
- **Typography System**: Font sizes, weights, and line heights using CSS variables
- **Utility Classes**: Common patterns compatible with Tailwind CSS
- **Accessibility**: Reduced motion support and focus states
- **Theme Integration**: Uses CSS variables injected by ThemeProvider

## CSS Variables

### Typography Variables

```css
--font-family-base: System font stack
--font-family-mono: Monospace font stack

--font-size-xs: 0.75rem (12px)
--font-size-sm: 0.875rem (14px)
--font-size-base: 1rem (16px)
--font-size-lg: 1.125rem (18px)
--font-size-xl: 1.25rem (20px)
--font-size-2xl: 1.5rem (24px)
--font-size-3xl: 1.875rem (30px)
--font-size-4xl: 2.25rem (36px)
--font-size-5xl: 3rem (48px)

--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700

--line-height-tight: 1.25
--line-height-base: 1.5
--line-height-relaxed: 1.75
```

### Spacing Variables

Compatible with Tailwind's spacing scale:

```css
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
--spacing-5: 1.25rem (20px)
--spacing-6: 1.5rem (24px)
--spacing-8: 2rem (32px)
--spacing-10: 2.5rem (40px)
--spacing-12: 3rem (48px)
--spacing-16: 4rem (64px)
```

### Border Radius Variables

```css
--radius-sm: 0.125rem (2px)
--radius-md: 0.25rem (4px)
--radius-lg: 0.5rem (8px)
--radius-xl: 0.75rem (12px)
--radius-2xl: 1rem (16px)
--radius-full: 9999px
```

### Z-Index Scale

```css
--z-base: 0
--z-dropdown: 1000
--z-sticky: 1100
--z-fixed: 1200
--z-modal-backdrop: 1300
--z-modal: 1400
--z-popover: 1500
--z-tooltip: 1600
```

## Theme Color Variables

These are injected by the ThemeProvider at runtime:

```css
--color-bg-primary
--color-bg-secondary
--color-bg-tertiary
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-accent-primary
--color-accent-secondary
--color-accent-glow
--color-status-success
--color-status-error
--color-status-warning
--color-status-info
--color-border-primary
--color-border-secondary
```

## Utility Classes

### Text Colors

```css
.text-primary    /* Uses --color-text-primary */
.text-secondary  /* Uses --color-text-secondary */
.text-tertiary   /* Uses --color-text-tertiary */
.text-accent     /* Uses --color-accent-primary */
```

### Background Colors

```css
.bg-primary      /* Uses --color-bg-primary */
.bg-secondary    /* Uses --color-bg-secondary */
.bg-tertiary     /* Uses --color-bg-tertiary */
```

### Border Colors

```css
.border-primary   /* Uses --color-border-primary */
.border-secondary /* Uses --color-border-secondary */
```

### Surface Utilities

```css
.surface         /* Card/panel background with border */
.surface-hover   /* Hover effect for surfaces */
```

### Focus States

```css
.focus-ring      /* Outline for focus states */
.focus-visible   /* Focus visible only for keyboard navigation */
```

### Transitions

```css
.transition-colors    /* Smooth color transitions */
.transition-transform /* Smooth transform transitions */
.transition-opacity   /* Smooth opacity transitions */
```

### Shadows

Respect theme effect settings:

```css
.shadow-sm  /* Small shadow */
.shadow-md  /* Medium shadow */
.shadow-lg  /* Large shadow */
```

### Glows

Respect theme effect settings:

```css
.glow-sm  /* Small glow */
.glow-md  /* Medium glow */
.glow-lg  /* Large glow */
```

### Spooky Effects

```css
.spooky-hover  /* Lift effect on hover */
```

### State Classes

```css
.loading   /* Loading state styling */
.disabled  /* Disabled state styling */
```

### Accessibility

```css
.sr-only  /* Screen reader only content */
```

## Usage Examples

### Using Typography Variables

```tsx
<h1 style={{ fontSize: 'var(--font-size-4xl)' }}>
  Large Heading
</h1>

<p style={{ 
  fontSize: 'var(--font-size-base)',
  lineHeight: 'var(--line-height-relaxed)'
}}>
  Body text with relaxed line height
</p>
```

### Using Theme Colors

```tsx
<div className="bg-primary text-primary">
  Content with theme colors
</div>

<button className="bg-secondary text-accent transition-colors">
  Themed Button
</button>
```

### Using Spacing

```tsx
<div style={{ 
  padding: 'var(--spacing-4)',
  marginBottom: 'var(--spacing-6)'
}}>
  Spaced content
</div>
```

### Creating Surfaces

```tsx
<div className="surface surface-hover">
  <h3>Card Title</h3>
  <p>Card content with hover effect</p>
</div>
```

### Adding Effects

```tsx
<button className="shadow-md glow-sm transition-transform spooky-hover">
  Spooky Button
</button>
```

## Accessibility Features

### Reduced Motion

All animations and transitions are automatically disabled when the user has `prefers-reduced-motion` enabled:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations become instant */
}
```

### Focus States

Proper focus indicators for keyboard navigation:

```tsx
<button className="focus-visible">
  Accessible Button
</button>
```

### Screen Reader Support

```tsx
<span className="sr-only">
  Hidden text for screen readers
</span>
```

## Smooth Scrolling

Smooth scrolling is enabled by default for anchor links:

```css
html {
  scroll-behavior: smooth;
}
```

This is automatically disabled when `prefers-reduced-motion` is enabled.

## Tailwind Compatibility

All utility classes are designed to work alongside Tailwind CSS without conflicts:

- Custom utilities use semantic names (`.text-primary` vs Tailwind's `.text-blue-500`)
- CSS variables can be used in Tailwind classes: `bg-[var(--color-bg-primary)]`
- Spacing scale matches Tailwind's scale
- No conflicts with Tailwind's reset

## Print Styles

Optimized styles for printing are included:

- Removes backgrounds and shadows
- Converts to black text on white
- Prevents page breaks in inappropriate places
- Shows link URLs

## Best Practices

1. **Use CSS Variables**: Always use CSS variables for colors, spacing, and typography
2. **Respect Theme Effects**: Use `.shadow-*` and `.glow-*` classes that respect theme settings
3. **Accessibility First**: Always include focus states and reduced motion support
4. **Semantic Classes**: Use semantic utility classes (`.text-primary`) over hardcoded values
5. **Smooth Transitions**: Use `.transition-*` classes for smooth state changes
6. **Spooky Vibes**: Use `.spooky-hover` and theme-specific animations for personality

## Requirements Satisfied

This implementation satisfies the following requirements:

- **6.1**: All theme colors defined as CSS custom properties
- **6.5**: CSS variables available to all components and styles
- Typography styles with proper font families, sizes, and line heights
- Utility classes for common patterns
- CSS reset/normalize for consistent rendering
- Smooth scrolling behavior (respects reduced motion)
- No conflicts with Tailwind CSS (semantic naming, compatible spacing scale)

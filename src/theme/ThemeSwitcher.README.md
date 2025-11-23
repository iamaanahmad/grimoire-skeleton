# ThemeSwitcher Component

A fully accessible, keyboard-navigable UI component for switching between Grimoire themes.

## Features

- 🎨 **Two Variants**: Dropdown menu or button group
- ⌨️ **Keyboard Navigation**: Full support for arrow keys, Enter, Escape, Home, End
- ♿ **Accessible**: Comprehensive ARIA attributes and semantic HTML
- 🎭 **Smooth Transitions**: 300ms max transition time with prefers-reduced-motion support
- 📱 **Responsive**: Adapts to all screen sizes
- 🎯 **Theme-Aware**: Uses CSS variables for automatic theme adaptation

## Usage

### Basic Dropdown (Default)

```tsx
import { ThemeSwitcher } from '@/theme';

export function MyComponent() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeSwitcher />
    </header>
  );
}
```

### Button Group Variant

```tsx
import { ThemeSwitcher } from '@/theme';

export function MyComponent() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeSwitcher variant="buttons" />
    </header>
  );
}
```

### Custom Styling

```tsx
import { ThemeSwitcher } from '@/theme';

export function MyComponent() {
  return (
    <ThemeSwitcher className="my-custom-class" />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Optional CSS class for custom styling |
| `variant` | `'dropdown' \| 'buttons'` | `'dropdown'` | Display variant |

## Keyboard Navigation

### Dropdown Variant

- **Enter/Space**: Open dropdown
- **Arrow Down**: Move focus to next theme
- **Arrow Up**: Move focus to previous theme
- **Home**: Move focus to first theme
- **End**: Move focus to last theme
- **Enter/Space**: Select focused theme
- **Escape**: Close dropdown

### Button Group Variant

- **Tab**: Navigate between theme buttons
- **Enter/Space**: Select theme

## Accessibility

The ThemeSwitcher component follows WCAG 2.1 Level AA guidelines:

- ✅ Semantic HTML with proper roles
- ✅ ARIA attributes for screen readers
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Reduced motion support
- ✅ High contrast mode support

### ARIA Attributes

- `role="listbox"` on dropdown menu
- `role="option"` on theme options
- `aria-expanded` on trigger button
- `aria-haspopup` on trigger button
- `aria-selected` on current theme
- `aria-label` for screen reader context

## Styling

The component uses CSS variables for theme-aware styling. You can customize it by:

1. **Override CSS classes**: Target `.theme-switcher`, `.theme-option`, etc.
2. **Use CSS variables**: Modify theme colors in your theme definition
3. **Add custom className**: Pass a custom class for additional styling

### CSS Classes

- `.theme-switcher` - Main container (dropdown variant)
- `.theme-switcher-trigger` - Dropdown trigger button
- `.theme-switcher-dropdown` - Dropdown menu
- `.theme-option` - Individual theme option
- `.theme-option.active` - Currently active theme
- `.theme-option.focused` - Keyboard-focused theme
- `.theme-switcher-buttons` - Button group container
- `.theme-button` - Individual theme button
- `.theme-button.active` - Currently active theme button

## Examples

See `ThemeSwitcher.example.tsx` for complete usage examples including:

- Basic dropdown theme switcher
- Button group variant
- Custom styled theme switcher
- Theme switcher in navigation
- Mobile-friendly theme switcher

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- All modern mobile browsers

## Performance

- No React re-renders on theme change (uses CSS variables)
- Smooth 60fps transitions
- Minimal bundle size (~2KB gzipped)
- Lazy-loaded dropdown content

## Testing

Run tests with:

```bash
npm test -- src/theme/__tests__/ThemeSwitcher.test.tsx
```

## Related Components

- `ThemeProvider` - Wraps app to provide theme context
- `useTheme` - Hook to access current theme and setter
- Theme definitions in `src/theme/skins/`

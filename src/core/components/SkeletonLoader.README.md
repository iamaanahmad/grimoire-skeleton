# SkeletonLoader Component

Theme-aware skeleton loader component with spooky bone/rib shapes and pulse animations. Fully accessible and responsive to user motion preferences.

## Features

- 🎨 **Theme-Aware**: Uses CSS variables from the active theme for colors and animations
- 💀 **Spooky Shapes**: Bone, rib, skull, rectangle, and circle variants
- 📏 **Configurable Sizes**: Small, medium, large, and extra-large options
- ♿ **Accessible**: Proper ARIA attributes and screen reader support
- 🎭 **Motion-Safe**: Respects `prefers-reduced-motion` setting
- 🎯 **Specialized Layouts**: Pre-built table and card skeleton variants

## Basic Usage

```tsx
import { SkeletonLoader } from '@/theme';

// Single bone skeleton
<SkeletonLoader />

// Multiple rib skeletons
<SkeletonLoader shape="rib" count={5} />

// Large skull skeleton
<SkeletonLoader shape="skull" size="lg" />
```

## Props

### SkeletonLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant of the skeleton |
| `shape` | `'bone' \| 'rib' \| 'skull' \| 'rectangle' \| 'circle'` | `'bone'` | Shape variant of the skeleton |
| `count` | `number` | `1` | Number of skeleton elements to render |
| `width` | `string` | - | Custom width (CSS value) |
| `height` | `string` | - | Custom height (CSS value) |
| `ariaLabel` | `string` | `'Loading content'` | Accessible label for screen readers |
| `className` | `string` | `''` | Additional CSS classes |

## Shape Variants

### Bone
Rounded ends like a bone with knobs on each side. Perfect for general content loading.

```tsx
<SkeletonLoader shape="bone" />
```

### Rib
Horizontal line with subtle curve and bottom border. Great for list items and text lines.

```tsx
<SkeletonLoader shape="rib" count={5} />
```

### Skull
Rounded shape with eye sockets. Ideal for profile pictures and avatars.

```tsx
<SkeletonLoader shape="skull" size="lg" />
```

### Rectangle
Simple rounded rectangle. Standard placeholder for various content.

```tsx
<SkeletonLoader shape="rectangle" width="100%" height="200px" />
```

### Circle
Perfect circle. Best for circular avatars and icons.

```tsx
<SkeletonLoader shape="circle" size="md" />
```

## Size Variants

- **sm**: 1rem height - For small text and compact elements
- **md**: 1.5rem height - Default size for most content
- **lg**: 2.5rem height - For headings and prominent elements
- **xl**: 4rem height - For large headers and hero sections

## Specialized Components

### SkeletonTable

Pre-configured skeleton for table layouts with rows and columns.

```tsx
import { SkeletonTable } from '@/theme';

<SkeletonTable rows={5} columns={4} ariaLabel="Loading table data" />
```

**Props:**
- `rows` (number, default: 5) - Number of table rows
- `columns` (number, default: 4) - Number of table columns
- `ariaLabel` (string, default: 'Loading table data') - Accessible label

### SkeletonCard

Pre-configured skeleton for card layouts with skull header and rib content.

```tsx
import { SkeletonCard } from '@/theme';

<SkeletonCard ariaLabel="Loading card" className="my-4" />
```

**Props:**
- `ariaLabel` (string, default: 'Loading card') - Accessible label
- `className` (string) - Additional CSS classes

## Custom Dimensions

Override default sizes with custom width and height:

```tsx
<SkeletonLoader
  shape="rectangle"
  width="300px"
  height="150px"
/>
```

## Multiple Skeletons

Render multiple skeleton elements at once:

```tsx
<SkeletonLoader shape="rib" count={5} />
```

## Theme Integration

The SkeletonLoader automatically uses the active theme's:

- **Colors**: Background, border, and accent colors from CSS variables
- **Animations**: Loading animation (bone-pulse, neon-pulse, heartbeat)
- **Effects**: Shimmer effect using theme's accent glow color

### CSS Variables Used

```css
--color-bg-secondary      /* Skeleton background */
--color-bg-primary        /* Skull eye sockets */
--color-border-primary    /* Skeleton border */
--color-border-secondary  /* Rib bottom border */
--color-accent-glow       /* Shimmer effect */
--animation-loading       /* Pulse animation */
--animation-duration-slow /* Animation duration */
--animation-easing        /* Animation timing function */
```

## Accessibility

The component follows accessibility best practices:

- **ARIA Attributes**: `role="status"`, `aria-busy="true"`, `aria-label`
- **Screen Reader Text**: Hidden text for screen readers
- **Motion Preferences**: Respects `prefers-reduced-motion` setting
- **Semantic HTML**: Proper use of status role

## Motion Preferences

When users have `prefers-reduced-motion` enabled:
- Pulse animations are disabled
- Shimmer effects are hidden
- Instant appearance without transitions

## Examples

### Loading User Profile

```tsx
<div className="profile-card">
  <SkeletonLoader shape="skull" size="xl" />
  <SkeletonLoader shape="bone" width="60%" />
  <SkeletonLoader shape="rib" count={3} />
</div>
```

### Loading Article List

```tsx
<div className="article-list">
  {Array.from({ length: 5 }, (_, i) => (
    <SkeletonCard key={i} ariaLabel={`Loading article ${i + 1}`} />
  ))}
</div>
```

### Loading Data Table

```tsx
<SkeletonTable
  rows={10}
  columns={5}
  ariaLabel="Loading tournament data"
/>
```

### Custom Loading State

```tsx
<div className="custom-loader">
  <SkeletonLoader shape="skull" size="lg" />
  <div className="content">
    <SkeletonLoader shape="bone" width="80%" />
    <SkeletonLoader shape="bone" width="60%" />
    <SkeletonLoader shape="rib" count={4} />
  </div>
</div>
```

## Styling

The component uses CSS classes that can be customized:

```css
/* Override skeleton colors */
.skeleton {
  background: custom-color;
  border-color: custom-border;
}

/* Customize animation speed */
.skeleton {
  animation-duration: 2s;
}

/* Add custom effects */
.skeleton-bone {
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
}
```

## Requirements Satisfied

- ✅ 11.1: Bone/rib-shaped skeleton component
- ✅ 11.2: Theme-appropriate colors using CSS variables
- ✅ 11.3: Pulse animation effect
- ✅ 11.4: Configurable sizes and shapes via props
- ✅ 11.5: Proper ARIA attributes for accessibility

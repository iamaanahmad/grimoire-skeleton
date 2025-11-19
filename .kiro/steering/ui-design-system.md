---
inclusion: fileMatch
fileMatchPattern: "**/*.{tsx,css,scss}"
---

# Grimoire UI Design System

## Spooky But Usable
Our UI must be hauntingly beautiful while maintaining excellent UX. Every animation, color, and interaction should feel intentional.

## Design Tokens

### Colors (CSS Variables)
```css
/* Base Dark Theme */
--bg-primary: #0a0a0f;
--bg-secondary: #16161d;
--bg-tertiary: #1f1f2a;
--text-primary: #e8e8f0;
--text-secondary: #a8a8b8;
--text-tertiary: #6a6a7a;

/* Nightmare Neon Skin */
--accent-primary: #00ff88;
--accent-secondary: #b800ff;
--accent-glow: rgba(0, 255, 136, 0.3);

/* Bone Minimal Skin */
--accent-primary: #f5f5f0;
--accent-secondary: #d0d0c8;
--accent-glow: rgba(245, 245, 240, 0.1);

/* Blood Moon Skin */
--accent-primary: #ff0044;
--accent-secondary: #cc0033;
--accent-glow: rgba(255, 0, 68, 0.2);
```

### Spacing Scale
Use Tailwind's default scale, but think in terms of:
- xs: 0.5rem (8px) - tight spacing
- sm: 0.75rem (12px) - compact
- md: 1rem (16px) - default
- lg: 1.5rem (24px) - breathing room
- xl: 2rem (32px) - section spacing
- 2xl: 3rem (48px) - major sections

### Typography
- **Headings**: Inter or system-ui, bold, tight line-height
- **Body**: Inter or system-ui, regular, comfortable line-height (1.6)
- **Mono**: 'Fira Code' or 'Courier New' for code/data

Sizes:
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 2rem (32px)

## Component Patterns

### Cards
```tsx
// Standard card with spooky hover
<div className="bg-secondary rounded-lg p-6 border border-tertiary 
                hover:border-accent-primary hover:shadow-glow 
                transition-all duration-300">
  {children}
</div>
```

### Buttons
Three variants:
1. **Primary** - Accent color, bold, for main actions
2. **Secondary** - Outlined, subtle, for secondary actions
3. **Ghost** - Minimal, text-only, for tertiary actions

All buttons should have:
- Smooth hover transitions (200-300ms)
- Subtle scale on hover (scale-105)
- Focus rings for accessibility
- Loading states with skeleton animation

### Tables
- Zebra striping with very subtle bg difference
- Hover row highlights with accent glow
- Sticky headers on scroll
- Skeleton loaders shaped like ribs while loading
- Empty states with ghost illustrations

### Forms
- Labels above inputs, always
- Error states in red with icon
- Success states in green with icon
- Floating labels optional for aesthetic
- All inputs have focus states with accent color
- Validation happens on blur, not on every keystroke

## Spooky Animations

### Glitch Effect (Nightmare Neon)
```css
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

.glitch-hover:hover {
  animation: glitch 0.3s ease-in-out;
}
```

### Bone Skeleton Loader
```css
@keyframes bone-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.skeleton-bone {
  background: linear-gradient(90deg, 
    var(--bg-tertiary) 25%, 
    var(--accent-primary) 50%, 
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: bone-pulse 1.5s ease-in-out infinite;
}
```

### Fade Ghost (for empty states)
```css
@keyframes fade-ghost {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.ghost-icon {
  animation: fade-ghost 3s ease-in-out infinite;
}
```

### Heartbeat Line (Haunted Clinic)
```css
@keyframes heartbeat {
  0%, 100% { transform: scaleY(1); }
  10% { transform: scaleY(1.3); }
  20% { transform: scaleY(1); }
  30% { transform: scaleY(1.5); }
  40% { transform: scaleY(1); }
}

.heartbeat-line {
  animation: heartbeat 2s ease-in-out infinite;
}
```

## Accessibility Requirements
- All interactive elements must have focus states
- Color contrast must meet WCAG AA (4.5:1 for text)
- Animations respect `prefers-reduced-motion`
- All images have alt text
- Forms have proper labels and ARIA attributes
- Keyboard navigation works everywhere

## Spooky Terminology
Use throughout the UI:
- "Summon" instead of "Create"
- "Banish" instead of "Delete"
- "Curse" for errors
- "Enchant" for success
- "Raise" for restore/undo
- "Cast" for submit/execute
- "Haunt" for active/selected state
- "Crypt" for archive
- "Ritual" for process/workflow

## Component Checklist
Every component should have:
- [ ] TypeScript props interface
- [ ] JSDoc comment explaining purpose
- [ ] Responsive design (mobile-first)
- [ ] Dark theme support
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Accessibility attributes
- [ ] Smooth transitions
- [ ] Spooky touch (animation, terminology, or visual)

## Layout Principles
- **Sidebar**: Fixed left, 240px wide, collapsible on mobile
- **Top bar**: Sticky, 64px height, app title + theme toggle + user menu
- **Content area**: Max width 1400px, centered, padding on sides
- **Cards**: Grid layout, responsive (1 col mobile, 2-3 cols desktop)
- **Spacing**: Generous whitespace, let content breathe

## Performance
- Lazy load images
- Code split routes
- Minimize animation jank (use transform/opacity only)
- Debounce search inputs
- Virtual scrolling for long lists (100+ items)

# Grimoire Skeleton - Project Architecture

## Core Philosophy
Grimoire is a Kiro-native skeleton framework designed to spawn diverse applications from a single, elegant foundation. Every decision prioritizes:
- **Clarity over cleverness** - Code should be immediately understandable
- **Configuration over code** - Define entities declaratively, generate implementation
- **Kiro-first development** - Built to showcase and leverage Kiro's full capabilities

## Technology Stack
- **Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend**: Appwrite (for auth, database, storage)
- **Styling**: Tailwind + CSS variables for theming
- **State**: React hooks + Context (keep it simple)

## Folder Structure
```
/src
  /core           # Shared components, layouts, utilities
    /components   # Reusable UI components (Table, Form, Card, etc.)
    /layouts      # App shell, navigation, auth wrappers
    /lib          # Utilities, API clients, helpers
  /modules        # Domain-specific features (tournaments, doctors, etc.)
  /theme          # Theme system, skins, animations
  /config         # Entity definitions, app configurations
/apps             # The two example applications
  /cursed-arena   # Esports tournament platform
  /haunted-clinic # Doctor appointment system
/.kiro
  /specs          # Kiro specs for features
  /hooks          # Automated workflows
  /steering       # Development guidelines (this file)
```

## Entity System Design
Entities are defined declaratively in config files:
```typescript
export const entities = {
  tournament: {
    fields: {
      name: { type: 'string', required: true },
      game: { type: 'string', required: true },
      startDate: { type: 'date', required: true },
      status: { type: 'enum', options: ['upcoming', 'live', 'completed'] }
    },
    permissions: ['admin', 'staff'],
    features: ['list', 'create', 'edit', 'detail']
  }
}
```

From this config, the skeleton auto-generates:
- List pages with filtering/sorting
- Create/edit forms with validation
- Detail views
- API routes
- Type definitions

## Theme System
Three spooky skins, all with excellent UX:
1. **nightmare_neon** - Neon green/purple, glitch effects, cyberpunk vibes
2. **bone_minimal** - Monochrome bone-white/black, clean and stark
3. **blood_moon** - Deep red accents, subtle glows, elegant darkness

All themes maintain:
- WCAG AA contrast ratios minimum
- Smooth animations (respect prefers-reduced-motion)
- Consistent spacing and typography
- Skeleton loaders shaped like bones/ribs

## Code Quality Standards
- All components must be TypeScript with proper types
- Use functional components with hooks
- Keep components under 200 lines (extract if larger)
- Every public function needs JSDoc comments
- Prefer composition over inheritance
- No any types unless absolutely necessary

## Naming Conventions
- Components: PascalCase (UserCard.tsx)
- Utilities: camelCase (formatDate.ts)
- Constants: UPPER_SNAKE_CASE
- CSS classes: kebab-case or Tailwind utilities
- Spooky terminology encouraged: "summon", "cast", "raise", "curse", "haunt"

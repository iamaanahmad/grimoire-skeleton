# Design Document

## Overview

This design document outlines the comprehensive redesign of all pages in the Grimoire Skeleton framework. The redesign transforms both applications (Cursed Arena and Haunted Clinic) into polished, hackathon-winning experiences while maintaining the shared skeleton architecture. The design emphasizes visual impact, smooth animations, responsive layouts, and theme consistency.

## Architecture

### Component Hierarchy

```
src/
├── app/
│   ├── page.tsx                    # Enhanced landing page
│   ├── apps/
│   │   ├── cursed-arena/
│   │   │   ├── layout.tsx          # Enhanced navigation
│   │   │   ├── page.tsx            # Redesigned dashboard
│   │   │   ├── tournaments/        # Enhanced CRUD pages
│   │   │   ├── teams/              # Enhanced CRUD pages
│   │   │   ├── players/            # Enhanced CRUD pages
│   │   │   └── matches/            # Enhanced CRUD pages
│   │   └── haunted-clinic/
│   │       ├── layout.tsx          # Enhanced navigation
│   │       ├── page.tsx            # Redesigned dashboard
│   │       ├── doctors/            # Enhanced CRUD pages
│   │       ├── patients/           # Enhanced CRUD pages
│   │       └── appointments/       # Enhanced CRUD pages
├── components/
│   ├── shared/                     # New shared UI components
│   │   ├── AnimatedCounter.tsx     # Number animation component
│   │   ├── GlowCard.tsx            # Themed card with glow effects
│   │   ├── StatusBadge.tsx         # Unified status badges
│   │   ├── EmptyState.tsx          # Themed empty states
│   │   ├── PageHeader.tsx          # Consistent page headers
│   │   └── FloatingActions.tsx     # Floating action bar
│   ├── cursed-arena/               # Arena-specific components
│   └── haunted-clinic/             # Clinic-specific components
└── theme/
    └── animations.css              # Enhanced animation library
```

### Design Principles

1. **Theme-First**: All colors, shadows, and effects use CSS variables for instant theme switching
2. **Performance**: CSS transforms and opacity for 60fps animations, no layout thrashing
3. **Accessibility**: WCAG AA contrast, keyboard navigation, reduced motion support
4. **Consistency**: Shared components ensure visual consistency across both apps
5. **Progressive Enhancement**: Core functionality works without JavaScript animations

## Components and Interfaces

### Shared Components

#### AnimatedCounter
```typescript
interface AnimatedCounterProps {
  value: number;
  duration?: number;      // Animation duration in ms (default: 1000)
  prefix?: string;        // e.g., "$" for currency
  suffix?: string;        // e.g., "+" for growth
  className?: string;
}
```

#### GlowCard
```typescript
interface GlowCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  hover?: boolean;        // Enable hover effects
  glow?: boolean;         // Enable glow effect
  className?: string;
  onClick?: () => void;
}
```

#### StatusBadge
```typescript
interface StatusBadgeProps {
  status: string;
  variant?: 'tournament' | 'match' | 'appointment';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;        // Animated pulse for live status
}
```

#### PageHeader
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;          // Emoji or icon
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}
```

#### FloatingActions
```typescript
interface FloatingActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: { icon: string; label: string; onClick: () => void }[];
  position?: 'bottom-right' | 'bottom-center';
}
```

### Page-Specific Components

#### Cursed Arena

- **LiveMatchCard**: Displays live match with animated score, team names, and status
- **TournamentHero**: Large tournament banner with countdown and prize pool
- **PlayerProfileCard**: Player stats with avatar, role badge, and team affiliation
- **BracketPreview**: Mini tournament bracket visualization

#### Haunted Clinic

- **AppointmentTimeline**: Vertical timeline of today's appointments
- **DoctorScheduleGrid**: Weekly schedule grid with availability
- **PatientCard**: Patient info with medical history summary
- **MiniCalendar**: Compact calendar showing appointment density

## Data Models

### Existing Models (No Changes)

The redesign uses existing data models from `src/types/`:
- Tournament, Team, Player, Match (Cursed Arena)
- Doctor, Patient, Appointment (Haunted Clinic)

### UI State Models

```typescript
interface PageState {
  loading: boolean;
  error: string | null;
  data: unknown;
}

interface AnimationState {
  entered: boolean;       // For entrance animations
  reducedMotion: boolean; // User preference
}

interface FilterState {
  search: string;
  status?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Theme Switching Consistency
*For any* theme selection from the available themes (nightmare_neon, bone_minimal, blood_moon), switching to that theme SHALL update all CSS variables correctly and all visible elements SHALL reflect the new theme colors within one render cycle.
**Validates: Requirements 1.4**

### Property 2: Live Match Display Completeness
*For any* set of live matches with valid data, the live matches section SHALL render each match with: a "LIVE" indicator, both team names, current scores, and the match round/stage.
**Validates: Requirements 2.2**

### Property 3: Tournament Card Data Integrity
*For any* upcoming tournament with valid data, the tournament card SHALL display: tournament name, game type, start date with countdown, status badge, and prize pool (if available).
**Validates: Requirements 2.3**

### Property 4: Appointment Timeline Status Colors
*For any* appointment in today's schedule, the timeline view SHALL render the appointment with a status indicator color that correctly maps to its status (scheduled=gray, confirmed=blue, in-progress=yellow, completed=green, cancelled=red).
**Validates: Requirements 3.2**

### Property 5: Appointment Card Information
*For any* upcoming appointment with valid data, the appointment card SHALL display: patient name, doctor name, appointment date, time, and status badge.
**Validates: Requirements 3.3**

### Property 6: List Page Header Accuracy
*For any* list page displaying entities, the header SHALL show the correct entity count matching the actual number of items in the data array.
**Validates: Requirements 4.1**

### Property 7: Empty State Rendering
*For any* entity type (tournament, team, player, match, doctor, patient, appointment) with zero items, the list page SHALL render an empty state component with a call-to-action button that links to the create page for that entity type.
**Validates: Requirements 4.4**

### Property 8: Detail Page Action Buttons
*For any* entity detail page, the page SHALL render action buttons for edit and delete operations, with the edit button linking to the correct edit route and delete triggering a confirmation dialog.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 9: Form Field Labels
*For any* entity create or edit form, every input field SHALL have an associated label element with descriptive text, and required fields SHALL be visually indicated.
**Validates: Requirements 6.1**

### Property 10: Form Validation Error Display
*For any* form submission with invalid data, the form SHALL display inline error messages adjacent to the invalid fields, and the error messages SHALL describe what is wrong with the input.
**Validates: Requirements 6.2**

### Property 11: Reduced Motion Respect
*For any* component with animations, when the user has prefers-reduced-motion enabled, the component SHALL either disable animations entirely or reduce them to simple opacity transitions.
**Validates: Requirements 9.4**

### Property 12: Error State Retry Functionality
*For any* error state displayed to the user, the error UI SHALL include a retry button that, when clicked, re-attempts the failed operation.
**Validates: Requirements 10.2**

## Error Handling

### Loading States
- All data-fetching pages display skeleton loaders during initial load
- Skeleton loaders match the expected content layout (cards, tables, etc.)
- Loading state prevents user interaction with incomplete data

### Error States
- Network errors display a friendly message with retry option
- Validation errors show inline messages next to affected fields
- 404 pages provide navigation back to main areas
- Unauthorized access redirects to login or shows access denied

### Edge Cases
- Empty data sets show engaging empty states with CTAs
- Long text content truncates with ellipsis and tooltip on hover
- Missing optional fields display placeholder or "N/A"
- Invalid dates/times show "Invalid" with error styling

## Testing Strategy

### Unit Testing
- Test individual component rendering with various props
- Test utility functions (date formatting, status mapping, etc.)
- Test form validation logic
- Use Vitest with React Testing Library

### Property-Based Testing
- Use fast-check library for property-based tests
- Generate random valid entity data to test rendering properties
- Generate random invalid inputs to test validation properties
- Test theme switching with all theme combinations
- Minimum 100 iterations per property test

### Integration Testing
- Test page-level data fetching and rendering
- Test navigation between pages
- Test form submission flows
- Test theme persistence across page navigation

### Visual Testing
- Manual testing of animations and transitions
- Cross-browser testing (Chrome, Firefox, Safari)
- Responsive testing at key breakpoints (320px, 768px, 1024px, 1440px)

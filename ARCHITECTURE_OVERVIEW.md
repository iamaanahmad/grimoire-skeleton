# Grimoire Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GRIMOIRE SKELETON                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              ENTITY SYSTEM (Core)                   │    │
│  │                                                      │    │
│  │  Entity Config → Generator → Types + UI + API       │    │
│  │                                                      │    │
│  │  [tournament.ts] ──→ [Generator] ──→ [5+ files]    │    │
│  └────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │              THEME ENGINE (Core)                    │    │
│  │                                                      │    │
│  │  Theme Definition → CSS Variables → Components      │    │
│  │                                                      │    │
│  │  [nightmare_neon] → [--accent-primary] → [Button]  │    │
│  └────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │              AUTH SYSTEM (Core)                     │    │
│  │                                                      │    │
│  │  Appwrite → Auth Context → Protected Routes         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────┴──────────────────┐
        ↓                                      ↓
┌──────────────────┐                  ┌──────────────────┐
│  CURSED ARENA    │                  │  HAUNTED CLINIC  │
│                  │                  │                  │
│  Entities:       │                  │  Entities:       │
│  - Tournament    │                  │  - Doctor        │
│  - Team          │                  │  - Patient       │
│  - Player        │                  │  - Appointment   │
│  - Match         │                  │                  │
│                  │                  │  Theme:          │
│  Theme:          │                  │  - bone_minimal  │
│  - nightmare_neon│                  │  - blood_moon    │
│                  │                  │                  │
│  Style:          │                  │  Style:          │
│  - Cyberpunk     │                  │  - Medical Gothic│
│  - Glitch FX     │                  │  - Heartbeat FX  │
└──────────────────┘                  └──────────────────┘
```

## Data Flow

### Entity Creation Flow

```
Developer writes config
        ↓
Entity Generator Hook triggers
        ↓
┌───────────────────────────────┐
│ 1. Generate TypeScript types  │
│ 2. Generate List component    │
│ 3. Generate Form component    │
│ 4. Generate Detail component  │
│ 5. Generate API routes        │
│ 6. Update navigation          │
└───────────────────────────────┘
        ↓
Production-ready CRUD interface
```

### Theme Switching Flow

```
User clicks theme switcher
        ↓
ThemeContext updates
        ↓
CSS variables injected into :root
        ↓
All components re-render with new theme
        ↓
Smooth transition (300ms)
```

### Authentication Flow

```
User submits login form
        ↓
Auth service calls Appwrite
        ↓
Session created
        ↓
AuthContext updates
        ↓
User redirected to dashboard
        ↓
Protected routes now accessible
```

## File Structure

```
grimoire-skeleton/
│
├── .kiro/                          # Kiro configuration
│   ├── specs/                      # Implementation specs
│   │   ├── entity-system.md        # 15 tasks
│   │   ├── theme-engine.md         # 15 tasks
│   │   ├── auth-system.md          # 15 tasks
│   │   ├── cursed-arena-app.md     # 15 tasks
│   │   ├── haunted-clinic-app.md   # 15 tasks
│   │   └── project-setup.md        # 15 tasks
│   │
│   ├── hooks/                      # Automated workflows
│   │   ├── entity-generator.json   # Auto-generate from config
│   │   ├── theme-validator.json    # Check accessibility
│   │   ├── component-documentation.json
│   │   └── pre-commit-quality.json
│   │
│   ├── steering/                   # Development guidelines
│   │   ├── project-architecture.md # Always included
│   │   ├── entity-system-guide.md  # Conditional
│   │   ├── ui-design-system.md     # Conditional
│   │   └── kiro-usage-strategy.md  # Always included
│   │
│   └── KIRO_QUICKSTART.md         # How to use Kiro
│
├── src/                            # Core skeleton code
│   ├── core/                       # Shared across all apps
│   │   ├── components/             # Reusable UI
│   │   │   ├── EntityTable.tsx     # Generic table
│   │   │   ├── EntityForm.tsx      # Generic form
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   │
│   │   ├── generators/             # Code generators
│   │   │   ├── type-generator.ts
│   │   │   ├── list-generator.ts
│   │   │   ├── form-generator.ts
│   │   │   ├── detail-generator.ts
│   │   │   └── api-generator.ts
│   │   │
│   │   ├── layouts/                # App shell
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   │
│   │   ├── lib/                    # Utilities
│   │   │   ├── appwrite.ts
│   │   │   ├── entity-registry.ts
│   │   │   ├── validators.ts
│   │   │   └── ...
│   │   │
│   │   └── types/                  # Core types
│   │       └── entity.ts
│   │
│   ├── modules/                    # Generated entity modules
│   │   ├── tournament/
│   │   │   ├── types.ts
│   │   │   ├── list.tsx
│   │   │   ├── form.tsx
│   │   │   └── detail.tsx
│   │   └── ...
│   │
│   ├── theme/                      # Theme system
│   │   ├── types.ts
│   │   ├── ThemeContext.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   ├── skins/
│   │   │   ├── nightmare_neon.ts
│   │   │   ├── bone_minimal.ts
│   │   │   └── blood_moon.ts
│   │   ├── animations.css
│   │   └── globals.css
│   │
│   └── config/                     # Configuration
│       ├── entities/               # Entity definitions
│       └── navigation.ts
│
├── apps/                           # Example applications
│   ├── cursed-arena/
│   │   ├── config/
│   │   │   └── entities/
│   │   │       ├── tournament.ts
│   │   │       ├── team.ts
│   │   │       ├── player.ts
│   │   │       └── match.ts
│   │   ├── src/
│   │   │   ├── app/                # Next.js pages
│   │   │   └── components/         # Custom components
│   │   ├── scripts/
│   │   │   └── seed.ts
│   │   └── README.md
│   │
│   └── haunted-clinic/
│       ├── config/
│       │   └── entities/
│       │       ├── doctor.ts
│       │       ├── patient.ts
│       │       └── appointment.ts
│       ├── src/
│       │   ├── app/
│       │   └── components/
│       ├── scripts/
│       │   └── seed.ts
│       └── README.md
│
├── scripts/                        # Build scripts
│   ├── generate-entity.ts
│   └── setup-appwrite.ts
│
├── README.md                       # Main documentation
├── KIRO_USAGE_WRITEUP.md          # For hackathon submission
├── PROJECT_CHECKLIST.md           # Progress tracking
├── ARCHITECTURE_OVERVIEW.md       # This file
├── DEVELOPMENT.md                 # Developer guide
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.local.example
```

## Component Hierarchy

### Cursed Arena Dashboard

```
AppLayout
├── Sidebar (navigation)
├── TopBar
│   ├── AppTitle: "Cursed Arena"
│   └── ThemeSwitcher
└── DashboardPage
    ├── StatsCards
    │   ├── TotalTournaments
    │   ├── TotalTeams
    │   └── TotalPlayers
    ├── UpcomingTournaments
    │   └── TournamentCard[] (with glitch effect)
    └── LiveMatches
        └── MatchCard[]
```

### Haunted Clinic Dashboard

```
AppLayout
├── Sidebar (navigation)
├── TopBar
│   ├── AppTitle: "Haunted Clinic"
│   └── ThemeSwitcher
└── DashboardPage
    ├── StatsCards (with heartbeat animation)
    │   ├── TotalDoctors
    │   ├── TotalPatients
    │   └── AppointmentsToday
    ├── TodaySchedule
    │   └── AppointmentTimeline
    └── UpcomingAppointments
        └── AppointmentCard[]
```

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + CSS Variables
- **State**: React Hooks + Context API
- **UI Components**: Custom (generated)

### Backend

- **BaaS**: Appwrite
  - Authentication
  - Database (NoSQL)
  - Storage
  - Permissions

### Development

- **AI Partner**: Kiro
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest + React Testing Library
- **Version Control**: Git

## Key Design Patterns

### 1. Configuration over Code

```typescript
// Define once
const tournament = {
  fields: { name: 'string', date: 'date' },
  features: ['list', 'create', 'edit']
};

// Get automatically
- Types
- UI Components
- API Routes
- Navigation
```

### 2. Theme Composition

```typescript
// Base theme
const base = { bg: '#0a0a0f', text: '#e8e8f0' };

// Skin overlay
const nightmare_neon = { accent: '#00ff88', glow: true };

// Result: base + skin = complete theme
```

### 3. Generator Pipeline

```
Config → Validate → Generate → Format → Write → Register
```

### 4. Hook Automation

```
File Save → Pattern Match → Hook Trigger → Action → Feedback
```

## Kiro Integration Points

### 1. Specs (Structured)

- Complex systems
- Multiple interconnected files
- Security-critical code
- Clear requirements

### 2. Vibe Coding (Conversational)

- UI components
- Animations
- Refactoring
- Quick iterations

### 3. Hooks (Automated)

- Repetitive tasks
- Code generation
- Quality checks
- Documentation

### 4. Steering (Contextual)

- Architecture decisions
- Naming conventions
- Design patterns
- Best practices

## Success Metrics

### Code Generation

- **Target**: 80% of code generated by Kiro
- **Measurement**: Lines of code (manual vs generated)

### Time Savings

- **Target**: 40+ hours saved
- **Measurement**: Before/after comparisons

### Quality

- **TypeScript**: Zero errors
- **Accessibility**: WCAG AA compliant
- **Performance**: Lighthouse >90
- **Tests**: >80% coverage

### Kiro Usage

- **Specs**: 6 specs, 90 tasks
- **Hooks**: 4 hooks, ~8 hours saved
- **Steering**: 4 docs, always aligned
- **Vibe Coding**: 70% of UI components

---

This architecture demonstrates how Kiro can be used to build production-ready, reusable systems that are both powerful and maintainable.

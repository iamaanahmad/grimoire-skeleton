# Design Document - Cursed Arena

## Overview

Cursed Arena is the first example application built on the Grimoire skeleton framework, demonstrating how the entity system, theme engine, and core components can be configured to create a complete esports tournament management platform. The application leverages the entity generator to create CRUD functionality for four core entities (tournaments, teams, players, matches) and adds custom components for specialized views like dashboards, brackets, and live score updates.

The design follows the Grimoire skeleton's philosophy of configuration over code, using declarative entity definitions to generate most of the implementation while adding custom components only where unique functionality is required.

## Architecture

### High-Level Structure

```
apps/cursed-arena/
├── config/
│   ├── entities.ts          # Entity definitions for all 4 entities
│   └── app.ts               # App-level configuration (name, theme, nav)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Dashboard (custom)
│   │   ├── tournaments/     # Generated + custom detail page
│   │   ├── teams/           # Generated + custom detail page
│   │   ├── players/         # Generated pages
│   │   └── matches/         # Generated pages
│   ├── components/          # Custom components
│   │   ├── TournamentCard.tsx
│   │   ├── MatchScoreUpdater.tsx
│   │   └── BracketView.tsx
│   └── styles/
│       └── custom.css       # App-specific styles
├── scripts/
│   └── seed.ts              # Data seeding script
└── __tests__/
    └── e2e.test.ts          # End-to-end tests
```

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS variables (nightmare_neon theme)
- **Backend**: Appwrite (auth, database, storage)
- **State Management**: React hooks + Context
- **Code Generation**: Grimoire entity generator

### Integration with Grimoire Skeleton

Cursed Arena imports and extends the skeleton's core functionality:

```typescript
// Uses core components from skeleton
import { Table, Form, Card, Button } from '@/core/components';
import { AppLayout } from '@/core/layouts';
import { useEntity, useTheme } from '@/core/lib/hooks';

// Uses entity system
import { EntityRegistry } from '@/core/lib/entity-system';

// Uses theme engine
import { ThemeProvider } from '@/core/theme';
```

## Components and Interfaces

### Entity Definitions

All entities are defined in `apps/cursed-arena/config/entities.ts` following the `EntityDefinition` interface:

```typescript
interface EntityDefinition {
  fields: Record<string, FieldDefinition>;
  permissions: string[];
  features: ('list' | 'create' | 'edit' | 'detail' | 'delete')[];
  display: {
    icon: string;
    singular: string;
    plural: string;
    listColumns: string[];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

interface FieldDefinition {
  type: 'string' | 'number' | 'date' | 'enum' | 'reference';
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
  };
  options?: string[];  // For enum types
  reference?: string;  // For reference types
  defaultValue?: any;
}
```

#### Tournament Entity

```typescript
export const tournament: EntityDefinition = {
  fields: {
    name: { 
      type: 'string', 
      required: true,
      validation: { min: 3, max: 100 }
    },
    game: { 
      type: 'enum', 
      required: true,
      options: ['League of Legends', 'Dota 2', 'CS:GO', 'Valorant', 'Overwatch']
    },
    startDate: { type: 'date', required: true },
    endDate: { type: 'date' },
    prizePool: { type: 'number', validation: { min: 0 } },
    status: { 
      type: 'enum',
      options: ['upcoming', 'live', 'completed', 'cancelled'],
      defaultValue: 'upcoming'
    },
    maxTeams: { 
      type: 'number',
      validation: { min: 2, max: 64 },
      defaultValue: 16
    },
    description: { type: 'string' }
  },
  permissions: ['admin', 'staff'],
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '🏆',
    singular: 'Tournament',
    plural: 'Tournaments',
    listColumns: ['name', 'game', 'startDate', 'status', 'prizePool'],
    sortBy: 'startDate',
    sortOrder: 'desc'
  }
};
```

#### Team Entity

```typescript
export const team: EntityDefinition = {
  fields: {
    name: { 
      type: 'string', 
      required: true,
      validation: { min: 2, max: 50 }
    },
    tag: { 
      type: 'string', 
      required: true,
      validation: { min: 2, max: 5 }
    },
    logo: { type: 'string' },  // URL
    membersCount: { type: 'number', defaultValue: 0 },
    region: {
      type: 'enum',
      options: ['NA', 'EU', 'ASIA', 'SA', 'OCE']
    }
  },
  permissions: ['admin', 'staff'],
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '⚔️',
    singular: 'Team',
    plural: 'Teams',
    listColumns: ['name', 'tag', 'region', 'membersCount'],
    sortBy: 'name',
    sortOrder: 'asc'
  }
};
```

#### Player Entity

```typescript
export const player: EntityDefinition = {
  fields: {
    gamertag: { 
      type: 'string', 
      required: true,
      validation: { min: 2, max: 30 }
    },
    realName: { type: 'string' },
    team: { type: 'reference', reference: 'team' },
    role: {
      type: 'enum',
      options: ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Flex']
    },
    country: { type: 'string' }
  },
  permissions: ['admin', 'staff'],
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '🎮',
    singular: 'Player',
    plural: 'Players',
    listColumns: ['gamertag', 'team', 'role', 'country'],
    sortBy: 'gamertag',
    sortOrder: 'asc'
  }
};
```

#### Match Entity

```typescript
export const match: EntityDefinition = {
  fields: {
    tournament: { 
      type: 'reference', 
      reference: 'tournament',
      required: true
    },
    teamA: { 
      type: 'reference', 
      reference: 'team',
      required: true
    },
    teamB: { 
      type: 'reference', 
      reference: 'team',
      required: true
    },
    scoreA: { type: 'number', defaultValue: 0, validation: { min: 0 } },
    scoreB: { type: 'number', defaultValue: 0, validation: { min: 0 } },
    status: {
      type: 'enum',
      options: ['scheduled', 'live', 'completed'],
      defaultValue: 'scheduled'
    },
    scheduledTime: { type: 'date' },
    round: { type: 'string' }  // e.g., "Quarter Finals"
  },
  permissions: ['admin', 'staff'],
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '⚡',
    singular: 'Match',
    plural: 'Matches',
    listColumns: ['tournament', 'teamA', 'teamB', 'status', 'scheduledTime'],
    sortBy: 'scheduledTime',
    sortOrder: 'asc'
  }
};
```

### Custom Components

#### TournamentCard Component

A specialized card component styled to look like a cursed arcade cabinet.

```typescript
interface TournamentCardProps {
  tournament: Tournament;
  onClick?: () => void;
}

// Features:
// - Arcade cabinet aesthetic with neon borders
// - Glitch effect on hover
// - Displays game, date, prize pool
// - Click to navigate to detail page
// - Responsive design
```

**Styling Approach**:
- Base card from skeleton's Card component
- Custom CSS for arcade cabinet shape (angled corners)
- Neon glow using box-shadow with theme colors
- Glitch animation using CSS transforms and pseudo-elements
- Hover state triggers animation

#### MatchScoreUpdater Component

A compact component for quickly updating match scores during live events.

```typescript
interface MatchScoreUpdaterProps {
  match: Match;
  onUpdate: (scoreA: number, scoreB: number) => Promise<void>;
}

// Features:
// - Increment/decrement buttons for each team
// - Current score display
// - Save button
// - Live indicator when match status is "live"
// - Optimistic UI updates
// - Error handling
```

**State Management**:
```typescript
const [scoreA, setScoreA] = useState(match.scoreA);
const [scoreB, setScoreB] = useState(match.scoreB);
const [isSaving, setIsSaving] = useState(false);

const handleSave = async () => {
  setIsSaving(true);
  try {
    await onUpdate(scoreA, scoreB);
  } catch (error) {
    // Revert to original scores on error
    setScoreA(match.scoreA);
    setScoreB(match.scoreB);
  } finally {
    setIsSaving(false);
  }
};
```

#### BracketView Component

A text-based bracket visualization showing tournament progression.

```typescript
interface BracketViewProps {
  tournament: Tournament;
  matches: Match[];
}

// Features:
// - Groups matches by round
// - Displays team names and scores
// - Highlights winners
// - Responsive layout
// - Accessible (keyboard navigation, screen reader support)
```

**Data Structure**:
```typescript
// Group matches by round
const rounds = matches.reduce((acc, match) => {
  const round = match.round || 'Unassigned';
  if (!acc[round]) acc[round] = [];
  acc[round].push(match);
  return acc;
}, {} as Record<string, Match[]>);

// Render order: QF -> SF -> F
const roundOrder = ['Quarter Finals', 'Semi Finals', 'Finals'];
```

### Page Components

#### Dashboard Page (`app/page.tsx`)

Custom dashboard showing overview of the platform.

**Data Requirements**:
- Upcoming tournaments (next 5, sorted by startDate)
- Live matches (status === 'live')
- Statistics (total counts)

**API Calls**:
```typescript
const upcomingTournaments = await fetchTournaments({
  filter: { status: 'upcoming' },
  sort: 'startDate',
  limit: 5
});

const liveMatches = await fetchMatches({
  filter: { status: 'live' }
});

const stats = {
  totalTournaments: await countTournaments(),
  totalTeams: await countTeams(),
  totalPlayers: await countPlayers()
};
```

**Layout**:
- Stats cards at top (3 columns on desktop, 1 on mobile)
- Upcoming tournaments section with TournamentCard components
- Live matches section with match cards
- Glitch effects on hover for all cards

#### Tournament Detail Page (`app/tournaments/[id]/page.tsx`)

Custom detail page extending the generated tournament detail view.

**Sections**:
1. Tournament header (name, game, dates, prize pool, status)
2. Edit/Delete actions
3. Matches section (grouped by round)
4. Participating teams section
5. Bracket view

**Data Requirements**:
```typescript
const tournament = await fetchTournament(id);
const matches = await fetchMatches({ 
  filter: { tournament: id },
  sort: 'scheduledTime'
});
const teams = await fetchTeamsInTournament(id);
```

#### Team Detail Page (`app/teams/[id]/page.tsx`)

Custom detail page extending the generated team detail view.

**Sections**:
1. Team header (name, tag, logo, region)
2. Edit/Delete actions
3. Roster section (list of players)
4. Match history section

**Data Requirements**:
```typescript
const team = await fetchTeam(id);
const players = await fetchPlayers({ 
  filter: { team: id },
  sort: 'gamertag'
});
const matches = await fetchMatches({
  filter: { 
    $or: [{ teamA: id }, { teamB: id }]
  },
  sort: 'scheduledTime'
});
```

## Data Models

### TypeScript Interfaces

Generated by the entity system based on entity definitions:

```typescript
interface Tournament {
  id: string;
  name: string;
  game: 'League of Legends' | 'Dota 2' | 'CS:GO' | 'Valorant' | 'Overwatch';
  startDate: Date;
  endDate?: Date;
  prizePool?: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  maxTeams: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Team {
  id: string;
  name: string;
  tag: string;
  logo?: string;
  membersCount: number;
  region?: 'NA' | 'EU' | 'ASIA' | 'SA' | 'OCE';
  createdAt: Date;
  updatedAt: Date;
}

interface Player {
  id: string;
  gamertag: string;
  realName?: string;
  team?: string;  // Team ID reference
  role?: 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Support' | 'Flex';
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Match {
  id: string;
  tournament: string;  // Tournament ID reference
  teamA: string;       // Team ID reference
  teamB: string;       // Team ID reference
  scoreA: number;
  scoreB: number;
  status: 'scheduled' | 'live' | 'completed';
  scheduledTime?: Date;
  round?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Appwrite Collections

Each entity maps to an Appwrite collection with the following structure:

**Collection: tournaments**
- Attributes match entity fields
- Indexes: startDate, status
- Permissions: admin, staff (read/write)

**Collection: teams**
- Attributes match entity fields
- Indexes: name, region
- Permissions: admin, staff (read/write)

**Collection: players**
- Attributes match entity fields
- Indexes: gamertag, team (for filtering by team)
- Permissions: admin, staff (read/write)

**Collection: matches**
- Attributes match entity fields
- Indexes: tournament, status, scheduledTime
- Permissions: admin, staff (read/write)

### Relationships

```
Tournament (1) ----< (N) Match
Team (1) ----< (N) Player
Team (1) ----< (N) Match (as teamA)
Team (1) ----< (N) Match (as teamB)
```

## Error Handling

### Validation Errors

All form validation is handled by the generated form components using the validation rules defined in entity definitions:

```typescript
// Example validation for tournament name
if (name.length < 3 || name.length > 100) {
  return {
    field: 'name',
    message: 'Tournament name must be between 3 and 100 characters'
  };
}
```

### API Errors

API errors are caught and displayed using the skeleton's error handling system:

```typescript
try {
  await createTournament(data);
  showSuccess('Tournament created successfully');
  router.push('/tournaments');
} catch (error) {
  if (error.code === 'DUPLICATE_NAME') {
    showError('A tournament with this name already exists');
  } else {
    showError('Failed to create tournament. Please try again.');
  }
}
```

### Network Errors

Network errors are handled with retry logic and user feedback:

```typescript
const fetchWithRetry = async (url: string, retries = 3) => {
  try {
    return await fetch(url);
  } catch (error) {
    if (retries > 0) {
      await delay(1000);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
};
```

## Testing Strategy

### Unit Tests

Focus on custom components and utility functions:

- TournamentCard component rendering
- MatchScoreUpdater state management
- BracketView data grouping logic
- Validation functions

### Integration Tests

Test entity CRUD operations:

- Create tournament with valid data
- Update match scores
- Delete team and verify cascade behavior
- Filter and sort operations

### End-to-End Tests

Test complete user flows:

```typescript
describe('Tournament Management Flow', () => {
  it('should create tournament, add teams, create matches, and update scores', async () => {
    // 1. Create tournament
    await createTournament({
      name: 'Test Tournament',
      game: 'League of Legends',
      startDate: new Date(),
      maxTeams: 8
    });
    
    // 2. Create teams
    const teamA = await createTeam({ name: 'Team A', tag: 'TMA' });
    const teamB = await createTeam({ name: 'Team B', tag: 'TMB' });
    
    // 3. Create match
    const match = await createMatch({
      tournament: tournament.id,
      teamA: teamA.id,
      teamB: teamB.id,
      status: 'scheduled'
    });
    
    // 4. Update scores
    await updateMatchScores(match.id, { scoreA: 2, scoreB: 1 });
    
    // 5. Verify bracket view shows correct winner
    const bracket = await getBracketView(tournament.id);
    expect(bracket).toContainWinner(teamA.id);
  });
});
```

### Accessibility Tests

- Keyboard navigation through all pages
- Screen reader compatibility
- Color contrast validation
- Focus management

### Performance Tests

- Dashboard load time < 2 seconds
- List pages with 100+ items remain responsive
- Image optimization verification
- Bundle size analysis

## Theme and Styling

### nightmare_neon Theme Application

The app uses the nightmare_neon theme from the skeleton's theme engine:

```typescript
// apps/cursed-arena/config/app.ts
export const appConfig = {
  name: 'Cursed Arena',
  defaultTheme: 'nightmare_neon',
  // ... other config
};
```

### Custom Styles

Additional styles specific to Cursed Arena:

```css
/* apps/cursed-arena/src/styles/custom.css */

/* Arcade cabinet card styling */
.arcade-card {
  position: relative;
  clip-path: polygon(
    0 10px, 10px 0, 
    calc(100% - 10px) 0, 100% 10px,
    100% calc(100% - 10px), calc(100% - 10px) 100%,
    10px 100%, 0 calc(100% - 10px)
  );
  box-shadow: 
    0 0 20px var(--color-primary),
    inset 0 0 20px rgba(var(--color-primary-rgb), 0.2);
}

/* Glitch animation */
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

.arcade-card:hover {
  animation: glitch 0.3s ease-in-out;
}

/* Neon glow effect */
.neon-glow {
  text-shadow: 
    0 0 10px var(--color-primary),
    0 0 20px var(--color-primary),
    0 0 30px var(--color-primary);
}

/* Live indicator pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.live-indicator {
  animation: pulse 2s ease-in-out infinite;
}
```

### Responsive Breakpoints

Following Tailwind's default breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const BracketView = dynamic(() => import('@/components/BracketView'), {
  loading: () => <SkeletonBracket />,
  ssr: false
});
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image 
  src={team.logo} 
  alt={team.name}
  width={100}
  height={100}
  loading="lazy"
/>
```

### API Caching

```typescript
// Cache tournament list for 5 minutes
export const revalidate = 300;

export async function getTournaments() {
  // Next.js will cache this automatically
  return fetch('/api/tournaments');
}
```

### Loading States

All data fetching operations show skeleton loaders:

```typescript
{isLoading ? (
  <SkeletonCard count={5} />
) : (
  tournaments.map(t => <TournamentCard key={t.id} tournament={t} />)
)}
```

## Seed Data Script

The seed script creates realistic sample data for development and demos:

```typescript
// apps/cursed-arena/scripts/seed.ts

async function seed() {
  // Create tournaments
  const tournaments = await Promise.all([
    createTournament({
      name: 'Summer Championship 2024',
      game: 'League of Legends',
      startDate: addDays(new Date(), 7),
      prizePool: 100000,
      status: 'upcoming',
      maxTeams: 16
    }),
    // ... more tournaments
  ]);
  
  // Create teams
  const teams = await Promise.all([
    createTeam({ name: 'Shadow Legends', tag: 'SL', region: 'NA' }),
    createTeam({ name: 'Neon Knights', tag: 'NK', region: 'EU' }),
    // ... more teams
  ]);
  
  // Create players
  const players = await Promise.all([
    createPlayer({ 
      gamertag: 'DarkMage', 
      team: teams[0].id, 
      role: 'Mid' 
    }),
    // ... more players
  ]);
  
  // Create matches
  const matches = await Promise.all([
    createMatch({
      tournament: tournaments[0].id,
      teamA: teams[0].id,
      teamB: teams[1].id,
      round: 'Quarter Finals',
      status: 'scheduled',
      scheduledTime: addDays(new Date(), 8)
    }),
    // ... more matches
  ]);
  
  console.log('Seed data created successfully');
}
```

## Design Decisions and Rationales

### Why Entity Generator for Core CRUD?

**Decision**: Use the entity generator for all basic CRUD operations rather than hand-coding.

**Rationale**: 
- Demonstrates the skeleton's core value proposition
- Ensures consistency across all entities
- Reduces development time by 70%+
- Makes it easy to add new entities in the future
- Generated code follows best practices automatically

### Why Custom Components for Dashboard and Details?

**Decision**: Create custom components for dashboard, tournament detail, and team detail pages.

**Rationale**:
- These pages have unique layouts not covered by standard CRUD
- Showcases how to extend generated code
- Demonstrates flexibility of the skeleton
- Provides better UX than generic detail pages

### Why Text-Based Bracket View?

**Decision**: Implement a simple text-based bracket rather than a visual drag-and-drop bracket.

**Rationale**:
- Keeps scope manageable for hackathon timeline
- Focuses on functionality over fancy UI
- Easier to make accessible
- Can be enhanced later without affecting core functionality

### Why nightmare_neon as Default Theme?

**Decision**: Use nightmare_neon theme as the default for Cursed Arena.

**Rationale**:
- Best fits the esports/gaming aesthetic
- Showcases the theme engine's capabilities
- Provides strong visual identity
- Differentiates from the Haunted Clinic app (which uses blood_moon)

### Why Appwrite for Backend?

**Decision**: Use Appwrite for all backend services.

**Rationale**:
- Provides auth, database, and storage in one platform
- Easy to set up and configure
- Good developer experience
- Aligns with skeleton's architecture
- Reduces complexity compared to custom backend

## Dependencies

- Grimoire skeleton core (`/src/core`)
- Entity system (`/src/core/lib/entity-system`)
- Theme engine (`/src/core/theme`)
- Next.js 14+
- TypeScript 5+
- Tailwind CSS 3+
- Appwrite SDK
- React 18+

## Future Enhancements

Potential features to add after initial implementation:

1. **Visual Bracket Builder**: Drag-and-drop bracket creation
2. **Live Streaming Integration**: Embed Twitch streams on tournament pages
3. **Player Statistics**: Track individual player performance across tournaments
4. **Team Rankings**: ELO-based ranking system
5. **Notifications**: Real-time updates for match starts and score changes
6. **Mobile App**: React Native app using same backend
7. **Tournament Templates**: Pre-configured tournament formats (single elimination, double elimination, round robin)
8. **Sponsor Management**: Add sponsors to tournaments with logo placement

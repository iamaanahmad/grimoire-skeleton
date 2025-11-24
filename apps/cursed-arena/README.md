# Cursed Arena

Esports tournament management platform built on the Grimoire skeleton framework. Features cyberpunk aesthetics with the nightmare_neon theme, comprehensive CRUD operations for tournaments, teams, players, and matches, plus specialized views for brackets and live score updates.

## Features

- **Tournament Management** - Create and manage competitive gaming events
- **Team Management** - Track esports organizations and rosters
- **Player Management** - Manage individual competitors and team affiliations
- **Match Management** - Schedule matches and update scores in real-time
- **Dashboard** - Overview of upcoming tournaments and live matches
- **Bracket View** - Text-based tournament bracket visualization
- **Live Score Updates** - Quick score updater for live matches
- **Cyberpunk Theme** - Neon green/purple aesthetic with glitch effects

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Run seed script (optional)
npm run seed:cursed-arena
```

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Visit `http://localhost:3000` to see the dashboard.

## Entity Configuration

All entities are defined declaratively in `apps/cursed-arena/config/entities.ts`. The entity system auto-generates:

- TypeScript types
- List pages with filtering/sorting
- Create/edit forms with validation
- Detail views
- API routes

### Entities

1. **Tournament** - Competitive gaming events
2. **Team** - Esports organizations
3. **Player** - Individual competitors
4. **Match** - Games between teams

## Theme Customization

The app uses the `nightmare_neon` theme by default. To change themes:

```typescript
// apps/cursed-arena/config/app.ts
export const appConfig = {
  defaultTheme: 'bone_minimal', // or 'blood_moon'
  // ...
};
```

## Project Structure

```
apps/cursed-arena/
├── config/
│   ├── app.ts           # App configuration
│   └── entities.ts      # Entity definitions
├── src/
│   ├── app/
│   │   └── page.tsx     # Dashboard
│   ├── components/
│   │   ├── TournamentCard.tsx
│   │   ├── BracketView.tsx
│   │   └── MatchScoreUpdater.tsx
│   ├── lib/
│   │   └── api.ts       # API client
│   ├── types/
│   │   └── entities.ts  # TypeScript types
│   └── styles/
│       └── custom.css   # Custom styles
└── scripts/
    └── seed.ts          # Data seeding
```

## Development

Built with:
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Grimoire skeleton framework
- Appwrite (backend)

## License

MIT

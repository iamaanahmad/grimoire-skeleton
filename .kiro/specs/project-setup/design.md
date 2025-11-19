# Design Document - Project Setup

## Overview

This design document outlines the technical approach for setting up the Grimoire Skeleton project infrastructure. The setup establishes a Next.js 14+ application with TypeScript, Tailwind CSS, and Appwrite integration, organized in a modular structure that supports the entity system and theme engine. The design prioritizes developer experience, type safety, and maintainability while showcasing Kiro's capabilities.

## Architecture

### Technology Stack

**Frontend Framework:**
- Next.js 14+ with App Router for modern React development
- React 18+ for component architecture
- TypeScript 5+ for type safety

**Styling:**
- Tailwind CSS 3+ for utility-first styling
- CSS variables for dynamic theming
- PostCSS for CSS processing

**Backend:**
- Appwrite for authentication, database, and storage
- Server-side API routes in Next.js for backend logic

**Development Tools:**
- ESLint for code linting
- Prettier for code formatting
- Jest or Vitest for testing
- React Testing Library for component testing

### Project Structure

```
grimoire-skeleton/
├── .kiro/                    # Kiro configuration (tracked in git)
│   ├── specs/               # Feature specifications
│   ├── hooks/               # Automation hooks
│   ├── steering/            # Development guidelines
│   └── settings/            # Kiro settings
├── src/
│   ├── core/                # Shared foundation
│   │   ├── components/      # Reusable UI components
│   │   ├── layouts/         # App shells and wrappers
│   │   └── lib/             # Utilities and helpers
│   ├── modules/             # Domain-specific features
│   ├── theme/               # Theme system
│   └── config/              # Entity and app configs
├── apps/
│   ├── cursed-arena/        # Esports tournament app
│   └── haunted-clinic/      # Doctor appointment app
├── scripts/                 # Utility scripts
├── public/                  # Static assets
└── [config files]           # Root configuration files
```

## Components and Interfaces

### Configuration Files

**tsconfig.json:**
```typescript
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/core/*": ["./src/core/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/theme/*": ["./src/theme/*"],
      "@/config/*": ["./src/config/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CSS variables for theme system
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "generate:entity": "tsx scripts/generate-entity.ts",
    "seed:cursed-arena": "tsx scripts/seed-cursed-arena.ts",
    "seed:haunted-clinic": "tsx scripts/seed-haunted-clinic.ts",
    "setup:appwrite": "tsx scripts/setup-appwrite.ts"
  }
}
```

### Environment Variables

**.env.local.example:**
```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# Server-side only (not exposed to browser)
APPWRITE_API_KEY=your_api_key_here

# Optional: Development settings
NODE_ENV=development
```

### ESLint Configuration

**.eslintrc.json:**
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_" 
    }],
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/anchor-is-valid": "error"
  }
}
```

### Prettier Configuration

**.prettierrc:**
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Git Configuration

**.gitignore:**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# IDE
.vscode/
.idea/
*.sublime-*

# IMPORTANT: Do NOT ignore .kiro directory
# .kiro/ should be tracked in version control
```

## Data Models

### Appwrite Collections Structure

The setup script will create the following collections:

**Users Collection:**
- Managed by Appwrite Auth
- Extended with custom attributes via database collection

**Tournaments Collection (Cursed Arena):**
- name: string
- game: string
- startDate: datetime
- endDate: datetime
- status: enum (upcoming, live, completed)
- maxTeams: integer
- prizePool: string

**Teams Collection (Cursed Arena):**
- name: string
- tournamentId: string (relationship)
- members: string[] (array of user IDs)
- status: enum (registered, active, eliminated)

**Appointments Collection (Haunted Clinic):**
- patientId: string (relationship to users)
- doctorId: string (relationship to users)
- dateTime: datetime
- duration: integer (minutes)
- status: enum (scheduled, completed, cancelled)
- notes: string

**Doctors Collection (Haunted Clinic):**
- userId: string (relationship to users)
- specialty: string
- availability: json (schedule data)
- bio: string

## Error Handling

### Build-time Errors

**TypeScript Errors:**
- Strict mode catches type mismatches at compile time
- Path alias resolution errors fail the build
- Missing dependencies cause clear error messages

**ESLint Errors:**
- Linting errors block commits (via pre-commit hook)
- Warnings are displayed but don't block
- Auto-fixable issues are fixed on save

### Runtime Errors

**Environment Variable Validation:**
```typescript
// src/core/lib/env.ts
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please copy .env.local.example to .env.local and fill in the values.'
    );
  }
}
```

**Appwrite Connection Errors:**
- Graceful fallback when Appwrite is unreachable
- Clear error messages for authentication failures
- Retry logic for transient network errors

## Testing Strategy

### Testing Framework Choice

**Vitest** (recommended over Jest):
- Faster execution with native ESM support
- Better TypeScript integration
- Compatible with Vite ecosystem
- Simpler configuration

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/core/lib/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/core/lib/test-setup.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@/core': path.resolve(__dirname, './src/core'),
      '@/modules': path.resolve(__dirname, './src/modules'),
      '@/theme': path.resolve(__dirname, './src/theme'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },
});
```

### Test Structure

**Unit Tests:**
- Test utilities and helper functions
- Test individual components in isolation
- Mock external dependencies (Appwrite, etc.)

**Integration Tests:**
- Test component interactions
- Test API route handlers
- Test form submissions and validation

**Example Test:**
```typescript
// src/core/lib/__tests__/env.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateEnv } from '../env';

describe('validateEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should not throw when all required variables are present', () => {
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID = 'test-project';
    
    expect(() => validateEnv()).not.toThrow();
  });

  it('should throw when required variables are missing', () => {
    delete process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    
    expect(() => validateEnv()).toThrow(/Missing required environment variables/);
  });
});
```

## Appwrite Setup Script

### Script Design

**scripts/setup-appwrite.ts:**
```typescript
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = 'grimoire';

async function setupDatabase() {
  try {
    // Create database
    await databases.create(DATABASE_ID, 'Grimoire Database');
    console.log('✓ Database created');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('✓ Database already exists');
    } else {
      throw error;
    }
  }
}

async function createCollection(
  collectionId: string,
  collectionName: string,
  attributes: any[]
) {
  try {
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      collectionName
    );
    console.log(`✓ Collection '${collectionName}' created`);
    
    // Create attributes
    for (const attr of attributes) {
      await databases.createStringAttribute(
        DATABASE_ID,
        collectionId,
        attr.key,
        attr.size,
        attr.required
      );
    }
    console.log(`✓ Attributes added to '${collectionName}'`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`✓ Collection '${collectionName}' already exists`);
    } else {
      throw error;
    }
  }
}

async function main() {
  console.log('Setting up Appwrite...\n');
  
  await setupDatabase();
  
  // Create collections
  await createCollection('tournaments', 'Tournaments', [
    { key: 'name', size: 255, required: true },
    { key: 'game', size: 255, required: true },
    { key: 'status', size: 50, required: true },
  ]);
  
  // Add more collections...
  
  console.log('\n✓ Appwrite setup complete!');
}

main().catch(console.error);
```

## Documentation Structure

### README.md

**Sections:**
1. Project title and description
2. Features list (entity system, theme engine, dual apps)
3. Quick start (clone, install, configure, run)
4. Screenshots/GIFs of both apps
5. Tech stack
6. Kiroween hackathon mention
7. License
8. Links to detailed docs

### DEVELOPMENT.md

**Sections:**
1. Prerequisites (Node.js, npm, Appwrite account)
2. Local setup steps
3. Environment variables explanation
4. Running the dev server
5. Building for production
6. Adding new entities (step-by-step)
7. Adding new themes (step-by-step)
8. Running tests
9. Code style guidelines
10. Troubleshooting common issues

## Design Decisions

### Why Next.js App Router?

- Modern React patterns with Server Components
- Built-in API routes for backend logic
- Excellent TypeScript support
- Great developer experience
- Easy deployment to Vercel

### Why Vitest over Jest?

- Faster test execution
- Native ESM support (no transpilation needed)
- Better TypeScript integration
- Simpler configuration
- Active development and modern architecture

### Why Appwrite?

- Complete backend solution (auth, database, storage)
- Easy to set up and use
- Good TypeScript SDK
- Self-hostable option
- Free tier suitable for hackathon

### Why CSS Variables for Theming?

- Runtime theme switching without rebuilds
- Works seamlessly with Tailwind
- Better performance than CSS-in-JS
- Simple to understand and maintain
- Supports smooth transitions

### Why Track .kiro Directory?

- Showcases Kiro usage for judges
- Specs document development process
- Hooks demonstrate automation
- Steering files show best practices
- Essential for hackathon submission

## Implementation Phases

### Phase 1: Foundation (Tasks 1-5)
- Initialize Next.js project
- Create folder structure
- Configure TypeScript, Tailwind, environment variables

### Phase 2: Tooling (Tasks 6-10)
- Set up npm scripts
- Configure ESLint and Prettier
- Configure Git
- Set up testing framework

### Phase 3: Backend & Docs (Tasks 11-15)
- Create Appwrite setup script
- Write DEVELOPMENT.md
- Write README.md
- Add LICENSE
- Optional: Set up GitHub Actions

## Success Metrics

- All npm scripts execute without errors
- TypeScript compiles with zero errors
- ESLint reports zero errors
- All tests pass
- Dev server starts in under 3 seconds
- Documentation is clear and complete
- .kiro directory is tracked in git
- Project can be cloned and run by others in under 5 minutes

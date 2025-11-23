# Development Guide

Welcome to the Grimoire Skeleton development guide! This document will help you set up your local development environment and understand how to work with the project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.x or higher
  - Check your version: `node --version`
  - Download from: https://nodejs.org/

- **npm**: Version 10.x or higher (comes with Node.js)
  - Check your version: `npm --version`

- **Appwrite Account**: Required for backend services
  - Sign up at: https://cloud.appwrite.io/
  - Or self-host: https://appwrite.io/docs/advanced/self-hosting

- **Git**: For version control
  - Check your version: `git --version`
  - Download from: https://git-scm.com/

## Local Setup

Follow these steps to get the project running on your local machine:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd grimoire-skeleton
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, and development tools.

### 3. Set Up Appwrite Project

#### Create an Appwrite Project

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io/) or your self-hosted instance
2. Click "Create Project"
3. Name your project (e.g., "Grimoire Skeleton")
4. Note your **Project ID** from the project settings

#### Generate an API Key

1. In your Appwrite project, go to **Settings** → **API Keys**
2. Click "Create API Key"
3. Name it (e.g., "Grimoire Setup Key")
4. Set expiration (or leave as "Never")
5. Grant the following scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`
6. Copy the generated API key (you won't be able to see it again!)

### 4. Configure Environment Variables

#### Create .env.local File

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

#### Edit .env.local

Open `.env.local` and fill in your Appwrite credentials:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
# Or for self-hosted: https://your-domain.com/v1

NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

APPWRITE_API_KEY=your_api_key_here

# Optional
NODE_ENV=development
```

**Important Notes:**

- `NEXT_PUBLIC_*` variables are exposed to the browser
- `APPWRITE_API_KEY` is server-side only and should NEVER be exposed to the client
- Never commit `.env.local` to version control (it's in `.gitignore`)

### 5. Initialize Appwrite Backend

Run the setup script to create the database, collections, and attributes:

```bash
npm run setup:appwrite
```

This script will:

- Create the "Grimoire" database
- Set up collections for Cursed Arena (Tournaments, Teams)
- Set up collections for Haunted Clinic (Appointments, Doctors)
- Create all necessary attributes and indexes
- Handle existing resources gracefully (idempotent)

You should see output like:

```
🎃 Grimoire Skeleton - Appwrite Setup

✓ Database created
✓ Collection 'Tournaments' created
  ✓ Added string attribute: name
  ...
✅ Appwrite setup complete!
```

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Development Workflows

### Running the Development Server

Start the Next.js development server with hot reload:

```bash
npm run dev
```

The server will:

- Start on http://localhost:3000
- Auto-reload when you save files
- Show compilation errors in the browser
- Display TypeScript errors in the terminal

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

### Running Tests

Run all tests once:

```bash
npm run test
```

Run tests in watch mode (re-runs on file changes):

```bash
npm run test:watch
```

Generate code coverage report:

```bash
npm run test:coverage
```

Coverage reports will be in the `coverage/` directory.

### Code Quality

#### Type Checking

Run TypeScript compiler to check for type errors:

```bash
npm run type-check
```

This runs `tsc --noEmit` which checks types without generating output files.

#### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

ESLint will check for:

- TypeScript errors
- React best practices
- Accessibility issues
- Code style violations

#### Formatting

Format all code with Prettier:

```bash
npm run format
```

Check if code is formatted correctly (useful for CI):

```bash
npm run format:check
```

**Tip**: Configure your editor to format on save for the best experience.

## Feature Addition Guides

### How to Add a New Entity

Entities are the core of the Grimoire Skeleton. Follow these steps to add a new entity:

#### 1. Define the Entity Configuration

Create a new file in `src/config/entities/`:

```typescript
// src/config/entities/your-entity.ts
import { EntityConfig } from '@/core/types/entity';

export const yourEntityConfig: EntityConfig = {
  name: 'YourEntity',
  pluralName: 'YourEntities',
  collectionId: 'your_entities',

  fields: {
    name: {
      type: 'string',
      label: 'Name',
      required: true,
      maxLength: 255,
    },
    description: {
      type: 'text',
      label: 'Description',
      required: false,
      maxLength: 5000,
    },
    status: {
      type: 'enum',
      label: 'Status',
      options: ['active', 'inactive'],
      required: true,
      default: 'active',
    },
    createdAt: {
      type: 'datetime',
      label: 'Created At',
      required: true,
      auto: true,
    },
  },

  permissions: {
    create: ['admin', 'staff'],
    read: ['admin', 'staff', 'user'],
    update: ['admin', 'staff'],
    delete: ['admin'],
  },

  features: {
    list: true,
    create: true,
    edit: true,
    detail: true,
    delete: true,
  },

  ui: {
    icon: '🎃',
    color: 'primary',
    listColumns: ['name', 'status', 'createdAt'],
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};
```

#### 2. Register the Entity

Add your entity to the entity registry:

```typescript
// src/config/entities/index.ts
import { yourEntityConfig } from './your-entity';

export const entities = {
  // ... existing entities
  yourEntity: yourEntityConfig,
};
```

#### 3. Generate Entity Code

Run the entity generator (once implemented):

```bash
npm run generate:entity your-entity
```

This will create:

- TypeScript types (`src/core/types/your-entity.ts`)
- List page component (`src/modules/your-entity/YourEntityList.tsx`)
- Form component (`src/modules/your-entity/YourEntityForm.tsx`)
- Detail page component (`src/modules/your-entity/YourEntityDetail.tsx`)
- API routes (`src/app/api/your-entity/route.ts`)

#### 4. Update Appwrite Collections

Add your collection to the Appwrite setup script:

```typescript
// scripts/setup-appwrite.ts

async function setupYourEntityCollection(): Promise<void> {
  const collectionId = 'your_entities';
  const collectionName = 'Your Entities';

  console.log(`\nSetting up ${collectionName} collection...`);
  await createCollection(collectionId, collectionName);

  // Add attributes based on your entity config
  await createStringAttribute(collectionId, 'name', 255, true);
  await createStringAttribute(collectionId, 'description', 5000, false);
  await createEnumAttribute(collectionId, 'status', ['active', 'inactive'], true, 'active');

  // Create indexes
  await createIndex(collectionId, 'status_idx', 'key', ['status']);
}
```

Then run the setup script:

```bash
npm run setup:appwrite
```

#### 5. Add Navigation

Update the navigation configuration to include your new entity:

```typescript
// src/config/navigation.ts
export const navigationItems = [
  // ... existing items
  {
    label: 'Your Entities',
    href: '/your-entities',
    icon: '🎃',
    roles: ['admin', 'staff'],
  },
];
```

### How to Add a New Theme

The Grimoire Skeleton uses a CSS variable-based theming system. Here's how to add a new theme:

#### 1. Create Theme Definition

Create a new theme file:

```typescript
// src/theme/themes/your-theme.ts
import { Theme } from '@/theme/types';

export const yourTheme: Theme = {
  id: 'your_theme',
  name: 'Your Theme Name',
  description: 'A spooky description of your theme',

  colors: {
    primary: '#your-color',
    secondary: '#your-color',
    accent: '#your-color',
    background: '#your-color',
    foreground: '#your-color',
    muted: '#your-color',
    border: '#your-color',
    error: '#your-color',
    success: '#your-color',
    warning: '#your-color',
  },

  fonts: {
    heading: '"Your Heading Font", serif',
    body: '"Your Body Font", sans-serif',
    mono: '"Your Mono Font", monospace',
  },

  animations: {
    // Custom animation configurations
    glitchIntensity: 'medium',
    pulseSpeed: '2s',
    floatDistance: '10px',
  },

  effects: {
    // Special effects for this theme
    glow: true,
    particles: false,
    scanlines: true,
  },
};
```

#### 2. Register the Theme

Add your theme to the theme registry:

```typescript
// src/theme/index.ts
import { yourTheme } from './themes/your-theme';

export const themes = {
  nightmare_neon: nightmareNeonTheme,
  bone_minimal: boneMinimalTheme,
  blood_moon: bloodMoonTheme,
  your_theme: yourTheme, // Add your theme
};
```

#### 3. Create CSS Variables

Add CSS variables for your theme:

```css
/* src/app/globals.css */

[data-theme='your_theme'] {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  --color-accent: #your-color;
  --color-background: #your-color;
  --color-foreground: #your-color;
  --color-muted: #your-color;
  --color-border: #your-color;
  --color-error: #your-color;
  --color-success: #your-color;
  --color-warning: #your-color;

  /* Font families */
  --font-heading: 'Your Heading Font', serif;
  --font-body: 'Your Body Font', sans-serif;
  --font-mono: 'Your Mono Font', monospace;

  /* Animation speeds */
  --animation-glitch: 1s;
  --animation-pulse: 2s;
  --animation-float: 3s;
}
```

#### 4. Add Theme-Specific Styles (Optional)

Create theme-specific component styles:

```css
/* src/theme/themes/your-theme.css */

[data-theme='your_theme'] .card {
  /* Custom card styles for your theme */
  box-shadow: 0 0 20px var(--color-accent);
}

[data-theme='your_theme'] .button {
  /* Custom button styles */
  border: 2px solid var(--color-primary);
}
```

#### 5. Test Your Theme

1. Start the dev server: `npm run dev`
2. Open the theme switcher in the UI
3. Select your new theme
4. Verify all components look correct
5. Check contrast ratios for accessibility

#### 6. Add Theme Preview

Create a preview image for the theme selector:

```typescript
// src/theme/themes/your-theme.ts
export const yourTheme: Theme = {
  // ... existing config
  preview: {
    image: '/themes/your-theme-preview.png',
    description: 'Preview of Your Theme',
  },
};
```

## Troubleshooting

### Common Issues and Solutions

#### Environment Variable Problems

**Problem**: "Missing required environment variables" error

**Solution**:

1. Ensure `.env.local` exists (copy from `.env.local.example`)
2. Check that all required variables are set:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `APPWRITE_API_KEY`
3. Restart the dev server after changing environment variables
4. Verify no extra spaces or quotes around values

**Problem**: Environment variables not updating

**Solution**:

- Stop the dev server (`Ctrl+C`)
- Delete `.next` directory: `rm -rf .next` (or `rmdir /s /q .next` on Windows)
- Restart: `npm run dev`

#### Appwrite Connection Issues

**Problem**: "Failed to connect to Appwrite" error

**Solution**:

1. Verify your Appwrite endpoint is correct
   - Cloud: `https://cloud.appwrite.io/v1`
   - Self-hosted: `https://your-domain.com/v1`
2. Check your Project ID matches the one in Appwrite Console
3. Ensure your API key has the correct scopes
4. Test connection manually:
   ```bash
   curl https://cloud.appwrite.io/v1/health
   ```

**Problem**: "Unauthorized" or "Invalid API key" error

**Solution**:

1. Regenerate your API key in Appwrite Console
2. Ensure the key has all required scopes:
   - databases.read, databases.write
   - collections.read, collections.write
   - attributes.read, attributes.write
3. Update `APPWRITE_API_KEY` in `.env.local`
4. Run `npm run setup:appwrite` again

**Problem**: "Collection already exists" errors

**Solution**:

- This is normal! The setup script is idempotent
- It will skip existing resources and only create missing ones
- If you need to reset, delete collections in Appwrite Console first

#### Build Errors

**Problem**: TypeScript compilation errors

**Solution**:

1. Run type check: `npm run type-check`
2. Fix reported errors
3. Common issues:
   - Missing imports
   - Incorrect types
   - Unused variables (prefix with `_` if intentional)

**Problem**: "Module not found" errors

**Solution**:

1. Check if the file exists at the specified path
2. Verify path aliases in `tsconfig.json`:
   - `@/core/*` → `./src/core/*`
   - `@/modules/*` → `./src/modules/*`
   - `@/theme/*` → `./src/theme/*`
   - `@/config/*` → `./src/config/*`
3. Restart TypeScript server in your editor
4. Delete `.next` and restart dev server

**Problem**: Tailwind classes not working

**Solution**:

1. Verify the file is in Tailwind's content paths (`tailwind.config.ts`)
2. Check for typos in class names
3. Ensure Tailwind directives are in `globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Restart dev server

#### Test Failures

**Problem**: Tests failing with "Cannot find module" errors

**Solution**:

1. Check path aliases in `vitest.config.ts` match `tsconfig.json`
2. Ensure test setup file exists: `src/core/lib/test-setup.ts`
3. Install missing dependencies:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
   ```

**Problem**: "ReferenceError: document is not defined"

**Solution**:

- Ensure `vitest.config.ts` has `environment: 'jsdom'`
- Import test setup in your test file:
  ```typescript
  import '@testing-library/jest-dom';
  ```

#### Performance Issues

**Problem**: Slow development server startup

**Solution**:

1. Clear Next.js cache: `rm -rf .next`
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Disable unused features in `next.config.ts`
4. Check for large files in `public/` directory

**Problem**: Slow hot reload

**Solution**:

1. Reduce number of files being watched
2. Use more specific imports (avoid barrel exports)
3. Check for circular dependencies
4. Consider using `next.config.ts` experimental features:
   ```typescript
   experimental: {
     optimizePackageImports: ['@/core', '@/modules'],
   }
   ```

#### Git Issues

**Problem**: `.kiro` directory not being tracked

**Solution**:

1. Ensure `.kiro` is NOT in `.gitignore`
2. Force add if needed: `git add -f .kiro`
3. Commit: `git commit -m "Add .kiro directory"`

**Problem**: Accidentally committed `.env.local`

**Solution**:

1. Remove from git: `git rm --cached .env.local`
2. Ensure it's in `.gitignore`
3. Commit: `git commit -m "Remove .env.local from tracking"`
4. Rotate your API keys immediately!

### Getting Help

If you're still stuck:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Check the [Appwrite documentation](https://appwrite.io/docs)
3. Search existing issues in the repository
4. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Error messages
   - Your environment (OS, Node version, etc.)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Vitest Documentation](https://vitest.dev/)

## Development Tips

### Editor Setup

**VS Code** (recommended):

- Install extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
- Enable format on save in settings

**WebStorm**:

- Enable ESLint in Preferences → Languages & Frameworks → JavaScript → Code Quality Tools
- Enable Prettier in Preferences → Languages & Frameworks → JavaScript → Prettier
- Configure Tailwind CSS support

### Keyboard Shortcuts

- `Ctrl+C` - Stop dev server
- `Ctrl+Shift+P` (VS Code) - Command palette
- `F12` - Go to definition
- `Shift+F12` - Find all references

### Best Practices

1. **Always run type-check before committing**:

   ```bash
   npm run type-check && npm run lint
   ```

2. **Write tests for new features**:
   - Focus on core functionality
   - Test edge cases
   - Aim for >80% coverage

3. **Use meaningful commit messages**:

   ```
   feat: Add tournament registration form
   fix: Resolve date picker timezone issue
   docs: Update entity creation guide
   ```

4. **Keep components small and focused**:
   - Single responsibility principle
   - Extract reusable logic into hooks
   - Compose complex UIs from simple components

5. **Follow the spooky naming convention**:
   - Use terms like "summon", "cast", "raise", "curse", "haunt"
   - Makes the code more fun and thematic!

## Seeding Data

### Cursed Arena

Seed sample tournament and team data:

```bash
npm run seed:cursed-arena
```

This will create:

- 3 sample tournaments (upcoming, live, completed)
- 8 sample teams across tournaments
- Realistic game data (League of Legends, Dota 2, CS:GO, Valorant)

### Haunted Clinic

Seed sample doctor and appointment data:

```bash
npm run seed:haunted-clinic
```

This will create:

- 5 sample doctors with different specialties
- 10 sample appointments across different dates
- Various appointment statuses

## Entity Generation

To generate a new entity from a configuration file:

```bash
npm run generate:entity <entity-name>
```

This will:

1. Read the entity configuration from `src/config/entities/<entity-name>.ts`
2. Generate TypeScript types
3. Create list, form, and detail components
4. Generate API routes
5. Update navigation configuration

See the [Entity System Guide](./.kiro/steering/entity-system-guide.md) for more details.

Happy coding! 🎃👻💀

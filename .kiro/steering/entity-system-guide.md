---
inclusion: fileMatch
fileMatchPattern: "**/*{entity,config,generator}*"
---

# Entity System Guide

## Core Concept
The entity system is Grimoire's secret sauce. Define an entity once, get a full CRUD interface automatically.

## Entity Definition Schema
```typescript
interface EntityDefinition {
  fields: Record<string, FieldDefinition>;
  permissions: Role[];
  features: Feature[];
  display: DisplayConfig;
  validation?: ValidationRules;
}

interface FieldDefinition {
  type: 'string' | 'number' | 'date' | 'enum' | 'boolean' | 'reference';
  required?: boolean;
  options?: string[]; // for enum
  reference?: string; // for reference type (e.g., 'doctor')
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string; // name of custom validator function
  };
}

type Feature = 'list' | 'create' | 'edit' | 'detail' | 'delete' | 'export';
type Role = 'admin' | 'staff' | 'user';

interface DisplayConfig {
  icon?: string; // emoji or icon name
  singular: string; // "Tournament"
  plural: string; // "Tournaments"
  listColumns: string[]; // which fields to show in list view
  sortBy?: string; // default sort field
  sortOrder?: 'asc' | 'desc';
}
```

## Example Entity Definitions

### Cursed Arena - Tournament
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
      options: ['League of Legends', 'Dota 2', 'CS:GO', 'Valorant']
    },
    startDate: { 
      type: 'date', 
      required: true 
    },
    endDate: { 
      type: 'date' 
    },
    prizePool: { 
      type: 'number',
      validation: { min: 0 }
    },
    status: { 
      type: 'enum',
      options: ['upcoming', 'live', 'completed', 'cancelled'],
      defaultValue: 'upcoming'
    },
    maxTeams: { 
      type: 'number',
      validation: { min: 2, max: 64 }
    }
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

### Haunted Clinic - Appointment
```typescript
export const appointment: EntityDefinition = {
  fields: {
    patientName: { 
      type: 'string', 
      required: true 
    },
    doctor: { 
      type: 'reference', 
      reference: 'doctor',
      required: true 
    },
    date: { 
      type: 'date', 
      required: true 
    },
    time: { 
      type: 'string', 
      required: true,
      validation: { pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' }
    },
    status: { 
      type: 'enum',
      options: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
      defaultValue: 'scheduled'
    },
    notes: { 
      type: 'string' 
    }
  },
  permissions: ['admin', 'staff'],
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '📅',
    singular: 'Appointment',
    plural: 'Appointments',
    listColumns: ['patientName', 'doctor', 'date', 'time', 'status'],
    sortBy: 'date',
    sortOrder: 'asc'
  }
};
```

## Code Generation Rules

### 1. Type Generation
From entity definition, generate TypeScript types:
```typescript
// Generated from tournament entity
export interface Tournament {
  id: string;
  name: string;
  game: 'League of Legends' | 'Dota 2' | 'CS:GO' | 'Valorant';
  startDate: Date;
  endDate?: Date;
  prizePool?: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  maxTeams?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. List Page Generation
Generate a list page component:
- Table with columns from `display.listColumns`
- Filters for enum fields
- Search for string fields
- Sort by `display.sortBy`
- Pagination (20 items per page)
- "Summon New {Entity}" button if 'create' feature enabled
- Row actions: View, Edit, Delete (based on features)

### 3. Form Generation
Generate create/edit form:
- Fields in order of definition
- Input type based on field type:
  - string → text input
  - number → number input
  - date → date picker
  - enum → select dropdown
  - boolean → checkbox
  - reference → searchable select
- Validation from field definition
- Required field indicators
- Error messages
- Submit button: "Cast {Entity}" for create, "Enchant {Entity}" for edit

### 4. Detail Page Generation
Generate detail view:
- Card layout with all fields
- Labels from field names (camelCase → Title Case)
- Format values appropriately (dates, numbers, etc.)
- Action buttons: Edit, Delete (based on permissions)
- Related entities section (if references exist)

### 5. API Route Generation
Generate Next.js API routes:
```typescript
// /api/tournaments/route.ts
export async function GET(request: Request) {
  // List with filters, pagination, sorting
}

export async function POST(request: Request) {
  // Create with validation
}

// /api/tournaments/[id]/route.ts
export async function GET(request: Request, { params }) {
  // Get single
}

export async function PATCH(request: Request, { params }) {
  // Update with validation
}

export async function DELETE(request: Request, { params }) {
  // Delete
}
```

## Extension Patterns

### Custom Validators
```typescript
// config/validators.ts
export const validators = {
  futureDate: (value: Date) => {
    return value > new Date() || 'Date must be in the future';
  },
  uniqueTournamentName: async (value: string) => {
    const exists = await checkTournamentExists(value);
    return !exists || 'Tournament name already exists';
  }
};
```

### Custom Field Renderers
```typescript
// For special field types that need custom UI
export const fieldRenderers = {
  prizePool: (value: number) => (
    <span className="text-accent-primary font-bold">
      ${value.toLocaleString()}
    </span>
  ),
  status: (value: string) => (
    <StatusBadge status={value} />
  )
};
```

### Computed Fields
```typescript
// Fields that are calculated, not stored
export const computedFields = {
  tournament: {
    daysUntilStart: (entity: Tournament) => {
      const days = Math.ceil(
        (entity.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return days;
    }
  }
};
```

## File Structure for Generated Code
```
/src/modules/{entityName}/
  types.ts              # TypeScript interfaces
  config.ts             # Entity definition
  list.tsx              # List page component
  form.tsx              # Create/edit form
  detail.tsx            # Detail view
  api.ts                # API client functions
  validators.ts         # Custom validators
  
/src/app/api/{entityName}/
  route.ts              # List & Create endpoints
  [id]/route.ts         # Get, Update, Delete endpoints
```

## Generator Implementation Notes
- Use template strings for code generation
- Preserve formatting with Prettier
- Add comments explaining generated code
- Include TODO comments for manual customization points
- Generate tests alongside code
- Update navigation config automatically
- Register routes in app router

## Testing Generated Code
Every generated entity should have:
- Unit tests for validators
- Integration tests for API routes
- Component tests for forms
- E2E test for full CRUD flow

## Performance Considerations
- Lazy load entity modules
- Cache entity definitions
- Debounce search/filter inputs
- Virtual scroll for large lists
- Optimize Appwrite queries (indexes, limits)

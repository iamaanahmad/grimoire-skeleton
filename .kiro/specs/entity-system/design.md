# Design Document - Entity System Core

## Overview

The Entity System Core is the foundational architecture of the Grimoire Skeleton framework. It implements a code generation pipeline that transforms declarative entity definitions into complete, production-ready CRUD interfaces. The system consists of type definitions, generators, reusable UI components, and a CLI tool that orchestrates the generation process. This design prioritizes type safety, extensibility, and developer experience while maintaining high code quality standards.

## Architecture

### High-Level Flow

```
Developer writes entity definition
         ↓
Entity Registry loads definition
         ↓
CLI Generator Command invoked
         ↓
┌────────────────────────────────┐
│     Generator Pipeline         │
├────────────────────────────────┤
│  1. Type Generator             │
│  2. Component Generators       │
│     - List Page                │
│     - Form Page                │
│     - Detail Page              │
│  3. API Route Generator        │
│  4. Navigation Updater         │
└────────────────────────────────┘
         ↓
Generated files written to disk
         ↓
Application ready to use
```

### System Components

**Core Types Layer:**
- Entity definition interfaces
- Field type definitions
- Validation rule types
- Display configuration types

**Generator Layer:**
- TypeGenerator: Produces TypeScript interfaces and DTOs
- ListGenerator: Creates list page components
- FormGenerator: Creates form page components
- DetailGenerator: Creates detail page components
- APIGenerator: Creates Next.js API routes
- NavigationUpdater: Updates navigation configuration

**Component Layer:**
- EntityTable: Generic table component for list views
- EntityForm: Generic form component for create/edit
- ReferenceSelect: Searchable select for entity references
- Field components: Inputs for each field type

**Utility Layer:**
- Entity Registry: Centralized entity definition store
- Validators: Built-in and custom validation functions
- Export utilities: CSV and JSON export functions
- Formatters: Value formatting for display

## Components and Interfaces

### Core Type Definitions

**src/core/types/entity.ts:**

```typescript
/**
 * Complete definition of an entity including fields, permissions, and features
 */
export interface EntityDefinition {
  /** Field definitions keyed by field name */
  fields: Record<string, FieldDefinition>;
  /** Roles that can access this entity */
  permissions: Role[];
  /** Enabled CRUD features */
  features: Feature[];
  /** Display configuration for UI generation */
  display: DisplayConfig;
  /** Optional validation rules */
  validation?: ValidationRules;
}

/**
 * Definition of a single field in an entity
 */
export interface FieldDefinition {
  /** Data type of the field */
  type: 'string' | 'number' | 'date' | 'enum' | 'boolean' | 'reference';
  /** Whether the field is required */
  required?: boolean;
  /** Options for enum fields */
  options?: string[];
  /** Referenced entity name for reference fields */
  reference?: string;
  /** Default value for the field */
  defaultValue?: any;
  /** Field-specific validation rules */
  validation?: FieldValidation;
  /** Display label (defaults to field name) */
  label?: string;
}

/**
 * Field-level validation rules
 */
export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  custom?: (value: any) => string | null;
}

/**
 * Entity-level validation rules
 */
export interface ValidationRules {
  /** Custom validation function for the entire entity */
  custom?: (entity: any) => Record<string, string> | null;
}

/**
 * Display configuration for UI generation
 */
export interface DisplayConfig {
  /** Icon name (from icon library) */
  icon?: string;
  /** Singular form of entity name */
  singular: string;
  /** Plural form of entity name */
  plural: string;
  /** Fields to show in list view */
  listColumns: string[];
  /** Default sort field */
  sortBy?: string;
  /** Default sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Available CRUD features
 */
export type Feature = 'list' | 'create' | 'edit' | 'detail' | 'delete' | 'export';

/**
 * User roles for permissions
 */
export type Role = 'admin' | 'staff' | 'user';
```

### Type Generator

**src/core/generators/type-generator.ts:**

```typescript
import { EntityDefinition } from '@/core/types/entity';
import prettier from 'prettier';

/**
 * Generates TypeScript type definitions from an entity definition
 */
export function generateTypes(
  entityName: string,
  entityDef: EntityDefinition
): string {
  const interfaceName = capitalize(entityName);
  
  const mainInterface = generateMainInterface(interfaceName, entityDef);
  const createDTO = generateCreateDTO(interfaceName, entityDef);
  const updateDTO = generateUpdateDTO(interfaceName, entityDef);
  const filterDTO = generateFilterDTO(interfaceName, entityDef);
  
  const code = `
    // Auto-generated types for ${interfaceName}
    // Do not edit manually
    
    ${mainInterface}
    
    ${createDTO}
    
    ${updateDTO}
    
    ${filterDTO}
  `;
  
  return prettier.format(code, { parser: 'typescript' });
}

function generateMainInterface(
  name: string,
  def: EntityDefinition
): string {
  const fields = Object.entries(def.fields)
    .map(([fieldName, fieldDef]) => {
      const optional = fieldDef.required ? '' : '?';
      const type = mapFieldTypeToTS(fieldDef);
      return `  ${fieldName}${optional}: ${type};`;
    })
    .join('\n');
  
  return `
    export interface ${name} {
      id: string;
      createdAt: Date;
      updatedAt: Date;
    ${fields}
    }
  `;
}

function generateCreateDTO(
  name: string,
  def: EntityDefinition
): string {
  return `
    export type Create${name}DTO = Omit<${name}, 'id' | 'createdAt' | 'updatedAt'>;
  `;
}

function generateUpdateDTO(
  name: string,
  def: EntityDefinition
): string {
  return `
    export type Update${name}DTO = Partial<Create${name}DTO> & { id: string };
  `;
}

function generateFilterDTO(
  name: string,
  def: EntityDefinition
): string {
  const filterFields = Object.entries(def.fields)
    .filter(([_, fieldDef]) => fieldDef.type === 'string' || fieldDef.type === 'enum')
    .map(([fieldName, fieldDef]) => {
      const type = mapFieldTypeToTS(fieldDef);
      return `  ${fieldName}?: ${type};`;
    })
    .join('\n');
  
  return `
    export interface ${name}Filter {
      search?: string;
    ${filterFields}
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    }
  `;
}

function mapFieldTypeToTS(fieldDef: FieldDefinition): string {
  switch (fieldDef.type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'date':
      return 'Date';
    case 'boolean':
      return 'boolean';
    case 'enum':
      return fieldDef.options!.map(o => `'${o}'`).join(' | ');
    case 'reference':
      return 'string'; // ID of referenced entity
    default:
      return 'any';
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

### Generic Table Component

**src/core/components/EntityTable.tsx:**

```typescript
import { useState } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface EntityTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function EntityTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  loading = false,
  emptyMessage = 'No items found',
}: EntityTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Sorting logic
  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const order = sortOrder === 'asc' ? 1 : -1;
        return aVal > bVal ? order : -order;
      })
    : data;
  
  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  if (loading) {
    return <BoneSkeletonLoader />;
  }
  
  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }
  
  return (
    <div className="entity-table">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => col.sortable && handleSort(col.key)}
                className={col.sortable ? 'cursor-pointer' : ''}
              >
                {col.label}
                {sortKey === col.key && (
                  <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}
              <td>
                <ActionButtons
                  onView={onView ? () => onView(row) : undefined}
                  onEdit={onEdit ? () => onEdit(row) : undefined}
                  onDelete={onDelete ? () => onDelete(row) : undefined}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

### Generic Form Component

**src/core/components/EntityForm.tsx:**

```typescript
import { useState } from 'react';
import { EntityDefinition } from '@/core/types/entity';
import { validateField } from '@/core/lib/validators';

interface EntityFormProps<T> {
  entityDef: EntityDefinition;
  initialValues?: Partial<T>;
  onSubmit: (values: T) => Promise<void>;
  mode: 'create' | 'edit';
}

export function EntityForm<T extends Record<string, any>>({
  entityDef,
  initialValues = {},
  onSubmit,
  mode,
}: EntityFormProps<T>) {
  const [values, setValues] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (fieldName: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    
    // Clear error on change
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };
  
  const handleBlur = (fieldName: string) => {
    const fieldDef = entityDef.fields[fieldName];
    const error = validateField(values[fieldName], fieldDef);
    
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.entries(entityDef.fields).forEach(([fieldName, fieldDef]) => {
      const error = validateField(values[fieldName], fieldDef);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(values as T);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="entity-form">
      {Object.entries(entityDef.fields).map(([fieldName, fieldDef]) => (
        <div key={fieldName} className="form-field">
          <label htmlFor={fieldName}>
            {fieldDef.label || fieldName}
            {fieldDef.required && <span className="required">*</span>}
          </label>
          
          <FieldInput
            fieldName={fieldName}
            fieldDef={fieldDef}
            value={values[fieldName]}
            onChange={(value) => handleChange(fieldName, value)}
            onBlur={() => handleBlur(fieldName)}
            error={errors[fieldName]}
          />
          
          {errors[fieldName] && (
            <span className="error-message" role="alert">
              {errors[fieldName]}
            </span>
          )}
        </div>
      ))}
      
      <button
        type="submit"
        disabled={loading}
        className="submit-button"
      >
        {loading ? 'Casting...' : mode === 'create' ? 'Summon' : 'Enchant'}
      </button>
    </form>
  );
}
```

### Component Generators

**List Page Generator (src/core/generators/list-generator.ts):**

```typescript
export function generateListPage(
  entityName: string,
  entityDef: EntityDefinition
): string {
  const componentName = `${capitalize(entityName)}List`;
  const typeName = capitalize(entityName);
  
  const code = `
    'use client';
    
    import { useState, useEffect } from 'react';
    import { EntityTable } from '@/core/components/EntityTable';
    import { ${typeName}, ${typeName}Filter } from '@/modules/${entityName}/types';
    import { useRouter } from 'next/navigation';
    
    export default function ${componentName}() {
      const router = useRouter();
      const [data, setData] = useState<${typeName}[]>([]);
      const [loading, setLoading] = useState(true);
      const [filters, setFilters] = useState<${typeName}Filter>({});
      
      useEffect(() => {
        fetchData();
      }, [filters]);
      
      async function fetchData() {
        setLoading(true);
        try {
          const response = await fetch('/api/${entityName}?' + new URLSearchParams(filters as any));
          const result = await response.json();
          setData(result.data);
        } catch (error) {
          console.error('Failed to fetch ${entityName}:', error);
        } finally {
          setLoading(false);
        }
      }
      
      const columns = [
        ${entityDef.display.listColumns.map(col => `
          { key: '${col}', label: '${col}', sortable: true }
        `).join(',')}
      ];
      
      return (
        <div className="page-container">
          <div className="page-header">
            <h1>${entityDef.display.plural}</h1>
            ${entityDef.features.includes('create') ? `
              <button onClick={() => router.push('/${entityName}/new')}>
                Summon New ${entityDef.display.singular}
              </button>
            ` : ''}
          </div>
          
          <EntityTable
            data={data}
            columns={columns}
            loading={loading}
            onView={(item) => router.push(\`/${entityName}/\${item.id}\`)}
            ${entityDef.features.includes('edit') ? `
              onEdit={(item) => router.push(\`/${entityName}/\${item.id}/edit\`)}
            ` : ''}
            ${entityDef.features.includes('delete') ? `
              onDelete={(item) => handleDelete(item.id)}
            ` : ''}
          />
        </div>
      );
    }
  `;
  
  return prettier.format(code, { parser: 'typescript' });
}
```

**Form Page Generator (src/core/generators/form-generator.ts):**

```typescript
export function generateFormPage(
  entityName: string,
  entityDef: EntityDefinition
): string {
  const componentName = `${capitalize(entityName)}Form`;
  const typeName = capitalize(entityName);
  
  const code = `
    'use client';
    
    import { useRouter, useParams } from 'next/navigation';
    import { useState, useEffect } from 'react';
    import { EntityForm } from '@/core/components/EntityForm';
    import { ${typeName} } from '@/modules/${entityName}/types';
    import { ${entityName}Definition } from '@/config/entities/${entityName}';
    
    export default function ${componentName}() {
      const router = useRouter();
      const params = useParams();
      const isEdit = !!params.id;
      
      const [initialValues, setInitialValues] = useState<Partial<${typeName}>>({});
      const [loading, setLoading] = useState(isEdit);
      
      useEffect(() => {
        if (isEdit) {
          fetchEntity();
        }
      }, [params.id]);
      
      async function fetchEntity() {
        try {
          const response = await fetch(\`/api/${entityName}/\${params.id}\`);
          const data = await response.json();
          setInitialValues(data);
        } catch (error) {
          console.error('Failed to fetch ${entityName}:', error);
        } finally {
          setLoading(false);
        }
      }
      
      async function handleSubmit(values: ${typeName}) {
        const url = isEdit
          ? \`/api/${entityName}/\${params.id}\`
          : '/api/${entityName}';
        const method = isEdit ? 'PATCH' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        
        if (response.ok) {
          router.push('/${entityName}');
        } else {
          throw new Error('Failed to save ${entityName}');
        }
      }
      
      if (loading) {
        return <div>Loading...</div>;
      }
      
      return (
        <div className="page-container">
          <h1>{isEdit ? 'Edit' : 'Create'} ${entityDef.display.singular}</h1>
          
          <EntityForm
            entityDef={${entityName}Definition}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            mode={isEdit ? 'edit' : 'create'}
          />
        </div>
      );
    }
  `;
  
  return prettier.format(code, { parser: 'typescript' });
}
```

### API Route Generator

**src/core/generators/api-generator.ts:**

```typescript
export function generateAPIRoutes(
  entityName: string,
  entityDef: EntityDefinition
): { list: string; detail: string } {
  const listRoute = generateListRoute(entityName, entityDef);
  const detailRoute = generateDetailRoute(entityName, entityDef);
  
  return { list: listRoute, detail: detailRoute };
}

function generateListRoute(
  entityName: string,
  entityDef: EntityDefinition
): string {
  const code = `
    import { NextRequest, NextResponse } from 'next/server';
    import { databases } from '@/core/lib/appwrite';
    import { Query } from 'node-appwrite';
    
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
    const COLLECTION_ID = '${entityName}';
    
    export async function GET(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const sortBy = searchParams.get('sortBy');
        const sortOrder = searchParams.get('sortOrder') || 'asc';
        
        const queries = [];
        
        // Add filters
        ${Object.entries(entityDef.fields)
          .filter(([_, def]) => def.type === 'enum' || def.type === 'string')
          .map(([fieldName]) => `
            if (searchParams.get('${fieldName}')) {
              queries.push(Query.equal('${fieldName}', searchParams.get('${fieldName}')));
            }
          `).join('\n')}
        
        // Add sorting
        if (sortBy) {
          queries.push(
            sortOrder === 'desc'
              ? Query.orderDesc(sortBy)
              : Query.orderAsc(sortBy)
          );
        }
        
        // Add pagination
        queries.push(Query.limit(limit));
        queries.push(Query.offset((page - 1) * limit));
        
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          queries
        );
        
        return NextResponse.json({
          data: response.documents,
          total: response.total,
          page,
          limit,
        });
      } catch (error) {
        console.error('Error fetching ${entityName}:', error);
        return NextResponse.json(
          { error: 'Failed to fetch ${entityName}' },
          { status: 500 }
        );
      }
    }
    
    export async function POST(request: NextRequest) {
      try {
        const body = await request.json();
        
        // Validate required fields
        ${Object.entries(entityDef.fields)
          .filter(([_, def]) => def.required)
          .map(([fieldName]) => `
            if (!body.${fieldName}) {
              return NextResponse.json(
                { error: '${fieldName} is required' },
                { status: 400 }
              );
            }
          `).join('\n')}
        
        const document = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          'unique()',
          body
        );
        
        return NextResponse.json(document, { status: 201 });
      } catch (error) {
        console.error('Error creating ${entityName}:', error);
        return NextResponse.json(
          { error: 'Failed to create ${entityName}' },
          { status: 500 }
        );
      }
    }
  `;
  
  return prettier.format(code, { parser: 'typescript' });
}
```

## Data Models

### Entity Registry

**src/core/lib/entity-registry.ts:**

```typescript
import { EntityDefinition } from '@/core/types/entity';
import fs from 'fs';
import path from 'path';

class EntityRegistry {
  private entities: Map<string, EntityDefinition> = new Map();
  
  /**
   * Register an entity definition
   */
  register(name: string, definition: EntityDefinition): void {
    this.entities.set(name, definition);
  }
  
  /**
   * Get an entity definition by name
   */
  get(name: string): EntityDefinition | undefined {
    return this.entities.get(name);
  }
  
  /**
   * List all registered entity names
   */
  list(): string[] {
    return Array.from(this.entities.keys());
  }
  
  /**
   * Auto-discover and load entity definitions from config directory
   */
  async discover(): Promise<void> {
    const configDir = path.join(process.cwd(), 'src', 'config', 'entities');
    
    if (!fs.existsSync(configDir)) {
      return;
    }
    
    const files = fs.readdirSync(configDir);
    
    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const entityName = file.replace(/\.(ts|js)$/, '');
        const modulePath = path.join(configDir, file);
        
        try {
          const module = await import(modulePath);
          const definition = module.default || module[`${entityName}Definition`];
          
          if (definition) {
            this.register(entityName, definition);
          }
        } catch (error) {
          console.error(`Failed to load entity ${entityName}:`, error);
        }
      }
    }
  }
}

export const entityRegistry = new EntityRegistry();
```

### Validation System

**src/core/lib/validators.ts:**

```typescript
import { FieldDefinition, FieldValidation } from '@/core/types/entity';

/**
 * Validate a field value against its definition
 * @returns Error message if invalid, null if valid
 */
export function validateField(
  value: any,
  fieldDef: FieldDefinition
): string | null {
  // Required check
  if (fieldDef.required && (value === undefined || value === null || value === '')) {
    return `${fieldDef.label || 'This field'} is required`;
  }
  
  // Skip other validations if value is empty and not required
  if (!value && !fieldDef.required) {
    return null;
  }
  
  const validation = fieldDef.validation;
  if (!validation) {
    return null;
  }
  
  // String validations
  if (fieldDef.type === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      return `Must be at least ${validation.minLength} characters`;
    }
    
    if (validation.maxLength && value.length > validation.maxLength) {
      return `Must be at most ${validation.maxLength} characters`;
    }
    
    if (validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return 'Invalid format';
      }
    }
    
    if (validation.email && !isValidEmail(value)) {
      return 'Invalid email address';
    }
    
    if (validation.url && !isValidURL(value)) {
      return 'Invalid URL';
    }
  }
  
  // Number validations
  if (fieldDef.type === 'number') {
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return 'Must be a valid number';
    }
    
    if (validation.min !== undefined && numValue < validation.min) {
      return `Must be at least ${validation.min}`;
    }
    
    if (validation.max !== undefined && numValue > validation.max) {
      return `Must be at most ${validation.max}`;
    }
  }
  
  // Custom validation
  if (validation.custom) {
    return validation.custom(value);
  }
  
  return null;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

## Error Handling

### Generator Errors

**Validation at Generation Time:**
- Entity definition must have at least one field
- Entity definition must have at least one enabled feature
- Enum fields must have at least one option
- Reference fields must specify a valid entity name
- Display config must specify singular and plural names

**Error Messages:**
```typescript
if (Object.keys(entityDef.fields).length === 0) {
  throw new Error(`Entity ${entityName} must have at least one field`);
}

if (entityDef.features.length === 0) {
  throw new Error(`Entity ${entityName} must have at least one enabled feature`);
}

const enumFields = Object.entries(entityDef.fields)
  .filter(([_, def]) => def.type === 'enum');

for (const [fieldName, fieldDef] of enumFields) {
  if (!fieldDef.options || fieldDef.options.length === 0) {
    throw new Error(
      `Enum field ${fieldName} in entity ${entityName} must have at least one option`
    );
  }
}
```

### Runtime Errors

**API Error Handling:**
- 400 Bad Request: Validation errors
- 401 Unauthorized: Missing authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Entity not found
- 500 Internal Server Error: Unexpected errors

**Client Error Handling:**
- Network errors: Show retry button
- Validation errors: Display inline with fields
- Server errors: Show error toast with message
- Loading states: Show skeleton loaders

## Testing Strategy

### Unit Tests

**Type Generator Tests:**
```typescript
describe('generateTypes', () => {
  it('should generate main interface with all fields', () => {
    const entityDef: EntityDefinition = {
      fields: {
        name: { type: 'string', required: true },
        age: { type: 'number' },
      },
      permissions: ['admin'],
      features: ['list'],
      display: { singular: 'User', plural: 'Users', listColumns: ['name'] },
    };
    
    const result = generateTypes('user', entityDef);
    
    expect(result).toContain('export interface User');
    expect(result).toContain('name: string;');
    expect(result).toContain('age?: number;');
  });
  
  it('should generate CreateDTO without system fields', () => {
    const result = generateTypes('user', mockEntityDef);
    
    expect(result).toContain('export type CreateUserDTO');
    expect(result).toContain("Omit<User, 'id' | 'createdAt' | 'updatedAt'>");
  });
});
```

**Validator Tests:**
```typescript
describe('validateField', () => {
  it('should return error for missing required field', () => {
    const fieldDef: FieldDefinition = {
      type: 'string',
      required: true,
      label: 'Name',
    };
    
    const error = validateField('', fieldDef);
    expect(error).toBe('Name is required');
  });
  
  it('should validate email format', () => {
    const fieldDef: FieldDefinition = {
      type: 'string',
      validation: { email: true },
    };
    
    expect(validateField('invalid', fieldDef)).toBeTruthy();
    expect(validateField('valid@email.com', fieldDef)).toBeNull();
  });
});
```

### Integration Tests

**Full Generation Flow:**
```typescript
describe('Entity Generation', () => {
  it('should generate all files for an entity', async () => {
    const entityName = 'tournament';
    const entityDef = tournamentDefinition;
    
    await generateEntity(entityName, entityDef);
    
    // Check that files were created
    expect(fs.existsSync(`src/modules/${entityName}/types.ts`)).toBe(true);
    expect(fs.existsSync(`src/modules/${entityName}/list.tsx`)).toBe(true);
    expect(fs.existsSync(`src/modules/${entityName}/form.tsx`)).toBe(true);
    expect(fs.existsSync(`src/app/api/${entityName}/route.ts`)).toBe(true);
  });
});
```

## Design Decisions

### Why Code Generation Over Runtime Reflection?

**Pros:**
- Better TypeScript support and autocomplete
- Easier to debug (can see generated code)
- Better performance (no runtime overhead)
- Can customize generated code if needed

**Cons:**
- Need to regenerate when entity changes
- More files to manage

**Decision:** Code generation provides better DX and performance for this use case.

### Why Prettier for Code Formatting?

- Industry standard
- Ensures consistent formatting
- Makes generated code readable
- Easy to integrate

### Why Generic Components?

- Reduces code duplication
- Easier to maintain and update
- Consistent UI across all entities
- Type-safe with TypeScript generics

### Why Appwrite?

- Complete backend solution
- Good TypeScript SDK
- Easy to set up
- Suitable for hackathon timeline

## Implementation Phases

### Phase 1: Foundation (Tasks 1-3)
- Core type definitions
- Type generator
- Generic table component

### Phase 2: Forms and Validation (Tasks 4, 12)
- Generic form component
- Validation system
- Field input components

### Phase 3: Generators (Tasks 5-8)
- List page generator
- Form page generator
- Detail page generator
- API route generator

### Phase 4: Infrastructure (Tasks 9-11)
- Entity registry
- CLI generator command
- Navigation updater

### Phase 5: Advanced Features (Tasks 13-14)
- Reference field support
- Export functionality

### Phase 6: Testing (Task 15)
- Unit tests
- Integration tests

## Success Metrics

- Entity definition under 50 lines of code
- Generator creates 5+ files in under 2 seconds
- Generated code passes TypeScript strict mode
- Generated UI meets WCAG AA standards
- Zero manual edits needed for basic CRUD
- System handles 10+ entities without issues

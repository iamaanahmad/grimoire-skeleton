/**
 * Core entity type definitions for the Grimoire framework.
 * These types drive the entity generation system, form building, and API routes.
 */

/**
 * Available user roles in the system.
 * - admin: Full access to all resources
 * - staff: Can manage most resources but limited system config
 * - user: Standard end-user access
 * - guest: Unauthenticated access
 */
export type Role = 'admin' | 'staff' | 'user' | 'guest';

/**
 * Features that can be enabled or disabled for an entity.
 */
export type Feature = 'list' | 'create' | 'edit' | 'detail' | 'delete' | 'export';

/**
 * Configuration for displaying the entity in the UI.
 */
export interface DisplayConfig {
  /** Icon to use for the entity (Lucide icon name) */
  icon: string;
  /** Singular label for the entity (e.g., "Tournament") */
  singular: string;
  /** Plural label for the entity (e.g., "Tournaments") */
  plural: string;
  /** Fields to show in the list view table */
  listColumns: string[];
  /** Default field to sort by */
  sortBy?: string;
  /** Default sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Validation rules for a specific field.
 */
export interface FieldValidation {
  /** Whether the field is required */
  required?: boolean;
  /** Minimum length for string fields */
  minLength?: number;
  /** Maximum length for string fields */
  maxLength?: number;
  /** Minimum value for number fields */
  min?: number;
  /** Maximum value for number fields */
  max?: number;
  /** Regex pattern for string validation */
  pattern?: RegExp;
  /** Whether the field must be a valid email */
  email?: boolean;
  /** Whether the field must be a valid URL */
  url?: boolean;
  /** Custom validation function returning true if valid or error message string */
  custom?: (value: any) => boolean | string;
}

/**
 * Definition of a single field within an entity.
 */
export interface FieldDefinition {
  /** Data type of the field */
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'reference';
  /** Whether the field is required */
  required?: boolean;
  /** Label to display in forms and tables */
  label: string;
  /** Default value for the field */
  defaultValue?: any;
  /** Options for enum fields */
  options?: string[];
  /** Entity name referenced by this field (for type='reference') */
  reference?: string;
  /** Validation rules for the field */
  validation?: FieldValidation;
}

/**
 * Complete definition of an entity in the system.
 */
export interface EntityDefinition {
  /** Map of field names to their definitions */
  fields: Record<string, FieldDefinition>;
  /** Roles allowed to access this entity */
  permissions: {
    read: Role[];
    write: Role[];
    delete: Role[];
  };
  /** Enabled features for this entity */
  features: Feature[];
  /** UI display configuration */
  display: DisplayConfig;
  /** Custom validation function for the entire entity */
  validate?: (data: any) => boolean | string;
  /** Appwrite collection ID */
  collectionId: string;
  /** Appwrite database ID */
  databaseId: string;
}

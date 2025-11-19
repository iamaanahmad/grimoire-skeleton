# Implementation Plan - Entity System Core

## Prerequisites
This spec requires the project-setup spec to be completed first. Ensure the following exist before starting:
- Next.js project with TypeScript and Tailwind configured
- src/core, src/modules, src/config directory structure
- Path aliases configured (@/core, @/modules, @/config)
- npm scripts for type-check and format

## Implementation Tasks

- [ ] 1. Create core type definitions
  - [ ] 1.1 Create src/core/types/entity.ts with all interfaces
    - Define EntityDefinition interface with fields, permissions, features, display, and validation
    - Define FieldDefinition interface with type, required, options, reference, defaultValue, validation, and label
    - Define FieldValidation interface with minLength, maxLength, min, max, pattern, email, url, and custom
    - Define ValidationRules interface with custom validation function
    - Define DisplayConfig interface with icon, singular, plural, listColumns, sortBy, and sortOrder
    - Define Feature type as union of 'list', 'create', 'edit', 'detail', 'delete', 'export'
    - Define Role type as union of 'admin', 'staff', 'user'
    - Add JSDoc comments explaining each interface and type
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 1.2 Verify type definitions compile without errors
    - Run type-check to ensure no TypeScript errors
    - _Requirements: 16.5_

- [ ] 2. Implement type generator
  - [ ] 2.1 Create src/core/generators/type-generator.ts
    - Implement generateTypes function that accepts entityName and EntityDefinition
    - Implement generateMainInterface function to create main entity interface
    - Implement generateCreateDTO function to create DTO omitting system fields
    - Implement generateUpdateDTO function to create partial DTO with id
    - Implement generateFilterDTO function to create filter interface
    - Implement mapFieldTypeToTS helper to convert field types to TypeScript types
    - Handle enum fields by generating union types from options
    - Handle reference fields by using string type for IDs
    - Use Prettier to format generated code
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 16.1, 16.2_

  - [ ]* 2.2 Test type generator with sample entity
    - Create a test entity definition
    - Run type generator and verify output
    - Check that generated TypeScript is valid
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3. Build generic table component
  - [ ] 3.1 Create supporting UI components
    - Create src/core/components/BoneSkeletonLoader.tsx for loading state
    - Create src/core/components/EmptyState.tsx with ghost icon and message prop
    - Create src/core/components/Pagination.tsx with currentPage, totalPages, onPageChange props
    - Create src/core/components/ActionButtons.tsx with onView, onEdit, onDelete optional props
    - Style components with Tailwind and spooky theme
    - _Requirements: 3.5_
  
  - [ ] 3.2 Create src/core/components/EntityTable.tsx
    - Create generic TypeScript component with type parameter T extends { id: string }
    - Define Column<T> interface with key, label, sortable, render properties
    - Accept props: data (T[]), columns (Column<T>[]), onEdit, onDelete, onView, loading, emptyMessage
    - Implement state management for sorting (sortKey: keyof T | null, sortOrder: 'asc' | 'desc')
    - Implement state management for pagination (currentPage: number, itemsPerPage: 20)
    - Implement sorting logic that compares values and respects sortOrder
    - Implement pagination logic using slice((page-1)*itemsPerPage, page*itemsPerPage)
    - Render table header with sortable column indicators (↑↓ arrows)
    - Render table body with paginated and sorted data
    - Add action buttons column using ActionButtons component
    - Conditionally render BoneSkeletonLoader when loading is true
    - Conditionally render EmptyState when data is empty
    - Render Pagination component at bottom
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 3.3 Make table responsive and accessible
    - Add Tailwind responsive classes (hidden on mobile, show on md+)
    - Create mobile card view for small screens (stack fields vertically)
    - Ensure touch-friendly action buttons (min 44x44px touch targets)
    - Add ARIA labels to interactive elements (aria-label, aria-sort)
    - Implement keyboard navigation for sortable headers (enter/space to sort)
    - Add focus management with visible focus indicators
    - Ensure screen reader compatibility with proper table semantics
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  
  - [ ]* 3.4 Test table performance with large datasets
    - Create src/core/components/__tests__/EntityTable.test.tsx
    - Test with 1000+ items array
    - Verify pagination limits rendered items
    - Verify sorting works correctly
    - _Requirements: 3.5_

- [ ] 4. Build generic form component
  - [ ] 4.1 Create src/core/components/EntityForm.tsx
    - Create generic TypeScript component accepting entity type parameter
    - Accept props for entityDef, initialValues, onSubmit, and mode
    - Implement state management for form values
    - Implement state management for validation errors
    - Implement state management for loading state
    - Implement handleChange function to update field values
    - Implement handleBlur function to validate on blur
    - Implement handleSubmit function with full validation
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 4.2 Create FieldInput component for rendering field types
    - Create component that renders appropriate input based on field type
    - Implement text input for string fields
    - Implement number input for number fields
    - Implement date picker for date fields
    - Implement select dropdown for enum fields
    - Implement checkbox for boolean fields
    - Implement ReferenceSelect for reference fields (placeholder for now)
    - _Requirements: 4.2_
  
  - [ ] 4.3 Add form validation and error display
    - Display error messages below each field
    - Add ARIA attributes for error announcements
    - Style error states clearly
    - Clear errors when user corrects input
    - _Requirements: 4.3, 15.4_
  
  - [ ] 4.4 Add submit button with loading state
    - Create submit button with spooky text ("Summon" for create, "Enchant" for edit)
    - Disable button during submission
    - Show loading indicator during submission
    - _Requirements: 4.4_
  
  - [ ] 4.5 Add accessibility features to form
    - Associate labels with inputs using htmlFor
    - Add required field indicators
    - Implement focus management
    - Add ARIA attributes for validation
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [ ] 5. Implement validation system
  - [ ] 5.1 Create src/core/lib/validators.ts
    - Implement validateField function that accepts value and FieldDefinition
    - Implement required field validation
    - Implement minLength and maxLength validation for strings
    - Implement min and max validation for numbers
    - Implement pattern (regex) validation
    - Implement email validation with regex
    - Implement URL validation
    - Implement custom validator support
    - Return user-friendly error messages
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_
  
  - [ ]* 5.2 Write unit tests for validators
    - Test required field validation
    - Test string length validation
    - Test number range validation
    - Test email and URL validation
    - Test custom validators
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 6. Create list page generator
  - [ ] 6.1 Create src/core/generators/list-generator.ts
    - Implement generateListPage function accepting entityName and EntityDefinition
    - Generate imports for EntityTable, types, and Next.js hooks
    - Generate component with state for data, loading, and filters
    - Generate useEffect hook to fetch data on mount and filter changes
    - Generate fetchData function that calls API with query parameters
    - Generate columns configuration from display.listColumns
    - Generate filters UI for enum fields
    - Generate search input for string fields
    - Generate "Summon New" button if create feature is enabled
    - Generate EntityTable with appropriate props and callbacks
    - Generate delete handler if delete feature is enabled
    - Use Prettier to format generated code
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 9.2, 9.3, 16.1, 16.2, 16.3, 16.4_
  
  - [ ]* 6.2 Test list page generator
    - Generate a list page for a test entity
    - Verify generated code is valid TypeScript
    - Check that all features are correctly included/excluded
    - _Requirements: 3.1, 16.5_

- [ ] 7. Create form page generator
  - [ ] 7.1 Create src/core/generators/form-generator.ts
    - Implement generateFormPage function accepting entityName and EntityDefinition
    - Generate imports for EntityForm, types, and Next.js hooks
    - Generate component that detects create vs edit mode from URL params
    - Generate state for initialValues and loading
    - Generate useEffect to fetch entity data in edit mode
    - Generate fetchEntity function for edit mode
    - Generate handleSubmit function that POSTs or PATCHes to API
    - Generate redirect logic on successful submission
    - Generate error handling for failed submissions
    - Generate EntityForm with appropriate props
    - Use Prettier to format generated code
    - _Requirements: 4.1, 4.4, 4.5, 9.2, 9.3, 16.1, 16.2, 16.3, 16.4_
  
  - [ ]* 7.2 Test form page generator
    - Generate a form page for a test entity
    - Verify generated code is valid TypeScript
    - Check both create and edit modes are handled
    - _Requirements: 4.1, 4.5, 16.5_

- [ ] 8. Create detail page generator
  - [ ] 8.1 Create src/core/generators/detail-generator.ts
    - Implement generateDetailPage function accepting entityName and EntityDefinition
    - Generate imports for types and Next.js hooks
    - Generate component that fetches entity by ID from URL params
    - Generate state for entity data and loading
    - Generate useEffect to fetch entity data on mount
    - Generate card layout displaying all fields with labels
    - Generate value formatting logic for dates, numbers, booleans
    - Generate Edit button if edit feature is enabled
    - Generate Delete button if delete feature is enabled
    - Generate loading skeleton state
    - Generate error state handling
    - Use Prettier to format generated code
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 9.2, 9.3, 16.1, 16.2, 16.3, 16.4_
  
  - [ ]* 8.2 Test detail page generator
    - Generate a detail page for a test entity
    - Verify generated code is valid TypeScript
    - Check that formatting logic is correct
    - _Requirements: 5.1, 5.2, 5.3, 16.5_

- [ ] 9. Create API route generator
  - [ ] 9.1 Create src/core/generators/api-generator.ts
    - Implement generateAPIRoutes function returning list and detail route code
    - Implement generateListRoute function for GET and POST operations
    - Implement generateDetailRoute function for GET, PATCH, DELETE operations
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 9.2 Implement list route generation (GET)
    - Generate code to parse query parameters (page, limit, sortBy, sortOrder)
    - Generate code to build Appwrite Query array
    - Generate filtering logic for enum and string fields from query params
    - Generate sorting logic using Query.orderAsc/orderDesc
    - Generate pagination logic using Query.limit and Query.offset
    - Generate code to call databases.listDocuments with queries
    - Generate response with data, total, page, limit
    - Generate error handling with appropriate status codes
    - _Requirements: 6.2, 6.4_
  
  - [ ] 9.3 Implement list route generation (POST)
    - Generate code to parse request body
    - Generate validation for required fields
    - Generate code to call databases.createDocument
    - Generate response with created document and 201 status
    - Generate error handling with validation messages
    - _Requirements: 6.3, 6.4_
  
  - [ ] 9.4 Implement detail route generation (GET, PATCH, DELETE)
    - Generate GET handler to fetch single document by ID
    - Generate PATCH handler to update document with validation
    - Generate DELETE handler to remove document
    - Generate appropriate error responses (404, 400, 500)
    - _Requirements: 6.1, 6.3, 6.4, 6.5_
  
  - [ ] 9.5 Format generated API routes
    - Use Prettier to format all generated route code
    - Add JSDoc comments to generated functions
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [ ]* 9.6 Test API route generator
    - Generate API routes for a test entity
    - Verify generated code is valid TypeScript
    - Check that all CRUD operations are included
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 16.5_

- [ ] 10. Create entity registry
  - [ ] 10.1 Create src/core/lib/entity-registry.ts
    - Implement EntityRegistry class with private Map storage
    - Implement register method to add entity definitions
    - Implement get method to retrieve entity definition by name
    - Implement list method to return all entity names
    - Implement discover method to auto-load entities from config directory
    - Export singleton instance of EntityRegistry
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 10.2 Test entity registry
    - Test registering and retrieving entities
    - Test auto-discovery functionality
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 11. Create navigation updater
  - [ ] 11.1 Create navigation configuration structure
    - Create src/core/config/navigation.ts with NavigationItem interface
    - Define NavigationItem with label, icon, href, children properties
    - Export navigation array with initial items (Dashboard, Settings)
    - _Requirements: 11.6_
  
  - [ ] 11.2 Create src/core/lib/navigation-updater.ts
    - Implement updateNavigation function with signature (entityName: string, entityDef: EntityDefinition)
    - Read src/core/config/navigation.ts file using fs.readFileSync
    - Parse file content to find the navigation array export
    - Create new navigation entry object with label (plural), icon (from display.icon), href (/entityName)
    - Insert new entry into navigation array (append to end before closing bracket)
    - Write updated content back to file using fs.writeFileSync
    - Use Prettier to format the updated file
    - Handle case where navigation file doesn't exist (create it with template)
    - Add error handling for file read/write operations
    - _Requirements: 11.6_
  
  - [ ]* 11.3 Test navigation updater
    - Create src/core/lib/__tests__/navigation-updater.test.ts
    - Test adding entity to empty navigation array
    - Test adding entity to existing navigation with items
    - Verify formatting is preserved (run prettier on result)
    - Test error handling when file doesn't exist
    - _Requirements: 11.6_

- [ ] 12. Create CLI generator command
  - [ ] 12.1 Install required dependencies
    - Install prettier as dependency (for code formatting)
    - Install @types/node if not already present
    - _Requirements: 16.1_
  
  - [ ] 12.2 Create file writing utilities
    - Create scripts/lib/file-utils.ts
    - Implement ensureDirectory function to create directories if they don't exist
    - Implement writeFile function with proper error handling
    - Implement readFile function for reading entity definitions
    - _Requirements: 11.3, 11.4, 11.5_
  
  - [ ] 12.3 Create scripts/generate-entity.ts
    - Parse command line arguments to get entity name
    - Import entity definition from src/config/entities directory
    - Validate entity definition has required fields
    - Call type generator and write to src/modules/{entity}/types.ts
    - Call list generator and write to src/modules/{entity}/list.tsx if feature enabled
    - Call form generator and write to src/modules/{entity}/form.tsx if create or edit enabled
    - Call detail generator and write to src/modules/{entity}/detail.tsx if feature enabled
    - Call API generator and write to src/app/api/{entity}/route.ts and src/app/api/{entity}/[id]/route.ts
    - Call navigation updater to add entity to navigation
    - Log success message with list of created files
    - Handle errors gracefully with clear messages
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  
  - [ ]* 12.4 Create example entity definition
    - Create src/config/entities/example.ts with a sample entity
    - Use this to test the generator
    - _Requirements: 11.1_
  
  - [ ]* 12.5 Test CLI generator end-to-end
    - Run npm run generate:entity example
    - Verify all expected files are created in correct locations
    - Verify navigation is updated
    - Run npm run type-check to verify generated code compiles without errors
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 16.5_

- [ ] 13. Implement reference field support
  - [ ] 13.1 Create src/core/components/ReferenceSelect.tsx
    - Create searchable select component with TypeScript generics
    - Accept props: referencedEntity (string), value (string | null), onChange (function), label (string)
    - Implement state for options array, loading boolean, search query string, error message
    - Implement useEffect to fetch options from /api/{referencedEntity} on mount
    - Implement search/filter functionality that filters options locally
    - Display options in a dropdown with proper label field (use 'name' as default)
    - Handle selection and call onChange callback with selected ID
    - Add loading indicator (spinner or skeleton) while fetching
    - Add error message display if fetch fails
    - Make component accessible with ARIA attributes (aria-label, aria-expanded, role="combobox")
    - Add keyboard navigation support (arrow keys, enter, escape)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 15.1, 15.2, 15.3_
  
  - [ ] 13.2 Create FieldInput component
    - Create src/core/components/FieldInput.tsx
    - Accept props: fieldName, fieldDef, value, onChange, onBlur, error
    - Implement switch statement based on fieldDef.type
    - Render text input for 'string' type
    - Render number input for 'number' type
    - Render date input for 'date' type
    - Render select dropdown for 'enum' type with options from fieldDef.options
    - Render checkbox for 'boolean' type
    - Render ReferenceSelect for 'reference' type
    - Pass appropriate props to each input type
    - Add proper labels and error display
    - _Requirements: 4.2, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 13.3 Test reference select component
    - Create src/core/components/__tests__/ReferenceSelect.test.tsx
    - Test rendering with mock data
    - Test search functionality filters options
    - Test error handling displays error message
    - Test loading state shows indicator
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 14. Implement export functionality
  - [ ] 14.1 Create src/core/lib/export.ts
    - Implement exportToCSV function with signature (data: any[], filename: string, columns: string[])
    - Implement exportToJSON function with signature (data: any[], filename: string)
    - Implement CSV formatting logic: escape commas with quotes, escape quotes with double quotes, handle newlines
    - Implement file download logic: create Blob, use URL.createObjectURL, create anchor element, trigger click, revoke URL
    - Handle large datasets efficiently (process in chunks if needed for 1000+ items)
    - Add proper MIME types (text/csv, application/json)
    - _Requirements: 14.1, 14.2, 14.4_
  
  - [ ] 14.2 Add export button to list page generator
    - Update src/core/generators/list-generator.ts
    - Add import for export functions when 'export' feature is enabled
    - Generate export button in page header when 'export' feature is enabled
    - Generate dropdown or button group to choose CSV or JSON format
    - Generate handleExport function that calls exportToCSV or exportToJSON with current data
    - Use spooky button text like "Banish to CSV" or "Summon JSON"
    - _Requirements: 14.3_
  
  - [ ]* 14.3 Test export functionality
    - Create src/core/lib/__tests__/export.test.ts
    - Test CSV export with string, number, date, boolean fields
    - Test CSV escaping (commas, quotes, newlines in data)
    - Test JSON export produces valid JSON
    - Test with large datasets (1000+ items) completes without errors
    - Verify file download is triggered (mock URL.createObjectURL)
    - _Requirements: 14.1, 14.2, 14.4, 14.5_

- [ ]* 15. Create integration tests
  - [ ]* 15.1 Create src/core/__tests__/entity-system.test.ts
    - Write test for type generation with various field types
    - Write test for component generation (list, form, detail)
    - Write test for API route generation
    - Write test for full CRUD flow (create, read, update, delete)
    - Write test for validation (required fields, field types, custom validators)
    - Write test for permissions enforcement
    - Write test for feature flags (enabled/disabled features)
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 8.1, 9.1, 12.1_
  
  - [ ]* 15.2 Set up test fixtures and mocks
    - Create sample entity definitions for testing
    - Create mock Appwrite client
    - Create test utilities for file system operations
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_
  
  - [ ]* 15.3 Run tests and verify coverage
    - Execute all tests
    - Generate coverage report
    - Ensure coverage is above 80%
    - Fix any failing tests
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 8.1, 9.1, 12.1_

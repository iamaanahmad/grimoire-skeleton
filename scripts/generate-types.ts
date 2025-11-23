import fs from 'fs';
import path from 'path';
import { EntityDefinition, FieldDefinition } from '../src/core/types/entity';
import { tournament } from '../src/config/entities/tournament';

// Map of entity name to definition (in a real app, this would be dynamic)
const entities: Record<string, EntityDefinition> = {
  tournament
};

/**
 * Map entity field types to TypeScript types
 */
function mapFieldTypeToTS(field: FieldDefinition): string {
  switch (field.type) {
    case 'string':
    case 'date':
    case 'reference':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'enum':
      return field.options ? field.options.map(opt => `'${opt}'`).join(' | ') : 'string';
    default:
      return 'any';
  }
}

/**
 * Generate TypeScript interfaces for an entity
 */
function generateTypes(name: string, def: EntityDefinition): string {
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
  
  let output = `/**
 * ${pascalName} Type Definitions
 * Generated automatically by Grimoire Entity System
 */

export interface ${pascalName} {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
`;

  // Generate fields
  Object.entries(def.fields).forEach(([fieldName, fieldDef]) => {
    const tsType = mapFieldTypeToTS(fieldDef);
    const optional = !fieldDef.validation?.required ? '?' : '';
    output += `  ${fieldName}${optional}: ${tsType};\n`;
  });

  output += `}\n\n`;

  // Create DTO
  output += `export interface Create${pascalName}DTO {\n`;
  Object.entries(def.fields).forEach(([fieldName, fieldDef]) => {
    const tsType = mapFieldTypeToTS(fieldDef);
    const optional = !fieldDef.validation?.required ? '?' : '';
    output += `  ${fieldName}${optional}: ${tsType};\n`;
  });
  output += `}\n\n`;

  // Update DTO
  output += `export interface Update${pascalName}DTO extends Partial<Create${pascalName}DTO> {\n`;
  output += `  $id: string;\n`;
  output += `}\n`;

  return output;
}

/**
 * Main generator function
 */
async function main() {
  console.log('🔮 Summoning entity types...');
  
  const modulesDir = path.join(process.cwd(), 'src', 'modules');
  
  for (const [name, def] of Object.entries(entities)) {
    console.log(`   - Generating types for ${name}...`);
    
    const entityDir = path.join(modulesDir, name);
    if (!fs.existsSync(entityDir)) {
      fs.mkdirSync(entityDir, { recursive: true });
    }
    
    const typeContent = generateTypes(name, def);
    fs.writeFileSync(path.join(entityDir, 'types.ts'), typeContent);
  }
  
  console.log('✨ All types generated successfully!');
}

main().catch(console.error);

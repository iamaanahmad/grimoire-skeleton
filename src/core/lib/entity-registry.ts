import fs from 'fs';
import path from 'path';
import { EntityDefinition } from '../types/entity';

/**
 * Entity Registry
 * 
 * Singleton class to manage entity definitions.
 * Loads definitions from the config directory and provides access to them.
 */
class EntityRegistry {
  private static instance: EntityRegistry;
  private entities: Map<string, EntityDefinition> = new Map();
  private initialized = false;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): EntityRegistry {
    if (!EntityRegistry.instance) {
      EntityRegistry.instance = new EntityRegistry();
    }
    return EntityRegistry.instance;
  }

  /**
   * Register an entity definition
   */
  public register(name: string, definition: EntityDefinition): void {
    this.entities.set(name, definition);
  }

  /**
   * Get an entity definition by name
   */
  public get(name: string): EntityDefinition | undefined {
    return this.entities.get(name);
  }

  /**
   * Get all registered entity names
   */
  public list(): string[] {
    return Array.from(this.entities.keys());
  }

  /**
   * Get all registered entity definitions
   */
  public getAll(): Record<string, EntityDefinition> {
    return Object.fromEntries(this.entities);
  }

  /**
   * Auto-discover entities from the config directory
   * Note: This is primarily for server-side/build-time usage
   */
  public async discover(): Promise<void> {
    if (this.initialized) return;

    try {
      // In a real Next.js app, dynamic imports of config files can be tricky
      // This is a simplified implementation that assumes a specific structure
      // For client-side, we'll likely import a generated manifest
      
      // This is a placeholder for the actual discovery logic
      // In practice, we might generate a registry file at build time
      this.initialized = true;
    } catch (error) {
      console.error('Failed to discover entities:', error);
    }
  }
}

export const entityRegistry = EntityRegistry.getInstance();

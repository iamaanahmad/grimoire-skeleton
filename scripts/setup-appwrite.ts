#!/usr/bin/env node
/**
 * Appwrite Setup Script
 *
 * This script initializes the Appwrite backend for the Grimoire Skeleton project.
 * It creates the database, collections, and attributes needed for both applications:
 * - Cursed Arena (esports tournament platform)
 * - Haunted Clinic (doctor appointment system)
 *
 * The script is idempotent - it can be run multiple times safely.
 */

import { Client, Databases } from 'node-appwrite';

// Configuration
const DATABASE_ID = 'grimoire';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

/**
 * Creates the main database if it doesn't exist
 */
async function setupDatabase(): Promise<void> {
  try {
    await databases.create(DATABASE_ID, 'Grimoire Database');
    console.warn('✓ Database created');
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 409) {
      console.warn('✓ Database already exists');
    } else {
      throw error;
    }
  }
}

/**
 * Creates a collection with the specified configuration
 */
async function createCollection(collectionId: string, collectionName: string): Promise<void> {
  try {
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      collectionName,
      undefined, // permissions - will be set per document
      false, // documentSecurity
      true // enabled
    );
    console.warn(`✓ Collection '${collectionName}' created`);
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 409) {
      console.warn(`✓ Collection '${collectionName}' already exists`);
    } else {
      throw error;
    }
  }
}

/**
 * Creates a string attribute for a collection
 */
async function createStringAttribute(
  collectionId: string,
  key: string,
  size: number,
  required: boolean,
  defaultValue?: string
): Promise<void> {
  try {
    await databases.createStringAttribute(
      DATABASE_ID,
      collectionId,
      key,
      size,
      required,
      defaultValue,
      false // array
    );
    console.warn(`  ✓ Added string attribute: ${key}`);
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 409) {
      console.warn(`  ✓ Attribute '${key}' already exists`);
    } else {
      throw error;
    }
  }
}

/**
 * Creates an integer attribute for a collection
 */
async function createIntegerAttribute(
  collectionId: string,
  key: string,
  required: boolean,
  min?: number,
  max?: number,
  defaultValue?: number
): Promise<void> {
  try {
    await databases.createIntegerAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      min,
      max,
      defaultValue,
      false // array
    );
    console.warn(`  ✓ Added integer attribute: ${key}`);
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 409) {
      console.warn(`  ✓ Attribute '${key}' already exists`);
    } else {
      throw error;
    }
  }
}

/**
 * Creates a datetime attribute for a collection
 */
async function createDatetimeAttribute(
  collectionId: string,
  key: string,
  required: boolean,
  defaultValue?: string
): Promise<void> {
  try {
    await databases.createDatetimeAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      defaultValue,
      false // array
    );
    console.warn(`  ✓ Added datetime attribute: ${key}`);
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 409) {
      console.warn(`  ✓ Attribute '${key}' already exists`);
    } else {
      throw error;
    }
  }
}

/**
 * Creates an enum attribute for a collection
 */
async function createEnumAttribute(
  collectionId: string,
  key: string,
  elements: string[],
  required: boolean,
  defaultValue?: string
): Promise<void> {
  try {
    await databases.createEnumAttribute(
      DATABASE_ID,
      collectionId,
      key,
      elements,
      required,
      defaultValue,
      false // array
    );
    console.warn(`  ✓ Added enum attribute: ${key}`);
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 409) {
      console.warn(`  ✓ Attribute '${key}' already exists`);
    } else {
      throw error;
    }
  }
}

/**
 * Creates an index for a collection
 */
async function createIndex(
  collectionId: string,
  key: string,
  type: string,
  attributes: string[]
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await databases.createIndex(DATABASE_ID, collectionId, key, type as any, attributes);
    console.warn(`  ✓ Created index: ${key}`);
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 409) {
      console.warn(`  ✓ Index '${key}' already exists`);
    } else {
      throw error;
    }
  }
}

/**
 * Sets up the Tournaments collection for Cursed Arena
 */
async function setupTournamentsCollection(): Promise<void> {
  const collectionId = 'tournaments';
  const collectionName = 'Tournaments';

  console.warn(`\nSetting up ${collectionName} collection...`);
  await createCollection(collectionId, collectionName);

  // Add attributes
  await createStringAttribute(collectionId, 'name', 255, true);
  await createStringAttribute(collectionId, 'game', 255, true);
  await createDatetimeAttribute(collectionId, 'startDate', true);
  await createDatetimeAttribute(collectionId, 'endDate', true);
  await createEnumAttribute(
    collectionId,
    'status',
    ['upcoming', 'live', 'completed'],
    true,
    'upcoming'
  );
  await createIntegerAttribute(collectionId, 'maxTeams', true, 2, 128);
  await createStringAttribute(collectionId, 'prizePool', 255, false);
  await createStringAttribute(collectionId, 'description', 5000, false);

  // Create indexes
  await createIndex(collectionId, 'status_idx', 'key', ['status']);
  await createIndex(collectionId, 'startDate_idx', 'key', ['startDate']);
}

/**
 * Sets up the Teams collection for Cursed Arena
 */
async function setupTeamsCollection(): Promise<void> {
  const collectionId = 'teams';
  const collectionName = 'Teams';

  console.warn(`\nSetting up ${collectionName} collection...`);
  await createCollection(collectionId, collectionName);

  // Add attributes
  await createStringAttribute(collectionId, 'name', 255, true);
  await createStringAttribute(collectionId, 'tournamentId', 255, true);
  await createStringAttribute(collectionId, 'captainId', 255, true);
  await createEnumAttribute(
    collectionId,
    'status',
    ['registered', 'active', 'eliminated'],
    true,
    'registered'
  );
  await createStringAttribute(collectionId, 'memberIds', 1000, false);

  // Create indexes
  await createIndex(collectionId, 'tournament_idx', 'key', ['tournamentId']);
  await createIndex(collectionId, 'status_idx', 'key', ['status']);
}

/**
 * Sets up the Appointments collection for Haunted Clinic
 */
async function setupAppointmentsCollection(): Promise<void> {
  const collectionId = 'appointments';
  const collectionName = 'Appointments';

  console.warn(`\nSetting up ${collectionName} collection...`);
  await createCollection(collectionId, collectionName);

  // Add attributes
  await createStringAttribute(collectionId, 'patientId', 255, true);
  await createStringAttribute(collectionId, 'doctorId', 255, true);
  await createDatetimeAttribute(collectionId, 'dateTime', true);
  await createIntegerAttribute(collectionId, 'duration', true, 15, 240, 30);
  await createEnumAttribute(
    collectionId,
    'status',
    ['scheduled', 'completed', 'cancelled', 'no-show'],
    true,
    'scheduled'
  );
  await createStringAttribute(collectionId, 'notes', 5000, false);
  await createStringAttribute(collectionId, 'symptoms', 1000, false);

  // Create indexes
  await createIndex(collectionId, 'patient_idx', 'key', ['patientId']);
  await createIndex(collectionId, 'doctor_idx', 'key', ['doctorId']);
  await createIndex(collectionId, 'dateTime_idx', 'key', ['dateTime']);
  await createIndex(collectionId, 'status_idx', 'key', ['status']);
}

/**
 * Sets up the Doctors collection for Haunted Clinic
 */
async function setupDoctorsCollection(): Promise<void> {
  const collectionId = 'doctors';
  const collectionName = 'Doctors';

  console.warn(`\nSetting up ${collectionName} collection...`);
  await createCollection(collectionId, collectionName);

  // Add attributes
  await createStringAttribute(collectionId, 'userId', 255, true);
  await createStringAttribute(collectionId, 'name', 255, true);
  await createStringAttribute(collectionId, 'specialty', 255, true);
  await createStringAttribute(collectionId, 'bio', 2000, false);
  await createStringAttribute(collectionId, 'availability', 5000, false);
  await createIntegerAttribute(collectionId, 'yearsExperience', false, 0, 100);
  await createStringAttribute(collectionId, 'imageUrl', 500, false);

  // Create indexes
  await createIndex(collectionId, 'userId_idx', 'key', ['userId']);
  await createIndex(collectionId, 'specialty_idx', 'key', ['specialty']);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.warn('🎃 Grimoire Skeleton - Appwrite Setup\n');
  console.warn('Setting up Appwrite backend...\n');

  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT environment variable');
  }
  if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID environment variable');
  }
  if (!process.env.APPWRITE_API_KEY) {
    throw new Error('Missing APPWRITE_API_KEY environment variable');
  }

  try {
    // Create database
    await setupDatabase();

    // Setup Cursed Arena collections
    console.warn('\n📊 Setting up Cursed Arena collections...');
    await setupTournamentsCollection();
    await setupTeamsCollection();

    // Setup Haunted Clinic collections
    console.warn('\n🏥 Setting up Haunted Clinic collections...');
    await setupAppointmentsCollection();
    await setupDoctorsCollection();

    console.warn('\n✅ Appwrite setup complete!');
    console.warn('\nYou can now run the development server with: npm run dev');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
main();

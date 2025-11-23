/**
 * Appwrite Client Configuration
 * 
 * This module configures and exports Appwrite SDK clients for both
 * client-side and server-side operations in the Grimoire application.
 */

import { Client, Databases, Storage, Account } from 'appwrite';

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

// Only throw in browser environment or when actually using the client
// This prevents build scripts from failing when just importing constants
const validateConfig = () => {
  if (!endpoint || !projectId) {
    // Check if we're in a build/script environment where these might be missing
    if (process.env.NODE_ENV === 'test' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('Appwrite config missing in build/test environment');
      return false;
    }
    throw new Error(
      'Missing required Appwrite environment variables. ' +
      'Please ensure NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID are set.'
    );
  }
  return true;
};

/**
 * Client-side Appwrite client
 * Used in browser/React components
 */
export const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

/**
 * Databases service for client-side operations
 */
export const databases = new Databases(client);

/**
 * Storage service for file operations
 */
export const storage = new Storage(client);

/**
 * Account service for authentication
 */
export const account = new Account(client);

/**
 * Server-side Appwrite client
 * Used in API routes with API key authentication
 * Note: API key should be set via headers in individual API routes
 */
export const getServerClient = () => {
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!apiKey) {
    console.warn('APPWRITE_API_KEY not set - server operations may fail');
  }
  
  const client = new Client();
  
  if (endpoint && projectId) {
    client.setEndpoint(endpoint).setProject(projectId);
  }
  
  // Set API key if available (for server-side operations)
  if (apiKey) {
    client.headers['X-Appwrite-Key'] = apiKey;
  }
  
  return client;
};

/**
 * Server-side Databases service
 */
export const getServerDatabases = () => new Databases(getServerClient());

/**
 * Server-side Storage service
 */
export const getServerStorage = () => new Storage(getServerClient());

/**
 * Database IDs
 */
export const DATABASE_IDS = {
  CURSED_ARENA: process.env.NEXT_PUBLIC_CURSED_ARENA_DB || 'cursed-arena',
  HAUNTED_CLINIC: process.env.NEXT_PUBLIC_HAUNTED_CLINIC_DB || 'haunted-clinic',
} as const;

/**
 * Collection IDs for Cursed Arena
 */
export const CURSED_ARENA_COLLECTIONS = {
  TOURNAMENTS: process.env.NEXT_PUBLIC_TOURNAMENTS_COLLECTION || 'tournaments',
  TEAMS: process.env.NEXT_PUBLIC_TEAMS_COLLECTION || 'teams',
  MATCHES: process.env.NEXT_PUBLIC_MATCHES_COLLECTION || 'matches',
  PLAYERS: process.env.NEXT_PUBLIC_PLAYERS_COLLECTION || 'players',
} as const;

/**
 * Collection IDs for Haunted Clinic
 */
export const HAUNTED_CLINIC_COLLECTIONS = {
  DOCTORS: process.env.NEXT_PUBLIC_DOCTORS_COLLECTION || 'doctors',
  PATIENTS: process.env.NEXT_PUBLIC_PATIENTS_COLLECTION || 'patients',
  APPOINTMENTS: process.env.NEXT_PUBLIC_APPOINTMENTS_COLLECTION || 'appointments',
} as const;

/**
 * Storage bucket ID
 */
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'grimoire-assets';

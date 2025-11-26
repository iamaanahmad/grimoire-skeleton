import { Client, Account, Databases, Storage, Query } from 'appwrite';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_APPWRITE_ENDPOINT is not defined');
}

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not defined');
}

/**
 * Appwrite client instance
 */
export const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

/**
 * Appwrite Account service for authentication
 */
export const account = new Account(client);

/**
 * Appwrite Databases service
 */
export const databases = new Databases(client);

/**
 * Appwrite Storage service
 */
export const storage = new Storage(client);

/**
 * Re-export Query for use in API files
 */
export { Query };

/**
 * Database and collection IDs
 */
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'grimoire';
export const USERS_COLLECTION_ID = 'users';

// Cursed Arena Database
export const CURSED_ARENA_DB = process.env.NEXT_PUBLIC_CURSED_ARENA_DB || 'cursed-arena';
export const TOURNAMENTS_COLLECTION = process.env.NEXT_PUBLIC_TOURNAMENTS_COLLECTION || 'tournaments';
export const TEAMS_COLLECTION = process.env.NEXT_PUBLIC_TEAMS_COLLECTION || 'teams';
export const MATCHES_COLLECTION = process.env.NEXT_PUBLIC_MATCHES_COLLECTION || 'matches';
export const PLAYERS_COLLECTION = process.env.NEXT_PUBLIC_PLAYERS_COLLECTION || 'players';

// Haunted Clinic Database
export const HAUNTED_CLINIC_DB = process.env.NEXT_PUBLIC_HAUNTED_CLINIC_DB || 'haunted-clinic';
export const DOCTORS_COLLECTION = process.env.NEXT_PUBLIC_DOCTORS_COLLECTION || 'doctors';
export const PATIENTS_COLLECTION = process.env.NEXT_PUBLIC_PATIENTS_COLLECTION || 'patients';
export const APPOINTMENTS_COLLECTION = process.env.NEXT_PUBLIC_APPOINTMENTS_COLLECTION || 'appointments';

import { Client, Account, Databases, Storage } from 'appwrite';

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
 * Database and collection IDs
 */
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'grimoire';
export const USERS_COLLECTION_ID = 'users';

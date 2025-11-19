/**
 * Environment variable validation utilities
 * Ensures all required environment variables are present at startup
 */

/**
 * List of required environment variables for the application
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
] as const;

/**
 * List of required server-side environment variables
 * These are only checked in server-side contexts
 */
const REQUIRED_SERVER_ENV_VARS = ['APPWRITE_API_KEY'] as const;

/**
 * Validates that all required environment variables are present
 * 
 * @throws {Error} If any required environment variables are missing
 * @param includeServerVars - Whether to validate server-side variables (default: false)
 * 
 * @example
 * ```typescript
 * // In client-side code
 * validateEnv();
 * 
 * // In server-side code (API routes, server components)
 * validateEnv(true);
 * ```
 */
export function validateEnv(includeServerVars: boolean = false): void {
  const requiredVars = includeServerVars
    ? [...REQUIRED_ENV_VARS, ...REQUIRED_SERVER_ENV_VARS]
    : REQUIRED_ENV_VARS;

  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    const errorMessage = [
      '❌ Missing required environment variables:',
      '',
      ...missing.map((varName) => `  - ${varName}`),
      '',
      '📝 To fix this:',
      '  1. Copy .env.local.example to .env.local',
      '  2. Fill in the required values',
      '  3. Restart the development server',
      '',
      '💡 See .env.local.example for detailed instructions on each variable.',
    ].join('\n');

    throw new Error(errorMessage);
  }
}

/**
 * Gets the Appwrite endpoint URL
 * @throws {Error} If the environment variable is not set
 */
export function getAppwriteEndpoint(): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  if (!endpoint) {
    throw new Error('NEXT_PUBLIC_APPWRITE_ENDPOINT is not configured');
  }
  return endpoint;
}

/**
 * Gets the Appwrite project ID
 * @throws {Error} If the environment variable is not set
 */
export function getAppwriteProjectId(): string {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not configured');
  }
  return projectId;
}

/**
 * Gets the Appwrite API key (server-side only)
 * @throws {Error} If the environment variable is not set
 */
export function getAppwriteApiKey(): string {
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!apiKey) {
    throw new Error('APPWRITE_API_KEY is not configured');
  }
  return apiKey;
}

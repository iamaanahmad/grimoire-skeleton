import { account } from '@/core/lib/appwrite';

/**
 * Get the current session
 */
export async function getSession() {
  try {
    return await account.getSession('current');
  } catch (error) {
    return null;
  }
}

/**
 * Validate if session is still valid
 */
export async function validateSession(): Promise<boolean> {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Refresh session to extend expiration
 */
export async function refreshSession(): Promise<void> {
  try {
    const session = await account.getSession('current');
    if (session) {
      // Appwrite automatically refreshes sessions on API calls
      await account.get();
    }
  } catch (error) {
    console.error('Failed to refresh session:', error);
  }
}

/**
 * Clear session on logout
 */
export async function clearSession(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

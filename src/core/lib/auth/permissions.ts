import { User, Role } from './types';

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: Role): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.some((role) => user.roles.includes(role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: User | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.every((role) => user.roles.includes(role));
}

/**
 * Check if user can access a feature based on entity permissions
 */
export function canAccessFeature(
  user: User | null,
  requiredRoles: Role[]
): boolean {
  if (!user) return false;
  if (requiredRoles.length === 0) return true;
  return hasAnyRole(user, requiredRoles);
}

/**
 * Permission constants for common checks
 */
export const Permissions = {
  ADMIN_ONLY: ['admin'] as Role[],
  STAFF_AND_ADMIN: ['staff', 'admin'] as Role[],
  ALL_AUTHENTICATED: [] as Role[],
} as const;

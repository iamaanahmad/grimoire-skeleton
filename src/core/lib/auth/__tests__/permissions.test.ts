import { describe, it, expect } from 'vitest';
import { hasRole, hasAnyRole, hasAllRoles, canAccessFeature } from '../permissions';
import { User } from '../types';

const createMockUser = (roles: string[]): User => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  roles: roles as any,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('Permission Utilities', () => {
  describe('hasRole', () => {
    it('should return true if user has role', () => {
      const user = createMockUser(['admin']);
      expect(hasRole(user, 'admin')).toBe(true);
    });

    it('should return false if user does not have role', () => {
      const user = createMockUser(['user']);
      expect(hasRole(user, 'admin')).toBe(false);
    });

    it('should return false if user is null', () => {
      expect(hasRole(null, 'admin')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has any of the roles', () => {
      const user = createMockUser(['staff']);
      expect(hasAnyRole(user, ['admin', 'staff'])).toBe(true);
    });

    it('should return false if user has none of the roles', () => {
      const user = createMockUser(['user']);
      expect(hasAnyRole(user, ['admin', 'staff'])).toBe(false);
    });

    it('should return false if user is null', () => {
      expect(hasAnyRole(null, ['admin'])).toBe(false);
    });
  });

  describe('hasAllRoles', () => {
    it('should return true if user has all roles', () => {
      const user = createMockUser(['admin', 'staff']);
      expect(hasAllRoles(user, ['admin', 'staff'])).toBe(true);
    });

    it('should return false if user is missing a role', () => {
      const user = createMockUser(['admin']);
      expect(hasAllRoles(user, ['admin', 'staff'])).toBe(false);
    });

    it('should return false if user is null', () => {
      expect(hasAllRoles(null, ['admin'])).toBe(false);
    });
  });

  describe('canAccessFeature', () => {
    it('should return true if user has required role', () => {
      const user = createMockUser(['staff']);
      expect(canAccessFeature(user, ['staff', 'admin'])).toBe(true);
    });

    it('should return true if no roles required', () => {
      const user = createMockUser(['user']);
      expect(canAccessFeature(user, [])).toBe(true);
    });

    it('should return false if user lacks required role', () => {
      const user = createMockUser(['user']);
      expect(canAccessFeature(user, ['admin'])).toBe(false);
    });

    it('should return false if user is null', () => {
      expect(canAccessFeature(null, ['admin'])).toBe(false);
    });
  });
});

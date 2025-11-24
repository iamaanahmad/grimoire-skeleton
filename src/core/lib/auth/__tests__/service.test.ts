import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, register, logout, getCurrentUser, resetPassword } from '../service';
import { AuthError } from '../errors';
import * as appwrite from '@/core/lib/appwrite';

// Mock Appwrite
vi.mock('@/core/lib/appwrite', () => ({
  account: {
    createEmailPasswordSession: vi.fn(),
    create: vi.fn(),
    createVerification: vi.fn(),
    get: vi.fn(),
    deleteSession: vi.fn(),
    createRecovery: vi.fn(),
  },
  databases: {
    getDocument: vi.fn(),
  },
  DATABASE_ID: 'test-db',
  USERS_COLLECTION_ID: 'users',
}));

describe('Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        $id: '123',
        email: 'test@example.com',
        name: 'Test User',
        emailVerification: true,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      };

      vi.mocked(appwrite.account.createEmailPasswordSession).mockResolvedValue({} as any);
      vi.mocked(appwrite.account.get).mockResolvedValue(mockUser as any);
      vi.mocked(appwrite.databases.getDocument).mockResolvedValue({ roles: ['user'] } as any);

      const user = await login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.roles).toContain('user');
    });

    it('should throw error with invalid credentials', async () => {
      vi.mocked(appwrite.account.createEmailPasswordSession).mockRejectedValue(
        new Error('Invalid credentials')
      );

      await expect(
        login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow(AuthError);
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      const mockUser = {
        $id: '123',
        email: 'new@example.com',
        name: 'New User',
        emailVerification: false,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      };

      vi.mocked(appwrite.account.create).mockResolvedValue({} as any);
      vi.mocked(appwrite.account.createVerification).mockResolvedValue({} as any);
      vi.mocked(appwrite.account.createEmailPasswordSession).mockResolvedValue({} as any);
      vi.mocked(appwrite.account.get).mockResolvedValue(mockUser as any);
      vi.mocked(appwrite.databases.getDocument).mockResolvedValue({ roles: ['user'] } as any);

      const user = await register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('new@example.com');
    });

    it('should throw error for existing email', async () => {
      vi.mocked(appwrite.account.create).mockRejectedValue({ code: 409 });

      await expect(
        register({
          name: 'Test',
          email: 'existing@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
        })
      ).rejects.toThrow(AuthError);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      vi.mocked(appwrite.account.deleteSession).mockResolvedValue({} as any);

      await expect(logout()).resolves.not.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user', async () => {
      const mockUser = {
        $id: '123',
        email: 'test@example.com',
        name: 'Test User',
        emailVerification: true,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      };

      vi.mocked(appwrite.account.get).mockResolvedValue(mockUser as any);
      vi.mocked(appwrite.databases.getDocument).mockResolvedValue({ roles: ['admin'] } as any);

      const user = await getCurrentUser();

      expect(user).toBeDefined();
      expect(user.roles).toContain('admin');
    });

    it('should throw error when not authenticated', async () => {
      vi.mocked(appwrite.account.get).mockRejectedValue(new Error('Not authenticated'));

      await expect(getCurrentUser()).rejects.toThrow(AuthError);
    });
  });

  describe('resetPassword', () => {
    it('should send reset email', async () => {
      vi.mocked(appwrite.account.createRecovery).mockResolvedValue({} as any);

      await expect(resetPassword('test@example.com')).resolves.not.toThrow();
    });
  });
});

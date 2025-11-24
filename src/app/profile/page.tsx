'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/lib/auth/AuthContext';
import { withAuth } from '@/core/lib/auth/withAuth';
import { updateName, updatePassword, logout } from '@/core/lib/auth/service';
import { AuthError } from '@/core/lib/auth/errors';

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess(false);
    setNameLoading(true);
    
    try {
      await updateName(name);
      await refreshUser();
      setNameSuccess(true);
    } catch (err) {
      if (err instanceof AuthError) {
        setNameError(err.getUserMessage());
      } else {
        setNameError('Failed to update name');
      }
    } finally {
      setNameLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    
    if (newPassword !== newPasswordConfirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      await updatePassword(oldPassword, newPassword);
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (err) {
      if (err instanceof AuthError) {
        setPasswordError(err.getUserMessage());
      } else {
        setPasswordError('Failed to update password');
      }
    } finally {
      setPasswordLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-surface border-2 border-primary rounded-lg p-8 shadow-glow">
          <h1 className="text-3xl font-bold mb-6 text-primary">Profile</h1>
          
          <div className="space-y-4 mb-8">
            <div>
              <span className="text-sm text-muted">Email:</span>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <span className="text-sm text-muted">Roles:</span>
              <p className="text-lg">{user.roles.join(', ')}</p>
            </div>
            <div>
              <span className="text-sm text-muted">Email Verified:</span>
              <p className="text-lg">{user.emailVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <form onSubmit={handleUpdateName} className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-primary">Update Name</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {nameError && (
              <div className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm" role="alert">
                {nameError}
              </div>
            )}
            
            {nameSuccess && (
              <div className="p-3 bg-green-900/20 border border-green-500 rounded text-green-400 text-sm" role="status">
                Name updated successfully!
              </div>
            )}
            
            <button
              type="submit"
              disabled={nameLoading}
              className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {nameLoading ? 'Updating...' : 'Update Name'}
            </button>
          </form>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-primary">Change Password</h2>
            
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-4 py-2 bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="newPasswordConfirm" className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                id="newPasswordConfirm"
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-2 bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {passwordError && (
              <div className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm" role="alert">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="p-3 bg-green-900/20 border border-green-500 rounded text-green-400 text-sm" role="status">
                Password updated successfully!
              </div>
            )}
            
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {passwordLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
          
          <div className="pt-8 border-t border-primary">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);

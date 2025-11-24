'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/core/lib/auth/service';
import { AuthError } from '@/core/lib/auth/errors';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const getPasswordStrength = (password: string): string => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData);
      router.push('/');
      router.refresh();
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.getUserMessage());
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border-2 border-primary rounded-lg p-8 shadow-glow">
          <h1 className="text-3xl font-bold text-center mb-6 text-primary">
            Join the Grimoire
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                autoComplete="name"
                className="w-full px-4 py-2 bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
                className="w-full px-4 py-2 bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="new-password"
                minLength={8}
                className="w-full px-4 py-2 bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1">
                    <div className={`flex-1 rounded ${passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <div className={`flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
                    <div className={`flex-1 rounded ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  </div>
                  <p className="text-xs mt-1 text-muted">
                    {passwordStrength === 'weak' && 'Weak - Add more characters'}
                    {passwordStrength === 'medium' && 'Medium - Consider adding more characters'}
                    {passwordStrength === 'strong' && 'Strong password'}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="passwordConfirm" 
                className="block text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                required
                autoComplete="new-password"
                className="w-full px-4 py-2 bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {error && (
              <div 
                className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-background font-bold rounded hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Casting...' : 'Cast Registration Spell'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <Link 
              href="/login"
              className="text-primary hover:text-primary-hover"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

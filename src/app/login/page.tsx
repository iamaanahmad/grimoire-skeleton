'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/core/lib/auth/service';
import { AuthError } from '@/core/lib/auth/errors';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login({ email, password });
      router.push(redirectTo);
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
    <div className="w-full max-w-md">
        <div className="bg-surface border-2 border-primary rounded-lg p-8 shadow-glow">
          <h1 className="text-3xl font-bold text-center mb-6 text-primary">
            Enter the Grimoire
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
              {loading ? 'Summoning...' : 'Summon Session'}
            </button>
          </form>
          
          <div className="mt-6 text-center space-y-2 text-sm">
            <Link 
              href="/forgot-password"
              className="block text-primary hover:text-primary-hover"
            >
              Forgot your incantation?
            </Link>
            <Link 
              href="/register"
              className="block text-primary hover:text-primary-hover"
            >
              Join the coven
            </Link>
          </div>
        </div>
      </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { resetPassword } from '@/core/lib/auth/service';
import { AuthError } from '@/core/lib/auth/errors';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    try {
      await resetPassword(email);
      setSuccess(true);
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
            Forgot Your Incantation?
          </h1>
          
          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-900/20 border border-green-500 rounded text-green-400">
                Password reset email sent! Check your inbox for instructions.
              </div>
              <Link 
                href="/login"
                className="block text-center text-primary hover:text-primary-hover"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <div className="text-center text-sm">
                <Link 
                  href="/login"
                  className="text-primary hover:text-primary-hover"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

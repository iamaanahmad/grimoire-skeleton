'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border-2 border-primary rounded-lg p-8 shadow-glow text-center">
          <h1 className="text-3xl font-bold mb-4 text-primary">
            Access Denied
          </h1>
          
          <p className="text-lg mb-6 text-muted">
            You don't have permission to access this page. Your current role doesn't grant access to this feature.
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="block px-6 py-3 bg-primary text-background font-bold rounded hover:bg-primary-hover transition-colors"
            >
              Return to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="block w-full px-6 py-3 border border-primary text-primary font-bold rounded hover:bg-primary hover:text-background transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

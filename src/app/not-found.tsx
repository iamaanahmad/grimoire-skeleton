import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border-2 border-primary rounded-lg p-8 shadow-glow text-center">
          <h1 className="text-6xl font-bold mb-4 text-primary">
            404
          </h1>
          
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Page Not Found
          </h2>
          
          <p className="text-lg mb-6 text-muted">
            The page you're looking for has vanished into the void.
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="block px-6 py-3 bg-primary text-background font-bold rounded hover:bg-primary-hover transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

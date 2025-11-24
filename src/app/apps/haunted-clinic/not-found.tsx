import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--color-accent-primary)' }}>
          404
        </h1>
        
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Page Not Found
        </h2>
        
        <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          The page you're looking for is not in our records.
        </p>
        
        <Link 
          href="/apps/haunted-clinic"
          className="inline-block px-6 py-3 font-bold rounded transition-colors"
          style={{
            backgroundColor: 'var(--color-accent-primary)',
            color: 'var(--color-bg-primary)',
          }}
        >
          Return to Clinic
        </Link>
      </div>
    </div>
  );
}

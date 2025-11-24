import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--color-accent-primary)' }}>
          404
        </h1>
        
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Tournament Not Found
        </h2>
        
        <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          This tournament has been banished to the shadow realm.
        </p>
        
        <Link 
          href="/apps/cursed-arena"
          className="inline-block px-6 py-3 font-bold rounded transition-colors"
          style={{
            backgroundColor: 'var(--color-accent-primary)',
            color: 'var(--color-bg-primary)',
          }}
        >
          Return to Arena
        </Link>
      </div>
    </div>
  );
}

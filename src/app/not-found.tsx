'use client';

import Link from 'next/link';

/**
 * Custom 404 Page
 * 
 * Themed not found page with navigation options.
 */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        backgroundColor: 'var(--color-bg-primary)',
        textAlign: 'center',
      }}
    >
      {/* Ghost Animation */}
      <div
        style={{
          fontSize: '120px',
          marginBottom: '24px',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        👻
      </div>

      {/* Error Code */}
      <h1
        style={{
          fontSize: '96px',
          fontWeight: 'bold',
          color: 'var(--color-accent-primary)',
          textShadow: '0 0 40px var(--color-accent-glow)',
          marginBottom: '16px',
          lineHeight: 1,
        }}
      >
        404
      </h1>

      {/* Message */}
      <h2
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: '18px',
          color: 'var(--color-text-secondary)',
          maxWidth: '500px',
          marginBottom: '40px',
          lineHeight: 1.6,
        }}
      >
        The page you&apos;re looking for has vanished into the void. 
        Perhaps it was never meant to be found...
      </p>

      {/* Navigation Options */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 32px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-accent-primary)',
            color: 'var(--color-bg-primary)',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 0 20px var(--color-accent-glow)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>🏠</span>
          Return Home
        </Link>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/apps/cursed-arena"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px',
              border: '1px solid var(--color-border-primary)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-primary)';
            }}
          >
            <span>⚔️</span>
            Cursed Arena
          </Link>
          <Link
            href="/apps/haunted-clinic"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px',
              border: '1px solid var(--color-border-primary)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-primary)';
            }}
          >
            <span>🏥</span>
            Haunted Clinic
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

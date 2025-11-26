'use client';

import Link from 'next/link';

/**
 * Cursed Arena 404 Page
 */
export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 32px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '100px',
          marginBottom: '24px',
          animation: 'glitch 2s infinite',
        }}
      >
        💀
      </div>

      <h1
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: 'var(--color-accent-primary)',
          textShadow: '0 0 40px var(--color-accent-glow)',
          marginBottom: '16px',
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
        }}
      >
        Arena Not Found
      </h2>
      <p
        style={{
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          maxWidth: '400px',
          marginBottom: '32px',
        }}
      >
        This battle arena has been banished to the shadow realm.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/apps/cursed-arena"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-accent-primary)',
            color: 'var(--color-bg-primary)',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 0 20px var(--color-accent-glow)',
          }}
        >
          <span>⚔️</span>
          Return to Arena
        </Link>
        <Link
          href="/apps/cursed-arena/tournaments"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            fontWeight: 500,
            border: '1px solid var(--color-border-primary)',
          }}
        >
          <span>🏆</span>
          View Tournaments
        </Link>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-5px, 5px); }
          94% { transform: translate(5px, -5px); }
          96% { transform: translate(-5px, -5px); }
          98% { transform: translate(5px, 5px); }
        }
      `}</style>
    </div>
  );
}

'use client';

import Link from 'next/link';

/**
 * Haunted Clinic 404 Page
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
          animation: 'heartbeat 2s infinite',
        }}
      >
        🩺
      </div>

      <h1
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: 'var(--color-accent-primary)',
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
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          maxWidth: '400px',
          marginBottom: '32px',
        }}
      >
        This medical record seems to have gone missing from our archives.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/apps/haunted-clinic"
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
          }}
        >
          <span>🏥</span>
          Return to Clinic
        </Link>
        <Link
          href="/apps/haunted-clinic/appointments"
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
          <span>📅</span>
          View Appointments
        </Link>
      </div>

      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

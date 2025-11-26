'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/theme/useTheme';
import { getThemeById } from '@/theme/skins';
import { appConfig } from '@/config/cursed-arena/app';
import '@/styles/cursed-arena/custom.css';

/**
 * Cursed Arena Root Layout
 * 
 * Provides theme context and navigation for the entire app.
 */
export default function CursedArenaLayout({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const theme = getThemeById(appConfig.defaultTheme);
    if (theme) {
      setTheme(theme);
    }
  }, [setTheme]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Navigation */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 95%, transparent)',
          borderBottom: '1px solid var(--color-border-primary)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 30px var(--color-accent-glow)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/apps/cursed-arena"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 8px var(--color-accent-glow))' }}>⚔️</span>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'var(--color-accent-primary)',
                textShadow: '0 0 15px var(--color-accent-glow)',
              }}
            >
              {appConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
            }}
            className="desktop-nav"
          >
            {appConfig.navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: isActive(item.path)
                    ? 'color-mix(in srgb, var(--color-accent-primary) 20%, transparent)'
                    : 'transparent',
                  color: isActive(item.path)
                    ? 'var(--color-accent-primary)'
                    : 'var(--color-text-secondary)',
                  border: isActive(item.path)
                    ? '1px solid var(--color-accent-primary)'
                    : '1px solid transparent',
                  boxShadow: isActive(item.path)
                    ? '0 0 12px var(--color-accent-glow)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid var(--color-border-primary)',
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              fontSize: '20px',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--color-border-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
            className="mobile-nav"
          >
            {appConfig.navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  backgroundColor: isActive(item.path)
                    ? 'color-mix(in srgb, var(--color-accent-primary) 20%, transparent)'
                    : 'var(--color-bg-tertiary)',
                  color: isActive(item.path)
                    ? 'var(--color-accent-primary)'
                    : 'var(--color-text-primary)',
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Back to Home Link */}
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Link
          href="/"
          style={{
            color: 'var(--color-text-tertiary)',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
        >
          ← Back to Grimoire Skeleton
        </Link>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

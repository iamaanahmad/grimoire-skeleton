/**
 * Cursed Arena Root Layout
 * 
 * Provides theme context and navigation for the entire app.
 */

import React from 'react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { getThemeById } from '@/theme/skins';
import { appConfig } from '@/config/cursed-arena/app';
import Link from 'next/link';
import '@/styles/cursed-arena/custom.css';

export const metadata = {
  title: 'Cursed Arena',
  description: 'Esports tournament management platform',
};

export default function CursedArenaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialTheme={getThemeById(appConfig.defaultTheme)}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        {/* Navigation */}
        <nav
          className="sticky top-0 z-50 border-b"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/apps/cursed-arena" className="flex items-center gap-3">
                <span
                  className="text-2xl font-bold neon-glow"
                  style={{ color: 'var(--color-accent-primary)' }}
                >
                  {appConfig.name}
                </span>
              </Link>

              <div className="flex items-center gap-6">
                {appConfig.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span>{item.icon}</span>
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
}

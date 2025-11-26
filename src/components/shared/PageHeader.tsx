'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

/**
 * PageHeader - Consistent page header with title, subtitle, and actions
 * 
 * Features:
 * - Title with optional icon
 * - Subtitle/description
 * - Actions slot for buttons
 * - Optional breadcrumbs
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  count?: number;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  actions,
  breadcrumbs,
  count,
}: PageHeaderProps) {
  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav style={{ marginBottom: '16px' }}>
          <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
            {breadcrumbs.map((crumb, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {index > 0 && (
                  <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    style={{
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header Content */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'var(--color-text-primary)',
              marginBottom: subtitle ? '8px' : '0',
              textShadow: '0 0 30px var(--color-accent-glow)',
            }}
          >
            {icon && <span style={{ fontSize: '40px' }}>{icon}</span>}
            {title}
            {typeof count === 'number' && (
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'normal',
                  color: 'var(--color-text-tertiary)',
                  marginLeft: '8px',
                }}
              >
                ({count})
              </span>
            )}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;

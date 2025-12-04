'use client';

import { ReactNode } from 'react';

/**
 * GlowCard - Theme-aware card with glow effects
 * 
 * Features:
 * - CSS variable-based theming
 * - Multiple variants (default, accent, success, warning, error)
 * - Hover effects with scale and glow intensification
 */
interface GlowCardProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  hover?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const variantStyles = {
  default: {
    borderColor: 'var(--color-border-primary)',
    glowColor: 'var(--color-accent-glow)',
  },
  accent: {
    borderColor: 'var(--color-accent-primary)',
    glowColor: 'var(--color-accent-glow)',
  },
  success: {
    borderColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.3)',
  },
  warning: {
    borderColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.3)',
  },
  error: {
    borderColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.3)',
  },
};

export function GlowCard({
  children,
  variant = 'default',
  hover = true,
  glow = true,
  className = '',
  onClick,
  style,
}: GlowCardProps) {
  const variantStyle = variantStyles[variant];

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        padding: '20px',
        borderRadius: '20px',
        backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 60%, transparent)',
        border: `1px solid ${variantStyle.borderColor}`,
        boxShadow: glow ? `0 0 20px ${variantStyle.glowColor}` : 'none',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
        cursor: onClick || hover ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          if (glow) {
            e.currentTarget.style.boxShadow = `0 8px 32px ${variantStyle.glowColor}`;
          }
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          if (glow) {
            e.currentTarget.style.boxShadow = `0 0 20px ${variantStyle.glowColor}`;
          }
        }
      }}
      data-testid="glow-card"
    >
      {children}
    </div>
  );
}

export default GlowCard;

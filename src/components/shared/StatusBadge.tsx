'use client';

/**
 * StatusBadge - Unified status display with color mapping
 * 
 * Features:
 * - Status-to-color mapping for different contexts
 * - Pulse animation for live/active status
 * - Multiple sizes
 */
interface StatusBadgeProps {
  status: string;
  variant?: 'tournament' | 'match' | 'appointment' | 'general';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const statusColors: Record<string, Record<string, { bg: string; text: string }>> = {
  tournament: {
    upcoming: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
    live: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
    ongoing: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
    completed: { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
  },
  match: {
    scheduled: { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af' },
    live: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
    completed: { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
  },
  appointment: {
    scheduled: { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af' },
    confirmed: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
    'in-progress': { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' },
    completed: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
    'no-show': { bg: 'rgba(220, 38, 38, 0.2)', text: '#dc2626' },
  },
  general: {
    active: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
    inactive: { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af' },
    pending: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' },
    error: { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
  },
};

const sizeStyles = {
  sm: { padding: '2px 8px', fontSize: '11px' },
  md: { padding: '4px 12px', fontSize: '12px' },
  lg: { padding: '6px 16px', fontSize: '14px' },
};

export function StatusBadge({
  status,
  variant = 'general',
  size = 'md',
  pulse = false,
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const colors = statusColors[variant]?.[normalizedStatus] || 
                 statusColors.general[normalizedStatus] ||
                 { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af' };
  
  const sizeStyle = sizeStyles[size];
  const isLive = normalizedStatus === 'live' || normalizedStatus === 'in-progress';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: sizeStyle.padding,
        borderRadius: '9999px',
        fontSize: sizeStyle.fontSize,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.text}40`,
      }}
      data-testid="status-badge"
      data-status={normalizedStatus}
    >
      {(pulse || isLive) && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: colors.text,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
      {status}
    </span>
  );
}

export default StatusBadge;

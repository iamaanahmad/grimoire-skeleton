/**
 * Status Badge Component
 * 
 * Reusable status badge with color coding, icons, and animations.
 * Ensures WCAG AA contrast requirements and accessibility.
 * Requirements: 8.2, 10.2, 10.3
 */

'use client';

import { Appointment } from '@/types/haunted-clinic/entities';

export interface StatusBadgeProps {
  status: Appointment['status'];
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

/**
 * StatusBadge component displays appointment status with color coding and icons
 * 
 * @param status - The appointment status to display
 * @param size - Badge size: 'sm', 'md' (default), or 'lg'
 * @param showIcon - Whether to show status icon (default: true)
 */
export default function StatusBadge({
  status = 'scheduled',
  size = 'md',
  showIcon = true,
}: StatusBadgeProps) {
  // Status configuration with colors, icons, and labels
  const statusConfig = {
    scheduled: {
      label: 'Scheduled',
      icon: '📅',
      bgColor: '#4a5568', // Gray-600
      textColor: '#f7fafc', // Gray-50
      borderColor: '#718096', // Gray-500
    },
    confirmed: {
      label: 'Confirmed',
      icon: '✓',
      bgColor: '#2d5f3f', // Green-800
      textColor: '#c8d4c8', // Light green
      borderColor: '#48bb78', // Green-400
    },
    'in-progress': {
      label: 'In Progress',
      icon: '⏱️',
      bgColor: '#5a4a8a', // Purple-800
      textColor: '#e9d8fd', // Purple-100
      borderColor: '#9f7aea', // Purple-400
    },
    completed: {
      label: 'Completed',
      icon: '✔️',
      bgColor: '#1a4d2e', // Dark green
      textColor: '#c8d4c8', // Light green
      borderColor: '#68d391', // Green-300
    },
    cancelled: {
      label: 'Cancelled',
      icon: '✕',
      bgColor: '#742a2a', // Red-900
      textColor: '#fed7d7', // Red-100
      borderColor: '#fc8181', // Red-300
    },
    'no-show': {
      label: 'No Show',
      icon: '⚠️',
      bgColor: '#744210', // Orange-900
      textColor: '#feebc8', // Orange-100
      borderColor: '#f6ad55', // Orange-300
    },
  };

  const config = statusConfig[status];

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  // Animation class for in-progress status
  const animationClass = status === 'in-progress' ? 'status-in-progress' : '';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 
        font-medium rounded-full
        border
        transition-all duration-200 ease-in-out
        ${sizeClasses[size]}
        ${animationClass}
      `}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderColor: config.borderColor,
      }}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {showIcon && (
        <span
          className="flex-shrink-0"
          aria-hidden="true"
        >
          {config.icon}
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
}

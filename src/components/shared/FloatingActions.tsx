'use client';

import { useState } from 'react';

/**
 * FloatingActions - Floating action bar for detail pages
 * 
 * Features:
 * - Fixed position at bottom-right
 * - Edit and delete actions
 * - Custom actions support
 * - Smooth entrance animation
 */
interface CustomAction {
  icon: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface FloatingActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: CustomAction[];
  position?: 'bottom-right' | 'bottom-center';
}

export function FloatingActions({
  onEdit,
  onDelete,
  customActions = [],
  position = 'bottom-right',
}: FloatingActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete?.();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const positionStyles = position === 'bottom-center' 
    ? { left: '50%', transform: 'translateX(-50%)' }
    : { right: '32px' };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        ...positionStyles,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '16px',
        backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 95%, transparent)',
        border: '1px solid var(--color-border-primary)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px var(--color-accent-glow)',
        backdropFilter: 'blur(16px)',
        zIndex: 100,
        animation: 'slideUp 0.3s ease-out',
      }}
      data-testid="floating-actions"
    >
      {/* Custom Actions */}
      {customActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: action.variant === 'danger' 
              ? 'rgba(239, 68, 68, 0.2)' 
              : 'var(--color-bg-tertiary)',
            color: action.variant === 'danger' 
              ? '#f87171' 
              : 'var(--color-text-primary)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}

      {/* Edit Button */}
      {onEdit && (
        <button
          onClick={onEdit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'var(--color-accent-primary)',
            color: 'var(--color-bg-primary)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 0 15px var(--color-accent-glow)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          data-testid="edit-button"
        >
          <span>✏️</span>
          <span>Edit</span>
        </button>
      )}

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={handleDelete}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: showConfirm ? '2px solid #ef4444' : '1px solid var(--color-border-primary)',
            backgroundColor: showConfirm ? 'rgba(239, 68, 68, 0.2)' : 'var(--color-bg-tertiary)',
            color: showConfirm ? '#f87171' : 'var(--color-text-secondary)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          data-testid="delete-button"
        >
          <span>🗑️</span>
          <span>{showConfirm ? 'Confirm Delete' : 'Delete'}</span>
        </button>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) ${position === 'bottom-center' ? 'translateX(-50%)' : ''};
          }
          to {
            opacity: 1;
            transform: translateY(0) ${position === 'bottom-center' ? 'translateX(-50%)' : ''};
          }
        }
      `}</style>
    </div>
  );
}

export default FloatingActions;

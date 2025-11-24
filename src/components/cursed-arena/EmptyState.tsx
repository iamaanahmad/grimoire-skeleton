/**
 * EmptyState Component
 * 
 * Displays when no data is available.
 */

import React from 'react';
import { Ghost } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No data found' }) => {
  return (
    <div
      className="p-12 rounded-lg text-center"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border-primary)',
      }}
    >
      <Ghost
        className="w-16 h-16 mx-auto mb-4 opacity-30"
        style={{ color: 'var(--color-text-tertiary)' }}
      />
      <p style={{ color: 'var(--color-text-tertiary)' }}>{message}</p>
    </div>
  );
};

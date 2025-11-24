/**
 * TournamentCard Component
 * 
 * Displays tournament information in an arcade cabinet aesthetic.
 * Features neon borders, glitch effects on hover, and responsive design.
 */

'use client';

import React from 'react';
import { Tournament } from '@/types/cursed-arena/entities';
import { Calendar, Trophy, Gamepad2 } from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
  onClick?: () => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onClick,
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrizePool = (amount?: number) => {
    if (!amount) return 'TBD';
    return `$${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'var(--color-status-success)';
      case 'upcoming':
        return 'var(--color-status-info)';
      case 'completed':
        return 'var(--color-text-tertiary)';
      case 'cancelled':
        return 'var(--color-status-error)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  return (
    <div
      className="arcade-card p-6 cursor-pointer animate-entrance animate-hover"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      aria-label={`View ${tournament.name} tournament`}
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'var(--color-accent-primary)',
        transition: `all var(--animation-duration-normal) var(--animation-easing)`,
      }}
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span
          className="text-xs font-mono uppercase px-2 py-1 rounded"
          style={{
            backgroundColor: `color-mix(in srgb, ${getStatusColor(tournament.status)} 20%, transparent)`,
            color: getStatusColor(tournament.status),
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: getStatusColor(tournament.status),
          }}
        >
          {tournament.status}
        </span>
        {tournament.status === 'live' && (
          <span className="live-indicator text-xs font-bold" style={{ color: 'var(--color-status-success)' }}>
            ● LIVE
          </span>
        )}
      </div>

      {/* Tournament Name */}
      <h3
        className="text-xl font-bold mb-3 neon-glow"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {tournament.name}
      </h3>

      {/* Game */}
      <div className="flex items-center gap-2 mb-3">
        <Gamepad2 className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {tournament.game}
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {formatDate(tournament.startDate)}
          {tournament.endDate && ` - ${formatDate(tournament.endDate)}`}
        </span>
      </div>

      {/* Prize Pool */}
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4" style={{ color: 'var(--color-accent-secondary)' }} />
        <span className="text-lg font-bold" style={{ color: 'var(--color-accent-primary)' }}>
          {formatPrizePool(tournament.prizePool)}
        </span>
      </div>
    </div>
  );
};

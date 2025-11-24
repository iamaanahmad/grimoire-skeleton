/**
 * MatchScoreUpdater Component
 * 
 * Compact component for quickly updating match scores during live events.
 * Features optimistic UI updates and error handling.
 */

'use client';

import React, { useState } from 'react';
import { Match } from '@/types/cursed-arena/entities';
import { Plus, Minus, Save, Loader2 } from 'lucide-react';

interface MatchScoreUpdaterProps {
  match: Match;
  onUpdate: (scoreA: number, scoreB: number) => Promise<void>;
}

export const MatchScoreUpdater: React.FC<MatchScoreUpdaterProps> = ({
  match,
  onUpdate,
}) => {
  const [scoreA, setScoreA] = useState(match.scoreA);
  const [scoreB, setScoreB] = useState(match.scoreB);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onUpdate(scoreA, scoreB);
    } catch (err: any) {
      setError(err.message || 'Failed to update scores');
      setScoreA(match.scoreA);
      setScoreB(match.scoreB);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = scoreA !== match.scoreA || scoreB !== match.scoreB;

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border-primary)',
      }}
    >
      {match.status === 'live' && (
        <div className="flex items-center gap-2 mb-3">
          <span className="live-indicator text-xs font-bold" style={{ color: 'var(--color-status-success)' }}>
            ● LIVE
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Team A Score */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScoreA(Math.max(0, scoreA - 1))}
            disabled={scoreA === 0 || isSaving}
            className="p-1 rounded disabled:opacity-30"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Decrease Team A score"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-2xl font-bold w-12 text-center" style={{ color: 'var(--color-accent-primary)' }}>
            {scoreA}
          </span>
          <button
            onClick={() => setScoreA(scoreA + 1)}
            disabled={isSaving}
            className="p-1 rounded"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Increase Team A score"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <span className="text-lg font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
          VS
        </span>

        {/* Team B Score */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScoreB(Math.max(0, scoreB - 1))}
            disabled={scoreB === 0 || isSaving}
            className="p-1 rounded disabled:opacity-30"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Decrease Team B score"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-2xl font-bold w-12 text-center" style={{ color: 'var(--color-accent-secondary)' }}>
            {scoreB}
          </span>
          <button
            onClick={() => setScoreB(scoreB + 1)}
            disabled={isSaving}
            className="p-1 rounded"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Increase Team B score"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-accent-primary)',
            color: 'var(--color-bg-primary)',
          }}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-xs" style={{ color: 'var(--color-status-error)' }}>
          {error}
        </div>
      )}
    </div>
  );
};

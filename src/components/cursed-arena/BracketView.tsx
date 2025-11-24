/**
 * BracketView Component
 * 
 * Text-based bracket visualization showing tournament progression.
 * Groups matches by round and highlights winners.
 */

'use client';

import React from 'react';
import { Tournament, Match, Team } from '@/types/cursed-arena/entities';
import { Trophy } from 'lucide-react';

interface BracketViewProps {
  tournament: Tournament;
  matches: Match[];
  teams: Record<string, Team>;
}

export const BracketView: React.FC<BracketViewProps> = ({
  tournament,
  matches,
  teams,
}) => {
  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    const round = match.round || 'Unassigned';
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // Define round order
  const roundOrder = ['Quarter Finals', 'Semi Finals', 'Finals', 'Unassigned'];
  const orderedRounds = roundOrder.filter((round) => rounds[round]);

  const getWinner = (match: Match): string | null => {
    if (match.status !== 'completed') return null;
    if (match.scoreA > match.scoreB) return match.teamA;
    if (match.scoreB > match.scoreA) return match.teamB;
    return null;
  };

  const getTeamName = (teamId: string): string => {
    return teams[teamId]?.name || 'Unknown Team';
  };

  if (matches.length === 0) {
    return (
      <div
        className="p-8 rounded-lg text-center"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border-primary)',
        }}
      >
        <p style={{ color: 'var(--color-text-tertiary)' }}>
          No matches scheduled yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orderedRounds.map((roundName) => (
        <div key={roundName}>
          <h3
            className="text-lg font-bold mb-4 uppercase font-mono"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            {roundName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rounds[roundName].map((match) => {
              const winner = getWinner(match);
              return (
                <div
                  key={match.$id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-primary)',
                  }}
                  role="article"
                  aria-label={`Match between ${getTeamName(match.teamA)} and ${getTeamName(match.teamB)}`}
                >
                  {/* Team A */}
                  <div
                    className="flex justify-between items-center p-2 rounded mb-2"
                    style={{
                      backgroundColor:
                        winner === match.teamA
                          ? 'color-mix(in srgb, var(--color-status-success) 20%, transparent)'
                          : 'var(--color-bg-tertiary)',
                      borderWidth: winner === match.teamA ? '1px' : '0',
                      borderStyle: 'solid',
                      borderColor: winner === match.teamA ? 'var(--color-status-success)' : 'transparent',
                    }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {getTeamName(match.teamA)}
                      {winner === match.teamA && (
                        <Trophy className="inline w-4 h-4 ml-2" style={{ color: 'var(--color-status-success)' }} />
                      )}
                    </span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: 'var(--color-accent-primary)' }}
                    >
                      {match.scoreA}
                    </span>
                  </div>

                  {/* Team B */}
                  <div
                    className="flex justify-between items-center p-2 rounded"
                    style={{
                      backgroundColor:
                        winner === match.teamB
                          ? 'color-mix(in srgb, var(--color-status-success) 20%, transparent)'
                          : 'var(--color-bg-tertiary)',
                      borderWidth: winner === match.teamB ? '1px' : '0',
                      borderStyle: 'solid',
                      borderColor: winner === match.teamB ? 'var(--color-status-success)' : 'transparent',
                    }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {getTeamName(match.teamB)}
                      {winner === match.teamB && (
                        <Trophy className="inline w-4 h-4 ml-2" style={{ color: 'var(--color-status-success)' }} />
                      )}
                    </span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: 'var(--color-accent-secondary)' }}
                    >
                      {match.scoreB}
                    </span>
                  </div>

                  {/* Match Status */}
                  <div className="mt-2 text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                    {match.status === 'live' && (
                      <span className="live-indicator" style={{ color: 'var(--color-status-success)' }}>
                        ● LIVE
                      </span>
                    )}
                    {match.status === 'scheduled' && 'Scheduled'}
                    {match.status === 'completed' && 'Completed'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

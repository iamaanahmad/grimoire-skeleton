/**
 * Matches List Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Match } from '@/types/cursed-arena/entities';
import { fetchMatches } from '@/lib/cursed-arena/api';
import { Plus } from 'lucide-react';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await fetchMatches();
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Match>[] = [
    {
      key: 'round',
      label: 'Round',
      sortable: true,
    },
    {
      key: 'teamA',
      label: 'Team A',
      render: (value) => value || 'TBD',
    },
    {
      key: 'teamB',
      label: 'Team B',
      render: (value) => value || 'TBD',
    },
    {
      key: 'scoreA',
      label: 'Score',
      render: (_, match) => (
        <span className="font-bold text-lg" style={{ color: 'var(--color-accent-primary)' }}>
          {match.scoreA} - {match.scoreB}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className="px-2 py-1 rounded text-xs font-mono uppercase"
          style={{
            backgroundColor: `color-mix(in srgb, var(--color-accent-primary) 20%, transparent)`,
            color: 'var(--color-accent-primary)',
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              ⚡ Matches
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Schedule and track competition results
            </p>
          </div>
          <button
            onClick={() => router.push('/apps/cursed-arena/matches/new')}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            <Plus className="w-4 h-4" />
            Summon Match
          </button>
        </div>

        <EntityTable
          data={matches}
          columns={columns}
          loading={loading}
          onView={(match) => router.push(`/apps/cursed-arena/matches/${match.$id}`)}
          onEdit={(match) => router.push(`/apps/cursed-arena/matches/${match.$id}/edit`)}
          onDelete={async (match) => {
            if (confirm('Banish this match?')) {
              await loadMatches();
            }
          }}
          emptyMessage="No matches found. Summon your first match!"
        />
      </div>
    </div>
  );
}

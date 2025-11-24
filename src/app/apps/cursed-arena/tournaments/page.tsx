/**
 * Tournaments List Page
 * 
 * Displays all tournaments with filtering, sorting, and CRUD actions.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Tournament } from '@/types/cursed-arena/entities';
import { fetchTournaments } from '@/lib/cursed-arena/api';
import { Plus } from 'lucide-react';

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const data = await fetchTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Tournament>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'game',
      label: 'Game',
      sortable: true,
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
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
    {
      key: 'prizePool',
      label: 'Prize Pool',
      sortable: true,
      render: (value) => (value ? `$${value.toLocaleString()}` : 'TBD'),
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              🏆 Tournaments
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Manage competitive gaming events
            </p>
          </div>
          <button
            onClick={() => router.push('/tournaments/new')}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            <Plus className="w-4 h-4" />
            Summon Tournament
          </button>
        </div>

        {/* Table */}
        <EntityTable
          data={tournaments}
          columns={columns}
          loading={loading}
          onView={(tournament) => router.push(`/tournaments/${tournament.$id}`)}
          onEdit={(tournament) => router.push(`/tournaments/${tournament.$id}/edit`)}
          onDelete={async (tournament) => {
            if (confirm(`Banish ${tournament.name}?`)) {
              // TODO: Implement delete
              await loadTournaments();
            }
          }}
          emptyMessage="No tournaments found. Summon your first tournament!"
        />
      </div>
    </div>
  );
}

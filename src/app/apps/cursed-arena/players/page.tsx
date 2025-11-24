/**
 * Players List Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Player } from '@/types/cursed-arena/entities';
import { fetchPlayers } from '@/lib/cursed-arena/api';
import { Plus } from 'lucide-react';

export default function PlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const data = await fetchPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Failed to load players:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Player>[] = [
    {
      key: 'gamertag',
      label: 'Gamertag',
      sortable: true,
      render: (value) => (
        <span className="font-bold" style={{ color: 'var(--color-accent-primary)' }}>
          {value}
        </span>
      ),
    },
    {
      key: 'realName',
      label: 'Real Name',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              🎮 Players
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Manage individual competitors
            </p>
          </div>
          <button
            onClick={() => router.push('/players/new')}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            <Plus className="w-4 h-4" />
            Summon Player
          </button>
        </div>

        <EntityTable
          data={players}
          columns={columns}
          loading={loading}
          onEdit={(player) => router.push(`/players/${player.$id}/edit`)}
          onDelete={async (player) => {
            if (confirm(`Banish ${player.gamertag}?`)) {
              await loadPlayers();
            }
          }}
          emptyMessage="No players found. Summon your first player!"
        />
      </div>
    </div>
  );
}

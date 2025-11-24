/**
 * Teams List Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Team } from '@/types/cursed-arena/entities';
import { fetchTeams } from '@/lib/cursed-arena/api';
import { Plus } from 'lucide-react';

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const data = await fetchTeams();
      setTeams(data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Team>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'tag',
      label: 'Tag',
      sortable: true,
      render: (value) => (
        <span className="font-mono font-bold" style={{ color: 'var(--color-accent-primary)' }}>
          {value}
        </span>
      ),
    },
    {
      key: 'region',
      label: 'Region',
      sortable: true,
    },
    {
      key: 'membersCount',
      label: 'Members',
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              ⚔️ Teams
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Manage esports organizations
            </p>
          </div>
          <button
            onClick={() => router.push('/teams/new')}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            <Plus className="w-4 h-4" />
            Summon Team
          </button>
        </div>

        <EntityTable
          data={teams}
          columns={columns}
          loading={loading}
          onView={(team) => router.push(`/teams/${team.$id}`)}
          onEdit={(team) => router.push(`/teams/${team.$id}/edit`)}
          onDelete={async (team) => {
            if (confirm(`Banish ${team.name}?`)) {
              await loadTeams();
            }
          }}
          emptyMessage="No teams found. Summon your first team!"
        />
      </div>
    </div>
  );
}

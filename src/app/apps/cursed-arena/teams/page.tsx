'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Team } from '@/types/cursed-arena/entities';
import { fetchTeams, deleteTeam } from '@/lib/cursed-arena/api';
import { PageHeader, GlowCard } from '@/components/shared';

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tag?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Team>[] = [
    {
      key: 'name',
      label: 'Team',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'var(--color-accent-primary)',
            }}
          >
            {row.tag?.substring(0, 2) || value.substring(0, 2)}
          </div>
          <div>
            <span style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{value}</span>
            {row.tag && (
              <div style={{ fontSize: '12px', color: 'var(--color-accent-primary)', fontFamily: 'monospace' }}>
                [{row.tag}]
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'region',
      label: 'Region',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>{value || '—'}</span>
      ),
    },
    {
      key: 'membersCount',
      label: 'Members',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>{value || 0} players</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Teams"
        subtitle="Manage esports organizations"
        icon="⚔️"
        count={filteredTeams.length}
        actions={
          <Link
            href="/apps/cursed-arena/teams/new"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 0 20px var(--color-accent-glow)',
            }}
          >
            <span>➕</span>
            Summon Team
          </Link>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-primary)',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      {!loading && filteredTeams.length === 0 ? (
        <GlowCard hover={false} glow={false}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚔️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              {search ? 'No teams found' : 'No teams yet'}
            </h3>
            <p style={{ color: 'var(--color-text-tertiary)', marginBottom: '24px' }}>
              {search ? 'Try a different search term' : 'Summon your first team to get started!'}
            </p>
            {!search && (
              <Link
                href="/apps/cursed-arena/teams/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'var(--color-bg-primary)',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                ➕ Summon Team
              </Link>
            )}
          </div>
        </GlowCard>
      ) : (
        <EntityTable
          data={filteredTeams}
          columns={columns}
          loading={loading}
          onView={(team) => router.push(`/apps/cursed-arena/teams/${team.$id}`)}
          onEdit={(team) => router.push(`/apps/cursed-arena/teams/${team.$id}/edit`)}
          onDelete={async (team) => {
            if (confirm(`Banish ${team.name}?`)) {
              try {
                await deleteTeam(team.$id);
                await loadTeams();
              } catch (error) {
                console.error('Failed to delete team:', error);
                alert('Failed to delete team');
              }
            }
          }}
          emptyMessage="No teams found"
        />
      )}
    </div>
  );
}

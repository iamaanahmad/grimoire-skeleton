'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Player } from '@/types/cursed-arena/entities';
import { fetchPlayers, deletePlayer } from '@/lib/cursed-arena/api';
import { PageHeader, GlowCard } from '@/components/shared';

export default function PlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredPlayers = players.filter((p) =>
    p.gamertag.toLowerCase().includes(search.toLowerCase()) ||
    p.realName?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Player>[] = [
    {
      key: 'gamertag',
      label: 'Player',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            🎮
          </div>
          <div>
            <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{value}</span>
            {row.realName && (
              <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                {row.realName}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {value || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>{value || '—'}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Players"
        subtitle="Manage individual competitors"
        icon="🎮"
        count={filteredPlayers.length}
        actions={
          <Link
            href="/apps/cursed-arena/players/new"
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
            Summon Player
          </Link>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search players..."
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

      {!loading && filteredPlayers.length === 0 ? (
        <GlowCard hover={false} glow={false}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎮</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              {search ? 'No players found' : 'No players yet'}
            </h3>
            <p style={{ color: 'var(--color-text-tertiary)', marginBottom: '24px' }}>
              {search ? 'Try a different search term' : 'Summon your first player to get started!'}
            </p>
            {!search && (
              <Link
                href="/apps/cursed-arena/players/new"
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
                ➕ Summon Player
              </Link>
            )}
          </div>
        </GlowCard>
      ) : (
        <EntityTable
          data={filteredPlayers}
          columns={columns}
          loading={loading}
          onView={(player) => router.push(`/apps/cursed-arena/players/${player.$id}`)}
          onEdit={(player) => router.push(`/apps/cursed-arena/players/${player.$id}/edit`)}
          onDelete={async (player) => {
            if (confirm(`Banish ${player.gamertag}?`)) {
              try {
                await deletePlayer(player.$id);
                await loadPlayers();
              } catch (error) {
                console.error('Failed to delete player:', error);
                alert('Failed to delete player');
              }
            }
          }}
          emptyMessage="No players found"
        />
      )}
    </div>
  );
}

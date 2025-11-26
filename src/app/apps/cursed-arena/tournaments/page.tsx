'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Tournament } from '@/types/cursed-arena/entities';
import { fetchTournaments, deleteTournament } from '@/lib/cursed-arena/api';
import { PageHeader, StatusBadge, GlowCard } from '@/components/shared';

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.game.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Tournament>[] = [
    {
      key: 'name',
      label: 'Tournament',
      sortable: true,
      render: (value, row) => (
        <div>
          <span style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{value}</span>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
            🎮 {row.game}
          </div>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} variant="tournament" />,
    },
    {
      key: 'prizePool',
      label: 'Prize Pool',
      sortable: true,
      render: (value) => (
        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
          {value ? `$${value.toLocaleString()}` : '—'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tournaments"
        subtitle="Manage competitive gaming events"
        icon="🏆"
        count={filteredTournaments.length}
        actions={
          <Link
            href="/apps/cursed-arena/tournaments/new"
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
              transition: 'all 0.2s',
            }}
          >
            <span>➕</span>
            Summon Tournament
          </Link>
        }
      />

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search tournaments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-primary)',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-primary)'}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-primary)',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table or Empty State */}
      {!loading && filteredTournaments.length === 0 ? (
        <GlowCard hover={false} glow={false}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              {search || statusFilter !== 'all' ? 'No tournaments found' : 'No tournaments yet'}
            </h3>
            <p style={{ color: 'var(--color-text-tertiary)', marginBottom: '24px' }}>
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Summon your first tournament to get started!'}
            </p>
            {!search && statusFilter === 'all' && (
              <Link
                href="/apps/cursed-arena/tournaments/new"
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
                ➕ Summon Tournament
              </Link>
            )}
          </div>
        </GlowCard>
      ) : (
        <EntityTable
          data={filteredTournaments}
          columns={columns}
          loading={loading}
          onView={(tournament) => router.push(`/apps/cursed-arena/tournaments/${tournament.$id}`)}
          onEdit={(tournament) => router.push(`/apps/cursed-arena/tournaments/${tournament.$id}/edit`)}
          onDelete={async (tournament) => {
            if (confirm(`Banish ${tournament.name}?`)) {
              try {
                await deleteTournament(tournament.$id);
                await loadTournaments();
              } catch (error) {
                console.error('Failed to delete tournament:', error);
                alert('Failed to delete tournament');
              }
            }
          }}
          emptyMessage="No tournaments found"
        />
      )}
    </div>
  );
}

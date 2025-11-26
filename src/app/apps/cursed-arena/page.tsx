'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchTournaments, fetchMatches, countTournaments, countTeams, countPlayers } from '@/lib/cursed-arena/api';
import { Tournament, Match } from '@/types/cursed-arena/entities';
import { AnimatedCounter, GlowCard, StatusBadge, PageHeader } from '@/components/shared';

export default function CursedArenaDashboard() {
  const router = useRouter();
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState({ totalTournaments: 0, totalTeams: 0, totalPlayers: 0 });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [tournaments, matches, tournamentCount, teamCount, playerCount] = await Promise.all([
          fetchTournaments({ status: 'upcoming', limit: 6 }),
          fetchMatches({ status: 'live' }),
          countTournaments(),
          countTeams(),
          countPlayers(),
        ]);
        setUpcomingTournaments(tournaments);
        setLiveMatches(matches);
        setStats({ totalTournaments: tournamentCount, totalTeams: teamCount, totalPlayers: playerCount });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCountdown = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    if (diff <= 0) return 'Starting soon';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{ 
              fontSize: '64px', 
              marginBottom: '24px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            ⚔️
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>
            Summoning arena data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Cursed Arena"
        subtitle="Esports tournament management platform"
        icon="⚔️"
      />

      {/* Stats Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}
      >
        {[
          { icon: '🏆', label: 'Tournaments', value: stats.totalTournaments, link: '/apps/cursed-arena/tournaments', color: '#fbbf24' },
          { icon: '⚔️', label: 'Teams', value: stats.totalTeams, link: '/apps/cursed-arena/teams', color: '#60a5fa' },
          { icon: '🎮', label: 'Players', value: stats.totalPlayers, link: '/apps/cursed-arena/players', color: '#a78bfa' },
        ].map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.link}
            style={{
              textDecoration: 'none',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.4s ease ${i * 0.1}s`,
            }}
          >
            <GlowCard variant="accent" hover glow>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div 
                  style={{ 
                    fontSize: '48px',
                    filter: `drop-shadow(0 0 10px ${stat.color})`,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '42px',
                      fontWeight: 'bold',
                      color: 'var(--color-accent-primary)',
                      textShadow: '0 0 20px var(--color-accent-glow)',
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedCounter value={stat.value} duration={1200} />
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--color-text-primary)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span 
              style={{ 
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 10px #22c55e',
                animation: 'pulse 1s infinite',
              }}
            />
            Live Matches
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {liveMatches.map((match) => (
              <GlowCard key={match.$id} variant="success" glow>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <StatusBadge status="LIVE" variant="match" pulse />
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}>{match.round}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Team A</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                      {match.scoreA}
                    </div>
                  </div>
                  <div 
                    style={{ 
                      fontSize: '24px', 
                      color: 'var(--color-text-tertiary)',
                      padding: '0 16px',
                    }}
                  >
                    VS
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Team B</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                      {match.scoreB}
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tournaments */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            🏆 Upcoming Tournaments
          </h2>
          <Link
            href="/apps/cursed-arena/tournaments"
            style={{
              color: 'var(--color-accent-primary)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            View all →
          </Link>
        </div>
        {upcomingTournaments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {upcomingTournaments.map((tournament, i) => (
              <div
                key={tournament.$id}
                onClick={() => router.push(`/apps/cursed-arena/tournaments/${tournament.$id}`)}
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 50%, transparent)',
                  border: '1px solid var(--color-border-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${0.3 + i * 0.05}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px var(--color-accent-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <StatusBadge status={tournament.status} variant="tournament" />
                  {tournament.prizePool && (
                    <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '16px' }}>
                      ${tournament.prizePool.toLocaleString()}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  {tournament.name}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                  🎮 {tournament.game}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}>
                    📅 {new Date(tournament.startDate).toLocaleDateString()}
                  </span>
                  <span 
                    style={{ 
                      padding: '4px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
                      color: 'var(--color-accent-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    ⏱️ {getCountdown(tournament.startDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <GlowCard hover={false} glow={false}>
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: '16px', marginBottom: '16px' }}>
                No upcoming tournaments
              </p>
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
                  fontSize: '14px',
                }}
              >
                Summon Tournament
              </Link>
            </div>
          </GlowCard>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { href: '/apps/cursed-arena/tournaments/new', icon: '🏆', label: 'Summon Tournament', primary: true },
          { href: '/apps/cursed-arena/teams/new', icon: '⚔️', label: 'Summon Team', primary: false },
          { href: '/apps/cursed-arena/players/new', icon: '🎮', label: 'Summon Player', primary: false },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              transition: 'all 0.2s',
              backgroundColor: action.primary ? 'var(--color-accent-primary)' : 'var(--color-bg-tertiary)',
              color: action.primary ? 'var(--color-bg-primary)' : 'var(--color-text-primary)',
              border: action.primary ? 'none' : '1px solid var(--color-border-primary)',
              boxShadow: action.primary ? '0 0 20px var(--color-accent-glow)' : 'none',
            }}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

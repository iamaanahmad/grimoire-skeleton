'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Player, Team } from '@/types/cursed-arena/entities';
import { fetchPlayers, fetchTeam } from '@/lib/cursed-arena/api';
import { ArrowLeft, Edit, Trash2, User, Flag, Users } from 'lucide-react';

export default function PlayerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const players = await fetchPlayers();
        const p = players.find((x) => x.$id === id);
        setPlayer(p || null);
        if (p?.team) {
          const t = await fetchTeam(p.team);
          setTeam(t);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] py-8 px-4">
        <div className="max-w-3xl mx-auto animate-pulse space-y-6">
          <div className="h-10 w-24 bg-[#1a1a2e] rounded-lg" />
          <div className="h-64 bg-[#12121a] rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👻</div>
          <h2 className="text-2xl font-bold text-white mb-2">Player Not Found</h2>
          <button
            onClick={() => router.push('/apps/cursed-arena/players')}
            className="mt-4 px-6 py-3 bg-[#00ff88] text-[#0a0a0f] rounded-lg font-bold"
          >
            Back to Players
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/apps/cursed-arena/players')}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 
                       bg-[#12121a] border border-[#2d2d44] rounded-lg
                       hover:text-white hover:border-[#3d3d54] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/apps/cursed-arena/players/${id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a0a0f] rounded-lg font-semibold hover:bg-[#00cc6a] transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => confirm('Banish this player?') && router.push('/apps/cursed-arena/players')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Banish
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#12121a] border border-[#2d2d44] rounded-2xl p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#2d2d44]">
            <div className="w-20 h-20 bg-[#1a1a2e] border-2 border-[#00ff88] rounded-full flex items-center justify-center text-4xl">
              🎮
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#00ff88]">{player.gamertag}</h1>
              {player.realName && <p className="text-xl text-gray-400">{player.realName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {player.role && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#1a1a2e] rounded-lg">
                  <User className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Role</p>
                  <p className="text-white font-medium">{player.role}</p>
                </div>
              </div>
            )}
            {player.country && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#1a1a2e] rounded-lg">
                  <Flag className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Country</p>
                  <p className="text-white font-medium">{player.country}</p>
                </div>
              </div>
            )}
            {team && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#1a1a2e] rounded-lg">
                  <Users className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Team</p>
                  <button
                    onClick={() => router.push(`/apps/cursed-arena/teams/${team.$id}`)}
                    className="text-[#00ff88] font-medium hover:underline"
                  >
                    {team.name} [{team.tag}]
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

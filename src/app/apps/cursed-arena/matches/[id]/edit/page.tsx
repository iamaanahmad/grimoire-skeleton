'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { match } from '@/config/cursed-arena/entities';
import { fetchMatches } from '@/lib/cursed-arena/api';
import { Match } from '@/types/cursed-arena/entities';
import { ArrowLeft } from 'lucide-react';

export default function EditMatchPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches().then((matches) => setData(matches.find((m) => m.$id === id) || null)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values: any) => {
    router.push(`/apps/cursed-arena/matches/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="animate-pulse text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4" style={{ backgroundColor: '#1a1a2e' }} />
          <div className="h-8 w-48 rounded mx-auto mb-2" style={{ backgroundColor: '#1a1a2e' }} />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">👻</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>Match Not Found</h2>
          <button
            onClick={() => router.push('/apps/cursed-arena/matches')}
            className="mt-4 px-6 py-3 rounded-xl font-bold"
            style={{ backgroundColor: '#00ff88', color: '#0a0a0f' }}
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="w-full px-6 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-lg transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: '#1a1a2e', color: '#a0a0b0', border: '1px solid #2d2d44' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full"
            style={{ backgroundColor: '#1a1a2e', border: '3px solid #00ff88', boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)' }}
          >
            <span className="text-4xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#ffffff' }}>Edit Match</h1>
          <p className="text-lg" style={{ color: '#808090' }}>Update match details</p>
        </div>

        <EntityForm entityDef={match} initialValues={data} onSubmit={handleSubmit} mode="edit" />
      </div>
    </div>
  );
}

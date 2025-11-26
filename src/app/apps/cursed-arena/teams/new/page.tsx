'use client';

import { useRouter } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { team } from '@/config/cursed-arena/entities';
import { createTeam } from '@/lib/cursed-arena/api';
import { ArrowLeft } from 'lucide-react';

export default function NewTeamPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await createTeam(values);
    router.push('/apps/cursed-arena/teams');
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="w-full px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: '#1a1a2e',
            color: '#a0a0b0',
            border: '1px solid #2d2d44',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full"
            style={{
              backgroundColor: '#1a1a2e',
              border: '3px solid #00ff88',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
            }}
          >
            <span className="text-4xl">⚔️</span>
          </div>
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: '#ffffff' }}
          >
            Summon Team
          </h1>
          <p
            className="text-lg"
            style={{ color: '#808090' }}
          >
            Create a new esports organization to compete in tournaments
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full">
          <EntityForm entityDef={team} onSubmit={handleSubmit} mode="create" />
        </div>
      </div>
    </div>
  );
}

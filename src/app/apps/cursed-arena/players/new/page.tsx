'use client';

import { useRouter } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { player } from '@/config/cursed-arena/entities';
import { createPlayer } from '@/lib/cursed-arena/api';
import { ArrowLeft } from 'lucide-react';

export default function NewPlayerPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await createPlayer(values);
    router.push('/apps/cursed-arena/players');
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-3 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            padding: '12px 20px',
            marginBottom: '32px',
            backgroundColor: '#1a1a2e',
            color: '#00ff88',
            border: '1px solid #00ff88',
            boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)',
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontWeight: '600' }}>Back</span>
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: '80px',
              height: '80px',
              marginBottom: '24px',
              backgroundColor: '#1a1a2e',
              border: '3px solid #00ff88',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
            }}
          >
            <span style={{ fontSize: '36px' }}>🎮</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px', color: '#ffffff' }}>
            Summon Player
          </h1>
          <p style={{ fontSize: '16px', color: '#808090' }}>Add a new competitor to the arena</p>
        </div>

        {/* Form Container */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <EntityForm entityDef={player} onSubmit={handleSubmit} mode="create" />
        </div>
      </div>
    </div>
  );
}

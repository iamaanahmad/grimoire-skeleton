/**
 * Create Player Page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { player } from '@/config/cursed-arena/entities';
import { createPlayer } from '@/lib/cursed-arena/api';

export default function NewPlayerPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await createPlayer(values);
    router.push('/players');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Summon Player
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Add a new competitor to the arena
          </p>
        </div>

        <EntityForm entityDef={player} onSubmit={handleSubmit} mode="create" />
      </div>
    </div>
  );
}

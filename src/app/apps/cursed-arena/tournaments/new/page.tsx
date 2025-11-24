/**
 * Create Tournament Page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { tournament } from '@/config/cursed-arena/entities';
import { createTournament } from '@/lib/cursed-arena/api';

export default function NewTournamentPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await createTournament(values);
    router.push('/tournaments');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Summon Tournament
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Create a new competitive gaming event
          </p>
        </div>

        <EntityForm
          entityDef={tournament}
          onSubmit={handleSubmit}
          mode="create"
        />
      </div>
    </div>
  );
}

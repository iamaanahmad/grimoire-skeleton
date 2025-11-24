/**
 * Create Match Page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { match } from '@/config/cursed-arena/entities';
import { createMatch } from '@/lib/cursed-arena/api';

export default function NewMatchPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await createMatch(values);
    router.push('/matches');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Summon Match
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Schedule a new competition
          </p>
        </div>

        <EntityForm entityDef={match} onSubmit={handleSubmit} mode="create" />
      </div>
    </div>
  );
}

/**
 * Create Team Page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { team } from '@/config/cursed-arena/entities';
import { createTeam } from '@/lib/cursed-arena/api';

export default function NewTeamPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    await createTeam(values);
    router.push('/teams');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Summon Team
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Create a new esports organization
          </p>
        </div>

        <EntityForm entityDef={team} onSubmit={handleSubmit} mode="create" />
      </div>
    </div>
  );
}

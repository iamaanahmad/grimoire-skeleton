/**
 * Create Doctor Page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { doctor } from '@/config/haunted-clinic/entities';
import { createDoctor } from '@/lib/haunted-clinic/api';

export default function NewDoctorPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      await createDoctor(values);
      router.push('/doctors');
    } catch (error) {
      console.error('Failed to create doctor:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Add Doctor
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Register a new medical professional
          </p>
        </div>

        <EntityForm entityDef={doctor} onSubmit={handleSubmit} mode="create" />
      </div>
    </div>
  );
}

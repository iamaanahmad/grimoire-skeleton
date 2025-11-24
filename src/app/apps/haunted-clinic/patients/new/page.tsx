/**
 * Create Patient Page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { patient } from '@/config/haunted-clinic/entities';
import { createPatient } from '@/lib/haunted-clinic/api';

export default function NewPatientPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      await createPatient(values);
      router.push('/patients');
    } catch (error) {
      console.error('Failed to create patient:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Add Patient
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Register a new patient (synthetic data only)
          </p>
        </div>

        <EntityForm entityDef={patient} onSubmit={handleSubmit} mode="create" />
      </div>
    </div>
  );
}

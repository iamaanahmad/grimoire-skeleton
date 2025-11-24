/**
 * Edit Patient Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { patient as patientDef } from '@/config/haunted-clinic/entities';
import { fetchPatient, updatePatient } from '@/lib/haunted-clinic/api';
import { Patient } from '@/types/haunted-clinic/entities';

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    setLoading(true);
    try {
      const data = await fetchPatient(id);
      setPatient(data);
    } catch (error) {
      console.error('Failed to load patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await updatePatient(id, values);
      router.push(`/patients/${id}`);
    } catch (error) {
      console.error('Failed to update patient:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Patient not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Edit Patient
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Update patient information
          </p>
        </div>

        <EntityForm
          entityDef={patientDef}
          onSubmit={handleSubmit}
          mode="edit"
          initialValues={patient}
        />
      </div>
    </div>
  );
}

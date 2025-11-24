/**
 * Edit Doctor Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { doctor as doctorDef } from '@/config/haunted-clinic/entities';
import { fetchDoctor, updateDoctor } from '@/lib/haunted-clinic/api';
import { Doctor } from '@/types/haunted-clinic/entities';

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
  }, [id]);

  const loadDoctor = async () => {
    setLoading(true);
    try {
      const data = await fetchDoctor(id);
      setDoctor(data);
    } catch (error) {
      console.error('Failed to load doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await updateDoctor(id, values);
      router.push(`/doctors/${id}`);
    } catch (error) {
      console.error('Failed to update doctor:', error);
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

  if (!doctor) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Doctor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Edit Doctor
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Update doctor information
          </p>
        </div>

        <EntityForm
          entityDef={doctorDef}
          onSubmit={handleSubmit}
          mode="edit"
          initialValues={doctor}
        />
      </div>
    </div>
  );
}

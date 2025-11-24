/**
 * Edit Appointment Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { appointment as appointmentDef } from '@/config/haunted-clinic/entities';
import { fetchAppointment, updateAppointment } from '@/lib/haunted-clinic/api';
import { Appointment } from '@/types/haunted-clinic/entities';

export default function EditAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointment(id);
      setAppointment(data);
    } catch (error) {
      console.error('Failed to load appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await updateAppointment(id, values);
      router.push(`/appointments/${id}`);
    } catch (error) {
      console.error('Failed to update appointment:', error);
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

  if (!appointment) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Appointment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Edit Appointment
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Update appointment details
          </p>
        </div>

        <EntityForm
          entityDef={appointmentDef}
          onSubmit={handleSubmit}
          mode="edit"
          initialValues={appointment}
        />
      </div>
    </div>
  );
}

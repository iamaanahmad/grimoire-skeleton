/**
 * Create Appointment Page
 * 
 * Uses the multi-step booking flow for a guided appointment creation experience.
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AppointmentBooking from '@/components/haunted-clinic/AppointmentBooking';

export default function NewAppointmentPage() {
  const router = useRouter();

  const handleComplete = (appointmentId: string) => {
    // Redirect to the appointment detail page
    router.push(`/appointments/${appointmentId}`);
  };

  const handleCancel = () => {
    // Go back to appointments list
    router.push('/appointments');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Book Appointment
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Follow the steps below to schedule a new patient appointment
          </p>
        </div>

        <AppointmentBooking onComplete={handleComplete} onCancel={handleCancel} />
      </div>
    </div>
  );
}

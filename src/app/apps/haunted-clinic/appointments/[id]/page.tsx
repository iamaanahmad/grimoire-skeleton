/**
 * Appointment Detail Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Appointment, Doctor, Patient } from '@/types/haunted-clinic/entities';
import { fetchAppointment, deleteAppointment, fetchDoctor, fetchPatient, updateAppointment } from '@/lib/haunted-clinic/api';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import AppointmentStatusManager from '@/components/haunted-clinic/AppointmentStatusManager';

export default function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    setLoading(true);
    try {
      const appointmentData = await fetchAppointment(id);
      setAppointment(appointmentData);

      // Load related doctor and patient
      const [doctorData, patientData] = await Promise.all([
        fetchDoctor(appointmentData.doctorId),
        fetchPatient(appointmentData.patientId),
      ]);
      setDoctor(doctorData);
      setPatient(patientData);
    } catch (error) {
      console.error('Failed to load appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Cancel this appointment?')) {
      try {
        await deleteAppointment(id);
        router.push('/apps/haunted-clinic/appointments');
      } catch (error) {
        console.error('Failed to delete appointment:', error);
        alert('Failed to delete appointment');
      }
    }
  };

  /**
   * Handle status change with optimistic update
   */
  const handleStatusChange = async (newStatus: Appointment['status']) => {
    if (!appointment) return;

    // Optimistic update
    const previousStatus = appointment.status;
    setAppointment({ ...appointment, status: newStatus });

    try {
      // Update on server
      const updatedAppointment = await updateAppointment(id, { status: newStatus });
      setAppointment(updatedAppointment);

      // Show success toast
      showToast('Status updated successfully', 'success');
    } catch (error) {
      // Revert on error
      setAppointment({ ...appointment, status: previousStatus });
      showToast(error instanceof Error ? error.message : 'Failed to update status', 'error');
      throw error; // Re-throw to let the component handle it
    }
  };

  /**
   * Show toast notification
   */
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/apps/haunted-clinic/appointments')}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Appointments
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/apps/haunted-clinic/appointments/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent-primary)',
                color: 'var(--color-bg-primary)',
              }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-90"
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
              }}
            >
              <Trash2 className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>

        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              📅 Appointment Details
            </h1>
            <AppointmentStatusManager
              appointment={appointment}
              onStatusChange={handleStatusChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Patient
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{patient?.name || 'Unknown'}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Doctor
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{doctor?.name || 'Unknown'}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Date
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>
                {new Date(appointment.date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Time
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{appointment.time}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Duration
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>
                {appointment.duration || 30} minutes
              </p>
            </div>

            {appointment.reason && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Reason for Visit
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>{appointment.reason}</p>
              </div>
            )}

            {appointment.notes && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Notes
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className="fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg border animate-slide-up z-50"
            style={{
              backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              borderColor: toast.type === 'success' ? '#059669' : '#dc2626',
            }}
            role="alert"
          >
            <div className="flex items-center gap-2">
              <span>{toast.type === 'success' ? '✓' : '✖'}</span>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Appointment Detail Page
 */

'use client';

import { useState, useEffect } from 'react';
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
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', padding: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', padding: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Appointment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', padding: '24px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header with Back Button and Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <button
            onClick={() => router.push('/apps/haunted-clinic/appointments')}
            className="inline-flex items-center gap-3 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              padding: '12px 20px',
              backgroundColor: '#1a1a2e',
              color: '#00ff88',
              border: '1px solid #00ff88',
              boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontWeight: '600' }}>Back</span>
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push(`/apps/haunted-clinic/appointments/${id}/edit`)}
              className="inline-flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--color-accent-primary)',
                color: 'var(--color-bg-primary)',
                fontWeight: '600',
              }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                padding: '12px 24px',
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: '600',
              }}
            >
              <Trash2 className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div
          style={{
            padding: '32px',
            borderRadius: '20px',
            backgroundColor: '#12121a',
            border: '1px solid #2d2d44',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              📅 Appointment Details
            </h1>
            <AppointmentStatusManager
              appointment={appointment}
              onStatusChange={handleStatusChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid #2d2d44' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Patient
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontSize: '16px', fontWeight: '500' }}>{patient?.name || 'Unknown'}</p>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid #2d2d44' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Doctor
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontSize: '16px', fontWeight: '500' }}>Dr. {doctor?.name || 'Unknown'}</p>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid #2d2d44' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Date
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontSize: '16px', fontWeight: '500' }}>
                {new Date(appointment.date).toLocaleDateString()}
              </p>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid #2d2d44' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Time
              </h3>
              <p style={{ color: '#00ff88', fontSize: '16px', fontWeight: '600' }}>{appointment.time}</p>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid #2d2d44' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Duration
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontSize: '16px', fontWeight: '500' }}>
                {appointment.duration || 30} minutes
              </p>
            </div>

            {appointment.reason && (
              <div style={{ padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid #2d2d44', gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reason for Visit
                </h3>
                <p style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>{appointment.reason}</p>
              </div>
            )}

            {appointment.notes && (
              <div style={{ padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid #2d2d44', gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Notes
                </h3>
                <p style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>{appointment.notes}</p>
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

/**
 * Appointment Details Modal
 * Displays full appointment information in a modal dialog
 */

'use client';

import React, { useEffect } from 'react';
import { AppointmentWithPatient } from '@/types/haunted-clinic/entities';
import { X } from 'lucide-react';

interface AppointmentDetailsModalProps {
  appointment: AppointmentWithPatient | null;
  onClose: () => void;
}

export default function AppointmentDetailsModal({
  appointment,
  onClose,
}: AppointmentDetailsModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (appointment) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [appointment, onClose]);

  if (!appointment) return null;

  // Get status color
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'scheduled':
        return '#6b7280';
      case 'confirmed':
        return '#3b82f6';
      case 'in-progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      case 'no-show':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-lg shadow-xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2
            id="modal-title"
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            📅 Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize"
              style={{
                backgroundColor: getStatusColor(appointment.status),
                color: 'white',
              }}
            >
              {appointment.status || 'scheduled'}
            </span>
          </div>

          {/* Patient Information */}
          <div>
            <h3
              className="text-sm font-semibold mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Patient
            </h3>
            <div
              className="p-4 rounded"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {appointment.patient?.name || 'Unknown Patient'}
              </p>
              {appointment.patient?.phone && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  📞 {appointment.patient.phone}
                </p>
              )}
              {appointment.patient?.email && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  ✉️ {appointment.patient.email}
                </p>
              )}
            </div>
          </div>

          {/* Doctor Information */}
          <div>
            <h3
              className="text-sm font-semibold mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Doctor
            </h3>
            <div
              className="p-4 rounded"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {appointment.doctor?.name || 'Unknown Doctor'}
              </p>
              {appointment.doctor?.speciality && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {appointment.doctor.speciality}
                </p>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Date
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>
                {formatDate(appointment.date)}
              </p>
            </div>
            <div>
              <h3
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Time
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>
                {appointment.time} ({appointment.duration || 30} minutes)
              </p>
            </div>
          </div>

          {/* Reason */}
          {appointment.reason && (
            <div>
              <h3
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Reason for Visit
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{appointment.reason}</p>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h3
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Notes
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{appointment.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 p-6 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 rounded transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

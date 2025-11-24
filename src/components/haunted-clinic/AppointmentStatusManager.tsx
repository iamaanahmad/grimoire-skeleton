'use client';

import { useState } from 'react';
import { Appointment } from '@/types/haunted-clinic/entities';

type AppointmentStatus = NonNullable<Appointment['status']>;

/**
 * Status transition rules based on design document
 * - scheduled → confirmed, cancelled
 * - confirmed → in-progress, cancelled, no-show
 * - in-progress → completed
 * - completed → (no transitions)
 * - cancelled → (no transitions)
 * - no-show → (no transitions)
 */
const STATUS_TRANSITIONS: Record<AppointmentStatus, Array<AppointmentStatus>> = {
  scheduled: ['confirmed', 'cancelled'],
  confirmed: ['in-progress', 'cancelled', 'no-show'],
  'in-progress': ['completed'],
  completed: [],
  cancelled: [],
  'no-show': [],
};

/**
 * Status display configuration
 */
const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; color: string; icon: string }
> = {
  scheduled: {
    label: 'Scheduled',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: '📅',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-500/20 text-green-300 border-green-500/30',
    icon: '✓',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    icon: '⏳',
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    icon: '✔',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: '✖',
  },
  'no-show': {
    label: 'No Show',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: '⚠',
  },
};

interface AppointmentStatusManagerProps {
  appointment: Appointment;
  onStatusChange: (newStatus: Appointment['status']) => Promise<void>;
}

/**
 * AppointmentStatusManager Component
 *
 * Manages appointment status transitions with validation and confirmation dialogs.
 * Displays current status as a badge and provides dropdown for available transitions.
 *
 * @param appointment - The appointment to manage
 * @param onStatusChange - Callback when status changes
 */
export default function AppointmentStatusManager({
  appointment,
  onStatusChange,
}: AppointmentStatusManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AppointmentStatus | null>(null);
  const [confirmationReason, setConfirmationReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentStatus: AppointmentStatus = appointment.status || 'scheduled';
  const availableTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  const statusConfig = STATUS_CONFIG[currentStatus];

  /**
   * Check if a status change requires confirmation
   */
  const requiresConfirmation = (status: AppointmentStatus): boolean => {
    return status === 'cancelled' || status === 'no-show';
  };

  /**
   * Handle status selection from dropdown
   */
  const handleStatusSelect = (newStatus: AppointmentStatus) => {
    setIsOpen(false);
    setError(null);

    if (requiresConfirmation(newStatus)) {
      setPendingStatus(newStatus);
      setShowConfirmation(true);
    } else {
      handleStatusUpdate(newStatus);
    }
  };

  /**
   * Handle the actual status update
   */
  const handleStatusUpdate = async (newStatus: AppointmentStatus) => {
    setLoading(true);
    setError(null);

    try {
      await onStatusChange(newStatus);
      setShowConfirmation(false);
      setPendingStatus(null);
      setConfirmationReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle confirmation dialog submit
   */
  const handleConfirmationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingStatus) {
      handleStatusUpdate(pendingStatus);
    }
  };

  /**
   * Handle confirmation dialog cancel
   */
  const handleConfirmationCancel = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
    setConfirmationReason('');
    setError(null);
  };

  /**
   * Handle keyboard events for confirmation dialog
   */
  const handleConfirmationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleConfirmationCancel();
    }
  };

  return (
    <div className="relative">
      {/* Current Status Badge */}
      <button
        onClick={() => availableTransitions.length > 0 && setIsOpen(!isOpen)}
        disabled={loading || availableTransitions.length === 0}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border
          text-sm font-medium transition-all
          ${statusConfig.color}
          ${
            availableTransitions.length > 0
              ? 'cursor-pointer hover:opacity-80'
              : 'cursor-default'
          }
          ${loading ? 'opacity-50 cursor-wait' : ''}
          ${currentStatus === 'in-progress' ? 'animate-pulse' : ''}
        `}
        aria-label={`Current status: ${statusConfig.label}. ${
          availableTransitions.length > 0 ? 'Click to change status' : 'No status changes available'
        }`}
      >
        <span aria-hidden="true">{statusConfig.icon}</span>
        <span>{statusConfig.label}</span>
        {availableTransitions.length > 0 && (
          <span className="text-xs" aria-hidden="true">
            ▼
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && availableTransitions.length > 0 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div
            className="absolute top-full left-0 mt-2 w-48 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg shadow-lg z-20"
            role="menu"
            aria-label="Status options"
          >
            {availableTransitions.map((status) => {
              const config = STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors first:rounded-t-lg last:rounded-b-lg"
                  role="menuitem"
                >
                  <span aria-hidden="true">{config.icon}</span>
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && pendingStatus && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onKeyDown={handleConfirmationKeyDown}
        >
          <div
            className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg p-6 max-w-md w-full"
            role="dialog"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-description"
          >
            <h3
              id="confirmation-title"
              className="text-lg font-semibold text-[var(--text-primary)] mb-2"
            >
              Confirm Status Change
            </h3>
            <p
              id="confirmation-description"
              className="text-sm text-[var(--text-secondary)] mb-4"
            >
              Are you sure you want to change the status to{' '}
              <strong>{STATUS_CONFIG[pendingStatus].label}</strong>?
            </p>

            <form onSubmit={handleConfirmationSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="confirmation-reason"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                >
                  Reason (optional)
                </label>
                <textarea
                  id="confirmation-reason"
                  value={confirmationReason}
                  onChange={(e) => setConfirmationReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  rows={3}
                  placeholder="Enter reason for status change..."
                  disabled={loading}
                />
              </div>

              {error && (
                <div
                  className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleConfirmationCancel}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-wait"
                >
                  {loading ? 'Updating...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

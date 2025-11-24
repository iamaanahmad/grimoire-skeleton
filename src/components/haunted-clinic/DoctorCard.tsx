/**
 * Doctor Card Component
 * 
 * Displays doctor information in a card format with compact and detailed variants.
 * Requirements: 8.2, 8.4, 9.1, 9.2, 9.3
 */

'use client';

import { Doctor } from '@/types/haunted-clinic/entities';

export interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: (doctor: Doctor) => void;
  variant?: 'compact' | 'detailed';
}

/**
 * DoctorCard component displays doctor information in a card format
 * 
 * @param doctor - The doctor entity to display
 * @param onBookAppointment - Optional callback when "Book Appointment" button is clicked
 * @param variant - Display variant: 'compact' (default) or 'detailed'
 */
export default function DoctorCard({
  doctor,
  onBookAppointment,
  variant = 'compact',
}: DoctorCardProps) {
  const isDetailed = variant === 'detailed';

  return (
    <div
      className="
        bg-[var(--bg-tertiary,#262626)] 
        border border-[var(--border-primary,#f5f5dc30)]
        rounded-lg p-4 
        transition-all duration-200 ease-in-out
        hover:border-[var(--accent-primary,#f5f5dc)]
        animate-entrance animate-hover
      "
    >
      {/* Header: Name and Speciality */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--text-primary,#f5f5dc)] mb-1">
            {doctor.name}
          </h3>
          <span
            className="
              inline-block px-2 py-1 text-xs font-medium rounded
              bg-[var(--accent-primary,#f5f5dc)] 
              text-[var(--bg-primary,#0d0d0d)]
            "
          >
            {doctor.speciality}
          </span>
        </div>
        <div className="text-2xl ml-2">👨‍⚕️</div>
      </div>

      {/* Experience and Fee */}
      <div className="space-y-2 mb-4">
        {doctor.yearsExperience !== undefined && (
          <div className="flex items-center text-sm text-[var(--text-secondary,#d4d4c8)]">
            <span className="mr-2">📅</span>
            <span>{doctor.yearsExperience} years experience</span>
          </div>
        )}
        {doctor.consultationFee !== undefined && (
          <div className="flex items-center text-sm text-[var(--text-secondary,#d4d4c8)]">
            <span className="mr-2">💰</span>
            <span>${doctor.consultationFee} consultation fee</span>
          </div>
        )}
      </div>

      {/* Detailed variant: Bio and Available Days */}
      {isDetailed && (
        <div className="space-y-3 mb-4">
          {doctor.bio && (
            <div>
              <p className="text-sm text-[var(--text-secondary,#d4d4c8)] line-clamp-3">
                {doctor.bio}
              </p>
            </div>
          )}
          {doctor.availableDays && (
            <div>
              <p className="text-xs text-[var(--text-tertiary,#8c8c7a)] uppercase tracking-wide mb-1">
                Available Days
              </p>
              <p className="text-sm text-[var(--text-secondary,#d4d4c8)]">
                {doctor.availableDays}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contact Information (compact view) */}
      {!isDetailed && (
        <div className="space-y-1 mb-4">
          <div className="flex items-center text-xs text-[var(--text-tertiary,#8c8c7a)]">
            <span className="mr-2">📧</span>
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center text-xs text-[var(--text-tertiary,#8c8c7a)]">
            <span className="mr-2">📞</span>
            <span>{doctor.phone}</span>
          </div>
        </div>
      )}

      {/* Book Appointment Button */}
      {onBookAppointment && (
        <button
          onClick={() => onBookAppointment(doctor)}
          className="
            w-full px-4 py-2 
            bg-[var(--accent-primary,#f5f5dc)] 
            text-[var(--bg-primary,#0d0d0d)]
            font-medium text-sm rounded
            transition-all duration-200 ease-in-out
            hover:bg-[var(--accent-secondary,#d4d4c8)]
            hover:transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary,#f5f5dc)] focus:ring-offset-2 focus:ring-offset-[var(--bg-tertiary,#262626)]
            active:transform active:scale-95
          "
          aria-label={`Book appointment with ${doctor.name}`}
        >
          Book Appointment
        </button>
      )}
    </div>
  );
}

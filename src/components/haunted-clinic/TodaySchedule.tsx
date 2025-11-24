'use client';

/**
 * Today's Schedule Widget
 * 
 * Timeline view of today's appointments with:
 * - Appointments positioned by time
 * - Current time indicator that updates
 * - Color-coded status badges
 * - Click handlers for appointment details
 * 
 * Requirements: 4.1, 4.4, 8.2, 8.3, 10.1, 10.2
 */

import { useEffect, useState } from 'react';
import { Appointment, Doctor, Patient } from '@/types/haunted-clinic/entities';

interface TodayScheduleProps {
  appointments: Appointment[];
  doctors?: Doctor[];
  patients?: Patient[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function TodaySchedule({ 
  appointments, 
  doctors = [], 
  patients = [],
  onAppointmentClick 
}: TodayScheduleProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Sort appointments by time
  const sortedAppointments = [...appointments].sort((a, b) => 
    a.time.localeCompare(b.time)
  );

  // Calculate position for current time indicator
  const currentTimePosition = timeToPosition(
    `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`
  );

  return (
    <div className="relative">
      {/* Timeline container */}
      <div className="relative min-h-[400px] md:min-h-[500px]">
        {/* Time labels */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20">
          {generateTimeLabels().map((time) => (
            <div
              key={time}
              className="absolute text-xs md:text-sm text-secondary"
              style={{ top: `${timeToPosition(time)}%` }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Appointment blocks */}
        <div className="ml-16 md:ml-20 pl-4 relative border-l-2 border-border">
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((apt) => (
              <AppointmentBlock
                key={apt.$id}
                appointment={apt}
                doctor={doctors.find(d => d.$id === apt.doctorId)}
                patient={patients.find(p => p.$id === apt.patientId)}
                onClick={() => onAppointmentClick?.(apt)}
              />
            ))
          ) : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-secondary">No appointments scheduled for today</p>
            </div>
          )}

          {/* Current time indicator */}
          {currentTimePosition >= 0 && currentTimePosition <= 100 && (
            <div
              className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
              style={{ top: `${currentTimePosition}%` }}
              aria-label={`Current time: ${currentTime.toLocaleTimeString()}`}
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <div className="flex-1 h-0.5 bg-accent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Appointment Block Component
 */
interface AppointmentBlockProps {
  appointment: Appointment;
  doctor?: Doctor;
  patient?: Patient;
  onClick?: () => void;
}

function AppointmentBlock({ appointment, doctor, patient, onClick }: AppointmentBlockProps) {
  const position = timeToPosition(appointment.time);
  const height = (appointment.duration || 30) / 6; // Convert minutes to percentage (600 minutes = 10 hours)

  return (
    <button
      onClick={onClick}
      className="absolute left-0 right-0 p-2 md:p-3 rounded border transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent"
      style={{
        top: `${position}%`,
        minHeight: `${Math.max(height, 8)}%`,
      }}
      aria-label={`Appointment at ${appointment.time} with ${patient?.name || 'patient'}`}
    >
      <div className={`h-full rounded ${getStatusBackground(appointment.status || 'scheduled')}`}>
        <div className="flex items-start justify-between">
          <div className="text-left flex-1">
            <p className="font-medium text-sm md:text-base">{appointment.time}</p>
            <p className="text-xs md:text-sm opacity-90">
              {patient?.name || `Patient ${appointment.patientId}`}
            </p>
            {doctor && (
              <p className="text-xs opacity-75 mt-1">
                {doctor.name}
              </p>
            )}
            {appointment.reason && (
              <p className="text-xs opacity-75 mt-1 line-clamp-1">
                {appointment.reason}
              </p>
            )}
          </div>
          <StatusBadge status={appointment.status || 'scheduled'} />
        </div>
      </div>
    </button>
  );
}

/**
 * Status Badge Component
 */
function StatusBadge({ status }: { status: string }) {
  return (
    <span 
      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(status)}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}

/**
 * Convert time string (HH:MM) to vertical position percentage
 * Timeline runs from 8:00 AM (0%) to 6:00 PM (100%)
 */
function timeToPosition(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = 8 * 60; // 8:00 AM
  const endMinutes = 18 * 60; // 6:00 PM
  const rangeMinutes = endMinutes - startMinutes;

  if (totalMinutes < startMinutes) return -10; // Before timeline
  if (totalMinutes > endMinutes) return 110; // After timeline

  return ((totalMinutes - startMinutes) / rangeMinutes) * 100;
}

/**
 * Generate time labels for the timeline (8 AM - 6 PM)
 */
function generateTimeLabels(): string[] {
  const labels: string[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    labels.push(`${hour}:00`);
  }
  return labels;
}

/**
 * Get status color classes for badges
 */
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    confirmed: 'bg-green-500/20 text-green-300 border border-green-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    completed: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border border-red-500/30',
    'no-show': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  };
  return colors[status] || colors.scheduled;
}

/**
 * Get status background color for appointment blocks
 */
function getStatusBackground(status: string): string {
  const backgrounds: Record<string, string> = {
    scheduled: 'bg-blue-500/10 border border-blue-500/20',
    confirmed: 'bg-green-500/10 border border-green-500/20',
    'in-progress': 'bg-yellow-500/10 border border-yellow-500/20',
    completed: 'bg-gray-500/10 border border-gray-500/20',
    cancelled: 'bg-red-500/10 border border-red-500/20',
    'no-show': 'bg-orange-500/10 border border-orange-500/20',
  };
  return backgrounds[status] || backgrounds.scheduled;
}

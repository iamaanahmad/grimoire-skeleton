/**
 * Schedule Grid Component
 * Displays a weekly time grid with appointment blocks
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AppointmentWithPatient } from '@/types/haunted-clinic/entities';

interface ScheduleGridProps {
  appointments: AppointmentWithPatient[];
  weekStart: Date;
  onAppointmentClick?: (appointment: AppointmentWithPatient) => void;
}

// Time slots from 8 AM to 6 PM (10 hours)
const TIME_SLOTS = Array.from({ length: 21 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleGrid({
  appointments,
  weekStart,
  onAppointmentClick,
}: ScheduleGridProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Generate dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Group appointments by date
  const appointmentsByDate = appointments.reduce(
    (acc, apt) => {
      if (!acc[apt.date]) {
        acc[apt.date] = [];
      }
      acc[apt.date].push(apt);
      return acc;
    },
    {} as Record<string, AppointmentWithPatient[]>
  );

  // Check if a time is the current time (within the current hour)
  const isCurrentTime = (timeSlot: string): boolean => {
    const today = formatDate(currentTime);
    const currentWeekStart = formatDate(weekStart);
    const currentWeekEnd = formatDate(
      new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
    );

    // Only show current time indicator if today is in the current week
    if (today < currentWeekStart || today > currentWeekEnd) {
      return false;
    }

    const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    return slotHour === currentHour && Math.abs(slotMinute - currentMinute) < 30;
  };

  // Get status color
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'scheduled':
        return '#6b7280'; // Gray
      case 'confirmed':
        return '#3b82f6'; // Blue
      case 'in-progress':
        return '#f59e0b'; // Amber
      case 'completed':
        return '#10b981'; // Green
      case 'cancelled':
        return '#ef4444'; // Red
      case 'no-show':
        return '#dc2626'; // Dark red
      default:
        return '#6b7280';
    }
  };

  // Calculate position and height for appointment block
  const getAppointmentStyle = (apt: AppointmentWithPatient) => {
    const [hour, minute] = apt.time.split(':').map(Number);
    const startMinutes = (hour - 8) * 60 + minute;
    const duration = apt.duration || 30;

    // Each hour is 60px, so each minute is 1px
    const top = startMinutes;
    const height = duration;

    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: getStatusColor(apt.status),
    };
  };

  return (
    <div className="schedule-grid-container">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-px mb-2">
            <div className="p-2" style={{ color: 'var(--color-text-secondary)' }}>
              Time
            </div>
            {weekDates.map((date, i) => (
              <div
                key={i}
                className="p-2 text-center rounded"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <div className="font-semibold">{DAYS[i]}</div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-8 gap-px relative">
            {/* Time labels column */}
            <div className="space-y-[30px]">
              {TIME_SLOTS.map((time) => (
                <div
                  key={time}
                  className="h-[30px] flex items-center justify-end pr-2 text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDates.map((date, dayIndex) => {
              const dateStr = formatDate(date);
              const dayAppointments = appointmentsByDate[dateStr] || [];

              return (
                <div
                  key={dayIndex}
                  className="relative"
                  style={{
                    height: `${TIME_SLOTS.length * 30}px`,
                    backgroundColor: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* Time slot lines */}
                  {TIME_SLOTS.map((time, i) => (
                    <div
                      key={time}
                      className="absolute w-full"
                      style={{
                        top: `${i * 30}px`,
                        height: '30px',
                        borderBottom: '1px solid var(--color-border)',
                        opacity: 0.3,
                      }}
                    />
                  ))}

                  {/* Current time indicator */}
                  {formatDate(currentTime) === dateStr && (
                    <div
                      className="absolute w-full z-10"
                      style={{
                        top: `${(currentTime.getHours() - 8) * 60 + currentTime.getMinutes()}px`,
                        height: '2px',
                        backgroundColor: 'var(--color-accent-primary)',
                      }}
                      aria-label="Current time"
                    />
                  )}

                  {/* Appointment blocks */}
                  {dayAppointments.map((apt) => (
                    <button
                      key={apt.$id}
                      className="absolute w-full px-2 py-1 text-left text-xs rounded cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                      style={{
                        ...getAppointmentStyle(apt),
                        color: 'white',
                        zIndex: 5,
                      }}
                      onClick={() => onAppointmentClick?.(apt)}
                      aria-label={`Appointment with ${apt.patient?.name || 'patient'} at ${apt.time}`}
                    >
                      <div className="font-semibold truncate">
                        {apt.patient?.name || 'Unknown Patient'}
                      </div>
                      <div className="truncate opacity-90">{apt.time}</div>
                      <div className="truncate opacity-75 capitalize">{apt.status}</div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile view - List format */}
      <div className="md:hidden space-y-4">
        {weekDates.map((date, dayIndex) => {
          const dateStr = formatDate(date);
          const dayAppointments = appointmentsByDate[dateStr] || [];

          if (dayAppointments.length === 0) return null;

          return (
            <div
              key={dayIndex}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                {DAYS[dayIndex]}, {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </h3>
              <div className="space-y-2">
                {dayAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((apt) => (
                    <button
                      key={apt.$id}
                      className="w-full p-3 rounded text-left hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: getStatusColor(apt.status),
                        color: 'white',
                      }}
                      onClick={() => onAppointmentClick?.(apt)}
                    >
                      <div className="font-semibold">{apt.patient?.name || 'Unknown Patient'}</div>
                      <div className="text-sm opacity-90">
                        {apt.time} • {apt.duration || 30} min
                      </div>
                      <div className="text-sm opacity-75 capitalize">{apt.status}</div>
                    </button>
                  ))}
              </div>
            </div>
          );
        })}

        {appointments.length === 0 && (
          <p style={{ color: 'var(--color-text-secondary)' }}>No appointments this week</p>
        )}
      </div>
    </div>
  );
}

// Helper function
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

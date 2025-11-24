/**
 * Doctor Schedule Page
 * Displays a weekly calendar view of a doctor's appointments
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Doctor, Appointment, Patient, AppointmentWithPatient } from '@/types/haunted-clinic/entities';
import { fetchDoctor, fetchAppointments, fetchPatient } from '@/lib/haunted-clinic/api';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import ScheduleGrid from '@/components/haunted-clinic/ScheduleGrid';
import AppointmentDetailsModal from '@/components/haunted-clinic/AppointmentDetailsModal';

export default function DoctorSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, [id, weekStart]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch doctor details
      const doctorData = await fetchDoctor(id);
      setDoctor(doctorData);

      // Calculate week range
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Fetch appointments for the week
      const appointmentsData = await fetchAppointments({ doctorId: id });
      
      // Filter appointments within the week range
      const weekStartStr = formatDate(weekStart);
      const weekEndStr = formatDate(weekEnd);
      const filteredAppointments = appointmentsData.filter(
        (apt) => apt.date >= weekStartStr && apt.date <= weekEndStr
      );

      // Fetch patient details for each appointment and include doctor
      const appointmentsWithPatients = await Promise.all(
        filteredAppointments.map(async (apt) => {
          try {
            const patient = await fetchPatient(apt.patientId);
            return { ...apt, patient, doctor: doctorData };
          } catch {
            return { ...apt, doctor: doctorData };
          }
        })
      );

      setAppointments(appointmentsWithPatients);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setWeekStart(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setWeekStart(newWeekStart);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Doctor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/doctors/${id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Back to doctor details"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doctor
          </button>
        </div>

        {/* Doctor Info */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            👨‍⚕️ {doctor.name} - Weekly Schedule
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{doctor.speciality}</p>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousWeek}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Week
          </button>

          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {formatWeekRange(weekStart)}
          </h2>

          <button
            onClick={handleNextWeek}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Next week"
          >
            Next Week
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Schedule Grid */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <ScheduleGrid
            appointments={appointments}
            weekStart={weekStart}
            onAppointmentClick={(apt) => setSelectedAppointment(apt)}
          />
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}

// Helper functions

/**
 * Get the start of the week (Monday) for a given date
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format week range for display
 */
function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const startStr = weekStart.toLocaleDateString('en-US', options);
  const endStr = weekEnd.toLocaleDateString('en-US', options);

  return `${startStr} - ${endStr}`;
}

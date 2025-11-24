/**
 * Appointments List Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Appointment, Doctor, Patient } from '@/types/haunted-clinic/entities';
import { fetchAppointments, deleteAppointment, fetchDoctors, fetchPatients } from '@/lib/haunted-clinic/api';
import { Plus } from 'lucide-react';

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, doctorsData, patientsData] = await Promise.all([
        fetchAppointments(),
        fetchDoctors(),
        fetchPatients(),
      ]);
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    if (confirm('Cancel this appointment?')) {
      try {
        await deleteAppointment(appointment.$id);
        await loadData();
      } catch (error) {
        console.error('Failed to delete appointment:', error);
        alert('Failed to delete appointment');
      }
    }
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d.$id === doctorId);
    return doctor ? doctor.name : 'Unknown';
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.$id === patientId);
    return patient ? patient.name : 'Unknown';
  };

  const getStatusBadge = (status?: string) => {
    const colors: Record<string, string> = {
      scheduled: '#6b7280',
      confirmed: '#3b82f6',
      'in-progress': '#f59e0b',
      completed: '#10b981',
      cancelled: '#ef4444',
      'no-show': '#dc2626',
    };

    return (
      <span
        className="px-2 py-1 rounded text-xs font-medium"
        style={{
          backgroundColor: colors[status || 'scheduled'] || '#6b7280',
          color: 'white',
        }}
      >
        {status || 'scheduled'}
      </span>
    );
  };

  const columns: Column<Appointment>[] = [
    {
      key: 'patientId',
      label: 'Patient',
      sortable: true,
      render: (value) => (
        <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {getPatientName(value as string)}
        </span>
      ),
    },
    {
      key: 'doctorId',
      label: 'Doctor',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-primary)' }}>
          {getDoctorName(value as string)}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: 'time',
      label: 'Time',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => getStatusBadge(value as string),
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              📅 Appointments
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Manage patient appointments
            </p>
          </div>
          <button
            onClick={() => router.push('/appointments/new')}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            <Plus className="w-4 h-4" />
            Book Appointment
          </button>
        </div>

        <EntityTable
          data={appointments}
          columns={columns}
          loading={loading}
          onEdit={(appointment) => router.push(`/appointments/${appointment.$id}/edit`)}
          onDelete={handleDelete}
          emptyMessage="No appointments found. Book your first appointment!"
        />
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Appointment, Doctor, Patient } from '@/types/haunted-clinic/entities';
import { fetchAppointments, deleteAppointment, fetchDoctors, fetchPatients } from '@/lib/haunted-clinic/api';
import { PageHeader, StatusBadge, GlowCard } from '@/components/shared';

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredAppointments = appointments.filter((a) => {
    const patientName = getPatientName(a.patientId).toLowerCase();
    const doctorName = getDoctorName(a.doctorId).toLowerCase();
    const matchesSearch = patientName.includes(search.toLowerCase()) ||
                          doctorName.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Appointment>[] = [
    {
      key: 'patientId',
      label: 'Patient',
      sortable: true,
      render: (value) => (
        <span style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
          {getPatientName(value as string)}
        </span>
      ),
    },
    {
      key: 'doctorId',
      label: 'Doctor',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>
          Dr. {getDoctorName(value as string)}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'time',
      label: 'Time',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-accent-primary)', fontWeight: 500 }}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={(value as string) || 'scheduled'} variant="appointment" />,
    },
  ];

  return (
    <div style={{ padding: '8px 0' }}>
      <PageHeader
        title="Appointments"
        subtitle="Manage patient appointments"
        icon="📅"
        count={filteredAppointments.length}
        actions={
          <Link
            href="/apps/haunted-clinic/appointments/new"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>➕</span>
            Book Appointment
          </Link>
        }
      />

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '28px',
          marginTop: '24px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search by patient or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '2px solid #2d2d44',
            backgroundColor: '#1a1a2e',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            border: '2px solid #2d2d44',
            backgroundColor: '#1a1a2e',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {!loading && filteredAppointments.length === 0 ? (
        <GlowCard hover={false} glow={false}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📅</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              {search || statusFilter !== 'all' ? 'No appointments found' : 'No appointments yet'}
            </h3>
            <p style={{ color: 'var(--color-text-tertiary)', marginBottom: '24px' }}>
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Book your first appointment to get started!'}
            </p>
            {!search && statusFilter === 'all' && (
              <Link
                href="/apps/haunted-clinic/appointments/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'var(--color-bg-primary)',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                ➕ Book Appointment
              </Link>
            )}
          </div>
        </GlowCard>
      ) : (
        <EntityTable
          data={filteredAppointments}
          columns={columns}
          loading={loading}
          onView={(appointment) => router.push(`/apps/haunted-clinic/appointments/${appointment.$id}`)}
          onEdit={(appointment) => router.push(`/apps/haunted-clinic/appointments/${appointment.$id}/edit`)}
          onDelete={handleDelete}
          emptyMessage="No appointments found"
        />
      )}
    </div>
  );
}

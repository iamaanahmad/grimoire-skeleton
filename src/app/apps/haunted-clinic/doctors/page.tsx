/**
 * Doctors List Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Doctor } from '@/types/haunted-clinic/entities';
import { fetchDoctors, deleteDoctor } from '@/lib/haunted-clinic/api';
import { Plus } from 'lucide-react';

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctor: Doctor) => {
    if (confirm(`Remove Dr. ${doctor.name} from the clinic?`)) {
      try {
        await deleteDoctor(doctor.$id);
        await loadDoctors();
      } catch (error) {
        console.error('Failed to delete doctor:', error);
        alert('Failed to delete doctor');
      }
    }
  };

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => (
        <span className="font-bold" style={{ color: 'var(--color-accent-primary)' }}>
          {value}
        </span>
      ),
    },
    {
      key: 'speciality',
      label: 'Speciality',
      sortable: true,
    },
    {
      key: 'yearsExperience',
      label: 'Experience',
      sortable: true,
      render: (value) => (value ? `${value} years` : '-'),
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              👨‍⚕️ Doctors
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Manage medical professionals
            </p>
          </div>
          <button
            onClick={() => router.push('/doctors/new')}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            <Plus className="w-4 h-4" />
            Add Doctor
          </button>
        </div>

        <EntityTable
          data={doctors}
          columns={columns}
          loading={loading}
          onEdit={(doctor) => router.push(`/doctors/${doctor.$id}/edit`)}
          onDelete={handleDelete}
          emptyMessage="No doctors found. Add your first doctor!"
        />
      </div>
    </div>
  );
}

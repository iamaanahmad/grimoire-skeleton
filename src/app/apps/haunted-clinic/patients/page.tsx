/**
 * Patients List Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Patient } from '@/types/haunted-clinic/entities';
import { fetchPatients, deletePatient } from '@/lib/haunted-clinic/api';
import { Plus } from 'lucide-react';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patient: Patient) => {
    if (confirm(`Remove ${patient.name} from patient records?`)) {
      try {
        await deletePatient(patient.$id);
        await loadPatients();
      } catch (error) {
        console.error('Failed to delete patient:', error);
        alert('Failed to delete patient');
      }
    }
  };

  const columns: Column<Patient>[] = [
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
      key: 'phone',
      label: 'Phone',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'bloodType',
      label: 'Blood Type',
      sortable: true,
      render: (value) => value || '-',
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              🧑‍🦱 Patients
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Manage patient records (synthetic data only)
            </p>
          </div>
          <button
            onClick={() => router.push('/patients/new')}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            <Plus className="w-4 h-4" />
            Add Patient
          </button>
        </div>

        <EntityTable
          data={patients}
          columns={columns}
          loading={loading}
          onEdit={(patient) => router.push(`/patients/${patient.$id}/edit`)}
          onDelete={handleDelete}
          emptyMessage="No patients found. Add your first patient!"
        />
      </div>
    </div>
  );
}

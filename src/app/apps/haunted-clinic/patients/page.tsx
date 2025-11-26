'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Patient } from '@/types/haunted-clinic/entities';
import { fetchPatients, deletePatient } from '@/lib/haunted-clinic/api';
import { PageHeader, GlowCard } from '@/components/shared';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      label: 'Patient',
      sortable: true,
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'color-mix(in srgb, var(--color-accent-primary) 15%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            🧑‍🦱
          </div>
          <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
          {value || '—'}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>{value || '—'}</span>
      ),
    },
    {
      key: 'bloodType',
      label: 'Blood Type',
      sortable: true,
      render: (value) => (
        value ? (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
            }}
          >
            {value}
          </span>
        ) : (
          <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>
        )
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle="Manage patient records (synthetic data only)"
        icon="🧑‍🦱"
        count={filteredPatients.length}
        actions={
          <Link
            href="/apps/haunted-clinic/patients/new"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            <span>➕</span>
            Add Patient
          </Link>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-primary)',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      {!loading && filteredPatients.length === 0 ? (
        <GlowCard hover={false} glow={false}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧑‍🦱</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              {search ? 'No patients found' : 'No patients yet'}
            </h3>
            <p style={{ color: 'var(--color-text-tertiary)', marginBottom: '24px' }}>
              {search ? 'Try a different search term' : 'Add your first patient to get started!'}
            </p>
            {!search && (
              <Link
                href="/apps/haunted-clinic/patients/new"
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
                ➕ Add Patient
              </Link>
            )}
          </div>
        </GlowCard>
      ) : (
        <EntityTable
          data={filteredPatients}
          columns={columns}
          loading={loading}
          onView={(patient) => router.push(`/apps/haunted-clinic/patients/${patient.$id}`)}
          onEdit={(patient) => router.push(`/apps/haunted-clinic/patients/${patient.$id}/edit`)}
          onDelete={handleDelete}
          emptyMessage="No patients found"
        />
      )}
    </div>
  );
}

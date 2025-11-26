'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EntityTable, Column } from '@/core/components/EntityTable';
import { Doctor } from '@/types/haunted-clinic/entities';
import { fetchDoctors, deleteDoctor } from '@/lib/haunted-clinic/api';
import { PageHeader, GlowCard } from '@/components/shared';

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.speciality?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      label: 'Doctor',
      sortable: true,
      render: (value, row) => (
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
            👨‍⚕️
          </div>
          <div>
            <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>Dr. {value}</span>
            {row.speciality && (
              <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                {row.speciality}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'yearsExperience',
      label: 'Experience',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)' }}>
          {value ? `${value} years` : '—'}
        </span>
      ),
    },
    {
      key: 'phone',
      label: 'Contact',
      sortable: true,
      render: (value) => (
        <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
          {value || '—'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Doctors"
        subtitle="Manage medical professionals"
        icon="👨‍⚕️"
        count={filteredDoctors.length}
        actions={
          <Link
            href="/apps/haunted-clinic/doctors/new"
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
            Add Doctor
          </Link>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search doctors by name or speciality..."
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

      {!loading && filteredDoctors.length === 0 ? (
        <GlowCard hover={false} glow={false}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👨‍⚕️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              {search ? 'No doctors found' : 'No doctors yet'}
            </h3>
            <p style={{ color: 'var(--color-text-tertiary)', marginBottom: '24px' }}>
              {search ? 'Try a different search term' : 'Add your first doctor to get started!'}
            </p>
            {!search && (
              <Link
                href="/apps/haunted-clinic/doctors/new"
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
                ➕ Add Doctor
              </Link>
            )}
          </div>
        </GlowCard>
      ) : (
        <EntityTable
          data={filteredDoctors}
          columns={columns}
          loading={loading}
          onView={(doctor) => router.push(`/apps/haunted-clinic/doctors/${doctor.$id}`)}
          onEdit={(doctor) => router.push(`/apps/haunted-clinic/doctors/${doctor.$id}/edit`)}
          onDelete={handleDelete}
          emptyMessage="No doctors found"
        />
      )}
    </div>
  );
}

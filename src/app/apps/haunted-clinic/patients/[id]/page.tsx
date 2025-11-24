/**
 * Patient Detail Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Patient } from '@/types/haunted-clinic/entities';
import { fetchPatient, deletePatient } from '@/lib/haunted-clinic/api';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    setLoading(true);
    try {
      const data = await fetchPatient(id);
      setPatient(data);
    } catch (error) {
      console.error('Failed to load patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Remove ${patient?.name} from patient records?`)) {
      try {
        await deletePatient(id);
        router.push('/patients');
      } catch (error) {
        console.error('Failed to delete patient:', error);
        alert('Failed to delete patient');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Patient not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/patients')}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Patients
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/patients/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent-primary)',
                color: 'var(--color-bg-primary)',
              }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-90"
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            🧑‍🦱 {patient.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Phone
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{patient.phone}</p>
            </div>

            {patient.email && (
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Email
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>{patient.email}</p>
              </div>
            )}

            {patient.dateOfBirth && (
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Date of Birth
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            )}

            {patient.bloodType && (
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Blood Type
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>{patient.bloodType}</p>
              </div>
            )}

            {patient.allergies && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Allergies
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>{patient.allergies}</p>
              </div>
            )}

            {patient.emergencyContact && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Emergency Contact
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>{patient.emergencyContact}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

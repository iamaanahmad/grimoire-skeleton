/**
 * Doctor Detail Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Doctor } from '@/types/haunted-clinic/entities';
import { fetchDoctor, deleteDoctor } from '@/lib/haunted-clinic/api';
import { ArrowLeft, Edit, Trash2, Calendar } from 'lucide-react';

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
  }, [id]);

  const loadDoctor = async () => {
    setLoading(true);
    try {
      const data = await fetchDoctor(id);
      setDoctor(data);
    } catch (error) {
      console.error('Failed to load doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Remove Dr. ${doctor?.name} from the clinic?`)) {
      try {
        await deleteDoctor(id);
        router.push('/apps/haunted-clinic/doctors');
      } catch (error) {
        console.error('Failed to delete doctor:', error);
        alert('Failed to delete doctor');
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

  if (!doctor) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: 'var(--color-text-secondary)' }}>Doctor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/apps/haunted-clinic/doctors')}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doctors
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/apps/haunted-clinic/doctors/${id}/schedule`)}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
            <button
              onClick={() => router.push(`/apps/haunted-clinic/doctors/${id}/edit`)}
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
            👨‍⚕️ {doctor.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Speciality
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{doctor.speciality}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Email
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{doctor.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Phone
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{doctor.phone}</p>
            </div>

            {doctor.yearsExperience !== undefined && (
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Years of Experience
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>{doctor.yearsExperience} years</p>
              </div>
            )}

            {doctor.availableDays && (
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Available Days
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>{doctor.availableDays}</p>
              </div>
            )}

            {doctor.consultationFee !== undefined && (
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Consultation Fee
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>${doctor.consultationFee}</p>
              </div>
            )}
          </div>

          {doctor.bio && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Bio
              </h3>
              <p style={{ color: 'var(--color-text-primary)' }}>{doctor.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

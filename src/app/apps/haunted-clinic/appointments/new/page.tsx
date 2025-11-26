'use client';

import { useRouter } from 'next/navigation';
import AppointmentBooking from '@/components/haunted-clinic/AppointmentBooking';
import { ArrowLeft } from 'lucide-react';

export default function NewAppointmentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="w-full px-6 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-lg transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: '#1a1a2e', color: '#a0a0b0', border: '1px solid #2d2d44' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full"
            style={{ backgroundColor: '#1a1a2e', border: '3px solid #00ff88', boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)' }}
          >
            <span className="text-4xl">📅</span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#ffffff' }}>Book Appointment</h1>
          <p className="text-lg" style={{ color: '#808090' }}>Schedule a new patient appointment</p>
        </div>

        <AppointmentBooking
          onComplete={(id) => router.push(`/apps/haunted-clinic/appointments/${id}`)}
          onCancel={() => router.push('/apps/haunted-clinic/appointments')}
        />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EntityForm } from '@/core/components/EntityForm';
import { appointment } from '@/config/haunted-clinic/entities';
import { fetchAppointment, updateAppointment } from '@/lib/haunted-clinic/api';
import { Appointment } from '@/types/haunted-clinic/entities';
import { ArrowLeft } from 'lucide-react';

export default function EditAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointment(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values: any) => {
    await updateAppointment(id, values);
    router.push(`/apps/haunted-clinic/appointments/${id}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] py-8 px-4">
        <div className="w-full max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-10 w-24 bg-[#1a1a2e] rounded-lg" />
          <div className="h-96 bg-[#12121a] rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👻</div>
          <h2 className="text-2xl font-bold text-white mb-2">Appointment Not Found</h2>
          <button
            onClick={() => router.push('/apps/haunted-clinic/appointments')}
            className="mt-4 px-6 py-3 bg-[#00ff88] text-[#0a0a0f] rounded-lg font-bold"
          >
            Back to Appointments
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] py-8 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-gray-400 
                     bg-[#12121a] border border-[#2d2d44] rounded-lg
                     hover:text-white hover:border-[#3d3d54] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 
                          bg-[#12121a] border-2 border-[#00ff88] rounded-full">
            <span className="text-3xl">📅</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Appointment</h1>
          <p className="text-gray-400">Update appointment details</p>
        </div>

        <EntityForm entityDef={appointment} initialValues={data} onSubmit={handleSubmit} mode="edit" />
      </div>
    </main>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { TodaySchedule } from './TodaySchedule';
import { Appointment, Doctor, Patient } from '@/types/haunted-clinic/entities';

interface DashboardScheduleWrapperProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
}

export function DashboardScheduleWrapper({ 
  appointments, 
  doctors, 
  patients 
}: DashboardScheduleWrapperProps) {
  const router = useRouter();

  return (
    <TodaySchedule 
      appointments={appointments}
      doctors={doctors}
      patients={patients}
      onAppointmentClick={(apt) => {
        router.push(`/apps/haunted-clinic/appointments/${apt.$id}`);
      }}
    />
  );
}

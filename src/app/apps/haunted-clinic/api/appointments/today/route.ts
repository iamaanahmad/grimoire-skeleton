/**
 * Today's Appointments API Route
 * 
 * Fetches appointments for today, sorted by time.
 * Requirements: 4.1, 11.5
 */

import { NextResponse } from 'next/server';
import { fetchTodayAppointments, fetchDoctor, fetchPatient } from '@/lib/haunted-clinic/api';

export async function GET() {
  try {
    // Fetch today's appointments
    const appointments = await fetchTodayAppointments();

    // Sort by time in ascending order
    appointments.sort((a, b) => a.time.localeCompare(b.time));

    // Enrich with doctor and patient details
    const enrichedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        try {
          const [doctor, patient] = await Promise.all([
            fetchDoctor(apt.doctorId),
            fetchPatient(apt.patientId),
          ]);

          return {
            ...apt,
            doctor: {
              $id: doctor.$id,
              name: doctor.name,
              speciality: doctor.speciality,
            },
            patient: {
              $id: patient.$id,
              name: patient.name,
            },
          };
        } catch (error) {
          console.error('Error enriching appointment:', error);
          return apt;
        }
      })
    );

    return NextResponse.json({
      appointments: enrichedAppointments,
      count: enrichedAppointments.length,
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch today\'s appointments' },
      { status: 500 }
    );
  }
}

/**
 * Upcoming Appointments API Route
 * 
 * Fetches future appointments sorted by date and time.
 * Requirements: 4.3, 11.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchUpcomingAppointments, fetchDoctor, fetchPatient } from '@/lib/haunted-clinic/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Fetch upcoming appointments
    const appointments = await fetchUpcomingAppointments(limit);

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
      limit,
    });
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming appointments' },
      { status: 500 }
    );
  }
}

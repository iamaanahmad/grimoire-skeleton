/**
 * Doctor Schedule API Route
 * 
 * Fetches appointments for a specific doctor within a date range.
 * Requirements: 5.1, 5.2, 5.3, 11.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchAppointments } from '@/lib/haunted-clinic/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const { id: doctorId } = await params;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    // Fetch all appointments for this doctor
    const appointments = await fetchAppointments({ doctorId });

    // Filter by date range if provided
    let filteredAppointments = appointments;
    if (start) {
      filteredAppointments = filteredAppointments.filter(
        (apt) => apt.date >= start
      );
    }
    if (end) {
      filteredAppointments = filteredAppointments.filter(
        (apt) => apt.date <= end
      );
    }

    // Sort by date and time
    filteredAppointments.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    return NextResponse.json({
      appointments: filteredAppointments,
      count: filteredAppointments.length,
    });
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor schedule' },
      { status: 500 }
    );
  }
}

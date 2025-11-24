'use client';

import { fetchTodayAppointments, fetchUpcomingAppointments, countDoctors, countPatients, fetchDoctors, fetchPatients } from '@/lib/haunted-clinic/api';
import { Appointment } from '@/types/haunted-clinic/entities';
import { StatisticsCards } from '@/components/haunted-clinic/StatisticsCards';
import { DashboardScheduleWrapper } from '@/components/haunted-clinic/DashboardScheduleWrapper';
import { HeartbeatAnimation } from '@/components/haunted-clinic/HeartbeatAnimation';
import '@/styles/haunted-clinic/custom.css';

/**
 * Dashboard Page Component
 * 
 * Client component that displays:
 * - Statistics cards (total doctors, patients, today's appointments)
 * - Today's schedule timeline
 * - Upcoming appointments list
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.5
 */
export default async function HauntedClinicDashboard() {
  try {
    // Fetch all data in parallel for optimal performance
    const [todayAppointments, upcomingAppointments, totalDoctors, totalPatients, doctors, patients] = await Promise.all([
      fetchTodayAppointments(),
      fetchUpcomingAppointments(5),
      countDoctors(),
      countPatients(),
      fetchDoctors(),
      fetchPatients(),
    ]);

    const stats = {
      totalDoctors,
      totalPatients,
      todayAppointments: todayAppointments.length,
    };

    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 relative">
        {/* Heartbeat Animation Background */}
        <HeartbeatAnimation />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-secondary">Welcome to the Haunted Clinic</p>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8">
            <StatisticsCards stats={stats} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <div className="bg-tertiary rounded-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
              <DashboardScheduleWrapper 
                appointments={todayAppointments}
                doctors={doctors}
                patients={patients}
              />
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-tertiary rounded-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-2">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.$id} className="p-3 bg-secondary rounded border border-border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{apt.date} at {apt.time}</p>
                          <p className="text-sm text-secondary">Patient ID: {apt.patientId}</p>
                          {apt.reason && <p className="text-sm mt-1">{apt.reason}</p>}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(apt.status || 'scheduled')}`}>
                          {apt.status || 'scheduled'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary">No upcoming appointments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-tertiary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-bold mb-2 text-red-500">Error Loading Dashboard</h2>
            <p className="text-secondary">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-accent text-primary rounded hover:opacity-80 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Helper function to get status color classes
 */
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-500/20 text-blue-300',
    confirmed: 'bg-green-500/20 text-green-300',
    'in-progress': 'bg-yellow-500/20 text-yellow-300',
    completed: 'bg-gray-500/20 text-gray-300',
    cancelled: 'bg-red-500/20 text-red-300',
    'no-show': 'bg-orange-500/20 text-orange-300',
  };
  return colors[status] || colors.scheduled;
}

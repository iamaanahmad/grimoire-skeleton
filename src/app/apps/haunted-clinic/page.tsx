'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  fetchTodayAppointments,
  fetchUpcomingAppointments,
  countDoctors,
  countPatients,
  fetchDoctors,
  fetchPatients,
} from '@/lib/haunted-clinic/api';
import { Appointment, Doctor, Patient } from '@/types/haunted-clinic/entities';
import { AnimatedCounter, GlowCard, StatusBadge, PageHeader } from '@/components/shared';

export default function HauntedClinicDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, todayAppointments: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [todayApts, upcomingApts, totalDocs, totalPats, docsData, patsData] = await Promise.all([
          fetchTodayAppointments(),
          fetchUpcomingAppointments(5),
          countDoctors(),
          countPatients(),
          fetchDoctors(),
          fetchPatients(),
        ]);
        setTodayAppointments(todayApts);
        setUpcomingAppointments(upcomingApts);
        setDoctors(docsData);
        setPatients(patsData);
        setStats({ totalDoctors: totalDocs, totalPatients: totalPats, todayAppointments: todayApts.length });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getDoctorName = (id: string) => doctors.find((d) => d.$id === id)?.name || 'Unknown';
  const getPatientName = (id: string) => patients.find((p) => p.$id === id)?.name || 'Unknown';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{ 
              fontSize: '64px', 
              marginBottom: '24px',
              animation: 'heartbeat 1.5s ease-in-out infinite',
            }}
          >
            🏥
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>
            Loading clinic data...
          </p>
        </div>
        <style jsx>{`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <GlowCard variant="error" hover={false}>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ color: '#f87171', fontSize: '24px', marginBottom: '8px' }}>Error Loading Data</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 32px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-bg-primary)',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </GlowCard>
    );
  }

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to the Haunted Clinic"
        icon="📊"
      />

      {/* Stats Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}
      >
        {[
          { icon: '👨‍⚕️', label: 'Total Doctors', value: stats.totalDoctors, link: '/apps/haunted-clinic/doctors', color: '#60a5fa' },
          { icon: '🧑‍🦱', label: 'Total Patients', value: stats.totalPatients, link: '/apps/haunted-clinic/patients', color: '#a78bfa' },
          { icon: '📅', label: "Today's Appointments", value: stats.todayAppointments, link: '/apps/haunted-clinic/appointments', color: '#4ade80' },
        ].map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.link}
            style={{
              textDecoration: 'none',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.4s ease ${i * 0.1}s`,
            }}
          >
            <GlowCard variant="default" hover glow>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div 
                  style={{ 
                    fontSize: '48px',
                    filter: `drop-shadow(0 0 8px ${stat.color})`,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '42px',
                      fontWeight: 'bold',
                      color: 'var(--color-accent-primary)',
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedCounter value={stat.value} duration={1200} />
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '48px' }}>
        {/* Today's Schedule - Timeline View */}
        <div
          style={{
            padding: '28px',
            borderRadius: '24px',
            backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 50%, transparent)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ animation: 'heartbeat 2s ease-in-out infinite' }}>❤️</span>
            Today&apos;s Schedule
          </h2>
          {todayAppointments.length > 0 ? (
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              {/* Timeline line */}
              <div
                style={{
                  position: 'absolute',
                  left: '6px',
                  top: '8px',
                  bottom: '8px',
                  width: '2px',
                  backgroundColor: 'var(--color-border-primary)',
                }}
              />
              {todayAppointments.map((apt, i) => (
                <div
                  key={apt.$id}
                  style={{
                    position: 'relative',
                    marginBottom: i < todayAppointments.length - 1 ? '16px' : 0,
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border-primary)',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `all 0.3s ease ${i * 0.1}s`,
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-22px',
                      top: '20px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent-primary)',
                      boxShadow: '0 0 8px var(--color-accent-glow)',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)', fontSize: '16px' }}>
                      {apt.time}
                    </span>
                    <StatusBadge status={apt.status || 'scheduled'} variant="appointment" size="sm" />
                  </div>
                  <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: '4px' }}>
                    {getPatientName(apt.patientId)}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    with Dr. {getDoctorName(apt.doctorId)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
              <p style={{ color: 'var(--color-text-tertiary)' }}>No appointments scheduled for today</p>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div
          style={{
            padding: '28px',
            borderRadius: '24px',
            backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 50%, transparent)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              📆 Upcoming Appointments
            </h2>
            <Link
              href="/apps/haunted-clinic/appointments"
              style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontSize: '13px' }}
            >
              View all →
            </Link>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingAppointments.map((apt, i) => (
                <div
                  key={apt.$id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border-primary)',
                    transition: 'all 0.2s',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                    transitionDelay: `${0.2 + i * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{apt.date}</span>
                    <span style={{ color: 'var(--color-accent-primary)', fontWeight: 500, fontSize: '14px' }}>{apt.time}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    {getPatientName(apt.patientId)} • Dr. {getDoctorName(apt.doctorId)}
                  </p>
                  {apt.reason && (
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: '13px', marginTop: '4px' }}>
                      {apt.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📆</div>
              <p style={{ color: 'var(--color-text-tertiary)' }}>No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { href: '/apps/haunted-clinic/appointments/new', icon: '➕', label: 'Book Appointment', primary: true },
          { href: '/apps/haunted-clinic/doctors/new', icon: '👨‍⚕️', label: 'Add Doctor', primary: false },
          { href: '/apps/haunted-clinic/patients/new', icon: '🧑‍🦱', label: 'Add Patient', primary: false },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              transition: 'all 0.2s',
              backgroundColor: action.primary ? 'var(--color-accent-primary)' : 'var(--color-bg-tertiary)',
              color: action.primary ? 'var(--color-bg-primary)' : 'var(--color-text-primary)',
              border: action.primary ? 'none' : '1px solid var(--color-border-primary)',
            }}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

/**
 * API Client for Haunted Clinic
 *
 * Simplified API functions for fetching and mutating data.
 * In production, this would integrate with Appwrite SDK.
 */

import { Doctor, Patient, Appointment } from '@/types/haunted-clinic/entities';

// Mock data storage
let mockDoctors: Doctor[] = [
  {
    $id: '1',
    name: 'Dr. Victor Frankenstein',
    speciality: 'General Practice',
    email: 'v.frankenstein@hauntedclinic.com',
    phone: '555-0101',
    yearsExperience: 15,
    bio: 'Specializes in bringing life to medical practice.',
    availableDays: 'Mon, Wed, Fri',
    consultationFee: 150,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
  {
    $id: '2',
    name: 'Dr. Jekyll Hyde',
    speciality: 'Psychiatry',
    email: 'j.hyde@hauntedclinic.com',
    phone: '555-0102',
    yearsExperience: 12,
    bio: 'Expert in dual diagnosis and personality disorders.',
    availableDays: 'Tue, Thu',
    consultationFee: 200,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
];

let mockPatients: Patient[] = [
  {
    $id: '1',
    name: 'Morticia Addams',
    email: 'morticia@example.com',
    phone: '555-0201',
    dateOfBirth: '1990-10-31',
    bloodType: 'AB-',
    allergies: 'Sunlight',
    emergencyContact: 'Gomez Addams - 555-0202',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
  {
    $id: '2',
    name: 'Count Dracula',
    email: 'count@example.com',
    phone: '555-0203',
    dateOfBirth: '1897-05-26',
    bloodType: 'O-',
    allergies: 'Garlic, Crosses',
    emergencyContact: 'Renfield - 555-0204',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
];

let mockAppointments: Appointment[] = [
  {
    $id: '1',
    patientId: '1',
    doctorId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 30,
    status: 'confirmed',
    reason: 'Annual checkup',
    notes: 'Patient prefers dim lighting',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
  {
    $id: '2',
    patientId: '2',
    doctorId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    duration: 60,
    status: 'scheduled',
    reason: 'Follow-up consultation',
    notes: 'Bring previous test results',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
  {
    $id: '3',
    patientId: '1',
    doctorId: '2',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 45,
    status: 'in-progress',
    reason: 'Therapy session',
    notes: 'Regular weekly session',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
];

// Doctors
export async function fetchDoctors(): Promise<Doctor[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockDoctors];
}

export async function fetchDoctor(id: string): Promise<Doctor> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const doctor = mockDoctors.find((d) => d.$id === id);
  if (!doctor) throw new Error('Doctor not found');
  return doctor;
}

export async function createDoctor(data: Partial<Doctor>): Promise<Doctor> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validation
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    throw new Error('Doctor name must be between 2 and 100 characters');
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Valid email is required');
  }
  if (!data.phone) {
    throw new Error('Phone number is required');
  }
  if (data.yearsExperience !== undefined && (data.yearsExperience < 0 || data.yearsExperience > 60)) {
    throw new Error('Years of experience must be between 0 and 60');
  }
  if (data.consultationFee !== undefined && data.consultationFee < 0) {
    throw new Error('Consultation fee must be non-negative');
  }

  const newDoctor: Doctor = {
    $id: String(Date.now()),
    ...data,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  } as Doctor;
  mockDoctors.push(newDoctor);
  return newDoctor;
}

export async function updateDoctor(id: string, data: Partial<Doctor>): Promise<Doctor> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockDoctors.findIndex((d) => d.$id === id);
  if (index === -1) throw new Error('Doctor not found');

  // Validation
  if (data.name && (data.name.length < 2 || data.name.length > 100)) {
    throw new Error('Doctor name must be between 2 and 100 characters');
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Valid email is required');
  }
  if (data.yearsExperience !== undefined && (data.yearsExperience < 0 || data.yearsExperience > 60)) {
    throw new Error('Years of experience must be between 0 and 60');
  }
  if (data.consultationFee !== undefined && data.consultationFee < 0) {
    throw new Error('Consultation fee must be non-negative');
  }

  mockDoctors[index] = {
    ...mockDoctors[index],
    ...data,
    $updatedAt: new Date().toISOString(),
  };
  return mockDoctors[index];
}

export async function deleteDoctor(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  mockDoctors = mockDoctors.filter((d) => d.$id !== id);
}

export async function countDoctors(): Promise<number> {
  return mockDoctors.length;
}

// Patients
export async function fetchPatients(): Promise<Patient[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockPatients];
}

export async function fetchPatient(id: string): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const patient = mockPatients.find((p) => p.$id === id);
  if (!patient) throw new Error('Patient not found');
  return patient;
}

export async function createPatient(data: Partial<Patient>): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validation
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    throw new Error('Patient name must be between 2 and 100 characters');
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Valid email format required');
  }
  if (!data.phone) {
    throw new Error('Phone number is required');
  }

  const newPatient: Patient = {
    $id: String(Date.now()),
    ...data,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  } as Patient;
  mockPatients.push(newPatient);
  return newPatient;
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockPatients.findIndex((p) => p.$id === id);
  if (index === -1) throw new Error('Patient not found');

  // Validation
  if (data.name && (data.name.length < 2 || data.name.length > 100)) {
    throw new Error('Patient name must be between 2 and 100 characters');
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Valid email format required');
  }

  mockPatients[index] = {
    ...mockPatients[index],
    ...data,
    $updatedAt: new Date().toISOString(),
  };
  return mockPatients[index];
}

export async function deletePatient(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  mockPatients = mockPatients.filter((p) => p.$id !== id);
}

export async function countPatients(): Promise<number> {
  return mockPatients.length;
}

// Appointments
export async function fetchAppointments(filters?: {
  date?: string;
  doctorId?: string;
  patientId?: string;
  status?: string;
}): Promise<Appointment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let results = [...mockAppointments];

  if (filters?.date) {
    results = results.filter((a) => a.date === filters.date);
  }
  if (filters?.doctorId) {
    results = results.filter((a) => a.doctorId === filters.doctorId);
  }
  if (filters?.patientId) {
    results = results.filter((a) => a.patientId === filters.patientId);
  }
  if (filters?.status) {
    results = results.filter((a) => a.status === filters.status);
  }

  return results;
}

export async function fetchAppointment(id: string): Promise<Appointment> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const appointment = mockAppointments.find((a) => a.$id === id);
  if (!appointment) throw new Error('Appointment not found');
  return appointment;
}

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validation
  if (!data.patientId) {
    throw new Error('Patient is required');
  }
  if (!data.doctorId) {
    throw new Error('Doctor is required');
  }
  if (!data.date) {
    throw new Error('Date is required');
  }
  if (!data.time || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    throw new Error('Valid time in HH:MM format is required');
  }
  if (data.duration !== undefined && (data.duration < 15 || data.duration > 120)) {
    throw new Error('Duration must be between 15 and 120 minutes');
  }

  const newAppointment: Appointment = {
    $id: String(Date.now()),
    duration: 30,
    status: 'scheduled',
    ...data,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  } as Appointment;
  mockAppointments.push(newAppointment);
  return newAppointment;
}

export async function updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockAppointments.findIndex((a) => a.$id === id);
  if (index === -1) throw new Error('Appointment not found');

  // Validation
  if (data.time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    throw new Error('Valid time in HH:MM format is required');
  }
  if (data.duration !== undefined && (data.duration < 15 || data.duration > 120)) {
    throw new Error('Duration must be between 15 and 120 minutes');
  }

  mockAppointments[index] = {
    ...mockAppointments[index],
    ...data,
    $updatedAt: new Date().toISOString(),
  };
  return mockAppointments[index];
}

export async function deleteAppointment(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  mockAppointments = mockAppointments.filter((a) => a.$id !== id);
}

export async function countAppointments(): Promise<number> {
  return mockAppointments.length;
}

// Helper functions for dashboard
export async function fetchTodayAppointments(): Promise<Appointment[]> {
  const today = new Date().toISOString().split('T')[0];
  return fetchAppointments({ date: today });
}

export async function fetchUpcomingAppointments(limit: number = 5): Promise<Appointment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const today = new Date().toISOString().split('T')[0];
  return mockAppointments
    .filter((a) => a.date >= today)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    })
    .slice(0, limit);
}

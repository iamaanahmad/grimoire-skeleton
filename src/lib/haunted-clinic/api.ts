/**
 * API Client for Haunted Clinic
 *
 * Real Appwrite integration for fetching and mutating data.
 */

import { ID } from 'appwrite';
import {
  databases,
  Query,
  HAUNTED_CLINIC_DB,
  DOCTORS_COLLECTION,
  PATIENTS_COLLECTION,
  APPOINTMENTS_COLLECTION,
} from '@/core/lib/appwrite';
import { Doctor, Patient, Appointment } from '@/types/haunted-clinic/entities';

// ============================================================================
// DOCTORS
// ============================================================================

export async function fetchDoctors(filters?: { speciality?: string; limit?: number }): Promise<Doctor[]> {
  const queries: string[] = [];

  if (filters?.speciality) {
    queries.push(Query.equal('speciality', filters.speciality));
  }
  if (filters?.limit) {
    queries.push(Query.limit(filters.limit));
  }

  queries.push(Query.orderDesc('$createdAt'));

  const response = await databases.listDocuments(
    HAUNTED_CLINIC_DB,
    DOCTORS_COLLECTION,
    queries
  );

  return response.documents as unknown as Doctor[];
}

export async function fetchDoctor(id: string): Promise<Doctor> {
  const response = await databases.getDocument(
    HAUNTED_CLINIC_DB,
    DOCTORS_COLLECTION,
    id
  );
  return response as unknown as Doctor;
}

export async function createDoctor(data: Partial<Doctor>): Promise<Doctor> {
  // Validation
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    throw new Error('Doctor name must be between 2 and 100 characters');
  }
  if (data.yearsExperience !== undefined && (data.yearsExperience < 0 || data.yearsExperience > 60)) {
    throw new Error('Years of experience must be between 0 and 60');
  }

  const response = await databases.createDocument(
    HAUNTED_CLINIC_DB,
    DOCTORS_COLLECTION,
    ID.unique(),
    {
      name: data.name,
      speciality: data.speciality || 'General Practice',
      yearsExperience: data.yearsExperience || 0,
      phone: data.phone || '',
    }
  );

  return response as unknown as Doctor;
}

export async function updateDoctor(id: string, data: Partial<Doctor>): Promise<Doctor> {
  // Validation
  if (data.name && (data.name.length < 2 || data.name.length > 100)) {
    throw new Error('Doctor name must be between 2 and 100 characters');
  }
  if (data.yearsExperience !== undefined && (data.yearsExperience < 0 || data.yearsExperience > 60)) {
    throw new Error('Years of experience must be between 0 and 60');
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.speciality !== undefined) updateData.speciality = data.speciality;
  if (data.yearsExperience !== undefined) updateData.yearsExperience = data.yearsExperience;
  if (data.phone !== undefined) updateData.phone = data.phone;

  const response = await databases.updateDocument(
    HAUNTED_CLINIC_DB,
    DOCTORS_COLLECTION,
    id,
    updateData
  );

  return response as unknown as Doctor;
}

export async function deleteDoctor(id: string): Promise<void> {
  await databases.deleteDocument(HAUNTED_CLINIC_DB, DOCTORS_COLLECTION, id);
}

export async function countDoctors(): Promise<number> {
  const response = await databases.listDocuments(
    HAUNTED_CLINIC_DB,
    DOCTORS_COLLECTION,
    [Query.limit(1)]
  );
  return response.total;
}

// ============================================================================
// PATIENTS
// ============================================================================

export async function fetchPatients(filters?: { bloodType?: string; limit?: number }): Promise<Patient[]> {
  const queries: string[] = [];

  if (filters?.bloodType) {
    queries.push(Query.equal('bloodType', filters.bloodType));
  }
  if (filters?.limit) {
    queries.push(Query.limit(filters.limit));
  }

  queries.push(Query.orderDesc('$createdAt'));

  const response = await databases.listDocuments(
    HAUNTED_CLINIC_DB,
    PATIENTS_COLLECTION,
    queries
  );

  return response.documents as unknown as Patient[];
}

export async function fetchPatient(id: string): Promise<Patient> {
  const response = await databases.getDocument(
    HAUNTED_CLINIC_DB,
    PATIENTS_COLLECTION,
    id
  );
  return response as unknown as Patient;
}

export async function createPatient(data: Partial<Patient>): Promise<Patient> {
  // Validation
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    throw new Error('Patient name must be between 2 and 100 characters');
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Valid email format required');
  }

  const response = await databases.createDocument(
    HAUNTED_CLINIC_DB,
    PATIENTS_COLLECTION,
    ID.unique(),
    {
      name: data.name,
      phone: data.phone || '',
      email: data.email || '',
      bloodType: data.bloodType || '',
    }
  );

  return response as unknown as Patient;
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
  // Validation
  if (data.name && (data.name.length < 2 || data.name.length > 100)) {
    throw new Error('Patient name must be between 2 and 100 characters');
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Valid email format required');
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.bloodType !== undefined) updateData.bloodType = data.bloodType;

  const response = await databases.updateDocument(
    HAUNTED_CLINIC_DB,
    PATIENTS_COLLECTION,
    id,
    updateData
  );

  return response as unknown as Patient;
}

export async function deletePatient(id: string): Promise<void> {
  await databases.deleteDocument(HAUNTED_CLINIC_DB, PATIENTS_COLLECTION, id);
}

export async function countPatients(): Promise<number> {
  const response = await databases.listDocuments(
    HAUNTED_CLINIC_DB,
    PATIENTS_COLLECTION,
    [Query.limit(1)]
  );
  return response.total;
}

// ============================================================================
// APPOINTMENTS
// ============================================================================

export async function fetchAppointments(filters?: {
  date?: string;
  doctorId?: string;
  patientId?: string;
  status?: string;
  limit?: number;
}): Promise<Appointment[]> {
  const queries: string[] = [];

  if (filters?.date) {
    queries.push(Query.equal('date', filters.date));
  }
  if (filters?.doctorId) {
    queries.push(Query.equal('doctorId', filters.doctorId));
  }
  if (filters?.patientId) {
    queries.push(Query.equal('patientId', filters.patientId));
  }
  if (filters?.status) {
    queries.push(Query.equal('status', filters.status));
  }
  if (filters?.limit) {
    queries.push(Query.limit(filters.limit));
  }

  queries.push(Query.orderDesc('$createdAt'));

  const response = await databases.listDocuments(
    HAUNTED_CLINIC_DB,
    APPOINTMENTS_COLLECTION,
    queries
  );

  return response.documents as unknown as Appointment[];
}

export async function fetchAppointment(id: string): Promise<Appointment> {
  const response = await databases.getDocument(
    HAUNTED_CLINIC_DB,
    APPOINTMENTS_COLLECTION,
    id
  );
  return response as unknown as Appointment;
}

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
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

  // Fetch patient name for denormalized storage
  let patientName = 'Unknown Patient';
  try {
    const patient = await fetchPatient(data.patientId);
    patientName = patient.name;
  } catch {
    // Use default if patient not found
  }

  const response = await databases.createDocument(
    HAUNTED_CLINIC_DB,
    APPOINTMENTS_COLLECTION,
    ID.unique(),
    {
      patientId: data.patientId,
      doctorId: data.doctorId,
      patientName: patientName,
      date: data.date,
      time: data.time,
      status: data.status || 'scheduled',
      reason: data.reason || '',
    }
  );

  return response as unknown as Appointment;
}

export async function updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
  // Validation
  if (data.time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    throw new Error('Valid time in HH:MM format is required');
  }

  const updateData: Record<string, unknown> = {};

  if (data.patientId !== undefined) updateData.patientId = data.patientId;
  if (data.doctorId !== undefined) updateData.doctorId = data.doctorId;
  if (data.date !== undefined) updateData.date = data.date;
  if (data.time !== undefined) updateData.time = data.time;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.reason !== undefined) updateData.reason = data.reason;

  const response = await databases.updateDocument(
    HAUNTED_CLINIC_DB,
    APPOINTMENTS_COLLECTION,
    id,
    updateData
  );

  return response as unknown as Appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  await databases.deleteDocument(HAUNTED_CLINIC_DB, APPOINTMENTS_COLLECTION, id);
}

export async function countAppointments(): Promise<number> {
  const response = await databases.listDocuments(
    HAUNTED_CLINIC_DB,
    APPOINTMENTS_COLLECTION,
    [Query.limit(1)]
  );
  return response.total;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export async function fetchTodayAppointments(): Promise<Appointment[]> {
  const today = new Date().toISOString().split('T')[0];
  return fetchAppointments({ date: today });
}

export async function fetchUpcomingAppointments(limit: number = 5): Promise<Appointment[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const response = await databases.listDocuments(
    HAUNTED_CLINIC_DB,
    APPOINTMENTS_COLLECTION,
    [
      Query.greaterThanEqual('date', today),
      Query.orderAsc('date'),
      Query.limit(limit),
    ]
  );

  return response.documents as unknown as Appointment[];
}

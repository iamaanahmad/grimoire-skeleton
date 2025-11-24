/**
 * Haunted Clinic Entity Type Definitions
 * Generated automatically by Grimoire Entity System
 */

// Doctor Entity
export interface Doctor {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  speciality:
    | 'General Practice'
    | 'Cardiology'
    | 'Dermatology'
    | 'Neurology'
    | 'Orthopedics'
    | 'Pediatrics'
    | 'Psychiatry';
  email: string;
  phone: string;
  yearsExperience?: number;
  bio?: string;
  availableDays?: string;
  consultationFee?: number;
}

export interface CreateDoctorDTO {
  name: string;
  speciality:
    | 'General Practice'
    | 'Cardiology'
    | 'Dermatology'
    | 'Neurology'
    | 'Orthopedics'
    | 'Pediatrics'
    | 'Psychiatry';
  email: string;
  phone: string;
  yearsExperience?: number;
  bio?: string;
  availableDays?: string;
  consultationFee?: number;
}

export interface UpdateDoctorDTO extends Partial<CreateDoctorDTO> {
  $id: string;
}

// Patient Entity
export interface Patient {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email?: string;
  phone: string;
  dateOfBirth?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string;
  emergencyContact?: string;
}

export interface CreatePatientDTO {
  name: string;
  email?: string;
  phone: string;
  dateOfBirth?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string;
  emergencyContact?: string;
}

export interface UpdatePatientDTO extends Partial<CreatePatientDTO> {
  $id: string;
}

// Appointment Entity
export interface Appointment {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration?: number;
  status?: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
}

export interface CreateAppointmentDTO {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration?: number;
  status?: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {
  $id: string;
}

export interface AppointmentWithPatient extends Appointment {
  patient?: Patient;
  doctor?: Doctor;
}

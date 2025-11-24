/**
 * Haunted Clinic Entity Definitions
 * 
 * Declarative entity configurations for doctors, patients, and appointments.
 * These definitions drive the entity generator to create CRUD functionality.
 */

import { EntityDefinition } from '@/core/types/entity';

/**
 * Doctor Entity
 * Represents medical professionals available for appointments.
 */
export const doctor: EntityDefinition = {
  fields: {
    name: {
      type: 'string',
      required: true,
      label: 'Doctor Name',
      validation: { min: 2, max: 100 },
    },
    speciality: {
      type: 'enum',
      required: true,
      label: 'Speciality',
      options: [
        'General Practice',
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
      ],
    },
    email: {
      type: 'string',
      required: true,
      label: 'Email',
      validation: { email: true },
    },
    phone: {
      type: 'string',
      required: true,
      label: 'Phone',
    },
    yearsExperience: {
      type: 'number',
      label: 'Years of Experience',
      validation: { min: 0, max: 60 },
    },
    bio: {
      type: 'string',
      label: 'Bio',
    },
    availableDays: {
      type: 'string',
      label: 'Available Days',
    },
    consultationFee: {
      type: 'number',
      label: 'Consultation Fee',
      validation: { min: 0 },
    },
  },
  permissions: {
    read: ['admin', 'staff'],
    write: ['admin', 'staff'],
    delete: ['admin', 'staff'],
  },
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '👨‍⚕️',
    singular: 'Doctor',
    plural: 'Doctors',
    listColumns: ['name', 'speciality', 'yearsExperience', 'phone'],
    sortBy: 'name',
    sortOrder: 'asc',
  },
  collectionId: 'doctors',
  databaseId: 'haunted_clinic',
};

/**
 * Patient Entity
 * Represents patients who book appointments.
 * IMPORTANT: Only synthetic test data should be used.
 */
export const patient: EntityDefinition = {
  fields: {
    name: {
      type: 'string',
      required: true,
      label: 'Patient Name',
      validation: { min: 2, max: 100 },
    },
    email: {
      type: 'string',
      label: 'Email',
      validation: { email: true },
    },
    phone: {
      type: 'string',
      required: true,
      label: 'Phone',
    },
    dateOfBirth: {
      type: 'date',
      label: 'Date of Birth',
    },
    bloodType: {
      type: 'enum',
      label: 'Blood Type',
      options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    allergies: {
      type: 'string',
      label: 'Allergies',
    },
    emergencyContact: {
      type: 'string',
      label: 'Emergency Contact',
    },
  },
  permissions: {
    read: ['admin', 'staff'],
    write: ['admin', 'staff'],
    delete: ['admin', 'staff'],
  },
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '🧑‍🦱',
    singular: 'Patient',
    plural: 'Patients',
    listColumns: ['name', 'phone', 'email', 'bloodType'],
    sortBy: 'name',
    sortOrder: 'asc',
  },
  collectionId: 'patients',
  databaseId: 'haunted_clinic',
};

/**
 * Appointment Entity
 * Represents scheduled appointments between patients and doctors.
 */
export const appointment: EntityDefinition = {
  fields: {
    patientId: {
      type: 'reference',
      required: true,
      label: 'Patient',
      reference: 'patient',
    },
    doctorId: {
      type: 'reference',
      required: true,
      label: 'Doctor',
      reference: 'doctor',
    },
    date: {
      type: 'date',
      required: true,
      label: 'Date',
    },
    time: {
      type: 'string',
      required: true,
      label: 'Time',
      validation: { pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    },
    duration: {
      type: 'number',
      label: 'Duration (minutes)',
      defaultValue: 30,
      validation: { min: 15, max: 120 },
    },
    status: {
      type: 'enum',
      label: 'Status',
      options: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
      defaultValue: 'scheduled',
    },
    reason: {
      type: 'string',
      label: 'Reason for Visit',
    },
    notes: {
      type: 'string',
      label: 'Notes',
    },
  },
  permissions: {
    read: ['admin', 'staff'],
    write: ['admin', 'staff'],
    delete: ['admin', 'staff'],
  },
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '📅',
    singular: 'Appointment',
    plural: 'Appointments',
    listColumns: ['patientId', 'doctorId', 'date', 'time', 'status'],
    sortBy: 'date',
    sortOrder: 'asc',
  },
  collectionId: 'appointments',
  databaseId: 'haunted_clinic',
};

/**
 * Entity Registry
 * Central registry of all entities in the Haunted Clinic application.
 */
export const entityRegistry = {
  doctor,
  patient,
  appointment,
};

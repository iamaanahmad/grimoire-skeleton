/**
 * Haunted Clinic Data Seeding Script
 * 
 * Populates the application with synthetic test data.
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 * 
 * IMPORTANT: This script uses ONLY synthetic test data.
 * No real patient information is stored.
 */

import { createDoctor, createPatient, createAppointment, fetchDoctors, fetchPatients } from '@/lib/haunted-clinic/api';

/**
 * Sample doctor data with spooky names
 */
const sampleDoctors = [
  {
    name: 'Dr. Victor Frankenstein',
    speciality: 'General Practice' as const,
    email: 'v.frankenstein@hauntedclinic.com',
    phone: '555-0101',
    yearsExperience: 15,
    bio: 'Specializes in bringing life to medical practice.',
    availableDays: 'Mon, Wed, Fri',
    consultationFee: 150,
  },
  {
    name: 'Dr. Jekyll Hyde',
    speciality: 'Psychiatry' as const,
    email: 'j.hyde@hauntedclinic.com',
    phone: '555-0102',
    yearsExperience: 12,
    bio: 'Expert in dual diagnosis and personality disorders.',
    availableDays: 'Tue, Thu',
    consultationFee: 200,
  },
  {
    name: 'Dr. Mina Harker',
    speciality: 'Cardiology' as const,
    email: 'm.harker@hauntedclinic.com',
    phone: '555-0103',
    yearsExperience: 20,
    bio: 'Cardiovascular specialist with a focus on blood circulation.',
    availableDays: 'Mon, Tue, Wed, Thu, Fri',
    consultationFee: 250,
  },
  {
    name: 'Dr. Herbert West',
    speciality: 'Neurology' as const,
    email: 'h.west@hauntedclinic.com',
    phone: '555-0104',
    yearsExperience: 8,
    bio: 'Neurological reanimation and brain function specialist.',
    availableDays: 'Wed, Thu, Fri',
    consultationFee: 180,
  },
  {
    name: 'Dr. Carmilla Karnstein',
    speciality: 'Dermatology' as const,
    email: 'c.karnstein@hauntedclinic.com',
    phone: '555-0105',
    yearsExperience: 18,
    bio: 'Skin care specialist with expertise in photosensitivity.',
    availableDays: 'Mon, Wed, Fri',
    consultationFee: 175,
  },
];

/**
 * Sample patient data (SYNTHETIC ONLY - no real information)
 */
const samplePatients = [
  {
    name: 'Morticia Addams',
    email: 'morticia@example.com',
    phone: '555-0201',
    dateOfBirth: '1990-10-31',
    bloodType: 'AB-' as const,
    allergies: 'Sunlight',
    emergencyContact: 'Gomez Addams - 555-0202',
  },
  {
    name: 'Count Dracula',
    email: 'count@example.com',
    phone: '555-0203',
    dateOfBirth: '1897-05-26',
    bloodType: 'O-' as const,
    allergies: 'Garlic, Crosses',
    emergencyContact: 'Renfield - 555-0204',
  },
  {
    name: 'Wednesday Addams',
    email: 'wednesday@example.com',
    phone: '555-0205',
    dateOfBirth: '2005-11-13',
    bloodType: 'A+' as const,
    allergies: 'Happiness',
    emergencyContact: 'Morticia Addams - 555-0201',
  },
  {
    name: 'Lily Munster',
    email: 'lily@example.com',
    phone: '555-0206',
    dateOfBirth: '1964-09-24',
    bloodType: 'B+' as const,
    allergies: 'Silver',
    emergencyContact: 'Herman Munster - 555-0207',
  },
  {
    name: 'Edward Scissorhands',
    email: 'edward@example.com',
    phone: '555-0208',
    dateOfBirth: '1990-12-07',
    bloodType: 'AB+' as const,
    allergies: 'None',
    emergencyContact: 'Kim Boggs - 555-0209',
  },
  {
    name: 'Elvira Hancock',
    email: 'elvira@example.com',
    phone: '555-0210',
    dateOfBirth: '1985-06-15',
    bloodType: 'O+' as const,
    allergies: 'Pollen',
    emergencyContact: 'Tony Montana - 555-0211',
  },
];

/**
 * Seed doctors into the system
 */
async function seedDoctors() {
  console.log('🩺 Seeding doctors...');
  
  const existingDoctors = await fetchDoctors();
  
  for (const doctorData of sampleDoctors) {
    // Check if doctor already exists (idempotent seeding)
    const exists = existingDoctors.some(d => d.email === doctorData.email);
    
    if (!exists) {
      try {
        const doctor = await createDoctor(doctorData);
        console.log(`  ✓ Created doctor: ${doctor.name}`);
      } catch (error) {
        console.error(`  ✗ Failed to create doctor ${doctorData.name}:`, error);
      }
    } else {
      console.log(`  ⊙ Doctor already exists: ${doctorData.name}`);
    }
  }
  
  console.log('');
}

/**
 * Seed patients into the system
 */
async function seedPatients() {
  console.log('🧑‍🦱 Seeding patients...');
  
  const existingPatients = await fetchPatients();
  
  for (const patientData of samplePatients) {
    // Check if patient already exists (idempotent seeding)
    const exists = existingPatients.some(p => p.email === patientData.email);
    
    if (!exists) {
      try {
        const patient = await createPatient(patientData);
        console.log(`  ✓ Created patient: ${patient.name}`);
      } catch (error) {
        console.error(`  ✗ Failed to create patient ${patientData.name}:`, error);
      }
    } else {
      console.log(`  ⊙ Patient already exists: ${patientData.name}`);
    }
  }
  
  console.log('');
}

/**
 * Seed appointments into the system
 */
async function seedAppointments() {
  console.log('📅 Seeding appointments...');
  
  const doctors = await fetchDoctors();
  const patients = await fetchPatients();
  
  if (doctors.length === 0 || patients.length === 0) {
    console.log('  ⚠ No doctors or patients found. Skipping appointment seeding.');
    return;
  }
  
  // Get today's date and upcoming dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  // Sample appointments with variety of statuses and times
  const sampleAppointments = [
    {
      patientId: patients[0]?.$id,
      doctorId: doctors[0]?.$id,
      date: formatDate(today),
      time: '09:00',
      duration: 30,
      status: 'confirmed' as const,
      reason: 'Annual checkup',
      notes: 'Patient prefers dim lighting',
    },
    {
      patientId: patients[1]?.$id,
      doctorId: doctors[0]?.$id,
      date: formatDate(today),
      time: '10:30',
      duration: 45,
      status: 'in-progress' as const,
      reason: 'Blood work review',
      notes: 'Fasting required',
    },
    {
      patientId: patients[2]?.$id,
      doctorId: doctors[1]?.$id,
      date: formatDate(today),
      time: '14:00',
      duration: 60,
      status: 'scheduled' as const,
      reason: 'Therapy session',
      notes: 'Regular weekly session',
    },
    {
      patientId: patients[3]?.$id,
      doctorId: doctors[2]?.$id,
      date: formatDate(tomorrow),
      time: '11:00',
      duration: 30,
      status: 'confirmed' as const,
      reason: 'Cardiac consultation',
      notes: 'Bring previous ECG results',
    },
    {
      patientId: patients[4]?.$id,
      doctorId: doctors[3]?.$id,
      date: formatDate(tomorrow),
      time: '15:30',
      duration: 45,
      status: 'scheduled' as const,
      reason: 'Neurological assessment',
      notes: 'First visit',
    },
    {
      patientId: patients[5]?.$id,
      doctorId: doctors[4]?.$id,
      date: formatDate(nextWeek),
      time: '10:00',
      duration: 30,
      status: 'scheduled' as const,
      reason: 'Skin examination',
      notes: 'Follow-up from previous treatment',
    },
  ];
  
  for (const appointmentData of sampleAppointments) {
    if (!appointmentData.patientId || !appointmentData.doctorId) {
      console.log('  ⚠ Skipping appointment due to missing patient or doctor');
      continue;
    }
    
    try {
      const appointment = await createAppointment(appointmentData);
      console.log(`  ✓ Created appointment: ${appointmentData.date} at ${appointmentData.time}`);
    } catch (error) {
      console.error(`  ✗ Failed to create appointment:`, error);
    }
  }
  
  console.log('');
}

/**
 * Main seeding function
 */
async function main() {
  console.log('🏥 Haunted Clinic Data Seeding');
  console.log('================================\n');
  console.log('⚠️  Using SYNTHETIC test data only\n');
  
  try {
    await seedDoctors();
    await seedPatients();
    await seedAppointments();
    
    console.log('✅ Seeding complete!\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding script
main().catch(console.error);

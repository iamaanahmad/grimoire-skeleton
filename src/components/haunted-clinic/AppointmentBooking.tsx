'use client';

/**
 * AppointmentBooking Component
 * 
 * Multi-step booking flow for creating appointments.
 * Guides users through doctor selection, date/time selection, patient info, and confirmation.
 * 
 * Requirements: 6.1, 6.2, 6.4
 */

import { useState, useEffect } from 'react';
import { Doctor, Patient, CreateAppointmentDTO, CreatePatientDTO } from '@/types/haunted-clinic/entities';
import { fetchDoctors, fetchAppointments, fetchPatients, createPatient } from '@/lib/haunted-clinic/api';

// Step definitions
type BookingStep = 1 | 2 | 3 | 4 | 5;

/**
 * TimeSlotPicker Component
 * Displays available time slots and checks for conflicts
 */
interface TimeSlotPickerProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  existingAppointments: any[];
  duration: number;
}

function TimeSlotPicker({
  selectedTime,
  onSelectTime,
  existingAppointments,
  duration,
}: TimeSlotPickerProps) {
  // Generate time slots from 8 AM to 6 PM in 30-minute intervals
  const timeSlots: string[] = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  function isTimeSlotAvailable(time: string): boolean {
    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + duration;

    // Check if this slot conflicts with any existing appointment
    return !existingAppointments.some((apt) => {
      const [aptHours, aptMinutes] = apt.time.split(':').map(Number);
      const aptStart = aptHours * 60 + aptMinutes;
      const aptEnd = aptStart + (apt.duration || 30);

      // Check for overlap
      return (slotStart < aptEnd && slotEnd > aptStart);
    });
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-3">Available Time Slots</label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto">
        {timeSlots.map((time) => {
          const isAvailable = isTimeSlotAvailable(time);
          const isSelected = selectedTime === time;

          return (
            <button
              key={time}
              onClick={() => isAvailable && onSelectTime(time)}
              disabled={!isAvailable}
              className={`
                px-3 py-2 rounded-lg text-sm transition-all
                ${isSelected ? 'bg-accent text-bg-primary font-bold' : ''}
                ${!isSelected && isAvailable ? 'bg-bg-tertiary hover:bg-accent/20' : ''}
                ${!isAvailable ? 'bg-bg-tertiary/30 text-text-secondary/50 cursor-not-allowed line-through' : ''}
              `}
            >
              {time}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-text-secondary mt-3">
        Crossed out times are already booked
      </p>
    </div>
  );
}

/**
 * DatePicker Component
 * Calendar picker that highlights available days and disables past dates
 */
interface DatePickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  availableDays?: string;
}

function DatePicker({ selectedDate, onSelectDate, availableDays }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Parse available days (e.g., "Mon, Wed, Fri")
  const availableDayNames = availableDays
    ? availableDays.split(',').map((d) => d.trim().toLowerCase())
    : null;

  const dayNameMap: Record<string, number> = {
    sun: 0,
    sunday: 0,
    mon: 1,
    monday: 1,
    tue: 2,
    tuesday: 2,
    wed: 3,
    wednesday: 3,
    thu: 4,
    thursday: 4,
    fri: 5,
    friday: 5,
    sat: 6,
    saturday: 6,
  };

  function isDayAvailable(date: Date): boolean {
    if (!availableDayNames) return true;

    const dayOfWeek = date.getDay();
    return availableDayNames.some((dayName) => dayNameMap[dayName] === dayOfWeek);
  }

  function isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  function getDaysInMonth(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add padding days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const paddingDate = new Date(year, month, -i);
      days.push(paddingDate);
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function isSelectedDate(date: Date): boolean {
    return selectedDate === formatDate(date);
  }

  function handlePreviousMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  }

  function handleNextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  }

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-md mx-auto">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="px-3 py-1 bg-bg-tertiary hover:bg-bg-tertiary/80 rounded transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-bg-tertiary hover:bg-bg-tertiary/80 rounded transition-colors"
        >
          →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm text-text-secondary font-semibold">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isPast = isPastDate(date);
          const isAvailable = isDayAvailable(date);
          const isSelected = isSelectedDate(date);
          const isDisabled = isPast || !isAvailable;

          return (
            <button
              key={index}
              onClick={() => !isDisabled && onSelectDate(formatDate(date))}
              disabled={isDisabled}
              className={`
                aspect-square p-2 rounded-lg text-sm transition-all
                ${!isCurrentMonth ? 'text-text-secondary/30' : ''}
                ${isDisabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-accent/20'}
                ${isSelected ? 'bg-accent text-bg-primary font-bold' : 'bg-bg-tertiary'}
                ${!isDisabled && !isSelected && isAvailable ? 'border-2 border-accent/30' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {availableDays && (
        <p className="text-xs text-text-secondary mt-4 text-center">
          Dates with colored borders are available for booking
        </p>
      )}
    </div>
  );
}

interface BookingFlowState {
  currentStep: BookingStep;
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedPatient: Patient | null;
  duration: number;
  reason: string;
  notes: string;
}

interface AppointmentBookingProps {
  onComplete?: (appointmentId: string) => void;
  onCancel?: () => void;
}

/**
 * Main booking flow component with step navigation
 */
export default function AppointmentBooking({ onComplete, onCancel }: AppointmentBookingProps) {
  const [state, setState] = useState<BookingFlowState>({
    currentStep: 1,
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,
    selectedPatient: null,
    duration: 30,
    reason: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Doctor selection state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState<string>('all');

  // Step 3: Time slot state
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Step 4: Patient selection state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatientData, setNewPatientData] = useState<Partial<CreatePatientDTO>>({});
  const [creatingPatient, setCreatingPatient] = useState(false);

  // Load doctors and patients on mount
  useEffect(() => {
    loadDoctors();
    loadPatients();
  }, []);

  async function loadDoctors() {
    setLoadingDoctors(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  }

  async function loadPatients() {
    setLoadingPatients(true);
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (err) {
      setError('Failed to load patients');
    } finally {
      setLoadingPatients(false);
    }
  }

  async function handleCreateNewPatient() {
    if (!newPatientData.name || !newPatientData.phone) {
      setError('Patient name and phone are required');
      return;
    }

    setCreatingPatient(true);
    setError(null);

    try {
      const patient = await createPatient(newPatientData as CreatePatientDTO);
      setPatients([...patients, patient]);
      updateState({ selectedPatient: patient });
      setShowNewPatientForm(false);
      setNewPatientData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
    } finally {
      setCreatingPatient(false);
    }
  }

  // Filter doctors based on search and speciality
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      searchQuery === '' ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpeciality = specialityFilter === 'all' || doctor.speciality === specialityFilter;

    return matchesSearch && matchesSpeciality;
  });

  // Get unique specialities for filter
  const specialities = Array.from(new Set(doctors.map((d) => d.speciality))).sort();

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) => {
    return (
      patientSearchQuery === '' ||
      patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      patient.phone.includes(patientSearchQuery) ||
      (patient.email && patient.email.toLowerCase().includes(patientSearchQuery.toLowerCase()))
    );
  });

  // Load existing appointments when date and doctor are selected
  useEffect(() => {
    if (state.selectedDate && state.selectedDoctor) {
      loadExistingAppointments();
    }
  }, [state.selectedDate, state.selectedDoctor]);

  async function loadExistingAppointments() {
    if (!state.selectedDate || !state.selectedDoctor) return;

    setLoadingAppointments(true);
    try {
      const appointments = await fetchAppointments({
        date: state.selectedDate,
        doctorId: state.selectedDoctor.$id,
      });
      setExistingAppointments(appointments);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoadingAppointments(false);
    }
  }

  // Navigation helpers
  const canGoBack = state.currentStep > 1;
  const canGoForward = isStepValid(state.currentStep, state);

  /**
   * Validate if current step has required data
   */
  function isStepValid(step: BookingStep, currentState: BookingFlowState): boolean {
    switch (step) {
      case 1:
        return currentState.selectedDoctor !== null;
      case 2:
        return currentState.selectedDate !== null;
      case 3:
        return currentState.selectedTime !== null;
      case 4:
        return currentState.selectedPatient !== null;
      case 5:
        return true; // Confirmation step is always valid if we got here
      default:
        return false;
    }
  }

  /**
   * Navigate to previous step
   */
  function handleBack() {
    if (canGoBack) {
      setState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep - 1) as BookingStep,
      }));
      setError(null);
    }
  }

  /**
   * Navigate to next step
   */
  function handleNext() {
    if (canGoForward) {
      setState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep + 1) as BookingStep,
      }));
      setError(null);
    }
  }

  /**
   * Jump to a specific step (for editing from confirmation)
   */
  function jumpToStep(step: BookingStep) {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }));
    setError(null);
  }

  /**
   * Update state with new values
   */
  function updateState(updates: Partial<BookingFlowState>) {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  }

  /**
   * Submit the appointment
   */
  async function handleSubmit() {
    if (!state.selectedDoctor || !state.selectedDate || !state.selectedTime || !state.selectedPatient) {
      setError('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const appointmentData: CreateAppointmentDTO = {
        doctorId: state.selectedDoctor.$id,
        patientId: state.selectedPatient.$id,
        date: state.selectedDate,
        time: state.selectedTime,
        duration: state.duration,
        status: 'scheduled',
        reason: state.reason || undefined,
        notes: state.notes || undefined,
      };

      // Import dynamically to avoid circular dependencies
      const { createAppointment } = await import('@/lib/haunted-clinic/api');
      const appointment = await createAppointment(appointmentData);

      if (onComplete) {
        onComplete(appointment.$id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  transition-colors duration-200
                  ${
                    step === state.currentStep
                      ? 'bg-accent text-bg-primary'
                      : step < state.currentStep
                      ? 'bg-accent/70 text-bg-primary'
                      : 'bg-bg-tertiary text-text-secondary'
                  }
                `}
              >
                {step}
              </div>
              {step < 5 && (
                <div
                  className={`
                    flex-1 h-1 mx-2
                    ${step < state.currentStep ? 'bg-accent/70' : 'bg-bg-tertiary'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-text-secondary mt-2">
          <span>Doctor</span>
          <span>Date</span>
          <span>Time</span>
          <span>Patient</span>
          <span>Confirm</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-bg-secondary rounded-lg p-6 mb-6 min-h-[400px]">
        {state.currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Doctor</h2>
            <p className="text-text-secondary mb-6">Choose a doctor for your appointment</p>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or speciality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="sm:w-64">
                <select
                  value={specialityFilter}
                  onChange={(e) => setSpecialityFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Specialities</option>
                  {specialities.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctor List */}
            {loadingDoctors ? (
              <div className="text-center py-12 text-text-secondary">Loading doctors...</div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                No doctors found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.$id}
                    onClick={() => updateState({ selectedDoctor: doctor })}
                    className={`
                      text-left p-4 rounded-lg border-2 transition-all
                      ${
                        state.selectedDoctor?.$id === doctor.$id
                          ? 'border-accent bg-accent/10'
                          : 'border-border bg-bg-tertiary hover:border-accent/50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-text-primary">{doctor.name}</h3>
                        <span className="inline-block px-2 py-1 text-xs rounded bg-accent/20 text-accent mt-1">
                          {doctor.speciality}
                        </span>
                      </div>
                      {state.selectedDoctor?.$id === doctor.$id && (
                        <span className="text-accent text-xl">✓</span>
                      )}
                    </div>

                    {doctor.yearsExperience !== undefined && (
                      <p className="text-sm text-text-secondary mb-1">
                        {doctor.yearsExperience} years experience
                      </p>
                    )}

                    {doctor.consultationFee !== undefined && (
                      <p className="text-sm text-text-primary font-semibold">
                        ${doctor.consultationFee} consultation fee
                      </p>
                    )}

                    {doctor.bio && (
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">{doctor.bio}</p>
                    )}

                    {doctor.availableDays && (
                      <p className="text-xs text-text-secondary mt-2">
                        Available: {doctor.availableDays}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {state.currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Date</h2>
            <p className="text-text-secondary mb-6">
              Choose an appointment date
              {state.selectedDoctor && ` with ${state.selectedDoctor.name}`}
            </p>

            {state.selectedDoctor && state.selectedDoctor.availableDays && (
              <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-accent">Available days:</span>{' '}
                  {state.selectedDoctor.availableDays}
                </p>
              </div>
            )}

            <DatePicker
              selectedDate={state.selectedDate}
              onSelectDate={(date) => updateState({ selectedDate: date })}
              availableDays={state.selectedDoctor?.availableDays}
            />
          </div>
        )}

        {state.currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Time Slot</h2>
            <p className="text-text-secondary mb-6">
              Choose a time for your appointment on{' '}
              {state.selectedDate &&
                new Date(state.selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </p>

            {/* Duration Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Appointment Duration</label>
              <div className="flex flex-wrap gap-2">
                {[15, 30, 60, 90, 120].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => updateState({ duration: minutes })}
                    className={`
                      px-4 py-2 rounded-lg transition-all
                      ${
                        state.duration === minutes
                          ? 'bg-accent text-bg-primary font-semibold'
                          : 'bg-bg-tertiary text-text-primary hover:bg-bg-tertiary/80'
                      }
                    `}
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {loadingAppointments ? (
              <div className="text-center py-12 text-text-secondary">Loading available times...</div>
            ) : (
              <TimeSlotPicker
                selectedTime={state.selectedTime}
                onSelectTime={(time) => updateState({ selectedTime: time })}
                existingAppointments={existingAppointments}
                duration={state.duration}
              />
            )}
          </div>
        )}

        {state.currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Enter Patient Information</h2>
            <p className="text-text-secondary mb-6">Select an existing patient or create a new one</p>

            {!showNewPatientForm ? (
              <>
                {/* Patient Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search patients by name, phone, or email..."
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* Create New Patient Button */}
                <button
                  onClick={() => setShowNewPatientForm(true)}
                  className="w-full mb-4 px-4 py-3 bg-accent/20 hover:bg-accent/30 border-2 border-accent border-dashed rounded-lg text-accent font-semibold transition-colors"
                >
                  + Create New Patient
                </button>

                {/* Patient List */}
                {loadingPatients ? (
                  <div className="text-center py-12 text-text-secondary">Loading patients...</div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-12 text-text-secondary">
                    No patients found matching your search
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.$id}
                        onClick={() => updateState({ selectedPatient: patient })}
                        className={`
                          w-full text-left p-4 rounded-lg border-2 transition-all
                          ${
                            state.selectedPatient?.$id === patient.$id
                              ? 'border-accent bg-accent/10'
                              : 'border-border bg-bg-tertiary hover:border-accent/50'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-text-primary">{patient.name}</h3>
                            <p className="text-sm text-text-secondary">{patient.phone}</p>
                            {patient.email && (
                              <p className="text-sm text-text-secondary">{patient.email}</p>
                            )}
                            {patient.bloodType && (
                              <span className="inline-block px-2 py-0.5 text-xs rounded bg-accent/20 text-accent mt-1">
                                {patient.bloodType}
                              </span>
                            )}
                          </div>
                          {state.selectedPatient?.$id === patient.$id && (
                            <span className="text-accent text-xl">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* New Patient Form */}
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPatientData.name || ''}
                      onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newPatientData.phone || ''}
                      onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={newPatientData.email || ''}
                      onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newPatientData.dateOfBirth || ''}
                      onChange={(e) =>
                        setNewPatientData({ ...newPatientData, dateOfBirth: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Blood Type</label>
                    <select
                      value={newPatientData.bloodType || ''}
                      onChange={(e) =>
                        setNewPatientData({
                          ...newPatientData,
                          bloodType: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select blood type</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNewPatientForm(false);
                      setNewPatientData({});
                    }}
                    disabled={creatingPatient}
                    className="flex-1 px-4 py-2 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNewPatient}
                    disabled={creatingPatient || !newPatientData.name || !newPatientData.phone}
                    className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-bg-primary font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingPatient ? 'Creating...' : 'Create Patient'}
                  </button>
                </div>
              </>
            )}

            {/* Reason and Notes */}
            {state.selectedPatient && !showNewPatientForm && (
              <div className="mt-6 space-y-4 pt-6 border-t border-border">
                <div>
                  <label className="block text-sm font-semibold mb-1">Reason for Visit</label>
                  <input
                    type="text"
                    value={state.reason}
                    onChange={(e) => updateState({ reason: e.target.value })}
                    placeholder="e.g., Annual checkup, Follow-up consultation"
                    className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Notes</label>
                  <textarea
                    value={state.notes}
                    onChange={(e) => updateState({ notes: e.target.value })}
                    placeholder="Any additional information..."
                    rows={3}
                    className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {state.currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Confirm Appointment</h2>
            <p className="text-text-secondary mb-6">Please review the appointment details before booking</p>

            <div className="space-y-6">
              {/* Doctor Summary */}
              {state.selectedDoctor && (
                <div className="bg-bg-tertiary rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-text-secondary mb-1">Doctor</h3>
                      <p className="text-lg font-bold text-text-primary">
                        {state.selectedDoctor.name}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs rounded bg-accent/20 text-accent mt-1">
                        {state.selectedDoctor.speciality}
                      </span>
                    </div>
                    <button
                      onClick={() => jumpToStep(1)}
                      className="text-sm text-accent hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {state.selectedDoctor.consultationFee !== undefined && (
                    <p className="text-sm text-text-secondary mt-2">
                      Fee: ${state.selectedDoctor.consultationFee}
                    </p>
                  )}
                </div>
              )}

              {/* Date & Time Summary */}
              {state.selectedDate && state.selectedTime && (
                <div className="bg-bg-tertiary rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-text-secondary mb-1">
                        Date & Time
                      </h3>
                      <p className="text-lg font-bold text-text-primary">
                        {new Date(state.selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-text-primary mt-1">
                        {state.selectedTime} ({state.duration} minutes)
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => jumpToStep(2)}
                        className="text-sm text-accent hover:underline text-right"
                      >
                        Edit Date
                      </button>
                      <button
                        onClick={() => jumpToStep(3)}
                        className="text-sm text-accent hover:underline text-right"
                      >
                        Edit Time
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Summary */}
              {state.selectedPatient && (
                <div className="bg-bg-tertiary rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-text-secondary mb-1">Patient</h3>
                      <p className="text-lg font-bold text-text-primary">
                        {state.selectedPatient.name}
                      </p>
                      <p className="text-sm text-text-secondary mt-1">
                        {state.selectedPatient.phone}
                      </p>
                      {state.selectedPatient.email && (
                        <p className="text-sm text-text-secondary">{state.selectedPatient.email}</p>
                      )}
                      {state.selectedPatient.bloodType && (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-accent/20 text-accent mt-2">
                          {state.selectedPatient.bloodType}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => jumpToStep(4)}
                      className="text-sm text-accent hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Reason & Notes */}
              {(state.reason || state.notes) && (
                <div className="bg-bg-tertiary rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-text-secondary mb-1">
                        Additional Information
                      </h3>
                      {state.reason && (
                        <div className="mt-2">
                          <p className="text-xs text-text-secondary">Reason:</p>
                          <p className="text-text-primary">{state.reason}</p>
                        </div>
                      )}
                      {state.notes && (
                        <div className="mt-2">
                          <p className="text-xs text-text-secondary">Notes:</p>
                          <p className="text-text-primary">{state.notes}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => jumpToStep(4)}
                      className="text-sm text-accent hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Confirmation Message */}
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-sm text-text-primary">
                  By clicking "Book Appointment", you confirm that all the information provided is
                  accurate and you agree to the appointment terms.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <div>
          {canGoBack && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-2 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}

          {state.currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canGoForward || isSubmitting}
              className="px-6 py-2 bg-accent hover:bg-accent/90 text-bg-primary font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-accent hover:bg-accent/90 text-bg-primary font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Book Appointment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

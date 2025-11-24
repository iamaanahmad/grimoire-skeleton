/**
 * Haunted Clinic Application Configuration
 * 
 * Defines app-level settings including name, theme, navigation, and branding.
 */

export const appConfig = {
  name: 'Haunted Clinic',
  defaultTheme: 'bone_minimal' as const,
  description: 'Doctor appointment booking system with a medical-gothic aesthetic',
  
  navigation: [
    {
      label: 'Dashboard',
      path: '/',
      icon: '📊',
    },
    {
      label: 'Doctors',
      path: '/doctors',
      icon: '👨‍⚕️',
    },
    {
      label: 'Patients',
      path: '/patients',
      icon: '🧑‍🦱',
    },
    {
      label: 'Appointments',
      path: '/appointments',
      icon: '📅',
    },
  ],

  branding: {
    logo: '/haunted-clinic-logo.svg',
    favicon: '/haunted-clinic-favicon.ico',
    primaryColor: '#f5f5f0',
    accentColor: '#8b0000',
  },

  features: {
    enableBookingFlow: true,
    enableScheduleView: true,
    enableDashboard: true,
    enableNotifications: false, // Future enhancement
  },

  availableThemes: ['bone_minimal', 'blood_moon'] as const,
};

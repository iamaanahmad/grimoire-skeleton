import type { Metadata } from 'next';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { getThemeById } from '@/theme/skins';
import { appConfig } from '@/config/haunted-clinic/app';
import '@/styles/haunted-clinic/custom.css';

export const metadata: Metadata = {
  title: 'Haunted Clinic',
  description: 'Doctor appointment booking system with a medical-gothic aesthetic',
};

export default function HauntedClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider initialTheme={getThemeById(appConfig.defaultTheme)}>
      {children}
    </ThemeProvider>
  );
}

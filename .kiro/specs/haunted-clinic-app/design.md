# Design Document: Haunted Clinic

## Overview

The Haunted Clinic is a doctor appointment booking system built on the Grimoire skeleton framework. It demonstrates the skeleton's versatility by creating a professional, business-oriented application with a medical-gothic aesthetic. The application leverages the entity system for rapid CRUD development, the theme engine for consistent styling, and follows Next.js 14 App Router patterns for optimal performance.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Haunted Clinic App                       │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router (apps/haunted-clinic/src/app)        │
│  ┌──────────┬──────────┬──────────┬──────────────────────┐ │
│  │Dashboard │ Doctors  │ Patients │ Appointments         │ │
│  └──────────┴──────────┴──────────┴──────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│              Grimoire Skeleton Core                          │
│  ┌──────────────┬──────────────┬──────────────────────┐   │
│  │Entity System │ Theme Engine │ Shared Components    │   │
│  └──────────────┴──────────────┴──────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Appwrite Backend                          │
│  ┌──────────────┬──────────────┬──────────────────────┐   │
│  │ Auth         │ Database     │ Storage              │   │
│  └──────────────┴──────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Application Structure

```
apps/haunted-clinic/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── doctors/           # Doctor CRUD pages
│   │   ├── patients/          # Patient CRUD pages
│   │   └── appointments/      # Appointment CRUD pages
│   ├── components/            # App-specific components
│   │   ├── AppointmentBooking.tsx
│   │   ├── AppointmentStatusManager.tsx
│   │   ├── DoctorCard.tsx
│   │   └── TodaySchedule.tsx
│   └── lib/                   # App-specific utilities
├── config/
│   ├── entities.ts            # Entity definitions
│   └── app.ts                 # App configuration
├── styles/
│   └── custom.css             # Custom styles & animations
└── scripts/
    └── seed.ts                # Data seeding script
```


## Components and Interfaces

### Entity Definitions

#### Doctor Entity

```typescript
interface DoctorEntity {
  $id: string;
  name: string;
  speciality: 'General Practice' | 'Cardiology' | 'Dermatology' | 'Neurology' | 'Orthopedics' | 'Pediatrics' | 'Psychiatry';
  email: string;
  phone: string;
  yearsExperience?: number;
  bio?: string;
  availableDays?: string;
  consultationFee?: number;
  $createdAt: string;
  $updatedAt: string;
}
```

**Configuration:**
- Permissions: admin, staff
- Features: list, create, edit, detail, delete
- Validation: email pattern, name length (2-100), years (0-60), fee (min 0)
- Display: Icon 👨‍⚕️, sort by name ascending

#### Patient Entity

```typescript
interface PatientEntity {
  $id: string;
  name: string;
  email?: string;
  phone: string;
  dateOfBirth?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string;
  emergencyContact?: string;
  $createdAt: string;
  $updatedAt: string;
}
```

**Configuration:**
- Permissions: admin, staff
- Features: list, create, edit, detail, delete
- Validation: email pattern, name length (2-100)
- Display: Icon 🧑‍🦱, sort by name ascending
- Privacy: Only synthetic test data

#### Appointment Entity

```typescript
interface AppointmentEntity {
  $id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string; // HH:MM format
  duration: number; // minutes, default 30
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
  $createdAt: string;
  $updatedAt: string;
}
```

**Configuration:**
- Permissions: admin, staff
- Features: list, create, edit, detail, delete
- Validation: time pattern (HH:MM), duration (15-120 minutes)
- Display: Icon 📅, sort by date ascending
- References: patient and doctor entities

### Core Components

#### Dashboard Component (`app/page.tsx`)

**Purpose:** Provide at-a-glance overview of clinic operations

**Data Requirements:**
- Today's appointments (filtered by date, sorted by time)
- Statistics: total doctors, total patients, today's appointment count
- Next 5 upcoming appointments

**UI Elements:**
- Stats cards with icons and counts
- Today's schedule timeline
- Upcoming appointments list
- Heartbeat animation background

**State Management:**
```typescript
interface DashboardState {
  todayAppointments: AppointmentEntity[];
  upcomingAppointments: AppointmentEntity[];
  stats: {
    totalDoctors: number;
    totalPatients: number;
    todayAppointments: number;
  };
  loading: boolean;
  error: string | null;
}
```


#### Doctor Schedule View (`app/doctors/[id]/schedule/page.tsx`)

**Purpose:** Visualize a doctor's weekly schedule with appointments

**Data Requirements:**
- Doctor details
- Appointments for selected week (7 days)
- Time slots from 8:00 AM to 6:00 PM

**UI Elements:**
- Week navigation (previous/next)
- Time grid (rows: time slots, columns: days)
- Appointment blocks with patient name and status
- Current time indicator
- Click handlers for appointment details

**State Management:**
```typescript
interface ScheduleState {
  doctor: DoctorEntity | null;
  weekStart: Date;
  appointments: AppointmentEntity[];
  selectedAppointment: AppointmentEntity | null;
  loading: boolean;
}
```

**Layout:**
```
┌─────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Time    │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │
├─────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 08:00   │     │ Apt │     │     │     │     │     │
│ 08:30   │     │     │     │     │     │     │     │
│ 09:00   │ Apt │     │ Apt │     │     │     │     │
│ ...     │     │     │     │     │     │     │     │
└─────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

#### Appointment Booking Flow (`components/AppointmentBooking.tsx`)

**Purpose:** Guide users through multi-step appointment creation

**Steps:**
1. Select Doctor (searchable list with filters by speciality)
2. Select Date (calendar picker, highlight available days)
3. Select Time Slot (show available slots based on doctor schedule)
4. Enter Patient Info (search existing or create new)
5. Confirm Details (review and submit)

**State Management:**
```typescript
interface BookingFlowState {
  currentStep: 1 | 2 | 3 | 4 | 5;
  selectedDoctor: DoctorEntity | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedPatient: PatientEntity | null;
  duration: number;
  reason: string;
  notes: string;
  canGoBack: boolean;
  canGoForward: boolean;
}
```

**Validation Rules:**
- Step 1: Doctor must be selected
- Step 2: Date must be selected and not in the past
- Step 3: Time slot must be selected and available
- Step 4: Patient must be selected or created with valid data
- Step 5: All data must be valid before submission

#### Appointment Status Manager (`components/AppointmentStatusManager.tsx`)

**Purpose:** Quick status updates for appointments

**Props:**
```typescript
interface AppointmentStatusManagerProps {
  appointment: AppointmentEntity;
  onStatusChange: (newStatus: AppointmentEntity['status']) => Promise<void>;
}
```

**UI Elements:**
- Status badge with current status
- Dropdown menu with available status transitions
- Confirmation dialog for destructive actions (cancel, no-show)
- Loading state during update
- Success/error feedback

**Status Transitions:**
- scheduled → confirmed, cancelled
- confirmed → in-progress, cancelled, no-show
- in-progress → completed
- completed → (no transitions)
- cancelled → (no transitions)
- no-show → (no transitions)


#### Doctor Card Component (`components/DoctorCard.tsx`)

**Purpose:** Display doctor information in a card format

**Props:**
```typescript
interface DoctorCardProps {
  doctor: DoctorEntity;
  onBookAppointment?: (doctor: DoctorEntity) => void;
  variant?: 'compact' | 'detailed';
}
```

**UI Elements:**
- Doctor name and speciality badge
- Years of experience indicator
- Consultation fee (if available)
- Bio excerpt (detailed variant)
- Available days (detailed variant)
- "Book Appointment" button
- Hover effects and animations

#### Today's Schedule Widget (`components/TodaySchedule.tsx`)

**Purpose:** Timeline view of today's appointments

**Props:**
```typescript
interface TodayScheduleProps {
  appointments: AppointmentEntity[];
  onAppointmentClick?: (appointment: AppointmentEntity) => void;
}
```

**UI Elements:**
- Vertical timeline from 8 AM to 6 PM
- Appointment blocks positioned by time
- Current time indicator (moving line)
- Status color coding
- Patient and doctor names
- Click to view details

**Timeline Calculation:**
```typescript
// Convert time to vertical position
const timeToPosition = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = (hours - 8) * 60 + minutes; // Relative to 8 AM
  const pixelsPerMinute = containerHeight / (10 * 60); // 10 hours
  return totalMinutes * pixelsPerMinute;
};
```

## Data Models

### Database Collections

**doctors**
- Collection ID: `doctors`
- Attributes: name (string, required), speciality (enum, required), email (string, email), phone (string, required), yearsExperience (integer), bio (string), availableDays (string), consultationFee (float)
- Indexes: name (asc), speciality (asc)
- Permissions: Read (admin, staff), Write (admin, staff)

**patients**
- Collection ID: `patients`
- Attributes: name (string, required), email (string, email), phone (string, required), dateOfBirth (datetime), bloodType (enum), allergies (string), emergencyContact (string)
- Indexes: name (asc), phone (asc)
- Permissions: Read (admin, staff), Write (admin, staff)

**appointments**
- Collection ID: `appointments`
- Attributes: patientId (string, required), doctorId (string, required), date (datetime, required), time (string, required), duration (integer, default 30), status (enum, default 'scheduled'), reason (string), notes (string)
- Indexes: date (asc), doctorId (asc), patientId (asc), status (asc)
- Permissions: Read (admin, staff), Write (admin, staff)
- Relationships: patientId → patients.$id, doctorId → doctors.$id

### API Routes

**Generated by Entity System:**
- `GET /api/doctors` - List doctors with filtering/sorting
- `POST /api/doctors` - Create doctor
- `GET /api/doctors/[id]` - Get doctor details
- `PUT /api/doctors/[id]` - Update doctor
- `DELETE /api/doctors/[id]` - Delete doctor

- `GET /api/patients` - List patients with filtering/sorting
- `POST /api/patients` - Create patient
- `GET /api/patients/[id]` - Get patient details
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient

- `GET /api/appointments` - List appointments with filtering/sorting
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/[id]` - Get appointment details
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Delete appointment

**Custom Routes:**
- `GET /api/doctors/[id]/schedule?start=[date]&end=[date]` - Get doctor's appointments for date range
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/appointments/upcoming?limit=[n]` - Get next N upcoming appointments
- `GET /api/stats` - Get dashboard statistics


## Theme and Styling

### Default Theme: bone_minimal

**Color Palette:**
```css
--bg-primary: #0a0a0a;        /* Deep black */
--bg-secondary: #1a1a1a;      /* Slightly lighter black */
--bg-tertiary: #2a2a2a;       /* Card backgrounds */
--text-primary: #f5f5f0;      /* Bone white */
--text-secondary: #c0c0b8;    /* Muted bone */
--accent: #f5f5f0;            /* Bone white accent */
--border: #3a3a3a;            /* Subtle borders */
```

**Typography:**
- Headings: Clean sans-serif, bold weights
- Body: Readable sans-serif, regular weight
- Monospace: For time displays and IDs

### Custom Animations

#### Heartbeat Line Animation

```css
@keyframes heartbeat {
  0%, 100% { 
    d: path("M 0,50 L 100,50"); 
  }
  10% { 
    d: path("M 0,50 L 40,50 L 45,30 L 50,70 L 55,50 L 100,50"); 
  }
  20% { 
    d: path("M 0,50 L 100,50"); 
  }
}

.heartbeat-line {
  animation: heartbeat 3s ease-in-out infinite;
  stroke: var(--accent);
  stroke-width: 2;
  fill: none;
}
```

**Usage:** Background decoration on dashboard, subtle and non-distracting

#### Status Badge Animations

```css
.status-badge {
  transition: all 0.2s ease;
}

.status-badge.scheduled { background: var(--status-scheduled); }
.status-badge.confirmed { background: var(--status-confirmed); }
.status-badge.in-progress { 
  background: var(--status-in-progress);
  animation: pulse 2s ease-in-out infinite;
}
.status-badge.completed { background: var(--status-completed); }
.status-badge.cancelled { background: var(--status-cancelled); }
.status-badge.no-show { background: var(--status-no-show); }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### Responsive Breakpoints

```css
/* Mobile: < 640px */
@media (max-width: 639px) {
  /* Stack cards vertically */
  /* Hide secondary information */
  /* Simplify schedule view */
}

/* Tablet: 640px - 1023px */
@media (min-width: 640px) and (max-width: 1023px) {
  /* 2-column layouts */
  /* Compact schedule view */
}

/* Desktop: >= 1024px */
@media (min-width: 1024px) {
  /* 3-column layouts */
  /* Full schedule view */
  /* Side-by-side forms */
}
```

### Accessibility Features

**Keyboard Navigation:**
- Tab order follows visual flow
- Focus indicators visible and high-contrast
- Skip links for main content
- Escape key closes modals/dropdowns

**Screen Reader Support:**
- ARIA labels on all interactive elements
- ARIA live regions for dynamic content updates
- Semantic HTML structure
- Alt text for decorative elements set to empty string

**Color Contrast:**
- All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Status colors distinguishable by shape/icon in addition to color
- Focus indicators have 3:1 contrast with background


## Error Handling

### Client-Side Error Handling

**Form Validation Errors:**
```typescript
interface ValidationError {
  field: string;
  message: string;
}

// Display inline with form fields
// Announce to screen readers
// Prevent form submission until resolved
```

**API Request Errors:**
```typescript
interface APIError {
  status: number;
  message: string;
  code?: string;
}

// Display toast notification
// Log to console in development
// Provide retry mechanism for transient errors
// Show user-friendly messages
```

**Error Boundaries:**
```typescript
// Wrap each major section in error boundary
// Display fallback UI with error message
// Provide "Try Again" button
// Log errors to monitoring service
```

### Server-Side Error Handling

**Validation Errors (400):**
- Return detailed field-level errors
- Include validation rules that failed
- Provide suggestions for correction

**Authentication Errors (401):**
- Redirect to login page
- Preserve intended destination
- Clear invalid tokens

**Authorization Errors (403):**
- Display "Access Denied" message
- Suggest contacting administrator
- Log unauthorized access attempts

**Not Found Errors (404):**
- Display friendly "Not Found" page
- Suggest navigation to valid pages
- Log for broken link detection

**Server Errors (500):**
- Display generic error message
- Log full error details server-side
- Provide error ID for support reference
- Automatically retry idempotent operations

### Data Integrity

**Appointment Conflicts:**
- Check for overlapping appointments before creation
- Validate doctor availability
- Prevent double-booking
- Display clear conflict messages

**Referential Integrity:**
- Validate patient and doctor IDs exist before creating appointments
- Handle cascading deletes appropriately
- Prevent deletion of doctors/patients with active appointments
- Display dependency warnings

**Optimistic Updates:**
- Update UI immediately for better UX
- Revert on server error
- Show loading state during server sync
- Queue updates if offline (future enhancement)


## Testing Strategy

### Unit Tests

**Entity Validation:**
- Test field validation rules (email format, phone format, time format)
- Test required field enforcement
- Test enum value validation
- Test numeric range validation

**Utility Functions:**
- Test date/time formatting functions
- Test time-to-position calculations for timeline
- Test status transition logic
- Test data transformation functions

**Component Logic:**
- Test booking flow state transitions
- Test form validation logic
- Test status change confirmation logic
- Test schedule calculation logic

### Integration Tests

**Entity CRUD Operations:**
- Test creating doctor with valid data
- Test creating patient with valid data
- Test creating appointment with valid references
- Test updating entities
- Test deleting entities
- Test listing with filters and sorting

**Booking Flow:**
- Test complete booking flow from doctor selection to confirmation
- Test validation at each step
- Test back navigation
- Test error handling

**Schedule View:**
- Test loading doctor schedule
- Test week navigation
- Test appointment click handling
- Test current time indicator

### End-to-End Tests

**Critical User Flows:**
1. Create a new doctor
2. Create a new patient
3. Book an appointment through the booking flow
4. View appointment in doctor's schedule
5. Update appointment status
6. View appointment on dashboard

**Accessibility Tests:**
- Test keyboard navigation through booking flow
- Test screen reader announcements
- Test focus management in modals
- Test color contrast ratios

### Performance Tests

**Load Time Metrics:**
- Dashboard initial load < 2 seconds
- Entity list pages < 1.5 seconds
- Schedule view < 2 seconds
- Form submissions < 1 second

**Bundle Size:**
- Initial bundle < 200KB (gzipped)
- Route chunks < 50KB each
- Lazy load non-critical components

### Manual Testing Checklist

**Visual Testing:**
- [ ] Test in bone_minimal theme
- [ ] Test in blood_moon theme
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Test animations and transitions
- [ ] Test loading states
- [ ] Test error states

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Accessibility Testing:**
- [ ] Keyboard navigation
- [ ] Screen reader (NVDA/JAWS)
- [ ] Color contrast
- [ ] Focus indicators
- [ ] ARIA labels


## Performance Optimization

### Code Splitting

**Route-Based Splitting:**
```typescript
// Automatic with Next.js App Router
// Each route in app/ directory is a separate chunk
app/
  page.tsx              // Dashboard chunk
  doctors/
    page.tsx            // Doctors list chunk
    [id]/page.tsx       // Doctor detail chunk
    [id]/schedule/page.tsx  // Schedule chunk
  patients/
    page.tsx            // Patients list chunk
  appointments/
    page.tsx            // Appointments list chunk
```

**Component-Based Splitting:**
```typescript
// Lazy load heavy components
const AppointmentBooking = dynamic(() => import('@/components/AppointmentBooking'), {
  loading: () => <SkeletonLoader />,
  ssr: false
});

const DoctorSchedule = dynamic(() => import('@/components/DoctorSchedule'), {
  loading: () => <SkeletonLoader />
});
```

### Data Fetching Optimization

**Server Components (Default):**
```typescript
// Fetch data on server, stream to client
async function DashboardPage() {
  const [appointments, stats] = await Promise.all([
    fetchTodayAppointments(),
    fetchStats()
  ]);
  
  return <Dashboard appointments={appointments} stats={stats} />;
}
```

**Client Components (When Needed):**
```typescript
// Use SWR for client-side data fetching with caching
import useSWR from 'swr';

function DoctorList() {
  const { data, error, isLoading } = useSWR('/api/doctors', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000 // Cache for 1 minute
  });
}
```

**Caching Strategy:**
- Cache doctor and patient lists (low change frequency)
- Revalidate appointment data more frequently (high change frequency)
- Use stale-while-revalidate pattern
- Implement optimistic updates for mutations

### Image Optimization

**Next.js Image Component:**
```typescript
import Image from 'next/image';

// Automatic optimization, lazy loading, responsive
<Image 
  src="/doctor-placeholder.png" 
  alt="Doctor profile"
  width={200}
  height={200}
  loading="lazy"
/>
```

### Database Query Optimization

**Indexed Queries:**
- Index on appointment.date for dashboard queries
- Index on appointment.doctorId for schedule queries
- Compound index on (date, status) for filtered lists

**Query Patterns:**
```typescript
// Efficient: Use specific queries with limits
const todayAppointments = await databases.listDocuments(
  'appointments',
  [
    Query.equal('date', today),
    Query.orderAsc('time'),
    Query.limit(100)
  ]
);

// Avoid: Fetching all data and filtering client-side
```

**Pagination:**
- Implement cursor-based pagination for large lists
- Default page size: 25 items
- Lazy load more items on scroll

### Bundle Optimization

**Tree Shaking:**
- Import only needed functions from libraries
- Use ES modules for better tree shaking
- Avoid importing entire libraries

**Minification:**
- Automatic with Next.js production build
- Remove console.logs in production
- Compress CSS and JavaScript

**Asset Optimization:**
- Compress images (WebP format)
- Inline critical CSS
- Defer non-critical JavaScript
- Use font-display: swap for web fonts


## Configuration and Setup

### Entity Configuration File

**Location:** `apps/haunted-clinic/config/entities.ts`

```typescript
import { EntityDefinition } from '@/core/types/entity';

export const entities: Record<string, EntityDefinition> = {
  doctor: {
    fields: {
      name: { 
        type: 'string', 
        required: true,
        validation: { min: 2, max: 100 }
      },
      speciality: { 
        type: 'enum', 
        required: true,
        options: ['General Practice', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry']
      },
      email: {
        type: 'string',
        required: true,
        validation: { pattern: 'email' }
      },
      phone: {
        type: 'string',
        required: true
      },
      yearsExperience: { 
        type: 'number',
        validation: { min: 0, max: 60 }
      },
      bio: { type: 'string' },
      availableDays: { type: 'string' },
      consultationFee: {
        type: 'number',
        validation: { min: 0 }
      }
    },
    permissions: ['admin', 'staff'],
    features: ['list', 'create', 'edit', 'detail', 'delete'],
    display: {
      icon: '👨‍⚕️',
      singular: 'Doctor',
      plural: 'Doctors',
      listColumns: ['name', 'speciality', 'yearsExperience', 'phone'],
      sortBy: 'name',
      sortOrder: 'asc'
    }
  },
  
  patient: {
    // ... (similar structure)
  },
  
  appointment: {
    // ... (similar structure with references)
  }
};
```

### App Configuration File

**Location:** `apps/haunted-clinic/config/app.ts`

```typescript
export const appConfig = {
  name: 'Haunted Clinic',
  description: 'Doctor appointment booking system with a medical-gothic aesthetic',
  defaultTheme: 'bone_minimal',
  availableThemes: ['bone_minimal', 'blood_moon'],
  
  navigation: [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: 'Doctors', href: '/doctors', icon: '👨‍⚕️' },
    { label: 'Patients', href: '/patients', icon: '🧑‍🦱' },
    { label: 'Appointments', href: '/appointments', icon: '📅' }
  ],
  
  branding: {
    logo: '/haunted-clinic-logo.svg',
    favicon: '/haunted-clinic-favicon.ico',
    primaryColor: '#f5f5f0',
    accentColor: '#8b0000'
  },
  
  features: {
    enableBookingFlow: true,
    enableScheduleView: true,
    enableDashboard: true,
    enableNotifications: false // Future enhancement
  }
};
```

### Seed Data Script

**Location:** `apps/haunted-clinic/scripts/seed.ts`

```typescript
import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

async function seedDoctors() {
  const doctors = [
    {
      name: 'Dr. Victor Frankenstein',
      speciality: 'General Practice',
      email: 'v.frankenstein@hauntedclinic.com',
      phone: '555-0101',
      yearsExperience: 15,
      bio: 'Specializes in bringing life to medical practice.',
      availableDays: 'Mon, Wed, Fri',
      consultationFee: 150
    },
    // ... more sample doctors
  ];
  
  for (const doctor of doctors) {
    await databases.createDocument(
      'haunted-clinic',
      'doctors',
      ID.unique(),
      doctor
    );
  }
}

async function seedPatients() {
  // Create synthetic patient data
  // No real patient information
}

async function seedAppointments() {
  // Create sample appointments
  // Link to seeded doctors and patients
}

async function main() {
  console.log('Seeding Haunted Clinic data...');
  await seedDoctors();
  await seedPatients();
  await seedAppointments();
  console.log('Seeding complete!');
}

main().catch(console.error);
```

### Environment Variables

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=haunted-clinic-project
APPWRITE_API_KEY=your-api-key-here

# App Configuration
NEXT_PUBLIC_APP_NAME=Haunted Clinic
NEXT_PUBLIC_DEFAULT_THEME=bone_minimal

# Feature Flags
NEXT_PUBLIC_ENABLE_BOOKING_FLOW=true
NEXT_PUBLIC_ENABLE_SCHEDULE_VIEW=true
```

## Design Decisions and Rationale

### Why Entity System?

**Decision:** Use declarative entity definitions with code generation

**Rationale:**
- Reduces boilerplate code by 80%
- Ensures consistency across CRUD operations
- Makes it easy to add new entities
- Demonstrates skeleton's core value proposition
- Allows rapid iteration during hackathon

### Why bone_minimal Theme?

**Decision:** Use bone_minimal as default theme instead of nightmare_neon

**Rationale:**
- Professional medical context requires clean, minimal aesthetic
- High contrast (bone white on black) ensures readability
- Subtle spooky elements maintain Grimoire brand
- Differentiates from Cursed Arena's neon cyberpunk style
- Better accessibility with simpler color palette

### Why Multi-Step Booking Flow?

**Decision:** Implement guided multi-step form instead of single-page form

**Rationale:**
- Reduces cognitive load by focusing on one decision at a time
- Allows progressive validation
- Better mobile experience with less scrolling
- Demonstrates complex UI pattern implementation
- Improves conversion rates for appointment booking

### Why Server Components?

**Decision:** Use Next.js Server Components by default, Client Components only when needed

**Rationale:**
- Better performance with server-side rendering
- Reduced JavaScript bundle size
- Improved SEO (though not critical for this app)
- Demonstrates modern Next.js patterns
- Easier data fetching with async/await

### Why Synthetic Data Only?

**Decision:** Enforce synthetic test data, no real patient information

**Rationale:**
- HIPAA awareness and privacy best practices
- Safe for demo and development
- Prevents accidental data leaks
- Educational value for developers
- Reduces legal liability

## Dependencies

### Required Grimoire Skeleton Components

- Entity System (core functionality)
- Theme Engine (styling and theming)
- Shared Components (Table, Form, Card, Button, etc.)
- Auth System (user authentication and authorization)
- Layout Components (AppShell, Navigation)

### External Dependencies

- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Appwrite SDK
- SWR (client-side data fetching)
- date-fns (date manipulation)
- zod (validation schemas)

### Development Dependencies

- Vitest (testing)
- Testing Library (component testing)
- Playwright (E2E testing)
- ESLint (linting)
- Prettier (formatting)

## Future Enhancements

**Phase 2 Features (Post-Hackathon):**
- Email notifications for appointment reminders
- SMS notifications
- Patient portal for self-booking
- Doctor availability management
- Recurring appointments
- Appointment history and analytics
- Export to calendar (iCal)
- Print appointment cards
- Multi-location support
- Insurance information tracking

**Technical Improvements:**
- Real-time updates with WebSockets
- Offline support with service workers
- Advanced caching strategies
- Performance monitoring
- Error tracking integration
- Automated backups
- Audit logging
- Role-based access control refinement

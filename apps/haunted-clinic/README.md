# 🏥 Haunted Clinic

A doctor appointment booking system with a medical-gothic aesthetic, built on the Grimoire skeleton framework.

## Overview

Haunted Clinic demonstrates the versatility of the Grimoire skeleton by creating a professional, business-oriented application. It manages doctors, patients, and appointments while maintaining a clean, accessible interface with subtle spooky design elements.

## Features

### Core Functionality
- **Doctor Management**: Create, view, edit, and manage doctor profiles with specialties, availability, and consultation fees
- **Patient Management**: Maintain patient records with medical information (synthetic data only)
- **Appointment Scheduling**: Book and manage appointments with status tracking
- **Dashboard**: At-a-glance view of today's schedule and clinic statistics
- **Doctor Schedule View**: Weekly calendar visualization of doctor appointments
- **Multi-Step Booking Flow**: Guided appointment creation process

### Design & UX
- **bone_minimal Theme**: Clean monochrome aesthetic with bone-white and stark black
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Smooth Animations**: Heartbeat ECG line, status badges, and loading skeletons
- **Loading States**: Bone-themed skeleton loaders for better UX

### Technical Features
- **Entity System**: Declarative entity definitions with auto-generated CRUD operations
- **Theme Engine**: Switchable themes (bone_minimal, blood_moon)
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized queries, caching, and code splitting
- **API Routes**: Custom endpoints for dashboard stats and schedules

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Next.js 14+
- TypeScript 5+

### Installation

1. Clone the repository and navigate to the project root:
```bash
cd Grimoire
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (if using Appwrite):
```bash
cp .env.local.example .env.local
# Edit .env.local with your Appwrite credentials
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The Haunted Clinic app will be available at `http://localhost:3000`

### Seeding Sample Data

Populate the application with synthetic test data:

```bash
npm run seed:haunted-clinic
```

Or run the seed script directly:
```bash
npx tsx apps/haunted-clinic/scripts/seed.ts
```

**Note**: The seed script uses ONLY synthetic test data. No real patient information is stored.

## Project Structure

```
apps/haunted-clinic/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── doctors/           # Doctor CRUD pages
│   │   ├── patients/          # Patient CRUD pages
│   │   ├── appointments/      # Appointment CRUD pages
│   │   └── api/               # Custom API routes
│   ├── components/            # App-specific components
│   │   ├── AppointmentBooking.tsx
│   │   ├── AppointmentStatusManager.tsx
│   │   ├── DoctorCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── LoadingSkeletons.tsx
│   │   └── TodaySchedule.tsx
│   ├── lib/                   # API utilities
│   └── types/                 # TypeScript types
├── config/
│   ├── entities.ts            # Entity definitions
│   └── app.ts                 # App configuration
├── styles/
│   └── custom.css             # Custom styles & animations
└── scripts/
    └── seed.ts                # Data seeding script
```

## Key Components

### Dashboard
- Real-time statistics (total doctors, patients, today's appointments)
- Today's schedule timeline with current time indicator
- Upcoming appointments list
- Heartbeat ECG animation background

### Doctor Schedule View
- Weekly calendar grid (8 AM - 6 PM)
- Appointment blocks with patient names and status
- Week navigation (previous/next)
- Click to view appointment details

### Appointment Booking Flow
1. Select Doctor (with specialty filter)
2. Select Date (calendar picker)
3. Select Time Slot (availability check)
4. Enter Patient Info (search or create new)
5. Confirm and Submit

### Status Management
- Visual status badges with color coding
- Status transitions (scheduled → confirmed → in-progress → completed)
- Confirmation dialogs for destructive actions
- Pulse animation for in-progress appointments

## Themes

### bone_minimal (Default)
- Clean monochrome design
- Bone-white (#f5f5f0) on deep black (#0d0d0d)
- High contrast for readability
- Minimal animations

### blood_moon
- Deep red accents
- Subtle glows
- Elegant darkness

Switch themes using the theme switcher in the navigation.

## Accessibility

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Focus Indicators**: High-contrast focus rings
- **Reduced Motion**: Respects `prefers-reduced-motion` preference
- **Touch Targets**: Minimum 44x44 pixels for mobile

## API Routes

### Custom Endpoints

- `GET /api/doctors/[id]/schedule` - Get doctor's appointments for date range
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments (default: 5)
- `GET /api/stats` - Get dashboard statistics (cached for 5 minutes)

### Generated Endpoints

Standard CRUD operations for doctors, patients, and appointments:
- `GET /api/[entity]` - List all
- `POST /api/[entity]` - Create new
- `GET /api/[entity]/[id]` - Get by ID
- `PUT /api/[entity]/[id]` - Update
- `DELETE /api/[entity]/[id]` - Delete

## Data Privacy

⚠️ **IMPORTANT**: This application uses ONLY synthetic test data for demonstration purposes. No real patient information should be stored. All sample data uses fictional names and information.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Custom CSS
- **Backend**: Appwrite (or mock API for development)
- **State Management**: React hooks + Context
- **Testing**: Vitest + Testing Library

## Development

### Adding New Entities

1. Define entity in `config/entities.ts`
2. Run entity generator (if available)
3. Customize generated pages as needed

### Customizing Themes

Edit theme definitions in `src/theme/skins/` or create new theme files.

### Running Tests

```bash
npm run test
```

## Contributing

This is a demonstration application for the Grimoire skeleton framework. Contributions should align with the project's goals of showcasing the skeleton's capabilities.

## License

See the main project LICENSE file.

## Acknowledgments

Built with the Grimoire skeleton framework, demonstrating rapid application development with declarative entity definitions and theme-driven design.

---

**Haunted Clinic** - Where medical care meets gothic aesthetics 🩺💀

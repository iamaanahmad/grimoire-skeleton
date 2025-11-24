# Implementation Plan

- [x] 1. Set up project structure and configuration
- [x] 1.1 Create app directory structure at `apps/haunted-clinic/`
  - Create src/app, src/components, src/lib, config, styles, scripts directories
  - Set up Next.js configuration for the haunted-clinic app
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 1.2 Create entity configuration file
  - Write `apps/haunted-clinic/config/entities.ts` with doctor, patient, and appointment entity definitions
  - Include all field definitions, validation rules, permissions, and display configurations
  - Export entity registry for use by entity generator
  - _Requirements: 1.1, 2.1, 3.1, 7.1, 7.2, 7.3_

- [x] 1.3 Create app configuration file
  - Write `apps/haunted-clinic/config/app.ts` with app name, theme settings, navigation, and branding
  - Set bone_minimal as default theme
  - Define navigation items for dashboard, doctors, patients, and appointments
  - _Requirements: 8.1, 8.5_

- [x] 2. Generate entity CRUD code
- [x] 2.1 Run entity generator for doctor entity
  - Execute entity generator with doctor configuration
  - Verify generated files: list page, form component, detail page, API routes, TypeScript types
  - Ensure navigation is updated with doctor links
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 7.4, 7.5_

- [x] 2.2 Run entity generator for patient entity
  - Execute entity generator with patient configuration
  - Verify generated files: list page, form component, detail page, API routes, TypeScript types
  - Ensure navigation is updated with patient links
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.2, 7.4, 7.5_

- [x] 2.3 Run entity generator for appointment entity
  - Execute entity generator with appointment configuration
  - Verify generated files: list page, form component, detail page, API routes, TypeScript types
  - Handle reference fields for patient and doctor
  - Ensure navigation is updated with appointment links
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.3, 7.4, 7.5_

- [x] 3. Implement dashboard page
- [x] 3.1 Create dashboard page component
  - Write `apps/haunted-clinic/src/app/page.tsx` as server component
  - Fetch today's appointments, upcoming appointments, and statistics
  - Implement data fetching with proper error handling
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 3.2 Create statistics cards component
  - Write component to display total doctors, total patients, and today's appointments
  - Style with bone_minimal theme colors
  - Make responsive for mobile, tablet, and desktop
  - _Requirements: 4.2, 8.2, 9.1, 9.2, 9.3_

- [x] 3.3 Create today's schedule widget
  - Write `apps/haunted-clinic/src/components/TodaySchedule.tsx`
  - Implement timeline view with appointments positioned by time
  - Add current time indicator that updates
  - Color-code appointments by status
  - Handle click events to view appointment details
  - _Requirements: 4.1, 4.4, 8.2, 8.3, 10.1, 10.2_

- [x] 3.4 Add heartbeat animation to dashboard
  - Create CSS animation for heartbeat line in `apps/haunted-clinic/styles/custom.css`
  - Implement SVG path animation resembling ECG line
  - Ensure animation respects prefers-reduced-motion
  - Make subtle and non-distracting
  - _Requirements: 4.4, 8.3_

- [x] 4. Implement doctor schedule view
- [x] 4.1 Create doctor schedule page
  - Write `apps/haunted-clinic/src/app/doctors/[id]/schedule/page.tsx`
  - Fetch doctor details and appointments for selected week
  - Implement week navigation (previous/next buttons)
  - _Requirements: 5.1, 5.5_

- [x] 4.2 Create schedule grid component
  - Build time grid with rows for time slots (8 AM - 6 PM) and columns for days
  - Position appointment blocks based on date and time
  - Display patient name and status in appointment blocks
  - Make responsive with horizontal scroll on mobile
  - _Requirements: 5.2, 5.3, 9.1, 9.2, 9.3_

- [x] 4.3 Add appointment click handling
  - Implement click handlers to show appointment details modal
  - Display full appointment information including patient, doctor, time, status, reason, notes
  - Add close button and keyboard escape handling
  - _Requirements: 5.4, 10.1, 10.2_

- [x] 5. Implement appointment booking flow
- [x] 5.1 Create booking flow component structure
  - Write `apps/haunted-clinic/src/components/AppointmentBooking.tsx`
  - Set up state management for multi-step flow
  - Implement progress indicator showing current step
  - Add navigation buttons (back, next, submit)
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 5.2 Implement step 1: Select doctor
  - Create doctor selection interface with searchable list
  - Add filter by speciality dropdown
  - Display doctor cards with name, speciality, and consultation fee
  - Validate doctor selection before allowing next step
  - _Requirements: 6.1, 6.3_

- [x] 5.3 Implement step 2: Select date
  - Create calendar picker component
  - Highlight available days based on doctor's availableDays
  - Disable past dates
  - Validate date selection before allowing next step
  - _Requirements: 6.1, 6.3_

- [x] 5.4 Implement step 3: Select time slot
  - Display available time slots for selected doctor and date
  - Check for existing appointments to show availability
  - Show duration selector (15, 30, 60, 90, 120 minutes)
  - Validate time selection before allowing next step
  - _Requirements: 6.1, 6.3_

- [x] 5.5 Implement step 4: Enter patient info
  - Create patient search/select interface
  - Add "Create New Patient" option with inline form
  - Validate patient selection or new patient data
  - Add reason and notes text fields
  - _Requirements: 6.1, 6.3_

- [x] 5.6 Implement step 5: Confirm and submit
  - Display summary of all selected information
  - Add edit buttons to go back to specific steps
  - Implement submit handler to create appointment
  - Show success message and redirect to appointment detail
  - Handle errors with user-friendly messages
  - _Requirements: 6.1, 6.5_

- [x] 6. Implement appointment status manager
- [x] 6.1 Create status manager component
  - Write `apps/haunted-clinic/src/components/AppointmentStatusManager.tsx`
  - Display current status as a badge
  - Create dropdown menu with available status transitions
  - Implement status transition logic (scheduled → confirmed, etc.)
  - _Requirements: 3.4_

- [x] 6.2 Add confirmation dialogs
  - Show confirmation dialog for destructive status changes (cancel, no-show)
  - Include reason text field in confirmation dialog
  - Implement keyboard handling (Enter to confirm, Escape to cancel)
  - _Requirements: 3.5, 10.1_

- [x] 6.3 Implement status update handler
  - Create API call to update appointment status
  - Show loading state during update
  - Display success/error feedback with toast notifications
  - Update UI optimistically for better UX
  - _Requirements: 3.4_

- [x] 7. Create custom components
- [x] 7.1 Create doctor card component
  - Write `apps/haunted-clinic/src/components/DoctorCard.tsx`
  - Display doctor name, speciality badge, years of experience, consultation fee
  - Add compact and detailed variants
  - Include "Book Appointment" button with click handler
  - Add hover effects and smooth transitions
  - _Requirements: 8.2, 8.4, 9.1, 9.2, 9.3_

- [x] 7.2 Create status badge component
  - Write reusable status badge component
  - Implement color coding for each status (scheduled, confirmed, in-progress, completed, cancelled, no-show)
  - Add pulse animation for in-progress status
  - Ensure colors meet WCAG AA contrast requirements
  - Add icons in addition to colors for accessibility
  - _Requirements: 8.2, 10.2, 10.3_

- [x] 7.3 Create loading skeleton components
  - Write skeleton loaders for cards, lists, and forms
  - Style with bone-themed shapes (ribs, bones)
  - Implement shimmer animation
  - Use throughout app for loading states
  - _Requirements: 8.4, 11.4_

- [x] 8. Implement custom API routes
- [x] 8.1 Create doctor schedule API route
  - Write `apps/haunted-clinic/src/app/api/doctors/[id]/schedule/route.ts`
  - Accept start and end date query parameters
  - Fetch appointments for doctor within date range
  - Return appointments sorted by date and time
  - _Requirements: 5.1, 5.2, 5.3, 11.5_

- [x] 8.2 Create today's appointments API route
  - Write `apps/haunted-clinic/src/app/api/appointments/today/route.ts`
  - Filter appointments by today's date
  - Sort by time in ascending order
  - Include patient and doctor details
  - _Requirements: 4.1, 11.5_

- [x] 8.3 Create upcoming appointments API route
  - Write `apps/haunted-clinic/src/app/api/appointments/upcoming/route.ts`
  - Accept limit query parameter (default 5)
  - Fetch future appointments sorted by date and time
  - Include patient and doctor details
  - _Requirements: 4.3, 11.5_

- [x] 8.4 Create dashboard statistics API route
  - Write `apps/haunted-clinic/src/app/api/stats/route.ts`
  - Count total doctors, total patients, and today's appointments
  - Optimize with parallel queries
  - Cache results for 5 minutes
  - _Requirements: 4.2, 11.3, 11.5_

- [x] 9. Implement styling and theming
- [x] 9.1 Create custom CSS file
  - Write `apps/haunted-clinic/styles/custom.css`
  - Define heartbeat animation keyframes
  - Create status badge styles with color variables
  - Add timeline styles for schedule widget
  - Implement hover effects and transitions
  - _Requirements: 8.2, 8.3, 8.4_

- [x] 9.2 Configure bone_minimal theme
  - Ensure bone_minimal theme is properly applied
  - Verify color contrast ratios meet WCAG AA standards
  - Test all components with theme colors
  - _Requirements: 8.1, 8.2_

- [x] 9.3 Add responsive styles
  - Implement mobile-first responsive design
  - Add breakpoints for tablet and desktop
  - Test layouts on different screen sizes
  - Ensure touch targets are minimum 44x44 pixels
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10. Implement accessibility features
- [x] 10.1 Add keyboard navigation
  - Ensure all interactive elements are keyboard accessible
  - Implement proper tab order throughout the app
  - Add skip links for main content
  - Handle Escape key for closing modals and dropdowns
  - Test complete keyboard navigation flow
  - _Requirements: 10.1_

- [x] 10.2 Add ARIA labels and semantic HTML
  - Add ARIA labels to all form inputs
  - Add ARIA labels to interactive components (buttons, links, dropdowns)
  - Use semantic HTML elements (nav, main, article, section)
  - Add ARIA live regions for dynamic content updates
  - Ensure proper heading hierarchy (h1, h2, h3)
  - _Requirements: 10.2, 10.4, 10.5_

- [x] 10.3 Add alt text and focus indicators
  - Add descriptive alt text to all images
  - Set empty alt text for decorative elements
  - Ensure focus indicators are visible with high contrast
  - Test focus indicators on all interactive elements
  - _Requirements: 10.3_

- [x] 11. Create data seeding script
- [x] 11.1 Write seed script structure
  - Create `apps/haunted-clinic/scripts/seed.ts`
  - Set up Appwrite client with environment variables
  - Create main function with error handling
  - Add command-line execution
  - _Requirements: 12.1, 12.2, 12.3_

- [x] 11.2 Implement doctor seeding
  - Create array of sample doctor data with spooky names
  - Include variety of specialities
  - Add realistic years of experience and consultation fees
  - Implement idempotent seeding (check for existing data)
  - _Requirements: 12.1, 12.4_

- [x] 11.3 Implement patient seeding
  - Create array of synthetic patient data (no real information)
  - Include variety of blood types and ages
  - Add sample allergies and emergency contacts
  - Implement idempotent seeding
  - _Requirements: 12.2, 12.4, 12.5_

- [x] 11.4 Implement appointment seeding
  - Create sample appointments linking seeded doctors and patients
  - Distribute appointments across different dates and times
  - Include variety of statuses
  - Ensure no appointment conflicts
  - Implement idempotent seeding
  - _Requirements: 12.3, 12.4_

- [x] 12. Implement error handling
- [x] 12.1 Add form validation
  - Implement client-side validation for all forms
  - Display inline error messages for invalid fields
  - Announce validation errors to screen readers
  - Prevent form submission until all errors are resolved
  - _Requirements: 1.2, 2.2, 3.2, 10.5_

- [x] 12.2 Add API error handling
  - Implement error handling for all API calls
  - Display user-friendly error messages in toast notifications
  - Provide retry mechanism for transient errors
  - Log errors to console in development mode
  - _Requirements: 11.1_

- [x] 12.3 Add error boundaries
  - Wrap major sections in React error boundaries
  - Create fallback UI with error message and "Try Again" button
  - Log errors for debugging
  - _Requirements: 11.1_

- [x] 13. Implement performance optimizations
- [x] 13.1 Add code splitting
  - Implement dynamic imports for heavy components (AppointmentBooking, DoctorSchedule)
  - Add loading components for lazy-loaded modules
  - Verify route-based code splitting is working
  - _Requirements: 11.2_

- [x] 13.2 Implement data caching
  - Set up SWR for client-side data fetching with caching
  - Configure cache duration for doctor and patient lists (1 minute)
  - Configure shorter cache for appointments (30 seconds)
  - Implement stale-while-revalidate pattern
  - _Requirements: 11.3_

- [x] 13.3 Optimize database queries
  - Add indexes to Appwrite collections (date, doctorId, patientId, status)
  - Use Query.limit() to prevent fetching excessive data
  - Implement pagination for large lists (25 items per page)
  - Use parallel queries where possible (Promise.all)
  - _Requirements: 11.5_

- [x] 13.4 Add loading states
  - Implement skeleton loaders for all data-fetching components
  - Add loading spinners for form submissions
  - Show progress indicators for multi-step processes
  - Ensure loading states are accessible
  - _Requirements: 11.4_

- [x] 14. Create documentation
- [x] 14.1 Write README file
  - Create `apps/haunted-clinic/README.md`
  - Explain what Haunted Clinic is and its purpose
  - Document how to run the application
  - Document how to run the seed script
  - List all features
  - Add note about synthetic data only
  - _Requirements: 12.5_

- [x] 14.2 Add code comments
  - Add JSDoc comments to all exported functions and components
  - Document complex logic and algorithms
  - Add inline comments for non-obvious code
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 14.3 Document entity configurations
  - Add comments explaining entity field purposes
  - Document validation rules and their rationale
  - Explain permission settings
  - _Requirements: 7.1, 7.2, 7.3_

- [ ]\* 15. Write tests
- [ ]\* 15.1 Write unit tests for utilities
  - Test date/time formatting functions
  - Test time-to-position calculations
  - Test status transition logic
  - Test validation functions
  - _Requirements: 1.2, 2.2, 3.2_

- [ ]\* 15.2 Write integration tests for API routes
  - Test creating doctor with valid data
  - Test creating patient with valid data
  - Test creating appointment with valid references
  - Test updating appointment status
  - Test fetching today's appointments
  - Test fetching doctor schedule
  - _Requirements: 1.1, 1.4, 2.1, 2.4, 3.1, 3.4_

- [ ]\* 15.3 Write component tests
  - Test booking flow state transitions
  - Test status manager confirmation logic
  - Test schedule grid rendering
  - Test dashboard data display
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]\* 15.4 Write end-to-end tests
  - Test complete booking flow from doctor selection to confirmation
  - Test viewing appointment in doctor's schedule
  - Test updating appointment status
  - Test dashboard displays correct data
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4_

- [ ] 16. Final polish and quality assurance
- [x] 16.1 Visual polish pass
  - Review all pages in bone_minimal theme
  - Review all pages in blood_moon theme
  - Fix any visual inconsistencies
  - Ensure consistent spacing and typography
  - Add micro-interactions and hover effects
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [x] 16.2 Accessibility audit
  - Test keyboard navigation through all flows
  - Test with screen reader (NVDA or JAWS)
  - Verify color contrast ratios with automated tool
  - Check focus indicators on all interactive elements
  - Validate ARIA labels and semantic HTML
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 16.3 Performance audit
  - Measure page load times (target < 2 seconds)
  - Check bundle sizes (initial < 200KB gzipped)
  - Test on slow network connection
  - Verify lazy loading is working
  - Check for unnecessary re-renders
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 16.4 Cross-browser testing
  - Test in Chrome (latest version)
  - Test in Firefox (latest version)
  - Test in Safari (latest version)
  - Test in Edge (latest version)
  - Fix any browser-specific issues
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 16.5 Responsive testing
  - Test on mobile device (< 640px)
  - Test on tablet device (640px - 1023px)
  - Test on desktop device (>= 1024px)
  - Verify all layouts work correctly
  - Ensure touch targets are adequate on mobile
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 16.6 Data validation testing
  - Test all form validations work correctly
  - Test appointment conflict detection
  - Test referential integrity (deleting doctors/patients with appointments)
  - Test edge cases (past dates, invalid times, etc.)
  - _Requirements: 1.2, 2.2, 3.2_

- [x] 16.7 Integration verification
  - Verify entity generator created all necessary files
  - Verify navigation links work correctly
  - Verify theme switching works
  - Verify all API routes are functional
  - Test complete user flows end-to-end
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.5_

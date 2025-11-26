# Implementation Plan

- [x] 1. Create shared UI components



  - [x] 1.1 Create AnimatedCounter component with number animation

    - Implement useEffect-based counter animation from 0 to target value
    - Support prefix/suffix for currency and percentage displays
    - Respect prefers-reduced-motion preference
    - _Requirements: 2.1, 3.1, 9.3_
  - [ ]* 1.2 Write property test for AnimatedCounter
    - **Property 11: Reduced Motion Respect**
    - **Validates: Requirements 9.4**

  - [x] 1.3 Create GlowCard component with theme-aware styling

    - Implement card with CSS variable-based glow effects
    - Support variants: default, accent, success, warning, error
    - Add hover state with scale transform and glow intensification
    - _Requirements: 2.1, 2.4, 3.1_

  - [x] 1.4 Create StatusBadge component for unified status display

    - Implement status-to-color mapping for tournaments, matches, appointments
    - Support pulse animation for "live" status
    - _Requirements: 2.2, 3.2, 4.1_
  - [ ]* 1.5 Write property test for StatusBadge color mapping
    - **Property 4: Appointment Timeline Status Colors**
    - **Validates: Requirements 3.2**

  - [x] 1.6 Create PageHeader component for consistent page headers

    - Implement title, subtitle, icon, and actions slot
    - Add breadcrumb support
    - _Requirements: 4.1, 5.1_

  - [x] 1.7 Create FloatingActions component for detail pages

    - Implement floating action bar with edit/delete buttons
    - Position at bottom-right with smooth entrance animation
    - _Requirements: 5.4_
  - [ ]* 1.8 Write property test for FloatingActions
    - **Property 8: Detail Page Action Buttons**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [ ] 2. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Redesign landing page



  - [x] 3.1 Enhance hero section with animations

    - Add entrance animations with staggered timing
    - Implement theme-aware glowing text effects
    - Add floating particles or subtle background animation
    - _Requirements: 1.1_

  - [ ] 3.2 Create interactive app preview cards
    - Design cards for Cursed Arena and Haunted Clinic
    - Add 3D transform on hover with perspective
    - Include app screenshots or illustrations

    - _Requirements: 1.2_
  - [ ] 3.3 Enhance features section with animations
    - Implement staggered fade-in on scroll

    - Add icon animations on hover
    - _Requirements: 1.3_
  - [ ] 3.4 Add theme showcase section
    - Display all three themes with live preview
    - Add smooth transition demonstration
    - _Requirements: 1.4_
  - [ ]* 3.5 Write property test for theme switching
    - **Property 1: Theme Switching Consistency**
    - **Validates: Requirements 1.4**

- [x] 4. Redesign Cursed Arena dashboard


  - [x] 4.1 Create animated stat cards section

    - Use AnimatedCounter for stats display
    - Add neon glow effects with theme colors
    - Implement pulsing border animation
    - _Requirements: 2.1_

  - [ ] 4.2 Create LiveMatchCard component
    - Display live indicator with pulse animation
    - Show team names and animated score display
    - Add glitch effect on score changes
    - _Requirements: 2.2_
  - [ ]* 4.3 Write property test for LiveMatchCard
    - **Property 2: Live Match Display Completeness**

    - **Validates: Requirements 2.2**
  - [ ] 4.4 Create TournamentCard component with countdown
    - Display tournament info with countdown timer
    - Show prize pool with currency formatting
    - Add game-specific theming/icons
    - _Requirements: 2.3_
  - [x]* 4.5 Write property test for TournamentCard

    - **Property 3: Tournament Card Data Integrity**
    - **Validates: Requirements 2.3**
  - [ ] 4.6 Implement quick actions section
    - Style action buttons with theme colors
    - Add hover effects and icons
    - _Requirements: 2.4_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 6. Redesign Haunted Clinic dashboard

  - [x] 6.1 Create statistics overview section

    - Use AnimatedCounter for patient/doctor counts
    - Add subtle heartbeat animation to medical icons
    - _Requirements: 3.1_

  - [ ] 6.2 Create AppointmentTimeline component
    - Display today's appointments in vertical timeline
    - Color-code by status with StatusBadge
    - Add smooth scroll for long lists
    - _Requirements: 3.2_
  - [ ]* 6.3 Write property test for AppointmentTimeline
    - **Property 4: Appointment Timeline Status Colors** (if not covered in 1.5)
    - **Validates: Requirements 3.2**

  - [ ] 6.4 Create upcoming appointments section
    - Display appointment cards with patient/doctor info
    - Show date, time, and status
    - _Requirements: 3.3_
  - [ ]* 6.5 Write property test for appointment cards
    - **Property 5: Appointment Card Information**
    - **Validates: Requirements 3.3**
  - [x] 6.6 Create MiniCalendar component

    - Display current month with appointment density
    - Highlight today and days with appointments
    - _Requirements: 3.4_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 8. Enhance list pages

  - [x] 8.1 Update list page headers with PageHeader component

    - Add entity count display
    - Implement search input with debounce
    - Add filter dropdown for status
    - _Requirements: 4.1_
  - [ ]* 8.2 Write property test for list page header
    - **Property 6: List Page Header Accuracy**
    - **Validates: Requirements 4.1**
  - [x] 8.3 Enhance table row hover effects

    - Add subtle glow on hover
    - Fade in action buttons on row hover
    - _Requirements: 4.3_

  - [ ] 8.4 Create themed empty states
    - Design empty state for each entity type
    - Add themed illustrations (skull for arena, medical cross for clinic)
    - Include clear CTA button
    - _Requirements: 4.4_
  - [ ]* 8.5 Write property test for empty states
    - **Property 7: Empty State Rendering**
    - **Validates: Requirements 4.4**
  - [x] 8.6 Enhance skeleton loaders

    - Create arena-themed skeleton (glitch effect)
    - Create clinic-themed skeleton (bone shape)
    - _Requirements: 4.2_

- [ ] 9. Enhance detail pages
  - [ ] 9.1 Create tournament detail page hero section
    - Display tournament banner with gradient overlay
    - Show status badge, dates, and prize pool
    - Add key metrics in card grid
    - _Requirements: 5.1_
  - [ ] 9.2 Enhance team and player detail pages
    - Add avatar placeholder with initials
    - Display statistics in card format
    - Show related entities (team members, team affiliation)
    - _Requirements: 5.2_
  - [ ] 9.3 Enhance doctor and patient detail pages
    - Display professional info cards
    - Show contact details with icons
    - Add appointment history section
    - _Requirements: 5.3_
  - [ ] 9.4 Add FloatingActions to all detail pages
    - Integrate FloatingActions component
    - Wire up edit and delete handlers
    - _Requirements: 5.4_

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Enhance form pages
  - [ ] 11.1 Style form fields with theme
    - Update input, select, textarea styling
    - Add focus states with glow effect
    - Ensure proper label association
    - _Requirements: 6.1_
  - [ ]* 11.2 Write property test for form field labels
    - **Property 9: Form Field Labels**
    - **Validates: Requirements 6.1**
  - [ ] 11.3 Implement inline validation display
    - Show error messages below invalid fields
    - Add red border and icon for errors
    - Clear errors on field change
    - _Requirements: 6.2_
  - [ ]* 11.4 Write property test for validation errors
    - **Property 10: Form Validation Error Display**
    - **Validates: Requirements 6.2**
  - [ ] 11.5 Add form submission states
    - Show loading spinner during submission
    - Disable form while submitting
    - Display success animation on completion
    - _Requirements: 6.3, 6.4_


- [ ] 12. Enhance navigation
  - [x] 12.1 Update navigation styling

    - Enhance active state indicators
    - Add hover effects with theme colors
    - Ensure theme switcher is prominent
    - _Requirements: 7.1, 7.4_

  - [ ] 12.2 Implement mobile navigation
    - Add hamburger menu button
    - Create slide-out navigation drawer
    - Ensure touch-friendly targets
    - _Requirements: 7.2_

- [ ] 13. Implement responsive layouts
  - [ ] 13.1 Add responsive grid layouts
    - Implement 3-column grid for desktop
    - 2-column for tablet
    - Single column for mobile
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ] 13.2 Optimize touch targets for mobile
    - Ensure buttons are at least 44px
    - Add appropriate spacing between interactive elements
    - _Requirements: 8.3_

- [-] 14. Enhance error and loading states

  - [x] 14.1 Create themed error page component

    - Design friendly error message UI
    - Add retry button functionality
    - Include support/contact information
    - _Requirements: 10.2_
  - [ ]* 14.2 Write property test for error retry
    - **Property 12: Error State Retry Functionality**
    - **Validates: Requirements 10.2**
  - [x] 14.3 Enhance 404 page

    - Add themed illustration
    - Provide navigation options to main areas
    - _Requirements: 10.3_

  - [x] 14.4 Enhance unauthorized page

    - Display access denied message
    - Add login button or contact options
    - _Requirements: 10.4_

- [ ] 15. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

# 🎃 Grimoire Skeleton

> A spooky, elegant skeleton framework for spawning diverse applications from a single foundation

**Built for the Kiroween Hackathon** - Showcasing Kiro's full capabilities through specs, hooks, and vibe coding.

## 🌟 What is Grimoire Skeleton?

Grimoire Skeleton is a Kiro-native framework that demonstrates how to build reusable, production-ready systems. Define your entities once, and watch as complete CRUD interfaces materialize before your eyes.

### Key Features

- **🔮 Entity System** - Declarative entity definitions that auto-generate types, forms, lists, and API routes
- **🎨 Theme Engine** - Three spooky skins (Nightmare Neon, Bone Minimal, Blood Moon) with seamless switching
- **⚡ Dual Applications** - Two complete apps from one skeleton:
  - **Cursed Arena** - Esports tournament platform
  - **Haunted Clinic** - Doctor appointment system
- **🤖 Kiro-First Development** - Built using specs, hooks, and steering documents
- **🎯 Type-Safe** - Full TypeScript with strict mode
- **♿ Accessible** - WCAG AA compliant with proper ARIA attributes

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Appwrite account ([sign up here](https://cloud.appwrite.io/))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd grimoire-skeleton

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Appwrite credentials

# Initialize Appwrite backend
npm run setup:appwrite

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Backend**: Appwrite (auth, database, storage)
- **Styling**: Tailwind CSS 4 + CSS variables for theming
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete development guide with setup instructions, workflows, and troubleshooting
- **[ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md)** - System architecture and design decisions
- **[KIRO_USAGE_WRITEUP.md](./KIRO_USAGE_WRITEUP.md)** - How we used Kiro to build this project

## 🎭 The Two Applications

### Cursed Arena 🏆

An esports tournament management platform featuring:

- Tournament creation and management
- Team registration and tracking
- Live tournament status updates
- Prize pool tracking

### Haunted Clinic 🏥

A doctor appointment booking system featuring:

- Doctor profiles and specialties
- Appointment scheduling
- Patient management
- Appointment status tracking

Both applications share the same core components, layouts, and theme system - demonstrating the power of the skeleton approach.

## 🎨 Theme System

Switch between three spooky themes:

1. **Nightmare Neon** 💚 - Cyberpunk vibes with neon green and purple
2. **Bone Minimal** 🦴 - Clean monochrome with bone-white and black
3. **Blood Moon** 🌙 - Elegant darkness with deep red accents

All themes maintain excellent contrast ratios and smooth animations.

## 🤖 Kiro Integration

This project showcases Kiro's capabilities:

- **Specs** - Used for core systems (entity system, theme engine, auth)
- **Vibe Coding** - Used for UI components and rapid prototyping
- **Hooks** - Automated entity generation, theme validation, and pre-commit checks
- **Steering** - Project architecture and development guidelines
- **MCP** - Appwrite integration for backend management

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🏗️ Project Structure

```
/src
  /core           # Shared components, layouts, utilities
  /modules        # Domain-specific features
  /theme          # Theme system and skins
  /config         # Entity definitions
/apps             # The two example applications
  /cursed-arena   # Esports tournament platform
  /haunted-clinic # Doctor appointment system
/.kiro
  /specs          # Kiro specs for features
  /hooks          # Automated workflows
  /steering       # Development guidelines
```

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Please read the development guide first.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🎃 Built with Kiro

This project was built for the Kiroween Hackathon to demonstrate how Kiro can accelerate development while maintaining code quality. Every feature was developed using a combination of specs for core systems and vibe coding for UI work.

---

**Happy Haunting!** 👻💀🎃

# Implementation Plan - Project Setup

- [x] 1. Initialize Next.js project with TypeScript and Tailwind
  - Run create-next-app with TypeScript, App Router, and Tailwind options
  - Verify the project structure is created correctly
  - Test that the dev server starts successfully
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Create project folder structure
  - [x] 2.1 Create src directory and move app directory into it
    - Create src/core, src/modules, src/theme, src/config directories
    - Create src/core/components, src/core/layouts, src/core/lib subdirectories
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Create apps directory structure
    - Create apps/cursed-arena and apps/haunted-clinic directories
    - Add placeholder README files in each app directory
    - _Requirements: 2.5_

  - [x] 2.3 Create scripts directory
    - Create scripts directory at project root
    - _Requirements: 6.5_

  - [x] 2.4 Verify .kiro directory exists and is tracked
    - Ensure .kiro directory is present
    - Verify .kiro is not in .gitignore
    - _Requirements: 2.6_

- [x] 3. Configure TypeScript with path aliases
  - [x] 3.1 Update tsconfig.json with strict mode and path aliases
    - Enable strict mode
    - Set target to ES2022
    - Configure path aliases for @/core, @/modules, @/theme, @/config
    - Enable incremental compilation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Create next.config.js to support path aliases
    - Configure webpack aliases if needed
    - Ensure Next.js recognizes the path mappings
    - _Requirements: 3.5_

  - [x] 3.3 Test path alias resolution
    - Create a test file that imports using path aliases
    - Verify TypeScript resolves imports correctly
    - _Requirements: 3.5_

- [x] 4. Configure Tailwind CSS with custom theme
  - [x] 4.1 Update tailwind.config.ts with custom configuration
    - Add CSS variable-based color definitions
    - Add custom animations (glitch, pulse-glow, float)
    - Configure content paths for src and apps directories
    - Configure dark mode support
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 4.2 Create global CSS file with theme variables
    - Create src/app/globals.css with CSS variable definitions
    - Define base theme colors using CSS variables
    - Add base styles and Tailwind directives
    - _Requirements: 4.1_

  - [x] 4.3 Test Tailwind build
    - Verify Tailwind generates CSS correctly
    - Test custom animations work
    - _Requirements: 4.5_

- [x] 5. Set up environment variables
  - [x] 5.1 Create .env.local.example file
    - Document NEXT_PUBLIC_APPWRITE_ENDPOINT
    - Document NEXT_PUBLIC_APPWRITE_PROJECT_ID
    - Document APPWRITE_API_KEY
    - Add comments explaining each variable
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 5.2 Create environment validation utility
    - Write src/core/lib/env.ts with validateEnv function
    - Check for required environment variables at startup
    - Provide clear error messages for missing variables
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 5.3 Update .gitignore to exclude .env.local
    - Ensure .env.local is in .gitignore
    - Ensure .env.local.example is NOT in .gitignore
    - _Requirements: 5.5_

- [x] 6. Configure npm scripts in package.json
  - [x] 6.1 Add development and build scripts
    - Add dev, build, start scripts
    - _Requirements: 6.1, 6.2_

  - [x] 6.2 Add code quality scripts
    - Add lint, type-check, format, format:check scripts
    - _Requirements: 6.3, 6.4_

  - [x] 6.3 Add utility scripts
    - Add generate:entity, seed:cursed-arena, seed:haunted-clinic, setup:appwrite scripts
    - Install tsx as dev dependency for running TypeScript scripts
    - _Requirements: 6.5_

  - [x] 6.4 Test all npm scripts
    - Verify each script runs without errors
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Configure ESLint
  - [x] 7.1 Update .eslintrc.json with custom rules
    - Extend Next.js, TypeScript, React hooks, and accessibility configs
    - Add custom rules (no-console warning, no-unused-vars, no-explicit-any)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 7.2 Install required ESLint plugins
    - Install @typescript-eslint/eslint-plugin
    - Install eslint-plugin-jsx-a11y
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 7.3 Run ESLint to verify configuration
    - Execute npm run lint
    - Fix any initial linting errors
    - _Requirements: 7.5_

- [x] 8. Configure Prettier
  - [x] 8.1 Create .prettierrc configuration file
    - Set printWidth to 100
    - Set tabWidth to 2
    - Configure single quotes, trailing commas
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 8.2 Create .prettierignore file
    - Ignore node_modules, .next, build directories
    - _Requirements: 8.5_

  - [x] 8.3 Install Prettier and integration packages
    - Install prettier as dev dependency
    - Install eslint-config-prettier to avoid conflicts
    - _Requirements: 8.5_

  - [x] 8.4 Run Prettier to format existing files
    - Execute npm run format
    - Verify formatting is applied correctly
    - _Requirements: 8.5_

- [x] 9. Configure Git
  - [x] 9.1 Update .gitignore with comprehensive rules
    - Add node_modules, .next, .env.local
    - Add OS files (.DS_Store, Thumbs.db)
    - Add IDE files (.vscode, .idea)
    - Ensure .kiro directory is NOT ignored
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 9.2 Initialize git repository if not already done
    - Run git init if needed
    - Create initial commit with project setup
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10. Set up testing framework
  - [x] 10.1 Install Vitest and testing dependencies
    - Install vitest, @vitejs/plugin-react, jsdom
    - Install @testing-library/react, @testing-library/jest-dom
    - Install @vitest/ui for test UI (optional)
    - _Requirements: 10.1_

  - [x] 10.2 Create vitest.config.ts
    - Configure test environment as jsdom
    - Set up path aliases for tests
    - Configure coverage reporting
    - _Requirements: 10.2_

  - [x] 10.3 Create test setup file
    - Create src/core/lib/test-setup.ts
    - Import @testing-library/jest-dom for matchers
    - _Requirements: 10.1_

  - [x] 10.4 Add test scripts to package.json
    - Add test, test:watch, test:coverage scripts
    - _Requirements: 10.4_

  - [x] 10.5 Create example test file
    - Write src/core/lib/__tests__/env.test.ts
    - Test the validateEnv function
    - _Requirements: 10.3_

  - [x] 10.6 Run tests to verify setup
    - Execute npm run test
    - Verify tests run and pass
    - _Requirements: 10.4, 10.5_

- [x] 11. Create Appwrite setup script
  - [x] 11.1 Install Appwrite Node SDK (Use Appwrite MCP)
    - Install node-appwrite package (MCP: uvx args=mcp-server-appwrite)
    - _Requirements: 11.1_

  - [x] 11.2 Write scripts/setup-appwrite.ts
    - Create database creation logic
    - Create collection creation functions
    - Add attribute creation for each collection
    - Make script idempotent (handle existing resources)
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 11.3 Define collections for both apps
    - Define Tournaments and Teams collections for Cursed Arena
    - Define Appointments and Doctors collections for Haunted Clinic
    - Add appropriate attributes and indexes
    - _Requirements: 11.1, 11.2_

  - [x] 11.4 Test Appwrite setup script
    - Run npm run setup:appwrite
    - Verify collections are created in Appwrite
    - Run again to verify idempotency
    - _Requirements: 11.4_

  - [x] 11.5 Document Appwrite setup process
    - Add instructions to DEVELOPMENT.md
    - Include prerequisites (Appwrite account, project creation)
    - _Requirements: 11.5_

- [x] 12. Write DEVELOPMENT.md documentation
  - [x] 12.1 Create DEVELOPMENT.md with setup instructions
    - Document prerequisites (Node.js version, npm, Appwrite)
    - Write step-by-step local setup guide
    - Explain environment variable configuration
    - _Requirements: 12.1_

  - [x] 12.2 Document development workflows
    - How to run the dev server
    - How to run tests
    - How to run linting and formatting
    - _Requirements: 12.3, 12.4_

  - [x] 12.3 Document feature addition guides
    - How to add a new entity (step-by-step)
    - How to add a new theme (step-by-step)
    - _Requirements: 12.2, 12.3_

  - [x] 12.4 Add troubleshooting section
    - Common issues and solutions
    - Environment variable problems
    - Appwrite connection issues
    - Build errors
    - _Requirements: 12.5_

- [x] 13. Write README.md
  - [x] 13.1 Create README.md with project overview
    - Write compelling project description
    - Explain the Grimoire Skeleton concept
    - Highlight key features (entity system, theme engine, dual apps)
    - _Requirements: 13.1, 13.2_

  - [x] 13.2 Add quick start section
    - Clone command
    - Install dependencies command
    - Environment setup steps
    - Run dev server command
    - _Requirements: 13.3_

  - [x] 13.3 Add hackathon and tech stack information
    - Mention Kiroween hackathon
    - List technology stack
    - Link to DEVELOPMENT.md for detailed docs
    - _Requirements: 13.4, 13.5_

  - [x] 13.4 Add placeholders for screenshots
    - Add sections for screenshots/GIFs
    - Note: Actual screenshots will be added after UI is built
    - _Requirements: 13.3_

- [x] 14. Add LICENSE file
  - [x] 14.1 Create LICENSE file with MIT license
    - Use standard MIT license text
    - Add current year and copyright holder
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 14.2 Reference license in README
    - Add license badge or section to README
    - _Requirements: 14.4, 14.5_

- [ ]\* 15. Set up GitHub Actions CI (optional)
  - [ ]\* 15.1 Create .github/workflows/ci.yml
    - Configure workflow to run on pull requests
    - Add job to run tests
    - Add job to run linting
    - Add job to run type checking
    - Add job to verify build succeeds
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  - [ ]\* 15.2 Test CI workflow
    - Push to GitHub and create a test PR
    - Verify all CI jobs run successfully
    - Ensure workflow completes within 5 minutes
    - _Requirements: 15.5_

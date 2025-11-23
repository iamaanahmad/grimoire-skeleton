'use client';

import { ThemeSwitcher } from '@/theme/ThemeSwitcher';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Navigation Bar */}
      <nav 
        className="sticky top-0 z-50 border-b backdrop-blur-sm"
        style={{ 
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border-primary)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">💀</span>
            <h1 
              className="text-lg font-bold tracking-tight sm:text-xl lg:text-2xl"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Grimoire Skeleton
            </h1>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          {/* Hero Content - Centered */}
          <div className="mb-16 text-center sm:mb-20">
            <div className="mb-6 flex justify-center sm:mb-8">
              <div 
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:px-6 sm:py-3"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-accent-primary)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                <span className="text-lg">🎃</span>
                <span>Built for Kiroween Hackathon</span>
              </div>
            </div>
            
            <h2 
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Summon Your Next
              <br />
              <span style={{ color: 'var(--color-accent-primary)' }}>
                Spooky Application
              </span>
            </h2>
            
            <p 
              className="mx-auto mb-10 max-w-3xl text-base leading-relaxed sm:text-lg lg:text-xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              A hauntingly elegant skeleton framework for spawning diverse applications from a single foundation. 
              Built with Next.js, TypeScript, and a flexible theming system.
            </p>

            {/* CTA Buttons - Centered */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <a
                className="group flex h-12 w-full max-w-xs items-center justify-center gap-3 rounded-xl px-6 text-base font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:h-14 sm:w-auto sm:text-lg"
                style={{
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'var(--color-bg-primary)',
                }}
                href="/apps/cursed-arena"
              >
                <span className="text-xl sm:text-2xl">⚔️</span>
                <span>Cursed Arena</span>
              </a>
              <a
                className="group flex h-12 w-full max-w-xs items-center justify-center gap-3 rounded-xl px-6 text-base font-bold transition-all hover:scale-105 sm:h-14 sm:w-auto sm:text-lg"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)',
                  border: '2px solid var(--color-border-primary)',
                }}
                href="/apps/haunted-clinic"
              >
                <span className="text-xl sm:text-2xl">🏥</span>
                <span>Haunted Clinic</span>
              </a>
            </div>
          </div>

          {/* Features Grid - All Centered */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div 
              className="group flex flex-col items-center rounded-2xl border p-6 text-center transition-all hover:scale-105 sm:p-8"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="mb-4 text-4xl sm:text-5xl">🎨</div>
              <h3 
                className="mb-3 text-lg font-bold sm:text-xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Three Spooky Themes
              </h3>
              <p 
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Switch between Nightmare Neon, Bone Minimal, and Blood Moon themes. 
                Each with unique colors, animations, and visual effects.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              className="group flex flex-col items-center rounded-2xl border p-6 text-center transition-all hover:scale-105 sm:p-8"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="mb-4 text-4xl sm:text-5xl">⚡</div>
              <h3 
                className="mb-3 text-lg font-bold sm:text-xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Entity System
              </h3>
              <p 
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Define entities once, get full CRUD interfaces automatically. 
                Type-safe, validated, and ready to summon.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              className="group flex flex-col items-center rounded-2xl border p-6 text-center transition-all hover:scale-105 sm:p-8"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="mb-4 text-4xl sm:text-5xl">♿</div>
              <h3 
                className="mb-3 text-lg font-bold sm:text-xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Accessible by Design
              </h3>
              <p 
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                WCAG AA compliant contrast ratios, keyboard navigation, 
                and reduced motion support built in.
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              className="group flex flex-col items-center rounded-2xl border p-6 text-center transition-all hover:scale-105 sm:p-8"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="mb-4 text-4xl sm:text-5xl">🔮</div>
              <h3 
                className="mb-3 text-lg font-bold sm:text-xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Built with Kiro
              </h3>
              <p 
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Developed using Kiro's specs, hooks, and vibe coding. 
                A showcase of AI-assisted development.
              </p>
            </div>

            {/* Feature 5 */}
            <div 
              className="group flex flex-col items-center rounded-2xl border p-6 text-center transition-all hover:scale-105 sm:p-8"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="mb-4 text-4xl sm:text-5xl">🚀</div>
              <h3 
                className="mb-3 text-lg font-bold sm:text-xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Production Ready
              </h3>
              <p 
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                TypeScript, Next.js 14, Tailwind CSS, and Appwrite. 
                Modern stack, zero compromises.
              </p>
            </div>

            {/* Feature 6 */}
            <div 
              className="group flex flex-col items-center rounded-2xl border p-6 text-center transition-all hover:scale-105 sm:p-8"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="mb-4 text-4xl sm:text-5xl">🎭</div>
              <h3 
                className="mb-3 text-lg font-bold sm:text-xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Spooky Animations
              </h3>
              <p 
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Glitch effects, bone rattles, and blood glows. 
                60fps performance with CSS transforms.
              </p>
            </div>
          </div>

          {/* Theme Showcase - Centered */}
          <div 
            className="mt-16 rounded-3xl border p-8 text-center sm:mt-20 sm:p-12 lg:p-16"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border-primary)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="mb-6 text-4xl sm:text-5xl">🎨</div>
            <h3 
              className="mb-4 text-2xl font-bold sm:text-3xl"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Try the Theme Switcher
            </h3>
            <p 
              className="mx-auto mb-8 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Click the theme selector in the top navigation to experience all three themes. 
              Watch as colors, shadows, and animations transform instantly without page reload.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div 
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                💚 Nightmare Neon
              </div>
              <div 
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                🦴 Bone Minimal
              </div>
              <div 
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                🌙 Blood Moon
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Centered */}
      <footer 
        className="border-t"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border-primary)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">💀</span>
              <span 
                className="text-base font-bold sm:text-lg"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Grimoire Skeleton
              </span>
            </div>
            <p 
              className="text-xs sm:text-sm"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Built with Kiro for the Kiroween Hackathon 🎃
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

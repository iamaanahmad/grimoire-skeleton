'use client';

import { ThemeSwitcher } from '@/theme/ThemeSwitcher';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Navigation Bar */}
      <nav 
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ 
          backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 90%, transparent)',
          borderColor: 'var(--color-border-primary)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl animate-bounce-slow">💀</span>
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
      <main className="flex flex-1 flex-col relative z-10">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          {/* Hero Content - Centered */}
          <div className="mb-24 text-center sm:mb-32 relative">
            <div className="mb-8 flex justify-center sm:mb-10">
              <div 
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:px-6 sm:py-3 glass-panel"
                style={{
                  color: 'var(--color-accent-primary)',
                  boxShadow: '0 0 20px var(--color-accent-secondary)',
                }}
              >
                <span className="text-lg">🎃</span>
                <span>Built for Kiroween Hackathon</span>
              </div>
            </div>
            
            <h2 
              className="mb-8 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl text-glow"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Summon Your Next
              <br />
              <span style={{ color: 'var(--color-accent-primary)' }}>
                Spooky Application
              </span>
            </h2>
            
            <p 
              className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed sm:text-xl lg:text-2xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              A hauntingly elegant skeleton framework for spawning diverse applications from a single foundation. 
              Built with Next.js, TypeScript, and a flexible theming system.
            </p>

            {/* CTA Buttons - Centered */}
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
              <a
                className="group flex h-14 w-full max-w-xs items-center justify-center gap-3 rounded-xl px-8 text-lg font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:h-16 sm:w-auto sm:text-xl box-glow"
                style={{
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'var(--color-bg-primary)',
                }}
                href="/apps/cursed-arena"
              >
                <span className="text-2xl sm:text-3xl">⚔️</span>
                <span>Cursed Arena</span>
              </a>
              <a
                className="group flex h-14 w-full max-w-xs items-center justify-center gap-3 rounded-xl px-8 text-lg font-bold transition-all hover:scale-105 sm:h-16 sm:w-auto sm:text-xl glass-panel"
                style={{
                  color: 'var(--color-text-primary)',
                }}
                href="/apps/haunted-clinic"
              >
                <span className="text-2xl sm:text-3xl">🏥</span>
                <span>Haunted Clinic</span>
              </a>
            </div>
          </div>

          {/* Features Grid - All Centered */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {/* Feature 1 */}
            <div className="group flex flex-col items-center rounded-2xl p-8 text-center transition-all hover:scale-105 hover:-translate-y-2 glass-panel w-full h-full">
              <div className="mb-6 text-5xl sm:text-6xl transition-transform group-hover:scale-110 duration-300">🎨</div>
              <h3 
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Three Spooky Themes
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Switch between Nightmare Neon, Bone Minimal, and Blood Moon themes. 
                Each with unique colors, animations, and visual effects.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group flex flex-col items-center rounded-2xl p-8 text-center transition-all hover:scale-105 hover:-translate-y-2 glass-panel w-full h-full">
              <div className="mb-6 text-5xl sm:text-6xl transition-transform group-hover:scale-110 duration-300">⚡</div>
              <h3 
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Entity System
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Define entities once, get full CRUD interfaces automatically. 
                Type-safe, validated, and ready to summon.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group flex flex-col items-center rounded-2xl p-8 text-center transition-all hover:scale-105 hover:-translate-y-2 glass-panel w-full h-full">
              <div className="mb-6 text-5xl sm:text-6xl transition-transform group-hover:scale-110 duration-300">♿</div>
              <h3 
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Accessible by Design
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                WCAG AA compliant contrast ratios, keyboard navigation, 
                and reduced motion support built in.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group flex flex-col items-center rounded-2xl p-8 text-center transition-all hover:scale-105 hover:-translate-y-2 glass-panel w-full h-full">
              <div className="mb-6 text-5xl sm:text-6xl transition-transform group-hover:scale-110 duration-300">🔮</div>
              <h3 
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Built with Kiro
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Developed using Kiro's specs, hooks, and vibe coding. 
                A showcase of AI-assisted development.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group flex flex-col items-center rounded-2xl p-8 text-center transition-all hover:scale-105 hover:-translate-y-2 glass-panel w-full h-full">
              <div className="mb-6 text-5xl sm:text-6xl transition-transform group-hover:scale-110 duration-300">🚀</div>
              <h3 
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Production Ready
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                TypeScript, Next.js 14, Tailwind CSS, and Appwrite. 
                Modern stack, zero compromises.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group flex flex-col items-center rounded-2xl p-8 text-center transition-all hover:scale-105 hover:-translate-y-2 glass-panel w-full h-full">
              <div className="mb-6 text-5xl sm:text-6xl transition-transform group-hover:scale-110 duration-300">🎭</div>
              <h3 
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Spooky Animations
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Glitch effects, bone rattles, and blood glows. 
                60fps performance with CSS transforms.
              </p>
            </div>
          </div>

          {/* Theme Showcase - Centered */}
          <div className="mt-24 sm:mt-32 glass-panel rounded-3xl p-8 text-center sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse-slow pointer-events-none"></div>
            <div className="mb-8 text-5xl sm:text-6xl">🎨</div>
            <h3 
              className="mb-6 text-3xl font-bold sm:text-4xl text-glow"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Try the Theme Switcher
            </h3>
            <p 
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Click the theme selector in the top navigation to experience all three themes. 
              Watch as colors, shadows, and animations transform instantly without page reload.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div 
                className="rounded-xl px-6 py-3 text-base font-bold transition-transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: '#00ff9d',
                  border: '1px solid #00ff9d',
                  boxShadow: '0 0 10px rgba(0, 255, 157, 0.2)',
                }}
              >
                💚 Nightmare Neon
              </div>
              <div 
                className="rounded-xl px-6 py-3 text-base font-bold transition-transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: '#e2e8f0',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 0 10px rgba(226, 232, 240, 0.2)',
                }}
              >
                🦴 Bone Minimal
              </div>
              <div 
                className="rounded-xl px-6 py-3 text-base font-bold transition-transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: '#ff4d4d',
                  border: '1px solid #ff4d4d',
                  boxShadow: '0 0 10px rgba(255, 77, 77, 0.2)',
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
        className="border-t backdrop-blur-sm"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 90%, transparent)',
          borderColor: 'var(--color-border-primary)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">💀</span>
              <span 
                className="text-lg font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Grimoire Skeleton
              </span>
            </div>
            <p 
              className="text-sm sm:text-base"
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

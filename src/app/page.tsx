'use client';

import { useEffect, useState } from 'react';
import { ThemeSwitcher } from '@/theme/ThemeSwitcher';
import { AnimatedCounter } from '@/components/shared';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: '🎨',
      title: 'Three Spooky Themes',
      desc: 'Switch between Nightmare Neon, Bone Minimal, and Blood Moon themes with unique colors and effects.',
    },
    {
      icon: '⚡',
      title: 'Entity System',
      desc: 'Define entities once, get full CRUD interfaces automatically. Type-safe and validated.',
    },
    {
      icon: '♿',
      title: 'Accessible by Design',
      desc: 'WCAG AA compliant contrast ratios, keyboard navigation, and reduced motion support.',
    },
    {
      icon: '🔮',
      title: 'Built with Kiro',
      desc: "Developed using Kiro's specs, hooks, and vibe coding for AI-assisted development.",
    },
    {
      icon: '🚀',
      title: 'Production Ready',
      desc: 'TypeScript, Next.js 14, Tailwind CSS, and Appwrite. Modern stack, zero compromises.',
    },
    {
      icon: '🎭',
      title: 'Spooky Animations',
      desc: 'Glitch effects, bone rattles, and blood glows with 60fps CSS transforms.',
    },
  ];

  const themes = [
    { name: 'Nightmare Neon', emoji: '💚', color: '#00ff9d' },
    { name: 'Bone Minimal', emoji: '🦴', color: '#e2e8f0' },
    { name: 'Blood Moon', emoji: '🌙', color: '#ff4d4d' },
  ];

  const apps = [
    {
      name: 'Cursed Arena',
      emoji: '⚔️',
      desc: 'Esports tournament management with live matches, team rosters, and bracket visualization.',
      href: '/apps/cursed-arena',
      gradient: 'linear-gradient(135deg, #00ff9d20, #00ff9d05)',
      stats: { tournaments: 12, teams: 48, players: 192 },
    },
    {
      name: 'Haunted Clinic',
      emoji: '🏥',
      desc: 'Medical appointment scheduling with doctor management and patient records.',
      href: '/apps/haunted-clinic',
      gradient: 'linear-gradient(135deg, #ff4d4d20, #ff4d4d05)',
      stats: { doctors: 8, patients: 156, appointments: 324 },
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, var(--color-accent-glow) 0%, transparent 50%)',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Navigation */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 85%, transparent)',
          borderBottom: '1px solid var(--color-border-primary)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 32px',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px', animation: mounted ? 'float 3s ease-in-out infinite' : 'none' }}>💀</span>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--color-text-primary)',
              }}
            >
              Grimoire Skeleton
            </span>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          padding: '80px 32px 100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            borderRadius: '9999px',
            marginBottom: '40px',
            backgroundColor: 'color-mix(in srgb, var(--color-accent-primary) 12%, transparent)',
            color: 'var(--color-accent-primary)',
            border: '1px solid var(--color-accent-primary)',
            boxShadow: '0 0 40px var(--color-accent-glow)',
            fontSize: '14px',
            fontWeight: 600,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out',
          }}
        >
          <span style={{ fontSize: '20px' }}>🎃</span>
          <span>Built for Kiroween Hackathon • Skeleton Crew Category</span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '24px',
            color: 'var(--color-text-primary)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease-out 0.1s',
          }}
        >
          Summon Your Next
          <br />
          <span
            style={{
              color: 'var(--color-accent-primary)',
              textShadow: '0 0 60px var(--color-accent-glow)',
              display: 'inline-block',
              animation: mounted ? 'glow 2s ease-in-out infinite alternate' : 'none',
            }}
          >
            Spooky Application
          </span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            lineHeight: 1.7,
            maxWidth: '800px',
            marginBottom: '48px',
            color: 'var(--color-text-secondary)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease-out 0.2s',
          }}
        >
          A hauntingly elegant skeleton framework for spawning diverse applications 
          from a single foundation. Two apps, one codebase, infinite possibilities.
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginBottom: '48px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease-out 0.3s',
          }}
        >
          {[
            { label: 'Themes', value: 3 },
            { label: 'Entity Types', value: 7 },
            { label: 'Components', value: 25 },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'var(--color-accent-primary)',
                  textShadow: '0 0 20px var(--color-accent-glow)',
                }}
              >
                <AnimatedCounter value={stat.value} duration={1500} />
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Preview Cards */}
      <section
        style={{
          width: '100%',
          padding: '0 32px 80px',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '32px',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          {apps.map((app, i) => (
            <a
              key={app.name}
              href={app.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '32px',
                borderRadius: '24px',
                textDecoration: 'none',
                background: app.gradient,
                backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 60%, transparent)',
                border: '1px solid var(--color-border-primary)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.4s ease',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${0.4 + i * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.3), 0 0 40px var(--color-accent-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
              }}
            >
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>{app.emoji}</div>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px',
                }}
              >
                {app.name}
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                  flex: 1,
                }}
              >
                {app.desc}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border-primary)',
                }}
              >
                {Object.entries(app.stats).map(([key, value]) => (
                  <div key={key}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                      {value}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', textTransform: 'capitalize' }}>
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          width: '100%',
          padding: '80px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 30%, transparent)',
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: 'var(--color-text-primary)',
            textAlign: 'center',
          }}
        >
          ✨ Hauntingly Good Features
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--color-text-secondary)',
            marginBottom: '48px',
            textAlign: 'center',
          }}
        >
          Everything you need to build production-ready applications
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '32px 24px',
                borderRadius: '20px',
                backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 50%, transparent)',
                border: '1px solid var(--color-border-primary)',
                transition: 'all 0.3s ease',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${0.6 + i * 0.05}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px var(--color-accent-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Theme Showcase */}
      <section
        style={{
          width: '100%',
          padding: '80px 32px',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '900px',
            padding: '48px',
            borderRadius: '32px',
            textAlign: 'center',
            backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 60%, transparent)',
            border: '1px solid var(--color-border-primary)',
            boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎨</div>
          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: 'var(--color-text-primary)',
            }}
          >
            Three Themes, One Click
          </h2>
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto 32px',
              color: 'var(--color-text-secondary)',
            }}
          >
            Click the theme selector in the navigation to experience instant theme switching.
            Colors, shadows, and animations transform seamlessly.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            {themes.map((theme) => (
              <div
                key={theme.name}
                style={{
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: theme.color,
                  border: `2px solid ${theme.color}`,
                  boxShadow: `0 0 20px ${theme.color}30`,
                  transition: 'transform 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {theme.emoji} {theme.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kiro Usage Section */}
      <section
        style={{
          width: '100%',
          padding: '80px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 30%, transparent)',
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 'bold',
            marginBottom: '48px',
            color: 'var(--color-text-primary)',
            textAlign: 'center',
          }}
        >
          🔮 Powered by Kiro
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          {[
            { icon: '💬', title: 'Vibe Coding', desc: '70% of UI built through natural conversation' },
            { icon: '📋', title: 'Specs', desc: 'Structured development for core systems' },
            { icon: '🪝', title: 'Hooks', desc: 'Automated workflows for repetitive tasks' },
            { icon: '🧭', title: 'Steering', desc: 'Consistent architecture guidance' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 50%, transparent)',
                border: '1px solid var(--color-border-primary)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          width: '100%',
          padding: '32px',
          marginTop: 'auto',
          backgroundColor: 'color-mix(in srgb, var(--color-bg-secondary) 80%, transparent)',
          borderTop: '1px solid var(--color-border-primary)',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>💀</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Grimoire Skeleton
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>
            Built with Kiro for the Kiroween Hackathon 🎃
          </p>
        </div>
      </footer>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          from { text-shadow: 0 0 40px var(--color-accent-glow); }
          to { text-shadow: 0 0 80px var(--color-accent-glow), 0 0 120px var(--color-accent-glow); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

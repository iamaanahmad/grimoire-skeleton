/**
 * ThemeSwitcher Component Tests
 *
 * Tests for the theme switcher UI component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { ThemeProvider } from '../ThemeProvider';
import { getDefaultTheme, getAllThemes } from '../skins';

// Mock the theme system
vi.mock('../skins', () => ({
  getDefaultTheme: vi.fn(() => ({
    id: 'nightmare_neon',
    name: 'Nightmare Neon',
    description: 'Cyberpunk horror with neon green and purple glitch effects',
    colors: {
      bg: { primary: '#0a0a0f', secondary: '#1a1a2e', tertiary: '#16213e' },
      text: { primary: '#00ff41', secondary: '#b388ff', tertiary: '#8e8e93' },
      accent: { primary: '#00ff41', secondary: '#b388ff', glow: '#00ff4180' },
      status: { success: '#00ff41', error: '#ff0055', warning: '#ffaa00', info: '#00d4ff' },
      border: { primary: '#00ff4140', secondary: '#b388ff40' },
    },
    animations: {
      duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      special: { hover: 'glitch', loading: 'neon-pulse', entrance: 'glitch-in' },
    },
    effects: { shadows: true, glows: true, blur: true, shadowIntensity: 0.8, glowIntensity: 0.9 },
  })),
  getAllThemes: vi.fn(() => [
    {
      id: 'nightmare_neon',
      name: 'Nightmare Neon',
      description: 'Cyberpunk horror with neon green and purple glitch effects',
      colors: {
        bg: { primary: '#0a0a0f', secondary: '#1a1a2e', tertiary: '#16213e' },
        text: { primary: '#00ff41', secondary: '#b388ff', tertiary: '#8e8e93' },
        accent: { primary: '#00ff41', secondary: '#b388ff', glow: '#00ff4180' },
        status: { success: '#00ff41', error: '#ff0055', warning: '#ffaa00', info: '#00d4ff' },
        border: { primary: '#00ff4140', secondary: '#b388ff40' },
      },
      animations: {
        duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        special: { hover: 'glitch', loading: 'neon-pulse', entrance: 'glitch-in' },
      },
      effects: { shadows: true, glows: true, blur: true, shadowIntensity: 0.8, glowIntensity: 0.9 },
    },
    {
      id: 'bone_minimal',
      name: 'Bone Minimal',
      description: 'Clean monochrome with bone-white and stark black',
      colors: {
        bg: { primary: '#0d0d0d', secondary: '#1a1a1a', tertiary: '#262626' },
        text: { primary: '#f5f5dc', secondary: '#d4d4c8', tertiary: '#8c8c7a' },
        accent: { primary: '#f5f5dc', secondary: '#d4d4c8', glow: '#f5f5dc60' },
        status: { success: '#c8d4c8', error: '#d4c8c8', warning: '#d4d4c8', info: '#c8d4d4' },
        border: { primary: '#f5f5dc30', secondary: '#d4d4c820' },
      },
      animations: {
        duration: { fast: '100ms', normal: '200ms', slow: '400ms' },
        easing: 'ease-in-out',
        special: { hover: 'bone-rattle', loading: 'bone-pulse', entrance: 'fade-in' },
      },
      effects: { shadows: false, glows: false, blur: false },
    },
  ]),
  getThemeById: vi.fn((id: string) => {
    const themes = getAllThemes();
    return themes.find(t => t.id === id);
  }),
}));

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with current theme name', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByText('Nightmare Neon')).toBeInTheDocument();
  });

  it('displays dropdown when clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const trigger = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('shows all available themes in dropdown', async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const trigger = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(trigger);

    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
      expect(screen.getAllByText('Nightmare Neon').length).toBeGreaterThan(0);
      expect(screen.getByText('Bone Minimal')).toBeInTheDocument();
    });
  });

  it('highlights currently active theme', async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const trigger = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(trigger);

    await waitFor(() => {
      const activeOption = screen.getByRole('option', { selected: true });
      expect(activeOption).toHaveTextContent('Nightmare Neon');
    });
  });

  it('renders button group variant', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher variant="buttons" />
      </ThemeProvider>
    );

    expect(screen.getByRole('group', { name: /theme selection/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to nightmare neon/i })).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const trigger = screen.getByRole('button', { name: /select theme/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
  });
});

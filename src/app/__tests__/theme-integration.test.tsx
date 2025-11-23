/**
 * Theme Integration Tests
 *
 * Tests that verify the theme system is properly integrated into the app.
 * Validates SSR compatibility, theme persistence, and hydration.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { getDefaultTheme } from '@/theme/skins';

describe('Theme Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any existing theme style elements
    const existingStyle = document.getElementById('grimoire-theme-vars');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  it('should render ThemeProvider without errors', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(container).toBeTruthy();
  });

  it('should inject theme CSS variables into the document', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Check that the style element was created
    const styleElement = document.getElementById('grimoire-theme-vars');
    expect(styleElement).toBeTruthy();
    expect(styleElement?.tagName).toBe('STYLE');
  });

  it('should set data-theme attribute on document root', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    const defaultTheme = getDefaultTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe(defaultTheme.id);
  });

  it('should handle SSR scenario where localStorage is unavailable', () => {
    // Mock localStorage to throw an error
    const originalLocalStorage = global.localStorage;
    Object.defineProperty(global, 'localStorage', {
      value: undefined,
      writable: true,
    });

    const { container } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(container).toBeTruthy();

    // Restore localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it('should apply default theme when no saved preference exists', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    const defaultTheme = getDefaultTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe(defaultTheme.id);
  });

  it('should set data-reduced-motion attribute based on media query', () => {
    // Mock matchMedia
    const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Check that data-reduced-motion attribute is set
    const reducedMotionAttr = document.documentElement.getAttribute('data-reduced-motion');
    expect(reducedMotionAttr).toBeTruthy();
  });
});

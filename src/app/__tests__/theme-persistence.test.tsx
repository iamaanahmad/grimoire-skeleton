/**
 * Theme Persistence Tests
 *
 * Tests that verify theme preferences persist across page navigations
 * and browser sessions using localStorage.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ThemeSwitcher } from '@/theme/ThemeSwitcher';
import { getThemeById, getAllThemes } from '@/theme/skins';

describe('Theme Persistence', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any existing theme style elements
    const existingStyle = document.getElementById('grimoire-theme-vars');
    if (existingStyle) {
      existingStyle.remove();
    }
    // Clear data attributes
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-reduced-motion');
  });

  it('should save theme preference to localStorage when changed', async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Open the theme switcher
    const trigger = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(trigger);

    // Get all available themes
    const themes = getAllThemes();
    const secondTheme = themes[1];

    // Click on a different theme
    const themeOption = screen.getByText(secondTheme.name);
    fireEvent.click(themeOption);

    // Check that the theme was saved to localStorage
    await waitFor(() => {
      const savedThemeId = localStorage.getItem('grimoire-theme');
      expect(savedThemeId).toBe(secondTheme.id);
    });
  });

  it('should load saved theme preference on mount', () => {
    const themes = getAllThemes();
    const savedTheme = themes[1];
    
    // Pre-populate localStorage with a theme preference
    localStorage.setItem('grimoire-theme', savedTheme.id);

    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Check that the saved theme was applied
    expect(document.documentElement.getAttribute('data-theme')).toBe(savedTheme.id);
  });

  it('should persist theme across component remounts', async () => {
    const themes = getAllThemes();
    const targetTheme = themes[2] || themes[1];

    // First render - change theme
    const { unmount } = render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const trigger = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(trigger);

    const themeOption = screen.getByText(targetTheme.name);
    fireEvent.click(themeOption);

    // Wait for theme to be saved
    await waitFor(() => {
      expect(localStorage.getItem('grimoire-theme')).toBe(targetTheme.id);
    });

    // Unmount the component
    unmount();

    // Second render - should load the saved theme
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Check that the theme persisted
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe(targetTheme.id);
    });
  });

  it('should handle invalid theme ID in localStorage gracefully', () => {
    // Set an invalid theme ID in localStorage
    localStorage.setItem('grimoire-theme', 'invalid-theme-id');

    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Should fall back to default theme
    const defaultTheme = getThemeById('nightmare_neon');
    expect(document.documentElement.getAttribute('data-theme')).toBe(defaultTheme?.id);
  });

  it('should update CSS variables when theme changes', async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Get initial style element
    const styleElement = document.getElementById('grimoire-theme-vars');
    expect(styleElement).toBeTruthy();
    const initialContent = styleElement?.textContent;

    // Change theme
    const trigger = screen.getByRole('button', { name: /select theme/i });
    fireEvent.click(trigger);

    const themes = getAllThemes();
    const secondTheme = themes[1];
    const themeOption = screen.getByText(secondTheme.name);
    fireEvent.click(themeOption);

    // Check that CSS variables were updated
    await waitFor(() => {
      const updatedContent = styleElement?.textContent;
      expect(updatedContent).not.toBe(initialContent);
      expect(updatedContent).toContain(':root');
    });
  });
});

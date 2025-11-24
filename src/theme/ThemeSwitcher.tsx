/**
 * ThemeSwitcher Component
 *
 * UI component for switching between available themes.
 * Features:
 * - Displays all available themes with names and descriptions
 * - Highlights currently active theme
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Smooth transitions (300ms max)
 * - Fully accessible with ARIA attributes
 * - Responsive design for all screen sizes
 */

'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import './ThemeSwitcher.css';
import { useTheme } from './useTheme';
import { getAllThemes } from './skins';
import type { ThemeDefinition } from '@/core/types/theme';

/**
 * Props for the ThemeSwitcher component.
 */
export interface ThemeSwitcherProps {
  /**
   * Optional CSS class name for custom styling.
   */
  className?: string;

  /**
   * Display variant: 'dropdown' or 'buttons'.
   * @default 'dropdown'
   */
  variant?: 'dropdown' | 'buttons';
}

/**
 * ThemeSwitcher component that allows users to switch between available themes.
 * Provides an accessible, keyboard-navigable interface for theme selection.
 *
 * @example
 * ```tsx
 * // Dropdown variant (default)
 * <ThemeSwitcher />
 *
 * // Button group variant
 * <ThemeSwitcher variant="buttons" />
 * ```
 */
export function ThemeSwitcher({ className = '', variant = 'dropdown' }: ThemeSwitcherProps) {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const themes = getAllThemes();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      // Open dropdown with Enter or Space
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(themes.findIndex(t => t.id === currentTheme.id));
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % themes.length);
        break;

      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => (prev - 1 + themes.length) % themes.length);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0) {
          handleThemeSelect(themes[focusedIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;

      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;

      case 'End':
        event.preventDefault();
        setFocusedIndex(themes.length - 1);
        break;
    }
  };

  const handleThemeSelect = (theme: ThemeDefinition) => {
    setTheme(theme);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  if (variant === 'buttons') {
    return (
      <div
        className={`theme-switcher-buttons ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme)}
            className={`theme-button ${theme.id === currentTheme.id ? 'active' : ''}`}
            aria-label={`Switch to ${theme.name} theme`}
            aria-pressed={theme.id === currentTheme.id}
            title={theme.description}
          >
            <span className="theme-button-name">{theme.name}</span>
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div
      ref={dropdownRef}
      className={`theme-switcher ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="theme-switcher-trigger"
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="theme-switcher-current">{currentTheme.name}</span>
        <svg
          className={`theme-switcher-icon ${isOpen ? 'open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          className="theme-switcher-dropdown glass-panel"
          role="listbox"
          aria-label="Available themes"
        >
          {themes.map((theme, index) => (
            <li
              key={theme.id}
              role="option"
              aria-selected={theme.id === currentTheme.id}
              className={`theme-option ${theme.id === currentTheme.id ? 'active' : ''} ${
                index === focusedIndex ? 'focused' : ''
              }`}
              onClick={() => handleThemeSelect(theme)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              <div className="theme-option-content">
                <span className="theme-option-name">{theme.name}</span>
                <span className="theme-option-description">{theme.description}</span>
              </div>
              {theme.id === currentTheme.id && (
                <svg
                  className="theme-option-check"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13 4L6 11L3 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

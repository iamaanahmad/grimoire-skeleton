/**
 * ThemeSwitcher Usage Examples
 *
 * This file demonstrates how to use the ThemeSwitcher component
 * in different scenarios and configurations.
 */

import { ThemeProvider } from './ThemeProvider';
import { ThemeSwitcher } from './ThemeSwitcher';

/**
 * Example 1: Basic dropdown theme switcher
 * This is the default variant, showing a dropdown menu with theme options.
 */
export function BasicThemeSwitcherExample() {
  return (
    <ThemeProvider>
      <div className="app">
        <header>
          <h1>My Spooky App</h1>
          <ThemeSwitcher />
        </header>
        <main>
          <p>Your content here...</p>
        </main>
      </div>
    </ThemeProvider>
  );
}

/**
 * Example 2: Button group variant
 * Shows all themes as individual buttons in a horizontal group.
 */
export function ButtonGroupThemeSwitcherExample() {
  return (
    <ThemeProvider>
      <div className="app">
        <header>
          <h1>My Spooky App</h1>
          <ThemeSwitcher variant="buttons" />
        </header>
        <main>
          <p>Your content here...</p>
        </main>
      </div>
    </ThemeProvider>
  );
}

/**
 * Example 3: Custom styled theme switcher
 * Apply custom CSS classes for additional styling.
 */
export function CustomStyledThemeSwitcherExample() {
  return (
    <ThemeProvider>
      <div className="app">
        <header>
          <h1>My Spooky App</h1>
          <ThemeSwitcher className="my-custom-theme-switcher" />
        </header>
        <main>
          <p>Your content here...</p>
        </main>
      </div>
    </ThemeProvider>
  );
}

/**
 * Example 4: Theme switcher in navigation
 * Common pattern: placing the theme switcher in the main navigation bar.
 */
export function NavigationThemeSwitcherExample() {
  return (
    <ThemeProvider>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>Grimoire</h1>
          </div>
          <div className="navbar-menu">
            <a href="/home">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="navbar-actions">
            <ThemeSwitcher />
          </div>
        </nav>
        <main>
          <p>Your content here...</p>
        </main>
      </div>
    </ThemeProvider>
  );
}

/**
 * Example 5: Mobile-friendly theme switcher
 * Using button variant for better mobile experience.
 */
export function MobileThemeSwitcherExample() {
  return (
    <ThemeProvider>
      <div className="app">
        <header className="mobile-header">
          <h1>My App</h1>
          <button className="menu-toggle">☰</button>
        </header>
        <aside className="mobile-menu">
          <nav>
            <a href="/home">Home</a>
            <a href="/settings">Settings</a>
          </nav>
          <div className="theme-section">
            <h3>Choose Theme</h3>
            <ThemeSwitcher variant="buttons" />
          </div>
        </aside>
        <main>
          <p>Your content here...</p>
        </main>
      </div>
    </ThemeProvider>
  );
}

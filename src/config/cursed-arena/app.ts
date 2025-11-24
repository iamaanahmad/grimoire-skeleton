/**
 * Cursed Arena Application Configuration
 * 
 * Defines app-level settings including name, theme, and navigation structure.
 */

export const appConfig = {
  name: 'Cursed Arena',
  defaultTheme: 'nightmare_neon' as const,
  description: 'Esports tournament management platform with cyberpunk aesthetics',
  
  navigation: [
    {
      label: 'Dashboard',
      path: '/',
      icon: '🏠',
    },
    {
      label: 'Tournaments',
      path: '/tournaments',
      icon: '🏆',
    },
    {
      label: 'Teams',
      path: '/teams',
      icon: '⚔️',
    },
    {
      label: 'Players',
      path: '/players',
      icon: '🎮',
    },
    {
      label: 'Matches',
      path: '/matches',
      icon: '⚡',
    },
  ],
};

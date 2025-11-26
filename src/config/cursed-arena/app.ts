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
      path: '/apps/cursed-arena',
      icon: '🏠',
    },
    {
      label: 'Tournaments',
      path: '/apps/cursed-arena/tournaments',
      icon: '🏆',
    },
    {
      label: 'Teams',
      path: '/apps/cursed-arena/teams',
      icon: '⚔️',
    },
    {
      label: 'Players',
      path: '/apps/cursed-arena/players',
      icon: '🎮',
    },
    {
      label: 'Matches',
      path: '/apps/cursed-arena/matches',
      icon: '⚡',
    },
  ],
};

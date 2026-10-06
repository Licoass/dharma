export const TOKENS = {
  colors: {
    // Fondos cálidos y orgánicos
    bg: '#FAF8F5',
    bgWarm: '#F5F2EB',
    bgAlt: '#F0ECE1',
    surface: '#FFFFFF',
    surfaceMuted: '#F8F6F0',
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',

    // Tipografía suave (sin negros agresivos)
    text: {
      primary: '#24292F',
      secondary: '#697282',
      muted: '#9DA6B5',
      light: '#C4CBD6',
    },

    // Acentos pastel calmantes
    pastels: {
      teal: {
        bg: '#E8F6F4',
        border: 'rgba(46, 181, 163, 0.18)',
        text: '#177468',
        accent: '#2EB5A3',
        glow: 'rgba(46, 181, 163, 0.25)',
      },
      lavender: {
        bg: '#F2EDFA',
        border: 'rgba(155, 116, 222, 0.18)',
        text: '#6A449F',
        accent: '#9B74DE',
        glow: 'rgba(155, 116, 222, 0.22)',
      },
      sage: {
        bg: '#EEF6F0',
        border: 'rgba(92, 161, 107, 0.18)',
        text: '#376841',
        accent: '#5CA16B',
        glow: 'rgba(92, 161, 107, 0.22)',
      },
      honey: {
        bg: '#FEF6E9',
        border: 'rgba(232, 167, 67, 0.20)',
        text: '#8E5B18',
        accent: '#E8A743',
        glow: 'rgba(232, 167, 67, 0.22)',
      },
      coral: {
        bg: '#FEEFEF',
        border: 'rgba(235, 107, 107, 0.18)',
        text: '#A63838',
        accent: '#EB6B6B',
        glow: 'rgba(235, 107, 107, 0.22)',
      },
      sky: {
        bg: '#EDF5FC',
        border: 'rgba(79, 165, 227, 0.18)',
        text: '#246A9E',
        accent: '#4FA5E3',
        glow: 'rgba(79, 165, 227, 0.22)',
      },
    },
  },

  radius: {
    sm: '12px',
    md: '18px',
    card: '26px',
    modal: '30px',
    full: '9999px',
  },

  shadows: {
    soft: '0 4px 20px -2px rgba(36, 41, 47, 0.03), 0 2px 6px -1px rgba(36, 41, 47, 0.02)',
    floating: '0 14px 34px -4px rgba(36, 41, 47, 0.06), 0 4px 12px -2px rgba(36, 41, 47, 0.02)',
    elevated: '0 20px 48px -6px rgba(36, 41, 47, 0.08), 0 6px 16px -2px rgba(36, 41, 47, 0.03)',
  },

  typography: {
    fontSans: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    trackingTitle: '0.06em',
    trackingSubtitle: '0.03em',
    trackingBody: '-0.01em',
  },
} as const;

export type PastelVariant = keyof typeof TOKENS.colors.pastels;

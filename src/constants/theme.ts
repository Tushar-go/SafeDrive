export const COLORS = {
  bg:         '#0A0A0A',
  bgCard:     '#1A1A1A',
  bgCardAlt:  '#141414',
  border:     '#2A2A2A',

  textPrimary:   '#FFFFFF',
  textSecondary: '#8A8A8A',
  textMuted:     '#444444',

  green:    '#00C853',
  greenDim: '#0A2A0A',

  scoreRed:    '#FF3B30',
  scoreOrange: '#FF9500',
  scoreYellow: '#FFCC00',
  scoreGreen:  '#34C759',

  // per-event colours
  eventHarshBraking:      '#FF3B30',
  eventSharpTurn:         '#FF9500',
  eventHarshAccel:        '#FF6B00',
  eventPhoneHandling:     '#00BCD4',
  eventAggressiveSteering:'#9C27B0',
  eventExcessiveMovement: '#607D8B',

  red:        '#FF3B30',
  orange:     '#FF9500',
  activeRed:  '#FF453A',

  tabActive:   '#00C853',
  tabInactive: '#555555',
} as const;

export const FONTS = {
  scoreXL: 72,
  scoreLG: 48,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 15,
  small: 13,
  tiny: 11,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

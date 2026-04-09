export const COLORS = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#AEAEB2',
  accent: '#007AFF',
  accentLight: 'rgba(0, 122, 255, 0.08)',
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  success: '#34C759',
  warning: '#FF9F0A',
  danger: '#FF3B30',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.35)',
  shadowColor: '#000',
  cardShadow: 'rgba(0, 0, 0, 0.04)',
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  padding: 24,

  // Radius
  radiusSm: 6,
  radius: 12,
  radiusLg: 16,
  radiusXl: 20,
  radiusFull: 999,

  // Typography
  fontHero: 42,
  fontLarge: 32,
  fontTitle: 28,
  fontMedium: 20,
  fontRegular: 16,
  fontSmall: 14,
  fontCaption: 12,
  fontMicro: 11,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  large: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  sheet: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const ANIMATION = {
  fast: 200,
  normal: 350,
  slow: 600,
  spring: { damping: 20, stiffness: 180 },
};

// ─────────────────────────────────────────────
//  AccessiWay — Theme
//  Modifiez ce fichier pour changer les couleurs
//  et la typographie de toute l'application.
// ─────────────────────────────────────────────

export const Colors = {
  // Primaire
  primary: '#1B6CA8',       // Bleu accessibilité
  primaryLight: '#E8F2FB',
  primaryDark: '#0D4A7A',

  // Accent
  accent: '#2EC4B6',        // Turquoise
  accentLight: '#E6F9F7',

  // SOS / Danger
  sos: '#E63946',
  sosLight: '#FDECEA',
  sosDark: '#B71C1C',

  // Neutres
  white: '#FFFFFF',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#DDE3EC',

  // Texte
  textPrimary: '#0F1C2E',
  textSecondary: '#5A6A80',
  textDisabled: '#A0AEC0',

  // Navbar
  navActive: '#1B6CA8',
  navInactive: '#8FA3BC',
  navBackground: '#FFFFFF',
};

export const Typography = {
  // Tailles
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,

  // Poids
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',

  // Familles (modifier selon votre projet)
  // Note: installer les fonts dans /assets/fonts si nécessaire
  fontPrimary: 'System',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#0F1C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F1C2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F1C2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
};

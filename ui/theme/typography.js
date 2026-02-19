/**
 * JARVIS — Typography System
 * SF Pro / Inter style — Modern 2026
 */
import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios:     { sans: 'SF Pro Display', mono: 'SF Mono' },
  android: { sans: 'Inter',          mono: 'SpaceMono' },
  default: { sans: 'Inter',          mono: 'monospace' },
});

export const Typography = {
  // ─── Font Families ─────────────────────────────────────────────────────────
  fontFamily,

  // ─── Scale ────────────────────────────────────────────────────────────────
  scale: {
    xs:   11,
    sm:   13,
    base: 15,
    md:   17,
    lg:   20,
    xl:   24,
    '2xl': 30,
    '3xl': 38,
    '4xl': 48,
  },

  // ─── Weights ──────────────────────────────────────────────────────────────
  weight: {
    thin:       '100',
    light:      '300',
    regular:    '400',
    medium:     '500',
    semibold:   '600',
    bold:       '700',
    extrabold:  '800',
    black:      '900',
  },

  // ─── Line Heights ─────────────────────────────────────────────────────────
  lineHeight: {
    tight:   1.1,
    snug:    1.25,
    normal:  1.5,
    relaxed: 1.75,
  },

  // ─── Letter Spacing ───────────────────────────────────────────────────────
  letterSpacing: {
    tighter: -0.8,
    tight:   -0.4,
    normal:   0,
    wide:     0.8,
    wider:    1.6,
    widest:   3.2,
  },

  // ─── Presets ──────────────────────────────────────────────────────────────
  presets: {
    appTitle: {
      fontSize:      38,
      fontWeight:    '700',
      letterSpacing: -1.2,
      lineHeight:    44,
    },
    tagline: {
      fontSize:      13,
      fontWeight:    '500',
      letterSpacing:  3.0,
      textTransform: 'uppercase',
    },
    transcript: {
      fontSize:      18,
      fontWeight:    '300',
      letterSpacing: -0.2,
      lineHeight:    28,
    },
    response: {
      fontSize:      16,
      fontWeight:    '400',
      letterSpacing: -0.1,
      lineHeight:    26,
    },
    label: {
      fontSize:      11,
      fontWeight:    '600',
      letterSpacing:  1.5,
      textTransform: 'uppercase',
    },
    statusText: {
      fontSize:      12,
      fontWeight:    '500',
      letterSpacing:  0.5,
    },
  },
};

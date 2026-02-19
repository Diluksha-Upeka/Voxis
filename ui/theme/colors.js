/**
 * JARVIS — Color System
 * Ultra-modern 2026 dark palette
 * Glassmorphism + Electric gradients
 */

export const Colors = {
  // ─── Backgrounds ──────────────────────────────────────────────────────────
  bg: {
    primary:    '#05060F',   // Deep void black
    secondary:  '#0A0C1A',   // Deep navy
    elevated:   '#0F1128',   // Elevated surfaces
    glass:      'rgba(255, 255, 255, 0.04)',   // Glassmorphism base
    glassBorder:'rgba(255, 255, 255, 0.08)',   // Glass border
    overlay:    'rgba(5, 6, 15, 0.85)',        // Modal overlay
  },

  // ─── Accent — Electric Blue / Violet ──────────────────────────────────────
  accent: {
    blue:       '#3B7BFF',   // Electric blue
    blueBright: '#5A97FF',   // Bright blue (hover)
    violet:     '#7B3BFF',   // Deep violet
    violetSoft: '#9D6EFF',   // Soft violet
    cyan:       '#00E5FF',   // Neon cyan (glow)
    cyanDim:    '#00B8D9',   // Dimmed cyan
  },

  // ─── State Gradients ──────────────────────────────────────────────────────
  gradients: {
    idle:      ['#1A1F3D', '#0A0C1A'],                    // Dormant
    listening: ['#001AFF', '#00E5FF', '#3B7BFF'],         // Active listening
    thinking:  ['#7B3BFF', '#3B7BFF', '#00E5FF'],         // Processing
    speaking:  ['#3B7BFF', '#7B3BFF', '#FF3BFF'],         // Responding
    button:    ['#3B7BFF', '#7B3BFF'],                    // Primary CTA
    buttonPressed: ['#2955CC', '#5A2ACC'],                // Pressed CTA
    orb:       ['rgba(59,123,255,0.35)', 'rgba(123,59,255,0.25)', 'rgba(0,229,255,0.15)'],
    orbGlow:   ['rgba(59,123,255,0.6)', 'rgba(0,229,255,0.3)', 'transparent'],
    card:      ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'],
  },

  // ─── Text ─────────────────────────────────────────────────────────────────
  text: {
    primary:    '#F0F4FF',   // Near white
    secondary:  '#8899CC',   // Muted blue-grey
    tertiary:   '#4A5580',   // Subtle label
    accent:     '#5A97FF',   // Highlighted text
    inverse:    '#05060F',   // On bright bg
  },

  // ─── UI Elements ──────────────────────────────────────────────────────────
  ui: {
    divider:    'rgba(255,255,255,0.06)',
    shadow:     'rgba(0, 0, 0, 0.8)',
    shadowBlue: 'rgba(59, 123, 255, 0.35)',
    shadowViolet:'rgba(123, 59, 255, 0.30)',
    shadowCyan: 'rgba(0, 229, 255, 0.25)',
    success:    '#00E5A0',
    warning:    '#FFB340',
    error:      '#FF3B5C',
  },

  // ─── Particles ────────────────────────────────────────────────────────────
  particles: {
    idle:      ['rgba(59,123,255,0.4)', 'rgba(123,59,255,0.3)'],
    listening: ['rgba(0,229,255,0.6)',  'rgba(59,123,255,0.5)'],
    thinking:  ['rgba(123,59,255,0.5)', 'rgba(59,123,255,0.4)'],
    speaking:  ['rgba(255,59,255,0.4)', 'rgba(123,59,255,0.5)'],
  },
};

// ─── State-mapped accent colors ─────────────────────────────────────────────
export const StateColors = {
  idle:      { primary: Colors.accent.blue,   glow: Colors.ui.shadowBlue },
  listening: { primary: Colors.accent.cyan,   glow: Colors.ui.shadowCyan },
  thinking:  { primary: Colors.accent.violet, glow: Colors.ui.shadowViolet },
  speaking:  { primary: '#FF3BFF',            glow: 'rgba(255,59,255,0.35)' },
};

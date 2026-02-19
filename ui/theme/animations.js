/**
 * JARVIS — Animation Configuration
 * Reanimated 3 + react-native-reanimated presets
 */
import { Easing } from 'react-native';

export const AnimConfig = {
  // ─── Spring Presets ────────────────────────────────────────────────────────
  spring: {
    snappy: { damping: 18, mass: 0.8, stiffness: 220 },
    gentle: { damping: 22, mass: 1.0, stiffness: 160 },
    bouncy: { damping: 12, mass: 0.9, stiffness: 280 },
    slow:   { damping: 28, mass: 1.2, stiffness: 120 },
  },

  // ─── Timing Presets ───────────────────────────────────────────────────────
  timing: {
    instant:  80,
    fast:     160,
    normal:   280,
    slow:     450,
    verySlow: 700,
  },

  // ─── Easing Curves ────────────────────────────────────────────────────────
  easing: {
    smooth:   Easing.bezier(0.25, 0.46, 0.45, 0.94),
    ease:     Easing.bezier(0.0,  0.0,  0.2,  1.0),
    snappy:   Easing.bezier(0.34, 1.56, 0.64, 1.0),
    linear:   Easing.linear,
  },

  // ─── Durations per state transition ───────────────────────────────────────
  stateTransition: {
    idleToListening:  350,
    listeningToThinking: 400,
    thinkingToSpeaking:  350,
    speakingToIdle:      500,
  },

  // ─── Orb Animation ────────────────────────────────────────────────────────
  orb: {
    idlePulseDuration:    3000,
    idlePulseMin:         0.92,
    idlePulseMax:         1.04,
    listenPulseDuration:  600,
    listenPulseMin:       0.96,
    listenPulseMax:       1.10,
    thinkRotateDuration:  1800,
    speakPulseDuration:   400,
    glowBlurIdleMin:      18,
    glowBlurIdleMax:      32,
  },

  // ─── Waveform ─────────────────────────────────────────────────────────────
  waveform: {
    barCount:           32,
    updateIntervalMs:   80,
    barMinHeight:       3,
    barMaxHeight:       44,
    barWidth:           3,
    barGap:             2.5,
    idleAmplitude:      0.08,
    listenAmplitude:    1.0,
    speakAmplitude:     0.6,
  },

  // ─── Particles ────────────────────────────────────────────────────────────
  particles: {
    count:              24,
    orbitRadiusMin:     110,
    orbitRadiusMax:     160,
    sizeMin:            2,
    sizeMax:            5,
    durationMin:        3000,
    durationMax:        7000,
    opacityMin:         0.2,
    opacityMax:         0.8,
  },
};

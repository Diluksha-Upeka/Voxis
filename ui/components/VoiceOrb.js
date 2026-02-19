/**
 * VoiceOrb — Animated central orb
 * States: idle | listening | thinking | speaking
 *
 * Layers (inside-out):
 *  1. Solid core sphere (LinearGradient)
 *  2. Inner glass ring
 *  3. Rotating gradient arc  (thinking only)
 *  4. Soft glow halo         (BlurView or shadow)
 *  5. Outer pulse ring       (scale + opacity loop)
 */

import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView }       from 'expo-blur';
import { Colors, StateColors, Spacing } from '../theme';

// ─── Sub-component: Rotating arc ring (thinking state) ────────────────────────
const RotatingRing = ({ size, active, color }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) { rotation.setValue(0); return; }
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    return () => rotation.stopAnimation();
  }, [active]);

  const rotate = rotation.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!active) return null;
  return (
    <Animated.View
      style={[
        styles.rotatingRing,
        {
          width:        size,
          height:       size,
          borderRadius: size / 2,
          borderColor:  color,
          transform:    [{ rotate }],
        },
      ]}
    />
  );
};

// ─── Sub-component: Pulse ring ─────────────────────────────────────────────────
const PulseRing = ({ size, color, delay = 0, active }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) { anim.setValue(0); return; }
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
    return () => anim.stopAnimation();
  }, [active]);

  const scale   = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.45] });
  const opacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.5, 0.15, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.pulseRing,
        {
          width:        size,
          height:       size,
          borderRadius: size / 2,
          borderColor:  color,
          transform:    [{ scale }],
          opacity,
          marginLeft:   -(size / 2),
          marginTop:    -(size / 2),
          left:         '50%',
          top:          '50%',
        },
      ]}
    />
  );
};

// ─── Main VoiceOrb ─────────────────────────────────────────────────────────────
const VoiceOrb = ({ state = 'idle', size = Spacing.orbSize }) => {
  const { primary, glow } = StateColors[state];
  const coreSize   = size * 0.65;
  const glowSize   = size * 1.25;

  // ── Core idle breath ─────────────────────────────────────────────────────
  const breathAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const isBreathing = state === 'idle' || state === 'speaking';
    const speed = state === 'speaking' ? 400 : 3000;
    if (!isBreathing) { breathAnim.setValue(1); return; }
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: state === 'speaking' ? 1.08 : 1.04,
          duration: speed,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: state === 'speaking' ? 0.94 : 0.96,
          duration: speed,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
    return () => breathAnim.stopAnimation();
  }, [state]);

  // ── State transition scale ────────────────────────────────────────────────
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: state === 'listening' ? 1.06 : 1,
      damping: 18,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [state]);

  // ── Glow opacity per state ────────────────────────────────────────────────
  const glowOpacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const targets = { idle: 0.55, listening: 0.90, thinking: 0.75, speaking: 0.80 };
    Animated.timing(glowOpacity, {
      toValue: targets[state],
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [state]);

  // ── Gradient colors per state ──────────────────────────────────────────────
  const gradientColors = useMemo(() => {
    const map = {
      idle:      ['#1A2860', '#0D1540', '#070B25'],
      listening: ['#003BBF', '#0099CC', '#001A80'],
      thinking:  ['#4A0FA8', '#1A3BCC', '#0A0C2A'],
      speaking:  ['#601AB0', '#3B0FA8', '#1A0540'],
    };
    return map[state];
  }, [state]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>

      {/* ── Glow Halo ─────────────────────────────────────────────────────── */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowHalo,
          {
            width:        glowSize,
            height:       glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: glow,
            opacity: glowOpacity,
          },
        ]}
      />

      {/* ── Outer ring (glass) ───────────────────────────────────────────── */}
      <View
        style={[
          styles.outerRing,
          {
            width:        size,
            height:       size,
            borderRadius: size / 2,
            borderColor:  primary + '33',
          },
        ]}
      />

      {/* ── Rotating arc (thinking) ──────────────────────────────────────── */}
      <RotatingRing
        size={size * 0.88}
        active={state === 'thinking'}
        color={Colors.accent.violet}
      />

      {/* ── Pulse rings ──────────────────────────────────────────────────── */}
      <PulseRing size={size * 0.90} color={primary} delay={0}    active={state === 'listening'} />
      <PulseRing size={size * 0.90} color={primary} delay={500}  active={state === 'listening'} />
      <PulseRing size={size * 0.90} color={primary} delay={900}  active={state === 'listening'} />

      {/* ── Core Orb ─────────────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.coreWrapper,
          { transform: [{ scale: Animated.multiply(breathAnim, scaleAnim) }] },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.2, y: 0.0 }}
          end={{ x: 0.8, y: 1.0 }}
          style={[
            styles.core,
            {
              width:        coreSize,
              height:       coreSize,
              borderRadius: coreSize / 2,
              shadowColor:  glow,
            },
          ]}
        >
          {/* Inner glass sheen */}
          <View style={styles.innerSheen} />
        </LinearGradient>
      </Animated.View>

    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  glowHalo: {
    position:  'absolute',
    // Soft radial glow via shadow + heavy blur radius
    shadowColor:   '#3B7BFF',
    shadowRadius:  60,
    shadowOpacity: 1,
    shadowOffset:  { width: 0, height: 0 },
    // Android elevation alternative
    elevation: 0,
  },
  outerRing: {
    position:        'absolute',
    borderWidth:     1,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  rotatingRing: {
    position:    'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderTopColor:   'transparent',
    borderLeftColor:  'transparent',
  },
  pulseRing: {
    position:    'absolute',
    borderWidth: 1.5,
  },
  coreWrapper: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  core: {
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
    // iOS shadow
    shadowRadius:   30,
    shadowOpacity:  0.9,
    shadowOffset:   { width: 0, height: 4 },
    elevation:      20,
  },
  innerSheen: {
    position:        'absolute',
    top:              8,
    left:             16,
    width:            '45%',
    height:           '30%',
    borderRadius:     999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    transform:       [{ rotate: '-20deg' }],
  },
});

export default VoiceOrb;

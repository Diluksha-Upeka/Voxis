/**
 * ParticleField — Floating particles orbiting the voice orb
 * Uses RN Animated for orbit + fade loops.
 * Each particle follows an elliptical orbit at a randomized radius,
 * speed, angle offset, and size.
 */

import React, { useEffect, useRef, useMemo, memo } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { Colors, AnimConfig } from '../theme';

const { particles: PC } = AnimConfig;

// ─── Single floating particle ─────────────────────────────────────────────────
const Particle = memo(({ config, orbSize, state }) => {
  const angleAnim   = useRef(new Animated.Value(config.startAngle)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0.4)).current;

  const stateColors = {
    idle:      Colors.particles.idle,
    listening: Colors.particles.listening,
    thinking:  Colors.particles.thinking,
    speaking:  Colors.particles.speaking,
  };

  useEffect(() => {
    // Orbit loop
    Animated.loop(
      Animated.timing(angleAnim, {
        toValue:        config.startAngle + 360,
        duration:       config.duration,
        easing:         Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Opacity breath loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue:  config.opacity,
          duration: config.duration * 0.35,
          easing:   Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue:  config.opacity * 0.3,
          duration: config.duration * 0.65,
          easing:   Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Fade in/out particles based on state activity
  useEffect(() => {
    const targetScale = state === 'idle' ? 0.6 : 1.0;
    Animated.spring(scaleAnim, {
      toValue: targetScale,
      damping: 14,
      stiffness: 140,
      useNativeDriver: true,
    }).start();
  }, [state]);

  const color = stateColors[state][config.colorIndex % stateColors[state].length];

  // Compute x/y from angle using JS-driven interpolation
  // Note: for true orbit we use a transform-based offset approach
  const centerOffset = orbSize / 2;
  const radius       = config.radius;

  const translateX = angleAnim.interpolate({
    inputRange:  [config.startAngle, config.startAngle + 360],
    outputRange: [
      Math.cos((config.startAngle * Math.PI) / 180) * radius,
      Math.cos(((config.startAngle + 360) * Math.PI) / 180) * radius,
    ],
  });

  const translateY = angleAnim.interpolate({
    inputRange:  [config.startAngle, config.startAngle + 360],
    outputRange: [
      Math.sin((config.startAngle * Math.PI) / 180) * radius * 0.5,
      Math.sin(((config.startAngle + 360) * Math.PI) / 180) * radius * 0.5,
    ],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          width:           config.size,
          height:          config.size,
          borderRadius:    config.size / 2,
          backgroundColor: color,
          opacity:         opacityAnim,
          transform:       [{ translateX }, { translateY }, { scale: scaleAnim }],
          position:        'absolute',
          left:             centerOffset - config.size / 2,
          top:              centerOffset - config.size / 2,
        },
      ]}
    />
  );
});

// ─── ParticleField ─────────────────────────────────────────────────────────────
const ParticleField = ({ orbSize = 200, state = 'idle' }) => {
  const configs = useMemo(() => {
    return Array.from({ length: PC.count }, (_, i) => ({
      id:         i,
      radius:     PC.orbitRadiusMin + Math.random() * (PC.orbitRadiusMax - PC.orbitRadiusMin),
      size:       PC.sizeMin + Math.random() * (PC.sizeMax - PC.sizeMin),
      startAngle: (360 / PC.count) * i + Math.random() * 15 - 7.5,
      duration:   PC.durationMin + Math.random() * (PC.durationMax - PC.durationMin),
      opacity:    PC.opacityMin + Math.random() * (PC.opacityMax - PC.opacityMin),
      colorIndex: i % 2,
    }));
  }, []);

  const containerSize = orbSize + (PC.orbitRadiusMax - orbSize / 2) * 2;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        { width: containerSize, height: containerSize },
      ]}
    >
      {configs.map(cfg => (
        <Particle key={cfg.id} config={cfg} orbSize={containerSize} state={state} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position:       'absolute',
    alignItems:     'center',
    justifyContent: 'center',
  },
  particle: {
    shadowRadius:   4,
    shadowOpacity:  0.9,
    shadowOffset:   { width: 0, height: 0 },
    shadowColor:    '#3B7BFF',
    elevation:      2,
  },
});

export default ParticleField;

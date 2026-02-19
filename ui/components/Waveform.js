/**
 * Waveform — Real-time audio waveform visualization
 * Uses RN Animated bars that respond to audio amplitude simulation.
 * In production: feed real Float32Array audio data via the `audioData` prop.
 */

import React, { useEffect, useRef, memo, useMemo } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { Colors, AnimConfig, StateColors } from '../theme';

const { waveform: WC } = AnimConfig;

// ─── Single bar ────────────────────────────────────────────────────────────────
const WaveBar = memo(({ index, state, audioSample }) => {
  const heightAnim = useRef(new Animated.Value(WC.barMinHeight)).current;

  const { primary } = StateColors[state];

  // Determine target height
  useEffect(() => {
    let targetHeight;

    if (state === 'listening') {
      // Simulate live audio by animating each bar to a slightly different height
      // In production: use audioSample directly
      const loop = () => {
        const nextH = WC.barMinHeight + Math.random() * WC.barMaxHeight;
        Animated.timing(heightAnim, {
          toValue:  nextH,
          duration: WC.updateIntervalMs + Math.random() * 60,
          easing:   Easing.inOut(Easing.quad),
          useNativeDriver: false, // height cannot use native driver
        }).start(({ finished }) => { if (finished) loop(); });
      };
      // Stagger start
      const timeout = setTimeout(loop, index * 25);
      return () => clearTimeout(timeout);
    }

    if (state === 'speaking') {
      // Softer wave for TTS output
      const loop = () => {
        const wave = Math.sin((Date.now() / 200) + (index * 0.3));
        const h = WC.barMinHeight + (wave * 0.5 + 0.5) * WC.barMaxHeight * 0.55;
        Animated.timing(heightAnim, {
          toValue:  h,
          duration: 120,
          easing:   Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }).start(({ finished }) => { if (finished) loop(); });
      };
      const timeout = setTimeout(loop, index * 20);
      return () => clearTimeout(timeout);
    }

    // Idle / thinking — flat minimal bars
    targetHeight = WC.barMinHeight + (
      state === 'thinking'
        ? (Math.abs(Math.sin(index * 0.4)) * 6)
        : 0
    );
    Animated.timing(heightAnim, {
      toValue:  targetHeight,
      duration: 400,
      easing:   Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [state]);

  // Bar opacity based on position (center bars brighter)
  const centerDist = Math.abs(index - WC.barCount / 2) / (WC.barCount / 2);
  const baseOpacity = 0.35 + (1 - centerDist) * 0.65;

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          width:           WC.barWidth,
          marginHorizontal: WC.barGap / 2,
          height:          heightAnim,
          backgroundColor: primary,
          opacity:         baseOpacity,
          borderRadius:    WC.barWidth / 2,
        },
      ]}
    />
  );
});

// ─── Waveform ──────────────────────────────────────────────────────────────────
const Waveform = ({ state = 'idle', audioData = null }) => {
  const bars = useMemo(() => Array.from({ length: WC.barCount }, (_, i) => i), []);

  return (
    <View style={styles.container}>
      {bars.map(i => (
        <WaveBar
          key={i}
          index={i}
          state={state}
          audioSample={audioData ? audioData[i] : null}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    height:          60,
    paddingHorizontal: 4,
  },
  bar: {
    alignSelf: 'center',
  },
});

export default Waveform;

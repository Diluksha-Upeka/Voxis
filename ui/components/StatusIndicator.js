/**
 * StatusIndicator — Top bar pill showing current AI state
 * Adapts color, label, and dot animation per state.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Typography, StateColors } from '../theme';

const STATE_LABELS = {
  idle:      'Online',
  listening: 'Listening',
  thinking:  'Processing',
  speaking:  'Responding',
};

const StatusIndicator = ({ state = 'idle' }) => {
  const dotAnim    = useRef(new Animated.Value(1)).current;
  const colorAnim  = useRef(new Animated.Value(0)).current;

  // Dot pulse for active states
  useEffect(() => {
    dotAnim.stopAnimation();
    if (state === 'idle') {
      dotAnim.setValue(1);
      return;
    }
    const duration = state === 'thinking' ? 700 : 900;
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 0.3, duration, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 1.0, duration, useNativeDriver: true }),
      ])
    ).start();
    return () => dotAnim.stopAnimation();
  }, [state]);

  const { primary } = StateColors[state];
  const label = STATE_LABELS[state];

  return (
    <BlurView intensity={20} tint="dark" style={styles.blurPill}>
      <View style={[styles.pill, { borderColor: primary + '30' }]}>
        {/* Dot */}
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: primary,
              opacity:         dotAnim,
              shadowColor:     primary,
            },
          ]}
        />
        {/* Label */}
        <Text style={[styles.label, { color: primary }]}>{label}</Text>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  blurPill: {
    borderRadius: Spacing.radius.full,
    overflow:     'hidden',
  },
  pill: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical:  6,
    paddingHorizontal: 14,
    borderWidth:    1,
    borderRadius:   Spacing.radius.full,
    backgroundColor: Colors.bg.glass,
  },
  dot: {
    width:        7,
    height:       7,
    borderRadius: 3.5,
    marginRight:  7,
    shadowRadius: 4,
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    elevation:    4,
  },
  label: {
    ...Typography.presets.statusText,
  },
});

export default StatusIndicator;

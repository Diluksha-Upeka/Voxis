/**
 * BottomControls — Floating bottom dock
 *
 * Layout:
 *   [Settings]  [● MIC BUTTON ●]  [History]
 *                  [Clear]          (below mic)
 *
 * Mic button:
 *   - Idle:      Electric blue gradient, soft glow shadow
 *   - Recording: Pulsing red gradient, expanding ring
 *   - Disabled:  Muted gray
 *
 * Secondary buttons: glassmorphism pills with icon + optional label
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Animated,
  StyleSheet,
  Platform,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView }       from 'expo-blur';
import { Feather }        from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme';

// ─── Icon Button (glass pill) ──────────────────────────────────────────────────
const GlassIconButton = ({ icon, label, onPress, disabled = false }) => {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue:  0.90,
      damping:   14,
      stiffness: 260,
      useNativeDriver: true,
    }).start();
    Vibration.vibrate(8);
  };
  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue:  1,
      damping:   12,
      stiffness: 220,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
        <BlurView intensity={25} tint="dark" style={styles.glassBtn}>
          <View style={[styles.glassBtnInner, disabled && styles.glassBtnDisabled]}>
            <Feather
              name={icon}
              size={20}
              color={disabled ? Colors.text.tertiary : Colors.text.secondary}
            />
            {label ? (
              <Text style={[styles.glassBtnLabel, disabled && { color: Colors.text.tertiary }]}>
                {label}
              </Text>
            ) : null}
          </View>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Mic Button ────────────────────────────────────────────────────────────────
const MicButton = ({ isRecording, onPress, disabled }) => {
  const scaleAnim    = useRef(new Animated.Value(1)).current;
  const pulseAnim    = useRef(new Animated.Value(0)).current;
  const glowAnim     = useRef(new Animated.Value(0.6)).current;

  // Recording pulse
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1.0, duration: 700, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.5, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
      Animated.timing(pulseAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      Animated.timing(glowAnim, { toValue: 0.6, duration: 300, useNativeDriver: true }).start();
    }
  }, [isRecording]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue:  0.93,
      damping:   10,
      stiffness: 300,
      useNativeDriver: true,
    }).start();
    Vibration.vibrate(12);
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue:  1,
      damping:   12,
      stiffness: 250,
      useNativeDriver: true,
    }).start();
  };

  const pulseScale   = pulseAnim.interpolate({ inputRange: [0,1], outputRange: [1, 1.35] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0,1], outputRange: [0.5, 0] });

  const gradientColors = disabled
    ? ['#2A2A3A', '#1A1A2A']
    : isRecording
      ? ['#CC1A40', '#991040']
      : ['#3B7BFF', '#7B3BFF'];

  const glowColor = isRecording
    ? Colors.ui.error
    : Colors.accent.blue;

  return (
    <View style={styles.micWrapper}>
      {/* Pulse ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.micPulseRing,
          {
            transform: [{ scale: pulseScale }],
            opacity:   pulseOpacity,
            borderColor: glowColor,
          },
        ]}
      />

      {/* Button */}
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.95}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={[
              styles.micButton,
              {
                shadowColor:   glowColor,
                shadowOpacity: disabled ? 0 : 0.65,
              },
            ]}
          >
            <Feather
              name={isRecording ? 'mic-off' : 'mic'}
              size={30}
              color={disabled ? Colors.text.tertiary : '#FFFFFF'}
            />
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

// ─── BottomControls ─────────────────────────────────────────────────────────────
const BottomControls = ({
  isRecording  = false,
  onMicPress,
  onSettings,
  onHistory,
  onClear,
  disabled     = false,
}) => {
  const dockSlide = useRef(new Animated.Value(80)).current;
  const dockOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(dockSlide, {
        toValue:  0,
        damping:  22,
        stiffness: 180,
        useNativeDriver: true,
      }),
      Animated.timing(dockOpacity, {
        toValue:  1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity:   dockOpacity,
          transform: [{ translateY: dockSlide }],
        },
      ]}
    >
      {/* ── Dock glass surface ───────────────────────────────────────────── */}
      <BlurView intensity={30} tint="dark" style={styles.dock}>
        <View style={styles.dockBorder} />

        <View style={styles.dockRow}>
          {/* Settings */}
          <GlassIconButton
            icon="settings"
            onPress={onSettings}
          />

          {/* Mic — center hero ─────────────────────────────── */}
          <MicButton
            isRecording={isRecording}
            onPress={onMicPress}
            disabled={disabled}
          />

          {/* History */}
          <GlassIconButton
            icon="message-square"
            onPress={onHistory}
          />
        </View>

        {/* Clear button ────────────────────────────────────── */}
        <TouchableOpacity onPress={onClear} style={styles.clearBtn} activeOpacity={0.7}>
          <Text style={styles.clearText}>Clear conversation</Text>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingBottom:     Platform.OS === 'ios' ? 28 : 16,
  },
  dock: {
    borderRadius:    Spacing.radius['2xl'],
    overflow:        'hidden',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  dockBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius:  Spacing.radius['2xl'],
    borderWidth:   1,
    borderColor:   Colors.bg.glassBorder,
  },
  dockRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },

  // ── Glass icon button ──────────────────────────────────────────────────────
  glassBtn: {
    borderRadius: Spacing.radius.xl,
    overflow:     'hidden',
  },
  glassBtnInner: {
    width:          Spacing.iconButtonSize,
    height:         Spacing.iconButtonSize,
    alignItems:     'center',
    justifyContent: 'center',
    borderRadius:   Spacing.radius.xl,
    borderWidth:    1,
    borderColor:    Colors.bg.glassBorder,
    backgroundColor: Colors.bg.glass,
  },
  glassBtnDisabled: {
    opacity: 0.4,
  },
  glassBtnLabel: {
    ...Typography.presets.label,
    color:     Colors.text.secondary,
    marginTop:  4,
    fontSize:   9,
  },

  // ── Mic button ─────────────────────────────────────────────────────────────
  micWrapper: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  micPulseRing: {
    position:     'absolute',
    width:        Spacing.micButtonSize + 24,
    height:       Spacing.micButtonSize + 24,
    borderRadius: (Spacing.micButtonSize + 24) / 2,
    borderWidth:  1.5,
  },
  micButton: {
    width:          Spacing.micButtonSize,
    height:         Spacing.micButtonSize,
    borderRadius:   Spacing.micButtonSize / 2,
    alignItems:     'center',
    justifyContent: 'center',
    shadowRadius:   20,
    shadowOffset:   { width: 0, height: 4 },
    elevation:      16,
  },

  // ── Clear ───────────────────────────────────────────────────────────────────
  clearBtn: {
    alignItems:  'center',
    marginTop:   Spacing.sm,
    paddingTop:  Spacing.xs,
  },
  clearText: {
    ...Typography.presets.label,
    color:         Colors.text.tertiary,
    letterSpacing: 0.8,
  },
});

export default BottomControls;

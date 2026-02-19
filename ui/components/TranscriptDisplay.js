/**
 * TranscriptDisplay — Glass card showing user speech + AI response
 * Dims non-active blocks. Fades in new text word-by-word.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView }       from 'expo-blur';
import { Colors, Spacing, Typography } from '../theme';

// ─── Typing cursor ─────────────────────────────────────────────────────────────
const Cursor = ({ visible }) => {
  const blink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!visible) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
    return () => blink.stopAnimation();
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.Text style={[styles.cursor, { opacity: blink }]}>|</Animated.Text>
  );
};

// ─── Message row ────────────────────────────────────────────────────────────────
const MessageRow = ({ label, text, color, dim, isLatest }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue:  1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue:  0,
        damping:  20,
        stiffness: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [text]);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        {
          opacity:   dim ? 0.38 : fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
      <View style={styles.textRow}>
        <Text style={[styles.messageText, isLatest && styles.messageTextActive]}>
          {text}
        </Text>
        <Cursor visible={isLatest && !!text} />
      </View>
    </Animated.View>
  );
};

// ─── TranscriptDisplay ─────────────────────────────────────────────────────────
const TranscriptDisplay = ({
  userText    = '',
  aiText      = '',
  state       = 'idle',
  scrollRef,
}) => {
  const containerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(containerFade, {
      toValue:  (userText || aiText) ? 1 : 0.4,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [userText, aiText]);

  const hasContent = !!(userText || aiText);

  return (
    <Animated.View style={[styles.outerWrapper, { opacity: containerFade }]}>
      {/* Glass card */}
      <BlurView intensity={18} tint="dark" style={styles.blurCard}>
        <LinearGradient
          colors={Colors.gradients.card}
          style={styles.gradientOverlay}
        />

        {/* Border ring */}
        <View style={styles.border} />

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!hasContent ? (
            <Text style={styles.placeholder}>
              Speak to start…
            </Text>
          ) : (
            <>
              {userText ? (
                <MessageRow
                  label="YOU"
                  text={userText}
                  color={Colors.accent.cyan}
                  dim={state === 'speaking'}
                  isLatest={state === 'listening' || state === 'thinking'}
                />
              ) : null}

              {aiText ? (
                <MessageRow
                  label="JARVIS"
                  text={aiText}
                  color={Colors.accent.violetSoft}
                  dim={false}
                  isLatest={state === 'speaking'}
                />
              ) : null}
            </>
          )}
        </ScrollView>
      </BlurView>
    </Animated.View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  outerWrapper: {
    marginHorizontal: Spacing.screenPaddingH,
    borderRadius:     Spacing.radius['2xl'],
    overflow:         'hidden',
    minHeight:        130,
  },
  blurCard: {
    borderRadius: Spacing.radius['2xl'],
    overflow:     'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Spacing.radius['2xl'],
    borderWidth:  1,
    borderColor:  Colors.bg.glassBorder,
  },
  scroll: {
    maxHeight: 220,
  },
  scrollContent: {
    padding:         Spacing.cardPadding,
    paddingBottom:   Spacing.lg,
  },
  placeholder: {
    ...Typography.presets.transcript,
    color:   Colors.text.tertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  messageRow: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.presets.label,
    marginBottom: 4,
  },
  textRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    alignItems:    'flex-end',
  },
  messageText: {
    ...Typography.presets.transcript,
    color:     Colors.text.secondary,
    flexShrink: 1,
  },
  messageTextActive: {
    color: Colors.text.primary,
  },
  cursor: {
    ...Typography.presets.transcript,
    color:      Colors.accent.cyan,
    marginLeft: 1,
  },
});

export default TranscriptDisplay;

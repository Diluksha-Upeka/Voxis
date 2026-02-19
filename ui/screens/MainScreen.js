/**
 * MainScreen — Primary Jarvis voice assistant screen
 *
 * Layout (top → bottom):
 *  ┌─────────────────────────────────────────────┐
 *  │  SafeAreaView                               │
 *  │  ┌─────────────────────────────────────┐   │
 *  │  │  Header: title + StatusIndicator    │   │
 *  │  └─────────────────────────────────────┘   │
 *  │                                             │
 *  │  OrbSection (flex:1)                        │
 *  │    ParticleField (absolute)                 │
 *  │    VoiceOrb (center)                        │
 *  │    Waveform (below orb)                     │
 *  │                                             │
 *  │  TranscriptDisplay                          │
 *  │                                             │
 *  │  BottomControls                             │
 *  └─────────────────────────────────────────────┘
 *
 * State machine: idle → listening → thinking → speaking → idle
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient }   from 'expo-linear-gradient';
import { BlurView }         from 'expo-blur';

import {
  VoiceOrb,
  ParticleField,
  Waveform,
  TranscriptDisplay,
  StatusIndicator,
  BottomControls,
} from '../components';

import { Colors, Spacing, Typography } from '../theme';

// ─── Background gradient mesh ─────────────────────────────────────────────────
const BackgroundMesh = ({ state }) => {
  const colors = {
    idle:      [Colors.bg.primary, Colors.bg.secondary, '#050818'],
    listening: ['#020B20', '#041230', '#020818'],
    thinking:  ['#080415', '#0C0520', '#050310'],
    speaking:  ['#080415', '#0A0420', '#050215'],
  };

  return (
    <LinearGradient
      colors={colors[state] || colors.idle}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
};

// ─── Floating nebula blobs (decorative) ──────────────────────────────────────
const NebulaBlob = ({ x, y, color, size }) => (
  <View
    pointerEvents="none"
    style={[
      styles.nebulaBlob,
      {
        left:        x,
        top:         y,
        width:       size,
        height:      size,
        borderRadius: size / 2,
        backgroundColor: color,
      },
    ]}
  />
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MainScreen = ({ navigation }) => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [appState,    setAppState]   = useState('idle');        // idle|listening|thinking|speaking
  const [isRecording, setIsRecording] = useState(false);
  const [userText,    setUserText]   = useState('');
  const [aiText,      setAiText]     = useState('');
  const scrollRef = useRef(null);

  // Title entrance animation
  const titleY     = useRef(new Animated.Value(-30)).current;
  const titleAlpha = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(titleY, {
        toValue:  0,
        damping:  20,
        stiffness: 160,
        delay:     200,
        useNativeDriver: true,
      }),
      Animated.timing(titleAlpha, {
        toValue:  1,
        duration: 500,
        delay:     200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Mic press: toggles recording.
   * In production: integrate with expo-av Audio API here.
   */
  const handleMicPress = useCallback(async () => {
    if (appState === 'thinking' || appState === 'speaking') return;

    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setAppState('listening');
      setUserText('');
      setAiText('');

      // --- DEMO: Simulate listening then thinking then speaking ---
      // Replace these timeouts with real Whisper + Groq API calls
      // mirroring the logic in jarvis.py
      setTimeout(() => {
        setUserText('What is the latest breakthrough in quantum computing?');
      }, 800);

      setTimeout(() => {
        setIsRecording(false);
        setAppState('thinking');
      }, 3500);

      setTimeout(() => {
        setAiText('IBM recently achieved a 1,000-qubit milestone, reducing error rates by 40% through new dynamic decoupling techniques. It's a significant step toward fault-tolerant quantum systems.');
        setAppState('speaking');
      }, 5800);

      setTimeout(() => {
        setAppState('idle');
      }, 11000);

    } else {
      // Manual stop
      setIsRecording(false);
      setAppState('thinking');
    }
  }, [appState, isRecording]);

  const handleSettings = useCallback(() => {
    navigation?.navigate('Settings');
  }, [navigation]);

  const handleHistory = useCallback(() => {
    navigation?.navigate('History');
  }, [navigation]);

  const handleClear = useCallback(() => {
    Alert.alert(
      'Clear Conversation',
      'Remove all messages from this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setUserText('');
            setAiText('');
            setAppState('idle');
          },
        },
      ]
    );
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [userText, aiText]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Dynamic background ─────────────────────────────────────────── */}
      <BackgroundMesh state={appState} />

      {/* ── Nebula decorative blobs ────────────────────────────────────── */}
      <NebulaBlob x={-80}  y={60}   color="rgba(59,123,255,0.08)"  size={320} />
      <NebulaBlob x={160}  y={-40}  color="rgba(123,59,255,0.06)"  size={280} />
      <NebulaBlob x={-40}  y={500}  color="rgba(0,229,255,0.05)"   size={260} />
      <NebulaBlob x={200}  y={680}  color="rgba(123,59,255,0.06)"  size={240} />

      <SafeAreaView style={styles.safe}>

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.header,
            { opacity: titleAlpha, transform: [{ translateY: titleY }] },
          ]}
        >
          {/* Title block */}
          <View style={styles.titleBlock}>
            <Text style={styles.appTitle}>JARVIS</Text>
            <Text style={styles.appTagline}>Voice Intelligence</Text>
          </View>

          {/* Status pill */}
          <StatusIndicator state={appState} />
        </Animated.View>

        {/* ── ORB SECTION ─────────────────────────────────────────────── */}
        <View style={styles.orbSection}>
          {/* Particle field (behind orb) */}
          <ParticleField orbSize={Spacing.orbSize} state={appState} />

          {/* Central voice orb */}
          <VoiceOrb state={appState} size={Spacing.orbSize} />

          {/* Waveform below orb */}
          <View style={styles.waveformContainer}>
            <Waveform state={appState} />
          </View>

          {/* State hint label */}
          <StateHint state={appState} />
        </View>

        {/* ── TRANSCRIPT ──────────────────────────────────────────────── */}
        <TranscriptDisplay
          userText={userText}
          aiText={aiText}
          state={appState}
          scrollRef={scrollRef}
        />

        {/* ── SPACER ──────────────────────────────────────────────────── */}
        <View style={styles.spacer} />

        {/* ── BOTTOM CONTROLS ─────────────────────────────────────────── */}
        <BottomControls
          isRecording={isRecording}
          onMicPress={handleMicPress}
          onSettings={handleSettings}
          onHistory={handleHistory}
          onClear={handleClear}
          disabled={appState === 'thinking' || appState === 'speaking'}
        />

      </SafeAreaView>
    </View>
  );
};

// ─── State hint label ──────────────────────────────────────────────────────────
const StateHint = ({ state }) => {
  const HINTS = {
    idle:      'Tap the mic to speak',
    listening: 'Listening…',
    thinking:  'Thinking…',
    speaking:  'Speaking…',
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const prevState = useRef(state);

  useEffect(() => {
    if (prevState.current === state) return;
    prevState.current = state;

    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [state]);

  // Initial fade in
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.Text style={[styles.stateHint, { opacity: fadeAnim }]}>
      {HINTS[state]}
    </Animated.Text>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: Colors.bg.primary,
  },
  safe: {
    flex: 1,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: Spacing.screenPaddingH,
    paddingTop:        Spacing.base,
    paddingBottom:     Spacing.sm,
  },
  titleBlock: {
    gap: 2,
  },
  appTitle: {
    ...Typography.presets.appTitle,
    color:      Colors.text.primary,
    lineHeight: 42,
  },
  appTagline: {
    ...Typography.presets.tagline,
    color: Colors.text.tertiary,
  },

  // ── Orb Section ───────────────────────────────────────────────────────────
  orbSection: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:       Spacing.base,
  },
  waveformContainer: {
    marginTop: Spacing.xl,
    width:     '85%',
  },
  stateHint: {
    ...Typography.presets.statusText,
    color:     Colors.text.tertiary,
    marginTop: Spacing.base,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    fontSize:  11,
  },

  // ── Bottom spacer ─────────────────────────────────────────────────────────
  spacer: {
    height: Spacing.base,
  },

  // ── Nebula blob ───────────────────────────────────────────────────────────
  nebulaBlob: {
    position:       'absolute',
    // Heavy blur simulation via shadow + transparency
    shadowRadius:   80,
    shadowOpacity:  1,
    shadowColor:    '#3B7BFF',
    shadowOffset:   { width: 0, height: 0 },
  },
});

export default MainScreen;

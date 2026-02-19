# Jarvis UI — Design System & Component Reference

Ultra-modern voice AI interface. Dark-first, glassmorphism, state-driven animations.  
Built for **Expo SDK 51 / React Native 0.74**.

---

## Directory Structure

```
ui/
├── App.js                        ← Entry point, navigation, font loading
├── app.json                      ← Expo config (permissions, splash)
├── package.json                  ← Dependencies
├── babel.config.js               ← Reanimated plugin
│
├── screens/
│   └── MainScreen.js             ← Full layout + state machine
│
├── components/
│   ├── VoiceOrb.js               ← Central animated orb
│   ├── ParticleField.js          ← Orbiting particle halo
│   ├── Waveform.js               ← Real-time audio bars
│   ├── TranscriptDisplay.js      ← Glass card: speech ↔ AI text
│   ├── StatusIndicator.js        ← Top-bar status pill
│   ├── BottomControls.js         ← Mic button + secondary actions
│   └── index.js
│
└── theme/
    ├── colors.js                 ← Full color system + state maps
    ├── spacing.js                ← 4px grid + radius + orb sizes
    ├── typography.js             ← Scale + weight + presets
    ├── animations.js             ← Spring/timing/orb/waveform config
    └── index.js
```

---

## Color System

### Backgrounds
| Token            | Hex         | Usage                     |
|------------------|-------------|---------------------------|
| `bg.primary`     | `#05060F`   | Screen background (void)  |
| `bg.secondary`   | `#0A0C1A`   | Deep navy layer           |
| `bg.elevated`    | `#0F1128`   | Cards, modals             |
| `bg.glass`       | `rgba(255,255,255,0.04)` | Glassmorphism fill |
| `bg.glassBorder` | `rgba(255,255,255,0.08)` | Glass border ring  |

### Accents
| Token              | Hex       | Usage                      |
|--------------------|-----------|----------------------------|
| `accent.blue`      | `#3B7BFF` | Primary CTA, idle orb      |
| `accent.violet`    | `#7B3BFF` | Thinking state, gradients  |
| `accent.cyan`      | `#00E5FF` | Listening state, neon glow |

### State Accent Map
| State      | Primary     | Glow shadow              |
|------------|-------------|--------------------------|
| idle       | `#3B7BFF`   | `rgba(59,123,255,0.35)`  |
| listening  | `#00E5FF`   | `rgba(0,229,255,0.25)`   |
| thinking   | `#7B3BFF`   | `rgba(123,59,255,0.30)`  |
| speaking   | `#FF3BFF`   | `rgba(255,59,255,0.35)`  |

---

## Spacing System (4px base grid)

| Token            | Value | Usage                     |
|------------------|-------|---------------------------|
| `xs`             | 4px   | Tight gaps                |
| `sm`             | 8px   | Icon padding              |
| `base`           | 16px  | Default margin            |
| `lg`             | 20px  | Card padding              |
| `xl`             | 24px  | Section gap               |
| `2xl`            | 32px  | Large gaps                |
| `screenPaddingH` | 24px  | Horizontal screen edge    |
| `orbSize`        | 200px | VoiceOrb diameter         |
| `micButtonSize`  | 72px  | Mic CTA diameter          |
| `iconButtonSize` | 50px  | Secondary button size     |

### Border Radius
| Token  | Value | Usage           |
|--------|-------|-----------------|
| `sm`   | 10px  | Chips           |
| `lg`   | 20px  | Cards (min)     |
| `xl`   | 24px  | Buttons, pills  |
| `2xl`  | 28px  | Transcript card |
| `full` | 9999  | Circles, pills  |

---

## Typography

**Font stack:** SF Pro Display (iOS) → Inter (Android/Web)  
Load via `@expo-google-fonts/inter`

| Preset      | Size | Weight | Tracking | Usage                 |
|-------------|------|--------|----------|-----------------------|
| `appTitle`  | 38px | 700    | −1.2     | "JARVIS" heading      |
| `tagline`   | 13px | 500    | +3.0     | "VOICE INTELLIGENCE"  |
| `transcript`| 18px | 300    | −0.2     | Live speech display   |
| `response`  | 16px | 400    | −0.1     | AI answer text        |
| `label`     | 11px | 600    | +1.5     | "YOU" / "JARVIS" tags |
| `statusText`| 12px | 500    | +0.5     | Status pill           |

---

## Component Breakdown

### `VoiceOrb`
Central hero element. 5 visual layers:

```
5. Outer pulse rings     ← scale + fade loop (listening only)
4. Rotating arc dashes   ← linear rotation (thinking only)
3. Outer glass ring      ← semi-transparent border
2. Soft glow halo        ← blurred radial shadow
1. Core sphere           ← LinearGradient + inner sheen
```

**Props:**
```js
<VoiceOrb
  state="idle"     // 'idle' | 'listening' | 'thinking' | 'speaking'
  size={200}       // diameter in dp
/>
```

---

### `ParticleField`
24 particles orbiting the orb at elliptical paths. Each has:
- Randomized orbit radius (110–160dp)
- Randomized speed (3s–7s full orbit)
- Randomized size (2–5dp)  
- Independent opacity breath loop
- Color adapts to current `state`

**Props:**
```js
<ParticleField orbSize={200} state="listening" />
```

---

### `Waveform`
32 animated bars reacting to `state`:

| State     | Behavior                                  |
|-----------|-------------------------------------------|
| idle      | Flat (3dp height)                         |
| listening | Random height per bar, fast update (80ms) |
| thinking  | Subtle sinusoidal shimmer                 |
| speaking  | Medium-amplitude smooth wave              |

Feed real audio via `audioData` prop (Float32Array, 32 samples).

**Props:**
```js
<Waveform state="listening" audioData={float32Array} />
```

---

### `TranscriptDisplay`
Glassmorphism card with `BlurView` + `LinearGradient` overlay.  
Shows `YOU` (cyan) and `JARVIS` (violet) message rows.  
Active message gets full opacity + blinking cursor.  
Past message dims to 38% opacity.  
Auto-scrolls to latest content.

**Props:**
```js
<TranscriptDisplay
  userText="Hello Jarvis"
  aiText="Hello! How can I help?"
  state="speaking"
  scrollRef={ref}
/>
```

---

### `StatusIndicator`
Top-right pill with pulsing dot + label. Adapts per state:

| State     | Label        | Dot color  | Animation      |
|-----------|--------------|------------|----------------|
| idle      | Online       | Blue       | Static         |
| listening | Listening    | Cyan       | Slow pulse     |
| thinking  | Processing   | Violet     | Fast pulse     |
| speaking  | Responding   | Magenta    | Medium pulse   |

---

### `BottomControls`
Floating glassmorphism dock with:

**Mic Button (center)**  
- Idle: Blue→Violet gradient, 20dp glow shadow  
- Recording: Red gradient, expanding pulse ring  
- Disabled (thinking/speaking): Muted grey  
- Spring press feedback + `Vibration.vibrate(12)`

**Secondary glass buttons**
- Settings (`feather: settings`) — left
- History (`feather: message-square`) — right
- Clear (`feather: -`) — centered below mic

---

## Animation System

### Spring Presets
| Name     | Damping | Stiffness | Use case                   |
|----------|---------|-----------|----------------------------|
| `snappy` | 18      | 220       | State transitions          |
| `gentle` | 22      | 160       | Orb entrance               |
| `bouncy` | 12      | 280       | Button press release       |

### Orb Breath Cycle
| State    | Cycle (ms) | Scale range   |
|----------|-----------|---------------|
| idle     | 3000      | 0.96 → 1.04   |
| speaking | 400       | 0.94 → 1.08   |

### Key Duration Reference
| Event                    | Duration |
|--------------------------|----------|
| State dot pulse          | 700ms    |
| Particle orbit (avg)     | 5000ms   |
| Waveform bar update      | 80ms     |
| Orb thinking rotation    | 1800ms   |
| Transcript slide-in      | 320ms    |
| Dock entrance            | 500ms    |

---

## Interaction States

```
                    ┌─────────────────────────────────┐
                    │           IDLE                  │
                    │  Soft blue glow, slow breath    │
                    │  Particles at 60% opacity       │
                    └──────────────┬──────────────────┘
                                   │ Mic tap
                    ┌──────────────▼──────────────────┐
                    │          LISTENING              │
                    │  Cyan glow, pulse rings ×3      │
                    │  Waveform: max amplitude        │
                    │  Particles: 100% opacity        │
                    └──────────────┬──────────────────┘
                                   │ Audio received
                    ┌──────────────▼──────────────────┐
                    │          THINKING               │
                    │  Violet glow, rotating arc      │
                    │  Waveform: gentle shimmer       │
                    │  Spinner gradient ring          │
                    └──────────────┬──────────────────┘
                                   │ Response ready
                    ┌──────────────▼──────────────────┐
                    │          SPEAKING               │
                    │  Magenta gradient, fast breath  │
                    │  Waveform: TTS amplitude        │
                    │  Controls disabled              │
                    └──────────────┬──────────────────┘
                                   │ TTS complete
                                   └──► IDLE
```

---

## Integration with jarvis.py Backend

Replace the `setTimeout` demo blocks in `MainScreen.handleMicPress()` with:

```js
// 1. Start recording (expo-av)
const recording = new Audio.Recording();
await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
await recording.startAsync();
setAppState('listening');

// 2. Stop + get URI
await recording.stopAndUnloadAsync();
const uri = recording.getURI();

// 3. Upload WAV → Python backend (FastAPI) or call Groq Whisper directly
const formData = new FormData();
formData.append('file', { uri, name: 'input.wav', type: 'audio/wav' });
const transcriptRes = await fetch('http://localhost:8000/transcribe', { method: 'POST', body: formData });
const { text } = await transcriptRes.json();
setUserText(text);
setAppState('thinking');

// 4. Call Groq LLM
const llmRes = await fetch('http://localhost:8000/think', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text }),
});
const { response } = await llmRes.json();
setAiText(response);
setAppState('speaking');

// 5. TTS (expo-speech or expo-av)
Speech.speak(response, { onDone: () => setAppState('idle') });
```

---

## Quick Start

```bash
cd ui
npm install
npx expo start
```

Scan QR with **Expo Go** (iOS/Android) or press `i` / `a` for simulator.

---

*Design target: Apple × Tesla × OpenAI — premium, minimal, voice-first.*

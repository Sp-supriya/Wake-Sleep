# Speech-to-Text Module with Wake/Sleep Word Detection

A modular, reusable React implementation for real-time speech-to-text transcription that activates on wake word detection and stops on sleep word detection.

## 🎯 Features

- **Wake Word Detection**: Continuously listens for a configurable wake word (e.g., "Hi") to start transcription
- **Sleep Word Detection**: Stops transcription when a configurable sleep word (e.g., "Bye") is detected
- **Real-time Transcription**: Live speech-to-text conversion with interim results
- **Modular Architecture**: Built with reusable React hooks that can be integrated into any app
- **Mobile-Ready**: Code structure compatible with React Native (just swap STT provider)
- **Configurable**: Easily customize wake/sleep words and language settings
- **Clean UI**: Functional demonstration interface with status indicators and transcript history

## 🏗️ Architecture

### Core Hooks

1. **`useSpeechToText`** (`src/hooks/useSpeechToText.ts`)
   - Handles speech recognition using Web Speech API
   - Provides start/stop controls and transcript history
   - Can be easily swapped with other STT providers (Deepgram, Whisper, etc.)

2. **`useWakeWordDetection`** (`src/hooks/useWakeWordDetection.ts`)
   - Main module combining STT with wake/sleep word logic
   - Manages two speech recognition instances (wake word detection + transcription)
   - Returns status, transcripts, and control functions

### Component

- **`SpeechToTextModule`** (`src/components/SpeechToTextModule.tsx`)
   - Demo component showing the module in action
   - Configurable wake/sleep words
   - Real-time status display
   - Transcript history with timestamps

## 🚀 How It Works

1. **Start Listening**: Click "Start Listening" to begin wake word detection
2. **Say Wake Word**: Say "Hi" (or your configured wake word)
3. **Transcription Begins**: Real-time transcription starts automatically
4. **Say Sleep Word**: Say "Bye" (or your configured sleep word)
5. **Transcription Stops**: Returns to waiting for wake word
6. **Repeat**: Cycle continues until manually stopped

## 💻 Usage

### Basic Integration

```tsx
import { useWakeWordDetection } from '@/hooks/useWakeWordDetection';

function MyComponent() {
  const {
    isActive,
    currentTranscript,
    allTranscripts,
    status,
    start,
    stop,
  } = useWakeWordDetection({
    wakeWord: 'hi',
    sleepWord: 'bye',
    language: 'en-US',
  });

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <p>Status: {status}</p>
      <p>Current: {currentTranscript}</p>
      {allTranscripts.map(t => (
        <div key={t.id}>{t.text}</div>
      ))}
    </div>
  );
}
```

### Standalone STT (without wake word)

```tsx
import { useSpeechToText } from '@/hooks/useSpeechToText';

function SimpleSTT() {
  const {
    isListening,
    transcript,
    transcriptHistory,
    startListening,
    stopListening,
  } = useSpeechToText({
    language: 'en-US',
    continuous: true,
    interimResults: true,
  });

  return (
    <div>
      <button onClick={startListening}>Start</button>
      <button onClick={stopListening}>Stop</button>
      <p>{transcript}</p>
    </div>
  );
}
```

## 🔧 Configuration

### Wake/Sleep Words

Customize the trigger words:

```tsx
useWakeWordDetection({
  wakeWord: 'hello',      // Say "hello" to start
  sleepWord: 'goodbye',   // Say "goodbye" to stop
  language: 'en-US',
});
```

### Language Support

Change the recognition language:

```tsx
useSpeechToText({
  language: 'es-ES',  // Spanish
  // language: 'fr-FR',  // French
  // language: 'de-DE',  // German
});
```

## 🔄 Swapping STT Providers

The module uses Web Speech API by default, but you can easily swap it with other providers:

### Example: Using Deepgram

```tsx
// In useSpeechToText.ts
import { createClient } from '@deepgram/sdk';

export const useSpeechToText = (config) => {
  const deepgram = createClient(API_KEY);
  
  // Implement Deepgram's real-time streaming
  // Replace Web Speech API calls with Deepgram SDK calls
  
  return {
    isListening,
    transcript,
    // ... same interface
  };
};
```

### Example: Using Whisper (via API)

```tsx
// Stream audio chunks to Whisper API endpoint
// Implement similar interface with Whisper's streaming capabilities
```

## 📱 Mobile (React Native) Adaptation

To use in React Native:

1. Replace `useSpeechToText` implementation with a mobile STT library:
   - `@react-native-voice/voice`
   - Deepgram SDK (supports mobile)
   - Google Cloud Speech-to-Text SDK

2. The `useWakeWordDetection` hook logic remains the same

3. Update UI components with React Native components

```tsx
// Example with @react-native-voice/voice
import Voice from '@react-native-voice/voice';

export const useSpeechToText = (config) => {
  // Replace Web Speech API with Voice methods
  Voice.start(config.language);
  // ... implement same interface
};
```

## 🧪 Testing

### Local Testing (PC/Laptop)

1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open in Chrome/Edge (best Web Speech API support)
5. Allow microphone permissions
6. Click "Start Listening"
7. Say wake word to begin transcription
8. Say sleep word to stop transcription

### Browser Requirements

- Chrome/Edge: Full support
- Firefox: Limited support
- Safari: Requires webkit prefix (already handled)
- Mobile browsers: Limited/No support for Web Speech API (use alternative STT)

## 🔐 Security Considerations

### For Production

- **Never expose API keys in frontend code**
- Use backend endpoints to handle STT API calls
- Implement authentication for sensitive transcriptions
- Consider using Deepgram/Whisper with backend proxy for better security

### Current Implementation

- Web Speech API runs entirely in browser (no API key needed)
- Suitable for demo/testing purposes
- For production, migrate to server-side STT processing


## 🛠️ Tech Stack

### Core Technologies
- **React 18.3.1** - UI framework with hooks for state management
- **TypeScript** - Static typing for type-safe code
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3.x** - Utility-first CSS framework for styling
- **shadcn/ui** - Accessible and customizable UI components

### Speech Recognition
- **Web Speech API** - Browser-native speech recognition (for demo)
  - Uses `SpeechRecognition` / `webkitSpeechRecognition`
  - Real-time audio processing in browser
  - No API key required for testing

### Development Tools
- **ESLint** - Code linting and quality checks
- **Bun** - Fast package manager
- **React Hooks** - `useState`, `useEffect`, `useRef`, `useCallback` for state management
- **Lovable AI** - Development assistance and code generation

### UI Components & Libraries
- **Radix UI** - Unstyled accessible component primitives
- **Lucide React** - Icon library
- **React Router DOM** - Client-side routing
- **Sonner** - Toast notifications
- **class-variance-authority** - Variant styling utility

## 🔧 Tools Used

### Speech-to-Text Provider
- **Web Speech API** (Current implementation)
  - Free, no API key required
  - Built into modern browsers
  - Good for prototyping and demos

### Recommended for Production
- **Deepgram** - High-quality STT with free credits
- **OpenAI Whisper** - Open-source, self-hostable
- **Google Cloud Speech-to-Text** - Enterprise-grade
- **AssemblyAI** - Real-time transcription API

### Development Environment
- **IDE**: VS Code / Any modern code editor
- **Browser**: Chrome/Edge (best Web Speech API support)
- **Node.js**: v18+ recommended
- **Package Manager**: Bun / npm / yarn

## 📋 Step-by-Step Build Process

### 1. Project Setup & Planning
```bash
# Initialize Vite + React + TypeScript project
npm create vite@latest speech-to-text-module -- --template react-ts
cd speech-to-text-module
npm install
```

### 2. Core Hook Development

**Step 2.1: Build `useSpeechToText` Hook**
- Created `src/hooks/useSpeechToText.ts`
- Implemented Web Speech API wrapper
- Added state management for:
  - `isListening`: Track recognition status
  - `transcript`: Current real-time transcript
  - `transcriptHistory`: Array of final transcripts
  - `error`: Error handling
- Implemented `startListening()` and `stopListening()` controls
- Added TypeScript interfaces for type safety

**Step 2.2: Build `useWakeWordDetection` Hook**
- Created `src/hooks/useWakeWordDetection.ts`
- Implemented dual recognition strategy:
  - **Instance 1**: Continuous wake word monitoring
  - **Instance 2**: Active transcription after wake word
- Added wake/sleep word detection logic:
  - Monitor wake word detector's transcript history
  - Check for wake word match → start transcription
  - Check for sleep word match → stop transcription
- Implemented status states: `idle`, `waiting-for-wake-word`, `active-transcription`
- Added configuration options for custom wake/sleep words

### 3. UI Component Development

**Step 3.1: Create Demo Component**
- Built `SpeechToTextModule.tsx` component
- Added status indicators with colored badges
- Implemented transcript display with timestamps
- Added start/stop controls
- Made wake/sleep words configurable via input fields

**Step 3.2: Styling with Tailwind**
- Set up semantic color tokens in `index.css`
- Added light/dark mode support
- Used shadcn/ui components (Card, Badge, Button, Input)
- Implemented responsive design

### 4. State Management & Logic

**Step 4.1: Recognition Instance Management**
- Used `useRef` to store recognition instances
- Implemented cleanup in `useEffect` return functions
- Prevented memory leaks with proper instance disposal

**Step 4.2: Transcript Processing**
- Differentiated interim vs final results
- Added timestamps to each transcript entry
- Implemented transcript history array
- Normalized text with `.toLowerCase()` for word matching

### 5. Error Handling & Browser Compatibility

**Step 5.1: Browser Support Detection**
- Added `isSupported` check for Web Speech API
- Implemented fallback error messages
- Handled browser-specific prefixes (`webkit`)

**Step 5.2: Error States**
- Added error handling for:
  - Microphone permission denied
  - Recognition errors
  - Browser compatibility issues
  - Network errors (for API-based STT)

### 6. Testing & Debugging

**Step 6.1: Local Testing**
- Tested wake word detection accuracy
- Verified transcription start/stop behavior
- Tested with various wake/sleep word combinations
- Validated transcript history accumulation

**Step 6.2: Browser Testing**
- Chrome: ✅ Full functionality
- Edge: ✅ Full functionality
- Safari: ⚠️ Webkit prefix handling
- Firefox: ⚠️ Limited support

### 7. Documentation

**Step 7.1: Code Documentation**
- Added TypeScript types and interfaces
- Included JSDoc comments for hooks
- Documented configuration options

**Step 7.2: README Creation**
- Architecture explanation
- Usage examples
- Configuration guide
- Mobile adaptation guide
- Provider swapping instructions

### 8. Modularity & Reusability

**Step 8.1: Hook Abstraction**
- Separated STT logic from wake word logic
- Made hooks independently usable
- Ensured clean interfaces

**Step 8.2: Provider Abstraction**
- Designed `useSpeechToText` for easy provider swapping
- Maintained consistent interface regardless of provider
- Added swap examples for Deepgram, Whisper

### 9. Mobile Preparation

**Step 9.1: Architecture Design**
- Used React hooks (compatible with React Native)
- Avoided browser-specific DOM manipulation
- Kept logic platform-agnostic

**Step 9.2: Swap Instructions**
- Documented React Native Voice integration
- Listed mobile-compatible STT options
- Provided code examples

## 🏗️ How We Built This

### Implementation Approach

1. **Modular Hook Architecture**
   - Separated concerns into reusable hooks
   - `useSpeechToText`: Generic STT interface (swappable)
   - `useWakeWordDetection`: Business logic for wake/sleep words
   - Each hook can be used independently

2. **Dual Recognition Strategy**
   - **Why two instances?**
     - Prevents wake word from appearing in transcripts
     - Allows independent control of each recognition process
     - Enables efficient wake word monitoring without full STT overhead
   - **Instance 1 (Wake Word Detector)**: Runs continuously, only checks for wake/sleep words
   - **Instance 2 (Transcriber)**: Only runs when active, captures actual content

3. **State Management**
   - Used React hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
   - Managed three key states: `idle` → `waiting-for-wake-word` → `active-transcription`
   - Implemented cleanup to prevent memory leaks

4. **Provider Abstraction**
   - Started with Web Speech API (free, no setup)
   - Designed for easy migration to Deepgram, Whisper, or other providers
   - Interface remains consistent regardless of underlying STT service

5. **Mobile-First Design**
   - Hooks are React Native compatible
   - Only STT provider needs swapping (e.g., `@react-native-voice/voice`)
   - Business logic remains unchanged

### Technical Decisions

1. **Why Web Speech API for Demo?**
   - No API key required
   - Works out-of-the-box in browsers
   - Perfect for prototyping
   - Easy to swap later

2. **Why String Matching for Wake/Sleep Words?**
   - Simple and reliable
   - Works with any STT provider
   - Can be enhanced with fuzzy matching if needed
   - Normalizes to lowercase for flexibility

3. **Why TypeScript?**
   - Type safety prevents runtime errors
   - Better IDE autocomplete
   - Self-documenting code
   - Easier maintenance

## 📝 Implementation Notes

### Why Two Recognition Instances?

The module uses two separate speech recognition instances:

1. **Wake Word Detector**: Always listening for the wake word
2. **Transcription Recorder**: Only active after wake word detected




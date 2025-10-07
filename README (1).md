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

## 📊 Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari | Mobile |
|---------|--------|------|---------|--------|--------|
| Web Speech API | ✅ | ✅ | ⚠️ | ⚠️ | ❌ |
| Wake Word Detection | ✅ | ✅ | ⚠️ | ⚠️ | ❌ |
| Real-time Transcription | ✅ | ✅ | ⚠️ | ⚠️ | ❌ |

✅ Full Support | ⚠️ Partial Support | ❌ Not Supported

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Web Speech API** - Speech recognition (demo)
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 📝 Implementation Notes

### Why Two Recognition Instances?

The module uses two separate speech recognition instances:

1. **Wake Word Detector**: Always listening for the wake word
2. **Transcription Recorder**: Only active after wake word detected

This separation ensures:
- Efficient wake word detection without processing all speech
- Clean transcription sessions between wake/sleep words
- Better control over start/stop behavior

### Transcript Management

- **Interim Transcripts**: Shown in real-time (may change as speech continues)
- **Final Transcripts**: Added to history once sentence/phrase is complete
- **Timestamps**: Each transcript entry includes timestamp for tracking

### Performance Considerations

- Minimal CPU usage when waiting for wake word
- Efficient audio processing with browser's native APIs
- Clean state management prevents memory leaks
- Automatic cleanup on component unmount

## 🚀 Future Enhancements

Potential improvements:

- [ ] Add confidence scores for transcripts
- [ ] Support multiple wake/sleep words
- [ ] Add speaker diarization
- [ ] Implement custom wake word training
- [ ] Add translation capabilities
- [ ] Export transcripts (JSON, TXT, PDF)
- [ ] Add keyword highlighting
- [ ] Implement transcript search

## 📄 License

MIT

## 👨‍💻 Author

Built as a demonstration of modular speech-to-text implementation with wake/sleep word detection.

---

**Note**: This is a demo/module implementation. For production use, consider:
- Using dedicated STT services (Deepgram, AssemblyAI, Google STT)
- Implementing backend processing for security
- Adding error recovery and network resilience
- Testing across multiple devices and environments

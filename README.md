## 🛠️ How We Built This

### Implementation Approach

This project was built with modularity and reusability as the primary goals. Here's our development process:

#### 1. **Modular Hook Architecture**
- Created `useSpeechToText` hook as the core STT abstraction layer
- Designed to work with any STT provider (Web Speech API, Deepgram, Whisper)
- Provides a consistent interface regardless of underlying provider

#### 2. **Dual Recognition Strategy**
- Implemented two separate speech recognition instances:
  - **Wake Word Detector**: Continuously listens for activation word
  - **Transcription Engine**: Only active after wake word detected
- This separation prevents processing overhead and enables clean session management

#### 3. **State Management**
- Used React hooks (useState, useEffect, useCallback) for efficient state handling
- Status tracking: `idle` → `waiting-for-wake-word` → `active-transcription`
- Transcript history with timestamps for complete session tracking

#### 4. **Web Speech API Choice**
- Selected for initial implementation due to:
  - Zero API key requirements (perfect for demo)
  - Built into modern browsers
  - Real-time streaming with interim results
  - Easy to swap with other providers later

#### 5. **Mobile-First Design**
- Structured code to be React Native compatible
- Provider abstraction allows easy swapping to mobile STT libraries
- Logic layer (`useWakeWordDetection`) remains unchanged across platforms

### Technical Decisions

**Why Two Recognition Instances?**
- Prevents wake word from appearing in transcripts
- Allows independent control of wake word detection vs transcription
- Better error handling and state isolation

**Why Provider Abstraction?**
- Web Speech API has limited mobile support
- Easy migration to Deepgram, Whisper, or Google STT
- Swap only `useSpeechToText` implementation, keep all logic intact

**Word Detection Logic**
- Simple string matching with `.includes()` for wake/sleep words
- Case-insensitive comparison for reliability
- Can be enhanced with fuzzy matching or custom wake word models

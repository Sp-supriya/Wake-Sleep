import { useState, useEffect, useCallback } from 'react';
import { useSpeechToText } from './useSpeechToText';

export interface WakeWordConfig {
  wakeWord: string;
  sleepWord: string;
  language?: string;
}

export interface UseWakeWordDetectionReturn {
  isActive: boolean;
  currentTranscript: string;
  allTranscripts: Array<{ id: string; text: string; timestamp: number }>;
  status: 'idle' | 'waiting-for-wake-word' | 'active-transcription' | 'error';
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Custom hook that combines speech-to-text with wake/sleep word detection
 * This is the main module that can be reused in any React application
 */
export const useWakeWordDetection = (
  config: WakeWordConfig
): UseWakeWordDetectionReturn => {
  const { wakeWord, sleepWord, language = 'en-US' } = config;

  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'waiting-for-wake-word' | 'active-transcription' | 'error'>('idle');
  const [allTranscripts, setAllTranscripts] = useState<Array<{ id: string; text: string; timestamp: number }>>([]);

  // Speech recognition for wake word detection (short bursts to reduce cost)
  const wakeWordSpeech = useSpeechToText({
    language,
    continuous: false, // Changed to false for shorter bursts
    interimResults: false,
  });

  // Speech recognition for actual transcription (only when active)
  const transcriptionSpeech = useSpeechToText({
    language,
    continuous: true,
    interimResults: true,
  });

  // Auto-restart wake word detection in short bursts to reduce cost
  useEffect(() => {
    if (!isActive && status === 'waiting-for-wake-word') {
      // If not listening and should be, restart after a short delay
      if (!wakeWordSpeech.isListening && !transcriptionSpeech.isListening) {
        const timer = setTimeout(() => {
          wakeWordSpeech.startListening();
        }, 100); // Short delay between detection bursts
        
        return () => clearTimeout(timer);
      }
    }
  }, [wakeWordSpeech.isListening, isActive, status, wakeWordSpeech, transcriptionSpeech.isListening]);

  // Monitor wake word detection
  useEffect(() => {
    if (!isActive && wakeWordSpeech.isListening) {
      const lastTranscript = wakeWordSpeech.transcriptHistory[wakeWordSpeech.transcriptHistory.length - 1];
      
      if (lastTranscript) {
        const text = lastTranscript.text.toLowerCase().trim();
        console.log('Wake word detection - heard:', text);
        
        // Check if wake word is detected
        if (text.includes(wakeWord.toLowerCase())) {
          console.log('Wake word detected! Starting transcription...');
          wakeWordSpeech.stopListening(); // Stop wake word detection first
          setIsActive(true);
          setStatus('active-transcription');
          // Small delay to ensure wake word detection fully stops
          setTimeout(() => {
            transcriptionSpeech.startListening();
          }, 200);
        }
      }
    }
  }, [wakeWordSpeech.transcriptHistory, isActive, wakeWord, transcriptionSpeech, wakeWordSpeech]);

  // Monitor sleep word detection
  useEffect(() => {
    if (isActive && transcriptionSpeech.isListening) {
      const lastTranscript = transcriptionSpeech.transcriptHistory[transcriptionSpeech.transcriptHistory.length - 1];
      
      if (lastTranscript) {
        const text = lastTranscript.text.toLowerCase().trim();
        console.log('Sleep word detection - heard:', text);
        
        // Only add if this ID doesn't already exist in allTranscripts
        setAllTranscripts((prev) => {
          const exists = prev.some(t => t.id === lastTranscript.id);
          if (exists) {
            return prev; // Don't add duplicates
          }
          return [
            ...prev,
            {
              id: lastTranscript.id,
              text: lastTranscript.text,
              timestamp: lastTranscript.timestamp,
            },
          ];
        });
        
        // Check if sleep word is detected
        if (text.includes(sleepWord.toLowerCase())) {
          console.log('Sleep word detected! Stopping transcription...');
          setIsActive(false);
          setStatus('waiting-for-wake-word');
          transcriptionSpeech.stopListening();
          // Restart wake word detection in short bursts
          setTimeout(() => wakeWordSpeech.startListening(), 100);
        }
      }
    }
  }, [transcriptionSpeech.transcriptHistory, isActive, sleepWord, transcriptionSpeech]);

  const start = useCallback(() => {
    console.log('Starting wake word detection...');
    setStatus('waiting-for-wake-word');
    wakeWordSpeech.startListening();
  }, [wakeWordSpeech]);

  const stop = useCallback(() => {
    console.log('Stopping all speech recognition...');
    setStatus('idle');
    setIsActive(false);
    wakeWordSpeech.stopListening();
    transcriptionSpeech.stopListening();
  }, [wakeWordSpeech, transcriptionSpeech]);

  const reset = useCallback(() => {
    console.log('Resetting transcripts...');
    setAllTranscripts([]);
  }, []);

  return {
    isActive,
    currentTranscript: transcriptionSpeech.transcript,
    allTranscripts,
    status,
    error: wakeWordSpeech.error || transcriptionSpeech.error,
    start,
    stop,
    reset,
  };
};

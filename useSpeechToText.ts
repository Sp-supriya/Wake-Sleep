import { useState, useEffect, useRef, useCallback } from 'react';

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface SpeechToTextConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  transcriptHistory: TranscriptEntry[];
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

/**
 * Custom hook for speech-to-text functionality using Web Speech API
 * Can be easily adapted to use other providers (Deepgram, Whisper, etc.)
 */
export const useSpeechToText = (
  config: SpeechToTextConfig = {}
): UseSpeechToTextReturn => {
  const {
    language = 'en-US',
    continuous = true,
    interimResults = true,
  } = config;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      // Add final transcripts to history
      if (finalTranscript) {
        const entry: TranscriptEntry = {
          id: `transcript-${Date.now()}`,
          text: finalTranscript.trim(),
          timestamp: Date.now(),
          isFinal: true,
        };
        setTranscriptHistory((prev) => [...prev, entry]);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      setTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, continuous, interimResults, isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setError('Failed to start speech recognition');
      }
    }
  }, [isListening, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    transcriptHistory,
    error,
    startListening,
    stopListening,
    isSupported,
  };
};

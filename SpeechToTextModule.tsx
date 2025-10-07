import { useState } from 'react';
import { useWakeWordDetection } from '@/hooks/useWakeWordDetection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Trash2, Volume2, VolumeX } from 'lucide-react';

/**
 * Speech-to-Text Module Component
 * Demonstrates real-time transcription with wake/sleep word detection
 * 
 * Features:
 * - Wake word detection to start transcription
 * - Sleep word detection to stop transcription
 * - Real-time transcript display
 * - Configurable wake/sleep words
 * - Clean, reusable architecture
 */
const SpeechToTextModule = () => {
  const [wakeWord, setWakeWord] = useState('hi');
  const [sleepWord, setSleepWord] = useState('bye');

  const {
    isActive,
    currentTranscript,
    allTranscripts,
    status,
    error,
    start,
    stop,
    reset,
  } = useWakeWordDetection({
    wakeWord,
    sleepWord,
    language: 'en-US',
  });

  const getStatusColor = () => {
    switch (status) {
      case 'waiting-for-wake-word':
        return 'bg-warning';
      case 'active-transcription':
        return 'bg-accent';
      case 'error':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'waiting-for-wake-word':
        return `Listening for wake word: "${wakeWord}"`;
      case 'active-transcription':
        return `🎙️ Actively transcribing (say "${sleepWord}" to stop)`;
      case 'error':
        return 'Error occurred';
      default:
        return 'Not started';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Speech-to-Text Module
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time transcription with wake/sleep word detection
          </p>
        </div>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Set your wake and sleep words to control transcription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Wake Word</label>
                <input
                  type="text"
                  value={wakeWord}
                  onChange={(e) => setWakeWord(e.target.value)}
                  disabled={status !== 'idle'}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground disabled:opacity-50"
                  placeholder="e.g., hi, hello, start"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sleep Word</label>
                <input
                  type="text"
                  value={sleepWord}
                  onChange={(e) => setSleepWord(e.target.value)}
                  disabled={status !== 'idle'}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground disabled:opacity-50"
                  placeholder="e.g., bye, stop, end"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {status === 'idle' ? (
                <Button onClick={start} className="gap-2">
                  <Mic className="h-4 w-4" />
                  Start Listening
                </Button>
              ) : (
                <Button onClick={stop} variant="destructive" className="gap-2">
                  <MicOff className="h-4 w-4" />
                  Stop All
                </Button>
              )}
              
              <Button onClick={reset} variant="outline" className="gap-2" disabled={allTranscripts.length === 0}>
                <Trash2 className="h-4 w-4" />
                Clear Transcripts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Status</span>
              <Badge className={getStatusColor()}>
                {status === 'waiting-for-wake-word' && <Volume2 className="h-3 w-3 mr-1" />}
                {status === 'active-transcription' && <Mic className="h-3 w-3 mr-1" />}
                {status === 'idle' && <VolumeX className="h-3 w-3 mr-1" />}
                {status.replace(/-/g, ' ').toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{getStatusText()}</p>
            {error && (
              <p className="text-destructive mt-2">Error: {error}</p>
            )}
          </CardContent>
        </Card>

        {/* Current Transcript (Interim) */}
        {isActive && currentTranscript && (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="text-accent">Current Transcript (Interim)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic text-muted-foreground">
                {currentTranscript}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Transcript History */}
        <Card>
          <CardHeader>
            <CardTitle>Transcript History</CardTitle>
            <CardDescription>
              {allTranscripts.length} transcript{allTranscripts.length !== 1 ? 's' : ''} recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {allTranscripts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Mic className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No transcripts yet. Say "{wakeWord}" to start transcribing.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allTranscripts.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-lg bg-muted/50 space-y-2 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-foreground">{entry.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="space-y-1">
              <p className="font-medium">🎯 Modular Architecture:</p>
              <p className="text-muted-foreground">
                Built with reusable hooks (<code className="text-xs bg-muted px-1 py-0.5 rounded">useSpeechToText</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">useWakeWordDetection</code>) that can be easily integrated into any React app.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">🔊 STT Provider:</p>
              <p className="text-muted-foreground">
                Currently using Web Speech API (free, built-in). Can be easily swapped with Deepgram, Whisper, or Google STT by modifying the <code className="text-xs bg-muted px-1 py-0.5 rounded">useSpeechToText</code> hook.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">📱 Mobile Ready:</p>
              <p className="text-muted-foreground">
                Code structure is compatible with React Native. Just replace the Web Speech API implementation with a mobile-compatible STT service.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">⚡ How It Works:</p>
              <p className="text-muted-foreground">
                1. System continuously listens for wake word<br />
                2. When detected, starts real-time transcription<br />
                3. Transcribes until sleep word is detected<br />
                4. Repeats cycle until manually stopped
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeechToTextModule;

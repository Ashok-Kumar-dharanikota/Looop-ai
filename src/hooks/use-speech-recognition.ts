import { useState, useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
  type ExpoSpeechRecognitionErrorCode,
} from 'expo-speech-recognition';

export interface UseSpeechRecognitionOptions {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
  contextualStrings?: string[];
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isAvailable: boolean;
  hasPermission: boolean | null;
  transcript: string;
  interimTranscript: string;
  words: string[];
  volumeLevel: number;
  normalizedVolume: number; // 0.0 to 1.0 for UI animations
  isFinal: boolean;
  errorCode: ExpoSpeechRecognitionErrorCode | null;
  errorMessage: string | null;
  start: (options?: UseSpeechRecognitionOptions) => Promise<boolean>;
  stop: () => Promise<void>;
  abort: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for real-time speech-to-text powered by expo-speech-recognition.
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(-2);
  const [isFinal, setIsFinal] = useState(false);
  const [errorCode, setErrorCode] = useState<ExpoSpeechRecognitionErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check initial capability & permissions
  useEffect(() => {
    let isMounted = true;

    async function checkStatus() {
      try {
        if (ExpoSpeechRecognitionModule) {
          const available = await ExpoSpeechRecognitionModule.isRecognitionAvailable();
          if (isMounted) setIsAvailable(Boolean(available));

          const perms = await ExpoSpeechRecognitionModule.getPermissionsAsync();
          if (isMounted) setHasPermission(Boolean(perms.granted));
        }
      } catch (err) {
        console.warn('Speech recognition status check warning:', err);
      }
    }

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  // Event Handlers via useSpeechRecognitionEvent hook
  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
    setErrorCode(null);
    setErrorMessage(null);
    setIsFinal(false);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
    setVolumeLevel(-2);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const mainResult = event.results && event.results[0];
    if (mainResult) {
      const text = mainResult.transcript || '';
      if (event.isFinal) {
        setTranscript(text);
        setInterimTranscript(text);
        setIsFinal(true);
      } else {
        setInterimTranscript(text);
      }
    }
  });

  useSpeechRecognitionEvent('volumechange', (event) => {
    // event.value is typically between -2 dB (quiet) and 10 dB (loud)
    setVolumeLevel(event.value);
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.warn('Speech recognition error event:', event.error, event.message);
    setErrorCode(event.error);
    setErrorMessage(event.message);
    setIsListening(false);
    setVolumeLevel(-2);
  });

  // Start speech recognition
  const start = useCallback(
    async (options?: UseSpeechRecognitionOptions): Promise<boolean> => {
      try {
        setErrorCode(null);
        setErrorMessage(null);
        setIsFinal(false);
        setTranscript('');
        setInterimTranscript('');
        setVolumeLevel(-2);

        // 1. Request permissions if not yet granted
        const permResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        setHasPermission(Boolean(permResult.granted));

        if (!permResult.granted) {
          setErrorCode('not-allowed');
          setErrorMessage('Microphone or Speech Recognition permission was not granted.');
          return false;
        }

        // 2. Start native speech recognition session
        await ExpoSpeechRecognitionModule.start({
          lang: options?.lang || 'en-US',
          interimResults: options?.interimResults ?? true,
          continuous: options?.continuous ?? false,
          contextualStrings: options?.contextualStrings,
          addsPunctuation: true,
          volumeChangeEventOptions: {
            enabled: true,
            intervalMillis: 80,
          },
          iosCategory: {
            category: 'playAndRecord',
            categoryOptions: ['defaultToSpeaker', 'allowBluetooth'],
            mode: 'measurement',
          },
        });

        setIsListening(true);
        return true;
      } catch (err: any) {
        console.warn('Failed to start speech recognition:', err);
        setErrorCode('unknown');
        setErrorMessage(err?.message || 'Failed to start speech recognition.');
        setIsListening(false);
        return false;
      }
    },
    []
  );

  // Stop recording and await final results
  const stop = useCallback(async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } catch (err) {
      console.warn('Error stopping speech recognition:', err);
      setIsListening(false);
    }
  }, []);

  // Cancel immediately
  const abort = useCallback(async () => {
    try {
      await ExpoSpeechRecognitionModule.abort();
      setIsListening(false);
      setTranscript('');
      setInterimTranscript('');
    } catch (err) {
      console.warn('Error aborting speech recognition:', err);
      setIsListening(false);
    }
  }, []);

  // Reset internal states
  const reset = useCallback(() => {
    setIsListening(false);
    setTranscript('');
    setInterimTranscript('');
    setVolumeLevel(-2);
    setIsFinal(false);
    setErrorCode(null);
    setErrorMessage(null);
  }, []);

  // Split active transcript into individual words for real-time streaming UI
  const currentText = transcript || interimTranscript;
  const words = useMemo(() => {
    if (!currentText.trim()) return [];
    return currentText.trim().split(/\s+/);
  }, [currentText]);

  // Normalized volume between 0 and 1
  const normalizedVolume = useMemo(() => {
    // Clamps between -2 and 10, then normalizes to 0.0 - 1.0
    const clamped = Math.max(-2, Math.min(10, volumeLevel));
    return (clamped + 2) / 12;
  }, [volumeLevel]);

  return {
    isListening,
    isAvailable,
    hasPermission,
    transcript,
    interimTranscript,
    words,
    volumeLevel,
    normalizedVolume,
    isFinal,
    errorCode,
    errorMessage,
    start,
    stop,
    abort,
    reset,
  };
}

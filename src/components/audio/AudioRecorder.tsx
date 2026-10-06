import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Sparkles, 
  RotateCw, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AudioCaptureManager, type AudioRecordingResult } from '../../services/audioCaptureService';
import { triggerHaptic } from '../../utils/haptics';

export interface AudioRecorderProps {
  onProcessWithDharmaCore: (audioBlob: Blob, audioUrl: string, durationSeconds: number, liveTranscript?: string) => void;
  onDiscard?: () => void;
  isProcessing?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onProcessWithDharmaCore,
  onDiscard,
  isProcessing = false,
}) => {
  // Estados del ciclo de grabación
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordingResult, setRecordingResult] = useState<AudioRecordingResult | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState('');

  // Estados de reproducción
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Manager y temporizadores
  const captureManagerRef = useRef<AudioCaptureManager | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPointerHoldingRef = useRef(false);
  const holdStartTimeRef = useRef(0);
  const speechRecognitionRef = useRef<any>(null);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (captureManagerRef.current) captureManagerRef.current.cancelRecording();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  // Formateador de tiempo: 00:00, 00:01, 00:02...
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Iniciar grabación real
  const handleStartRecording = async () => {
    setErrorMessage(null);
    setLiveTranscript('');
    if (!captureManagerRef.current) {
      captureManagerRef.current = new AudioCaptureManager();
    }

    try {
      setElapsedSeconds(0);
      await captureManagerRef.current.startRecording((volume) => {
        setVolumeLevel(volume);
      });

      setRecordingState('recording');

      // Iniciar reconocimiento de voz Web Speech si el navegador lo soporta
      const SpeechRecognition = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'es-ES';
          recognition.onresult = (event: any) => {
            let text = '';
            for (let i = 0; i < event.results.length; i++) {
              text += event.results[i][0].transcript + ' ';
            }
            setLiveTranscript(text.trim());
          };
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (_) {}
      }

      // Iniciar cronómetro de segundos
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      // Feedback háptico
      triggerHaptic(25);
    } catch (err: any) {
      console.warn('Error accediendo al micrófono:', err);
      setRecordingState('idle');
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      const msg = err.name === 'NotAllowedError'
        ? 'Permiso de micrófono denegado. Por favor permite el acceso al micrófono en tu navegador.'
        : 'No se pudo acceder al micrófono. Verifica los dispositivos de audio.';
      setErrorMessage(msg);
    }
  };

  // Detener grabación real
  const handleStopRecording = async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch (_) {}
      speechRecognitionRef.current = null;
    }

    if (!captureManagerRef.current) return;

    try {
      const result = await captureManagerRef.current.stopRecording();
      setRecordingResult(result);
      setRecordingState('recorded');
      setVolumeLevel(0);

      // Feedback háptico
      triggerHaptic([30, 40, 30]);
    } catch (err: any) {
      console.warn('Error deteniendo la grabación:', err);
      setRecordingState('idle');
      setErrorMessage('La grabación fue demasiado corta. Mantén presionado durante al menos 1 segundo.');
    }
  };

  // Descartar grabación
  const handleDiscard = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.abort(); } catch (_) {}
      speechRecognitionRef.current = null;
    }
    if (captureManagerRef.current) {
      captureManagerRef.current.cancelRecording();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (recordingResult?.url) {
      URL.revokeObjectURL(recordingResult.url);
    }

    setRecordingState('idle');
    setElapsedSeconds(0);
    setRecordingResult(null);
    setLiveTranscript('');
    setIsPlaying(false);
    setPlaybackTime(0);
    setErrorMessage(null);

    if (onDiscard) onDiscard();
  };

  // Reproducir / Pausar
  const handleTogglePlayback = () => {
    if (!recordingResult?.url) return;

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(recordingResult.url);
      audioPlayerRef.current.ontimeupdate = () => {
        if (audioPlayerRef.current) {
          setPlaybackTime(Math.floor(audioPlayerRef.current.currentTime));
        }
      };
      audioPlayerRef.current.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      };
    }

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Error al reproducir audio', e);
      });
    }
  };

  // Handlers para MÓVIL: "Mantén presionado para hablar"
  const handleMobilePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isPointerHoldingRef.current = true;
    holdStartTimeRef.current = Date.now();
    handleStartRecording();
  };

  const handleMobilePointerUp = () => {
    if (!isPointerHoldingRef.current) return;
    isPointerHoldingRef.current = false;
    const holdDuration = Date.now() - holdStartTimeRef.current;

    if (holdDuration < 400) {
      return;
    }

    handleStopRecording();
  };

  // Enviar a DHARMA CORE
  const handleProcessCore = () => {
    if (!recordingResult) return;
    onProcessWithDharmaCore(
      recordingResult.blob,
      recordingResult.url,
      recordingResult.durationSeconds,
      liveTranscript.trim() || undefined
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      {/* 
        ========================================================================
        ESTADO 1 & 2: IDLE Y GRABANDO
        ========================================================================
      */}
      {recordingState !== 'recorded' && (
        <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
          {/* Cronómetro en tiempo real: 00:00, 00:01, 00:02 */}
          <div className="space-y-1">
            <div className={`font-mono text-4xl sm:text-5xl font-extrabold tracking-tight transition-colors duration-200 ${
              recordingState === 'recording' ? 'text-[#EB6B6B]' : 'text-[#24292F]'
            }`}>
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-xs font-semibold text-[#697282] uppercase tracking-wider">
              {recordingState === 'recording' ? (
                <span className="flex items-center justify-center gap-1.5 text-[#EB6B6B] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#EB6B6B] animate-ping" />
                  Grabando señal de audio...
                </span>
              ) : (
                'Listo para capturar'
              )}
            </div>
          </div>

          {/* Ondas Sonoras / Visualizador Reactivo */}
          <div className="h-12 flex items-center justify-center gap-1.5 w-full max-w-xs px-4 py-1 bg-[#FAF8F5] rounded-2xl border border-black/[0.03]">
            {[10, 18, 32, 14, 42, 22, 50, 16, 36, 48, 20, 30, 24, 12, 28, 40, 16].map((baseHeight, i) => {
              const dynamicFactor = recordingState === 'recording' 
                ? Math.max(0.3, (volumeLevel / 100) * (1 + ((i % 4) * 0.4)))
                : 0.25;
              const barHeight = Math.min(44, Math.max(6, baseHeight * dynamicFactor));

              return (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    recordingState === 'recording'
                      ? 'bg-gradient-to-t from-[#177468] to-[#2EAF9D]'
                      : 'bg-[#9DA6B5]/30'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
              );
            })}
          </div>

          {/* Transcripción en vivo en tiempo real */}
          {liveTranscript && (
            <div className="w-full max-w-sm p-3.5 rounded-[20px] bg-white border border-black/[0.05] shadow-xs text-left space-y-1 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#171717] uppercase tracking-dharma">
                <span className="w-2 h-2 rounded-full bg-[#171717] animate-pulse" />
                <span>Voz en tiempo real</span>
              </div>
              <p className="text-xs text-[#525252] font-medium leading-relaxed italic">
                "{liveTranscript}"
              </p>
            </div>
          )}

          {/* 
            --------------------------------------------------------------------
            A) MÓVIL: Botón grande 🎙 "Mantén presionado para hablar"
            --------------------------------------------------------------------
          */}
          <div className="sm:hidden flex flex-col items-center gap-3 pt-2">
            <div className="relative flex items-center justify-center">
              {/* Halos pulsantes al grabar */}
              {recordingState === 'recording' && (
                <>
                  <div className="absolute w-32 h-32 rounded-full bg-[#EB6B6B]/20 animate-ping" />
                  <div className="absolute w-36 h-36 rounded-full bg-[#171717]/10 animate-pulse" />
                </>
              )}

              <button
                type="button"
                onPointerDown={handleMobilePointerDown}
                onPointerUp={handleMobilePointerUp}
                onPointerLeave={handleMobilePointerUp}
                onClick={() => {
                  if (recordingState === 'recording') {
                    handleStopRecording();
                  }
                }}
                className={`
                  relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer touch-none
                  ${
                    recordingState === 'recording'
                      ? 'bg-[#EB6B6B] text-white shadow-[#EB6B6B]/30 scale-105'
                      : 'bg-[#171717] text-white shadow-[0_12px_28px_rgba(23,23,23,0.25)] hover:scale-102'
                  }
                `}
                aria-label="Mantén presionado para hablar"
              >
                {recordingState === 'recording' ? (
                  <Square className="w-10 h-10 fill-white" />
                ) : (
                  <Mic className="w-11 h-11 stroke-[2.2] text-[#FFD84D]" />
                )}
              </button>
            </div>

            <div className="text-center space-y-0.5">
              <p className="text-xs font-bold text-[#171717]">
                {recordingState === 'recording' ? 'Suelta para finalizar' : 'Mantén presionado para hablar'}
              </p>
              <p className="text-[11px] text-[#8C827A]">
                {recordingState === 'recording' ? 'o toca para detener' : 'o presiona una vez para iniciar'}
              </p>
            </div>
          </div>

          {/* 
            --------------------------------------------------------------------
            B) DESKTOP: Botón "Iniciar grabación" / "Detener grabación"
            --------------------------------------------------------------------
          */}
          <div className="hidden sm:flex flex-col items-center gap-2 pt-2">
            {recordingState === 'recording' ? (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleStopRecording}
                icon={<Square className="w-4 h-4 fill-white" />}
                className="px-8 py-3.5 text-sm font-bold shadow-md bg-[#EB6B6B] hover:bg-[#D9534F] text-white border-transparent animate-pulse"
              >
                Detener grabación
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartRecording}
                icon={<Mic className="w-5 h-5 stroke-[2.2] text-[#FFD84D]" />}
                className="px-8 py-3.5 text-sm font-bold shadow-md hover:scale-[1.02] active:scale-98 transition-transform"
              >
                Iniciar grabación
              </Button>
            )}
            <span className="text-[11px] text-[#8C827A]">
              {recordingState === 'recording'
                ? 'Pulsa «Detener grabación» para revisar el audio'
                : 'Haz clic para comenzar a hablar'}
            </span>
          </div>

          {/* Mensaje de error si falla permiso */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#EB6B6B]/20 text-xs text-[#EB6B6B] flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* 
        ========================================================================
        ESTADO 3: AL TERMINAR (Grabación lista)
        Opciones requeridas:
        - Reproducir
        - Descartar
        - Procesar con DHARMA CORE
        ========================================================================
      */}
      {recordingState === 'recorded' && recordingResult && (
        <div className="w-full max-w-md space-y-6 animate-fadeIn">
          {/* Tarjeta de Audio Capturado */}
          <div className="p-5 rounded-[24px] bg-[#FAF8F5] border border-black/[0.05] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#171717]" />
                <span className="text-xs font-bold text-[#171717] uppercase tracking-dharma">
                  Audio Capturado
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#171717] bg-white px-2.5 py-1 rounded-full border border-black/[0.04]">
                {formatTime(playbackTime || recordingResult.durationSeconds)} / {formatTime(recordingResult.durationSeconds)}
              </span>
            </div>

            {/* Visualizador de Forma de Onda Final */}
            <div className="flex items-center justify-center gap-1.5 h-14 px-4 bg-white rounded-2xl border border-black/[0.03]">
              {[12, 24, 38, 16, 45, 28, 52, 20, 36, 44, 18, 30, 22, 14, 32, 42, 18, 26, 34, 16].map((h, idx) => {
                const progressRatio = playbackTime / (recordingResult.durationSeconds || 1);
                const isPlayed = idx / 20 <= progressRatio;
                return (
                  <span
                    key={idx}
                    className={`w-1.5 rounded-full transition-colors duration-150 ${
                      isPlayed ? 'bg-[#171717]' : 'bg-[#171717]/15'
                    }`}
                    style={{ height: `${h * 0.8}px` }}
                  />
                );
              })}
            </div>

            {/* Transcripción de voz en vivo si fue capturada */}
            {liveTranscript && (
              <div className="p-3.5 rounded-[18px] bg-white border border-black/[0.04] space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#171717] uppercase tracking-dharma">
                    Voz detectada
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFD84D]/40 text-[#171717]">
                    GEMINI READY
                  </span>
                </div>
                <p className="text-xs text-[#525252] font-medium leading-relaxed italic">
                  "{liveTranscript}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-[#8C827A] px-1">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#171717]" />
                <span>Formato: {recordingResult.mimeType.split(';')[0]}</span>
              </span>
              <span>Duración: {recordingResult.durationSeconds}s</span>
            </div>
          </div>

          {/* 
            --------------------------------------------------------------------
            ACCIONES AL TERMINAR:
            1. Reproducir
            2. Descartar
            3. Procesar con DHARMA CORE
            --------------------------------------------------------------------
          */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-black/[0.04]">
            {/* 1. Reproducir */}
            <Button
              variant="secondary"
              size="md"
              onClick={handleTogglePlayback}
              icon={
                isPlaying ? (
                  <Pause className="w-4 h-4 text-[#171717]" />
                ) : (
                  <Play className="w-4 h-4 text-[#171717] fill-[#171717]" />
                )
              }
              className="flex-1 justify-center"
            >
              {isPlaying ? 'Pausar' : 'Reproducir'}
            </Button>

            {/* 2. Descartar */}
            <Button
              variant="ghost"
              size="md"
              onClick={handleDiscard}
              icon={<Trash2 className="w-4 h-4 text-[#EB6B6B]" />}
              className="text-[#8C827A] hover:text-[#EB6B6B] justify-center"
            >
              Descartar
            </Button>

            {/* 3. Procesar con DHARMA CORE */}
            <Button
              variant="primary"
              size="md"
              onClick={handleProcessCore}
              disabled={isProcessing}
              icon={
                isProcessing ? (
                  <RotateCw className="w-4 h-4 animate-spin text-[#FFD84D]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#FFD84D] stroke-[2.2]" />
                )
              }
              className="flex-1 justify-center shadow-xs"
            >
              {isProcessing ? 'Procesando...' : 'Procesar con Core'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

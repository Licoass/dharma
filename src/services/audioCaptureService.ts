/**
 * Servicio de Captura y Gestión de Audio para DHARMA
 * Utiliza MediaRecorder API nativa del navegador y subida opcional a Supabase Storage.
 */

export interface AudioRecordingResult {
  blob: Blob;
  url: string;
  durationSeconds: number;
  mimeType: string;
}

export class AudioCaptureManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;

  /**
   * Inicia la grabación desde el micrófono del usuario.
   * @param onVolumeChange Callback opcional que recibe el volumen actual (0-100) para ondas reactivas
   */
  async startRecording(onVolumeChange?: (volume: number) => void): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Tu navegador no soporta la grabación de audio');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // Configuración de AnalyserNode para reactividad visual del audio
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        if (onVolumeChange) {
          const bufferLength = this.analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const checkVolume = () => {
            if (!this.analyser) return;
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const average = sum / bufferLength;
            const volumePercent = Math.min(100, Math.round((average / 128) * 100));
            onVolumeChange(volumePercent);
            this.animationFrameId = requestAnimationFrame(checkVolume);
          };

          this.animationFrameId = requestAnimationFrame(checkVolume);
        }
      }
    } catch (e) {
      console.warn('AudioContext no inicializado, continuando sin visualizador reactivo', e);
    }

    // Seleccionar mimeType compatible
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/aac',
    ];
    let selectedMimeType = '';
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        selectedMimeType = type;
        break;
      }
    }

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream, selectedMimeType ? { mimeType: selectedMimeType } : undefined);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.startTime = Date.now();
    this.mediaRecorder.start(200); // Guardar fragmentos cada 200ms
  }

  /**
   * Detiene la grabación y produce el resultado con el Blob y URL de audio.
   */
  async stopRecording(): Promise<AudioRecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('No hay grabación activa en curso'));
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

        this.cleanup();
        resolve({ blob, url, durationSeconds, mimeType });
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancela la grabación activa sin generar resultado.
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        // Ignorar
      }
    }
    this.cleanup();
  }

  private cleanup(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

/**
 * Convierte un Blob de audio a cadena Base64 (sin prefijo data:...)
 */
export async function audioBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Guarda temporalmente el audio en Supabase Storage (bucket: 'audio-transmissions').
 * Si Supabase no está configurado o falla, devuelve null para continuar con payload directo en base64.
 */
export async function uploadAudioToSupabaseStorage(
  blob: Blob,
  fileNamePrefix: string = 'rec'
): Promise<string | null> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  try {
    const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm';
    const filename = `${fileNamePrefix}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}.${ext}`;
    const uploadUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/audio-transmissions/${filename}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': blob.type,
        'x-upsert': 'true',
      },
      body: blob,
    });

    if (response.ok) {
      // URL pública del archivo
      return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/audio-transmissions/${filename}`;
    }
  } catch (error) {
    console.warn('No se pudo subir a Supabase Storage, continuando con base64 local', error);
  }

  return null;
}

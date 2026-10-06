import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { AudioRecorder } from './AudioRecorder';
import { DharmaCoreConfirmation } from '../dharmaCore/DharmaCoreConfirmation';
import { DharmaCore } from '../common/DharmaCore';
import { useTaskContext } from '../../context/TaskContext';
import { 
  processAudioWithDharmaCore, 
  type DharmaCoreExtractionResult, 
  type DharmaCoreTaskPreview 
} from '../../services/dharmaCoreService';
import { ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export interface AudioCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export const AudioCaptureModal: React.FC<AudioCaptureModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const { categories, statuses, addTask, addTransmission, setDharmaMood } = useTaskContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<DharmaCoreExtractionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProcessAudio = async (
    audioBlob: Blob,
    audioUrl: string,
    durationSeconds: number,
    liveTranscript?: string
  ) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setDharmaMood('syncing');

    try {
      // Registrar también opcionalmente en el buzón de transmisiones crudas como respaldo
      try {
        addTransmission({
          type: 'audio',
          title: `Captura de voz (${durationSeconds}s)`,
          content: liveTranscript ? `Transcripción: "${liveTranscript}"` : `Nota de audio capturada el ${new Date().toLocaleDateString('es-ES')}`,
          url: audioUrl,
          durationSeconds,
          status: 'procesando',
          frequencyCode: `VOC-${(104 + Math.random() * 4).toFixed(1)}`,
        });
      } catch (txErr) {
        console.warn('No se pudo registrar la transmisión previa:', txErr);
      }

      // Procesar audio con DHARMA CORE (Supabase Storage + Gemini Multimodal / Local Fallback)
      const result = await processAudioWithDharmaCore(audioBlob, categories, liveTranscript);
      setExtractionResult(result);
      setDharmaMood('focus');
    } catch (err: any) {
      console.error('Error procesando audio con Dharma Core:', err);
      setErrorMessage(err.message || 'Error al procesar la nota de voz');
      setDharmaMood('calm');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptAll = (tasksToSave: DharmaCoreTaskPreview[]) => {
    // REGLA FUNDAMENTAL: Nunca crear tareas automáticamente sin confirmación.
    // Solo aquí se guardan las tareas en el sistema.
    tasksToSave.forEach((t) => {
      addTask({
        title: t.title,
        description: t.description || `Extraída de audio con Dharma Core: "${extractionResult?.transcription || ''}"`,
        categoryId: t.categoryId || categories[0]?.id || 'cat-pers',
        statusId: statuses[0]?.id || 'por_hacer',
        priority: t.priority || 'media',
        dueDate: t.dueDate,
        origin: 'Voz / Dharma Core',
      });
    });

    setDharmaMood('celebrate');
    setTimeout(() => setDharmaMood('calm'), 2500);

    if (onCompleted) onCompleted();
    handleClose();
  };

  const handleDiscard = () => {
    setExtractionResult(null);
    handleClose();
  };

  const handleClose = () => {
    setExtractionResult(null);
    setIsProcessing(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={extractionResult ? 'DHARMA CORE' : 'CAPTURA DE AUDIO // DHARMA CORE'}
      subtitle={
        extractionResult
          ? 'Confirmación obligatoria previa al guardado en el sistema'
          : 'Graba tus notas de voz y conviértelas en tareas estructuradas con IA'
      }
      maxWidth={extractionResult ? 'lg' : 'md'}
    >
      {extractionResult ? (
        /* Pantalla de Confirmación de DHARMA CORE */
        <DharmaCoreConfirmation
          result={extractionResult}
          onAcceptAll={handleAcceptAll}
          onDiscard={handleDiscard}
        />
      ) : (
        /* Pantalla de Grabación */
        <div className="space-y-4 select-none">
          {/* Banner descriptivo */}
          <div className="p-3.5 rounded-[20px] bg-gradient-to-r from-[#FAF5FF] via-white to-[#E8F6F4] border border-[#8B5CF6]/15 flex items-start gap-3">
            <DharmaCore mood={isProcessing ? 'syncing' : 'focus'} size="sm" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#8B5CF6] uppercase bg-[#FAF5FF] px-2 py-0.5 rounded-full">
                  FASE 9 ONLINE
                </span>
                <span className="text-[10px] text-[#D48B38] font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Gemini Audio
                </span>
              </div>
              <p className="text-xs text-[#697282] leading-relaxed">
                Habla con naturalidad. El audio se almacena temporalmente y DHARMA CORE transcribirá, identificará tareas, categorías, fechas y prioridades.
              </p>
            </div>
          </div>

          {/* Componente de Grabación */}
          <AudioRecorder
            onProcessWithDharmaCore={handleProcessAudio}
            onDiscard={() => setErrorMessage(null)}
            isProcessing={isProcessing}
          />

          {/* Error si ocurre */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#EB6B6B]/20 text-xs text-[#EB6B6B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mensaje de Seguridad y Control */}
          <div className="flex items-center justify-between text-[11px] text-[#697282] pt-2 border-t border-black/[0.04] px-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#177468]" />
              <span>Nunca se guardan tareas sin tu confirmación previa</span>
            </div>
            <span className="font-mono text-[10px] text-[#9DA6B5]">
              Supabase Storage + Edge
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
};

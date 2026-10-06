import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  FileText, 
  Link2, 
  Mic, 
  Image as ImageIcon, 
  Volume2
} from 'lucide-react';
import { AudioRecorder } from '../audio/AudioRecorder';
import { DharmaCoreConfirmation } from '../dharmaCore/DharmaCoreConfirmation';
import { useTaskContext } from '../../context/TaskContext';
import { 
  processAudioWithDharmaCore, 
  type DharmaCoreExtractionResult, 
  type DharmaCoreTaskPreview 
} from '../../services/dharmaCoreService';
import type { Transmission, TransmissionType } from '../../types';

export interface NewTransmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transmissionData: Omit<Transmission, 'id' | 'createdAt'>) => void;
}

export const NewTransmissionModal: React.FC<NewTransmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { categories, statuses, addTask, setDharmaMood } = useTaskContext();
  const [activeType, setActiveType] = useState<TransmissionType>('texto');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');

  // Audio capturado real
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioDuration, setRecordedAudioDuration] = useState(0);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [audioExtraction, setAudioExtraction] = useState<DharmaCoreExtractionResult | null>(null);

  const handleProcessAudioWithCore = async (
    blob: Blob,
    url: string,
    durationSeconds: number
  ) => {
    setRecordedAudioUrl(url);
    setRecordedAudioDuration(durationSeconds);
    if (!content.trim()) {
      setContent(`Nota de voz grabada (${durationSeconds}s)`);
    }

    setIsProcessingAudio(true);
    setDharmaMood('syncing');
    try {
      const result = await processAudioWithDharmaCore(blob, categories);
      setAudioExtraction(result);
      setDharmaMood('focus');
    } catch (e) {
      console.warn('Error al procesar audio en transmisión', e);
      setDharmaMood('calm');
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const handleAcceptAllTasks = (tasksToSave: DharmaCoreTaskPreview[]) => {
    tasksToSave.forEach((t) => {
      addTask({
        title: t.title,
        description: t.description || `Extraída de audio: "${audioExtraction?.transcription || ''}"`,
        categoryId: t.categoryId || categories[0]?.id || 'cat-pers',
        statusId: statuses[0]?.id || 'por_hacer',
        priority: t.priority || 'media',
        dueDate: t.dueDate,
        origin: 'Transmisión / Audio',
      });
    });

    setDharmaMood('celebrate');
    setTimeout(() => setDharmaMood('calm'), 2000);

    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setUrl('');
    setRecordedAudioUrl(null);
    setRecordedAudioDuration(0);
    setAudioExtraction(null);
    setIsProcessingAudio(false);
    setActiveType('texto');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType !== 'audio' && !content.trim() && !url.trim()) return;

    const freqNumber = (104 + Math.random() * 5).toFixed(1);
    const prefix = activeType === 'audio' ? 'VOC' : activeType === 'enlace' ? 'NET' : activeType === 'imagen' ? 'IMG' : 'TX';

    onSubmit({
      type: activeType,
      title: title.trim() || undefined,
      content: content.trim() || (activeType === 'audio' ? 'Nota de voz entrante registrada.' : url),
      url: url.trim() || (activeType === 'audio' ? recordedAudioUrl || undefined : undefined),
      durationSeconds: activeType === 'audio' ? (recordedAudioDuration > 0 ? recordedAudioDuration : 20) : undefined,
      status: 'nueva',
      frequencyCode: `${prefix}-${freqNumber}`,
      signalStrength: Math.floor(93 + Math.random() * 7),
    });

    handleReset();
    onClose();
  };

  const typeTabs: { id: TransmissionType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'texto', label: 'Texto', icon: <FileText className="w-4 h-4" />, desc: 'Notas rápidas o memos' },
    { id: 'enlace', label: 'Enlace', icon: <Link2 className="w-4 h-4" />, desc: 'URLs y artículos de la web' },
    { id: 'audio', label: 'Audio', icon: <Mic className="w-4 h-4" />, desc: 'Voz y notas grabadas' },
    { id: 'imagen', label: 'Imagen', icon: <ImageIcon className="w-4 h-4" />, desc: 'Bocetos y esquemas' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title={audioExtraction ? 'DHARMA CORE' : 'NUEVA TRANSMISIÓN'}
      subtitle={
        audioExtraction
          ? 'Confirmación previa a la integración en el sistema'
          : 'Captura instantánea para el buzón de entrada (Inbox)'
      }
      maxWidth="lg"
    >
      {audioExtraction ? (
        <DharmaCoreConfirmation
          result={audioExtraction}
          onAcceptAll={handleAcceptAllTasks}
          onDiscard={() => setAudioExtraction(null)}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 select-none">
          {/* Selector de Tipo de Transmisión */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {typeTabs.map((tab) => {
              const isSelected = activeType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveType(tab.id)}
                  className={`
                    p-3 rounded-[18px] text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border
                    ${
                      isSelected
                        ? 'bg-[#177468] text-white border-[#177468] shadow-sm scale-[1.02]'
                        : 'bg-[#FAF8F5] text-[#697282] border-transparent hover:bg-[#F0ECE1]'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Título opcional */}
          <Input
            label="Etiqueta / Asunto (Opcional)"
            placeholder="Ej: Idea de proyecto, Lectura recomendada, Sensor 04..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 1. Modo TEXTO */}
          {activeType === 'texto' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#697282] uppercase tracking-[0.04em]">
                Mensaje o contenido de la transmisión *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe lo que tienes en mente sin preocuparte aún por ordenarlo..."
                rows={4}
                required
                autoFocus
                className="w-full px-4 py-3 rounded-[18px] bg-[#FAF8F5] border border-transparent focus:border-[#177468]/30 focus:bg-white text-sm text-[#24292F] outline-none transition-all resize-none shadow-2xs"
              />
            </div>
          )}

          {/* 2. Modo ENLACE */}
          {activeType === 'enlace' && (
            <div className="space-y-3">
              <Input
                label="URL o Enlace *"
                placeholder="https://ejemplo.com/recurso..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                autoFocus
                icon={<Link2 className="w-4 h-4 text-[#177468]" />}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#697282] uppercase tracking-[0.04em]">
                  Comentario o contexto del enlace
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="¿Por qué es relevante este recurso o enlace?"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-[16px] bg-[#FAF8F5] border border-transparent focus:border-[#177468]/30 focus:bg-white text-xs sm:text-sm text-[#24292F] outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* 3. Modo AUDIO (Captura Real FASE 9) */}
          {activeType === 'audio' && (
            <div className="p-3 sm:p-5 rounded-[22px] bg-gradient-to-br from-[#FAF5FF] via-white to-[#F5F2EB] border border-[#8B5CF6]/20 text-center">
              <AudioRecorder
                onProcessWithDharmaCore={handleProcessAudioWithCore}
                onDiscard={() => {
                  setRecordedAudioUrl(null);
                  setRecordedAudioDuration(0);
                }}
                isProcessing={isProcessingAudio}
              />
            </div>
          )}

        {/* 4. Modo IMAGEN */}
        {activeType === 'imagen' && (
          <div className="space-y-3">
            <Input
              label="Enlace a la Imagen *"
              placeholder="https://images.unsplash.com/... o URL directa de la imagen"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              autoFocus
              icon={<ImageIcon className="w-4 h-4 text-[#D97706]" />}
            />

            {url && (
              <div className="relative rounded-[16px] overflow-hidden aspect-[16/9] bg-[#FAF8F5] border border-black/[0.04]">
                <img src={url} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#697282] uppercase tracking-[0.04em]">
                Descripción o nota del esquema
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="¿Qué representa esta captura o imagen?"
                rows={2}
                className="w-full px-4 py-2.5 rounded-[16px] bg-[#FAF8F5] border border-transparent focus:border-[#177468]/30 focus:bg-white text-xs sm:text-sm text-[#24292F] outline-none transition-all resize-none"
              />
            </div>
          </div>
        )}

        {/* Botones de Envío */}
        <div className="flex items-center justify-between pt-3 border-t border-black/[0.05]">
          <div className="flex items-center gap-1.5 text-xs text-[#9DA6B5] font-mono">
            <Volume2 className="w-3.5 h-3.5 text-[#177468]" />
            <span>FRQ-108.4 MHz</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Transmitir a Dharma
            </Button>
          </div>
        </div>
      </form>
      )}
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  FileText, 
  Link2, 
  Mic, 
  Image as ImageIcon, 
  Radio, 
  Square, 
  Sparkles,
  Volume2
} from 'lucide-react';
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
  const [activeType, setActiveType] = useState<TransmissionType>('texto');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');

  // Estados de simulación de Audio
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);

  // Contador de grabación de audio simulado
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecordingAudio) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingAudio]);

  const handleToggleRecord = () => {
    if (isRecordingAudio) {
      setIsRecordingAudio(false);
      setHasRecordedAudio(true);
      if (!content.trim()) {
        setContent('Nota de voz grabada en canal local. Duración: 0:' + String(recordingSeconds).padStart(2, '0'));
      }
    } else {
      setRecordingSeconds(0);
      setHasRecordedAudio(false);
      setIsRecordingAudio(true);
    }
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setUrl('');
    setIsRecordingAudio(false);
    setRecordingSeconds(0);
    setHasRecordedAudio(false);
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
      url: url.trim() || undefined,
      durationSeconds: activeType === 'audio' ? (recordingSeconds > 0 ? recordingSeconds : 35) : undefined,
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
      title="NUEVA TRANSMISIÓN"
      subtitle="Captura instantánea para el buzón de entrada (Inbox)"
      maxWidth="lg"
    >
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

        {/* 3. Modo AUDIO (Interfaz preparada sin IA) */}
        {activeType === 'audio' && (
          <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#FAF5FF] via-white to-[#F5F2EB] border border-[#8B5CF6]/20 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#8B5CF6] uppercase tracking-wider">
              <Radio className="w-4 h-4 animate-pulse text-[#8B5CF6]" />
              <span>Canal de Frecuencia de Voz · Estación Receptora</span>
            </div>

            {/* Visualizador de Onda Sonora */}
            <div className="flex items-center justify-center gap-1.5 h-12 py-2">
              {[8, 18, 28, 12, 34, 22, 40, 16, 26, 38, 14, 30, 20, 10, 25, 32, 12].map(
                (h, idx) => (
                  <span
                    key={idx}
                    className={`
                      w-1.5 rounded-full transition-all duration-200
                      ${isRecordingAudio ? 'bg-[#8B5CF6] animate-pulse' : 'bg-[#8B5CF6]/25'}
                    `}
                    style={{
                      height: isRecordingAudio
                        ? `${Math.max(10, (h * ((idx % 3) + 1)) % 44)}px`
                        : `${h * 0.5}px`,
                    }}
                  />
                )
              )}
            </div>

            {/* Temporizador */}
            <div className="text-2xl font-mono font-bold text-[#24292F]">
              0:{String(recordingSeconds).padStart(2, '0')}
            </div>

            {/* Botón de Grabación / Stop */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`
                  px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95
                  ${
                    isRecordingAudio
                      ? 'bg-[#EB6B6B] text-white hover:bg-[#D9534F] ring-4 ring-[#EB6B6B]/20 animate-pulse'
                      : 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] ring-4 ring-[#8B5CF6]/15'
                  }
                `}
              >
                {isRecordingAudio ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span>Detener Grabación</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>{hasRecordedAudio ? 'Grabar de Nuevo' : 'Iniciar Grabación de Voz'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Nota de Arquitectura (IA en siguiente etapa) */}
            <div className="p-3 rounded-[14px] bg-white/80 border border-[#8B5CF6]/15 text-[11px] text-[#716E85] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span>
                <strong>Interfaz activa:</strong> La transmisión de voz quedará encolada como «Procesando» lista para el motor de transcripción por IA.
              </span>
            </div>
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
    </Modal>
  );
};

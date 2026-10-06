import React, { useState } from 'react';
import { 
  FileText, 
  Mic, 
  Link2, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle2, 
  RotateCw, 
  Archive, 
  MoreVertical, 
  CheckSquare, 
  BookMarked, 
  Trash2, 
  ArrowUpRight, 
  Play, 
  Pause,
  Radio,
  Sparkles
} from 'lucide-react';
import type { Transmission, TransmissionStatus, TransmissionType } from '../../types';
import { DropdownMenu } from '../ui/DropdownMenu';
import { useTaskContext } from '../../context/TaskContext';

export interface TransmissionCardProps {
  transmission: Transmission;
  onChangeStatus: (id: string, status: TransmissionStatus) => void;
  onDelete: (id: string) => void;
}

// Configuración de Estados de Procesamiento
export const TRANSMISSION_STATUS_CONFIG: Record<
  TransmissionStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  nueva: {
    label: 'Nueva',
    bg: 'bg-[#FEF6EC]',
    text: 'text-[#D48B38]',
    border: 'border-[#FCE1C2]',
    icon: <span className="w-2 h-2 rounded-full bg-[#D48B38] animate-pulse" />,
  },
  procesando: {
    label: 'Procesando',
    bg: 'bg-[#E8F4FD]',
    text: 'text-[#1E88E5]',
    border: 'border-[#BBDEFB]',
    icon: <RotateCw className="w-3 h-3 animate-spin stroke-[2.2]" />,
  },
  procesada: {
    label: 'Procesada',
    bg: 'bg-[#EAF5EA]',
    text: 'text-[#2E7D32]',
    border: 'border-[#CDE7CD]',
    icon: <CheckCircle2 className="w-3 h-3 stroke-[2.2]" />,
  },
  archivada: {
    label: 'Archivada',
    bg: 'bg-[#F0EFF4]',
    text: 'text-[#716E85]',
    border: 'border-[#DEDCE5]',
    icon: <Archive className="w-3 h-3 stroke-[2.2]" />,
  },
};

// Configuración de Tipos de Transmisión
export const TRANSMISSION_TYPE_CONFIG: Record<
  TransmissionType,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  texto: {
    label: 'Texto',
    bg: 'bg-[#FAF8F5]',
    text: 'text-[#697282]',
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  audio: {
    label: 'Audio',
    bg: 'bg-[#F3E8FF]',
    text: 'text-[#8B5CF6]',
    icon: <Mic className="w-3.5 h-3.5" />,
  },
  enlace: {
    label: 'Enlace',
    bg: 'bg-[#E8F6F4]',
    text: 'text-[#177468]',
    icon: <Link2 className="w-3.5 h-3.5" />,
  },
  imagen: {
    label: 'Imagen',
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#D97706]',
    icon: <ImageIcon className="w-3.5 h-3.5" />,
  },
};

export const TransmissionCard: React.FC<TransmissionCardProps> = ({
  transmission,
  onChangeStatus,
  onDelete,
}) => {
  const { addTask, addNote, openDharmaCore } = useTaskContext();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const statusCfg = TRANSMISSION_STATUS_CONFIG[transmission.status] || TRANSMISSION_STATUS_CONFIG.nueva;
  const typeCfg = TRANSMISSION_TYPE_CONFIG[transmission.type] || TRANSMISSION_TYPE_CONFIG.texto;

  // Formato relativo de tiempo
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMin = Math.round((Date.now() - date.getTime()) / (1000 * 60));
      if (diffMin < 1) return 'Hace un momento';
      if (diffMin < 60) return `Hace ${diffMin} min`;
      const diffHours = Math.round(diffMin / 60);
      if (diffHours < 24) return `Hace ${diffHours} h`;
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } catch {
      return 'Reciente';
    }
  };

  const handleConvertToTask = () => {
    addTask({
      title: transmission.title || transmission.content.slice(0, 50),
      description: transmission.content,
      categoryId: 'trabajo_personal',
      statusId: 'por_hacer',
      priority: 'media',
      origin: 'Transmisión',
    });
    onChangeStatus(transmission.id, 'procesada');
  };

  const handleConvertToNote = () => {
    addNote({
      title: transmission.title || 'Nota desde Transmisión',
      content: transmission.content,
      categoryId: 'personal',
      tags: ['Transmisión', transmission.type],
    });
    onChangeStatus(transmission.id, 'procesada');
  };

  const menuItems = [
    {
      id: 'dharma-core',
      label: 'Procesar con Dharma Core (IA)',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#177468]" />,
      onClick: () => openDharmaCore(transmission.content),
    },
    {
      id: 'convert-task',
      label: 'Convertir en Tarea',
      icon: <CheckSquare className="w-3.5 h-3.5 text-[#177468]" />,
      onClick: handleConvertToTask,
    },
    {
      id: 'convert-note',
      label: 'Convertir en Nota',
      icon: <BookMarked className="w-3.5 h-3.5 text-[#D48B38]" />,
      onClick: handleConvertToNote,
    },
    {
      id: 'status-nueva',
      label: 'Marcar: Nueva',
      icon: <Radio className="w-3.5 h-3.5 text-[#D48B38]" />,
      onClick: () => onChangeStatus(transmission.id, 'nueva'),
    },
    {
      id: 'status-proc',
      label: 'Marcar: Procesando',
      icon: <RotateCw className="w-3.5 h-3.5 text-[#1E88E5]" />,
      onClick: () => onChangeStatus(transmission.id, 'procesando'),
    },
    {
      id: 'status-done',
      label: 'Marcar: Procesada',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />,
      onClick: () => onChangeStatus(transmission.id, 'procesada'),
    },
    {
      id: 'status-arch',
      label: 'Marcar: Archivada',
      icon: <Archive className="w-3.5 h-3.5 text-[#716E85]" />,
      onClick: () => onChangeStatus(transmission.id, 'archivada'),
    },
    {
      id: 'delete',
      label: 'Eliminar transmisión',
      icon: <Trash2 className="w-3.5 h-3.5 text-[#EB6B6B]" />,
      destructive: true,
      onClick: () => {
        if (window.confirm('¿Deseas descartar esta transmisión?')) {
          onDelete(transmission.id);
        }
      },
    },
  ];

  return (
    <div className="group rounded-[22px] bg-white border border-black/[0.04] p-4 sm:p-5 shadow-[0_2px_12px_rgba(36,41,47,0.02)] hover:shadow-[0_10px_26px_rgba(36,41,47,0.06)] hover:-translate-y-0.5 transition-all select-none flex flex-col justify-between space-y-4">
      {/* 
        =========================================================
        1. CABECERA TELEMÉTRICA DE LA SEÑAL (Estación de Comunicaciones Pastel)
        =========================================================
      */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Tipo de Transmisión */}
          <span
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
              ${typeCfg.bg} ${typeCfg.text} border border-black/[0.03]
            `}
          >
            {typeCfg.icon}
            <span>{typeCfg.label}</span>
          </span>

          {/* Código de Frecuencia Telemetría */}
          {transmission.frequencyCode && (
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#9DA6B5] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-black/[0.02]">
              {transmission.frequencyCode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Estado de Procesamiento */}
          <span
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs
              ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}
            `}
          >
            {statusCfg.icon}
            <span>{statusCfg.label}</span>
          </span>

          {/* Menú de Opciones */}
          <DropdownMenu
            trigger={
              <button
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9DA6B5] hover:text-[#24292F] hover:bg-[#FAF8F5] transition-colors"
                aria-label="Opciones de transmisión"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            }
            items={menuItems}
          />
        </div>
      </div>

      {/* 
        =========================================================
        2. CONTENIDO PRINCIPAL SEGÚN EL TIPO DE TRANSMISIÓN
        =========================================================
      */}
      <div className="space-y-2.5 flex-1">
        {/* Título (si existe) */}
        {transmission.title && (
          <h4 className="text-sm sm:text-base font-bold text-[#24292F] leading-snug">
            {transmission.title}
          </h4>
        )}

        {/* Contenido en texto */}
        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed whitespace-pre-line">
          {transmission.content}
        </p>

        {/* Vista específica: Enlace */}
        {transmission.type === 'enlace' && transmission.url && (
          <div className="p-3 rounded-[16px] bg-[#FAF8F5] border border-black/[0.03] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Link2 className="w-4 h-4 text-[#177468] shrink-0" />
              <span className="text-xs font-mono font-medium text-[#177468] truncate">
                {transmission.url}
              </span>
            </div>
            <a
              href={transmission.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-[11px] font-bold text-[#177468] hover:bg-[#E8F6F4] border border-black/[0.04] transition-colors shrink-0"
            >
              <span>Abrir</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </a>
          </div>
        )}

        {/* Vista específica: Audio (Interfaz de Reproducción / Onda Sonora) */}
        {transmission.type === 'audio' && (
          <div className="p-3.5 rounded-[18px] bg-gradient-to-r from-[#F9F5FF] via-[#FAF8F5] to-[#F9F5FF] border border-[#8B5CF6]/15 space-y-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-8 h-8 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                title={isPlayingAudio ? 'Pausar nota de voz' : 'Escuchar audio'}
              >
                {isPlayingAudio ? (
                  <Pause className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                )}
              </button>

              {/* Onda Sonora Simulada */}
              <div className="flex-1 flex items-center gap-1 h-6">
                {[12, 24, 16, 28, 8, 20, 32, 18, 26, 14, 30, 22, 10, 25, 18, 28, 14].map(
                  (h, idx) => (
                    <span
                      key={idx}
                      className={`
                        w-1 rounded-full transition-all duration-300
                        ${
                          isPlayingAudio
                            ? 'bg-[#8B5CF6] animate-pulse'
                            : 'bg-[#8B5CF6]/30'
                        }
                      `}
                      style={{
                        height: isPlayingAudio ? `${Math.max(6, (h * (idx % 2 + 1)) % 26)}px` : `${h * 0.7}px`,
                      }}
                    />
                  )
                )}
              </div>

              <span className="text-xs font-mono font-bold text-[#8B5CF6]">
                {transmission.durationSeconds ? `0:${transmission.durationSeconds}` : '0:42'}
              </span>
            </div>

            <p className="text-[10px] text-[#716E85] font-medium italic">
              Audio capturado · Transcripción y análisis por IA disponible en siguiente fase
            </p>
          </div>
        )}

        {/* Vista específica: Imagen */}
        {transmission.type === 'imagen' && transmission.url && (
          <div className="relative rounded-[16px] overflow-hidden bg-[#FAF8F5] aspect-[16/9] border border-black/[0.04]">
            <img
              src={transmission.url}
              alt={transmission.title || 'Imagen capturada'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* 
        =========================================================
        3. PIE DE LA TARJETA: Fecha, Indicador de Señal y Acciones Rápidas
        =========================================================
      */}
      <div className="pt-3 border-t border-black/[0.03] flex items-center justify-between text-xs text-[#9DA6B5]">
        {/* Fecha y Frecuencia */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 opacity-60" />
          <span>{formatTime(transmission.createdAt)}</span>
          {transmission.signalStrength && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#177468] bg-[#E8F6F4] px-1.5 py-0.2 rounded-md">
              📶 {transmission.signalStrength}%
            </span>
          )}
        </div>

        {/* Acciones Rápidas directas */}
        <div className="flex items-center gap-1.5">
          {transmission.status !== 'procesada' && (
            <>
              <button
                type="button"
                onClick={() => openDharmaCore(transmission.content)}
                className="px-2 py-1 rounded-lg bg-[#E8F6F4] hover:bg-[#D5EFEA] text-[#177468] font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 border border-[#177468]/15"
                title="Extraer tareas automáticamente con Dharma Core (Gemini)"
              >
                <Sparkles className="w-3 h-3 stroke-[2.5]" />
                <span className="hidden sm:inline">Dharma Core</span>
              </button>

              <button
                type="button"
                onClick={handleConvertToTask}
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E8F6F4] text-[#177468] font-bold text-[11px] transition-colors cursor-pointer border border-black/[0.03]"
                title="Convertir rápidamente en tarea de Dharma"
              >
                A Tarea
              </button>
            </>
          )}

          {transmission.status !== 'archivada' && (
            <button
              type="button"
              onClick={() => onChangeStatus(transmission.id, 'archivada')}
              className="px-2 py-1 rounded-lg text-[#9DA6B5] hover:text-[#716E85] hover:bg-[#FAF8F5] transition-colors cursor-pointer text-[11px]"
              title="Archivar transmisión"
            >
              Archivar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

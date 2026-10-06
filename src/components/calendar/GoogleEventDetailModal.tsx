import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  ExternalLink, 
  Lock, 
  Info
} from 'lucide-react';
import type { CalendarActivity } from '../../types';

export interface GoogleEventDetailModalProps {
  activity: CalendarActivity | null;
  onClose: () => void;
}

export const GoogleEventDetailModal: React.FC<GoogleEventDetailModalProps> = ({
  activity,
  onClose,
}) => {
  if (!activity) return null;

  return (
    <Modal
      isOpen={!!activity}
      onClose={onClose}
      title="DETALLE DE EVENTO"
      subtitle="Evento sincronizado desde Google Calendar"
      maxWidth="md"
    >
      <div className="space-y-5 select-none">
        {/* Cabecera con Badge de Solo Lectura */}
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-[20px] bg-[#E8F0FE] border border-[#4285F4]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#1A73E8] uppercase block">
                GOOGLE CALENDAR
              </span>
              <span className="text-xs font-bold text-[#1F1F1F]">
                Sincronización Externa Activa
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#5F6368] shadow-2xs border border-black/[0.04]">
            <Lock className="w-3 h-3 text-[#5F6368]" />
            <span>Solo lectura</span>
          </span>
        </div>

        {/* Título y Horario */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-extrabold text-[#24292F] leading-tight">
            {activity.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#697282] font-semibold">
            <span className="inline-flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1 rounded-full border border-black/[0.03]">
              <CalendarIcon className="w-3.5 h-3.5 text-[#177468]" />
              <span>{activity.date}</span>
            </span>

            {activity.time && (
              <span className="inline-flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1 rounded-full border border-black/[0.03]">
                <Clock className="w-3.5 h-3.5 text-[#177468]" />
                <span>{activity.time}</span>
              </span>
            )}
          </div>
        </div>

        {/* Ubicación y Meet */}
        {(activity.location || activity.googleMeetLink) && (
          <div className="space-y-2 pt-2 border-t border-black/[0.04]">
            {activity.location && (
              <div className="flex items-center gap-2 text-xs text-[#4A5568]">
                <MapPin className="w-4 h-4 text-[#EA4335] shrink-0" />
                <span className="font-medium">{activity.location}</span>
              </div>
            )}

            {activity.googleMeetLink && (
              <div className="p-3 rounded-[16px] bg-[#E8F0FE]/60 border border-[#4285F4]/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Video className="w-4 h-4 text-[#1A73E8] shrink-0" />
                  <span className="text-xs font-bold text-[#1A73E8] truncate">
                    Videollamada de Google Meet
                  </span>
                </div>
                <a
                  href={activity.googleMeetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#1A73E8] hover:bg-[#1557B0] text-white transition-colors shrink-0 shadow-xs"
                >
                  Unirse
                </a>
              </div>
            )}
          </div>
        )}

        {/* Descripción */}
        {activity.description && (
          <div className="space-y-1 pt-2 border-t border-black/[0.04]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9DA6B5]">
              Descripción / Notas
            </span>
            <p className="text-xs text-[#4A5568] leading-relaxed bg-[#FAF8F5] p-3 rounded-[14px] whitespace-pre-wrap">
              {activity.description}
            </p>
          </div>
        )}

        {/* Aviso de Arquitectura Solo Lectura */}
        <div className="p-3.5 rounded-[16px] bg-[#FAF8F5] border border-black/[0.04] text-[11px] text-[#697282] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#177468] shrink-0 mt-0.5" />
          <span>
            <strong>Primera versión (Solo lectura):</strong> Este evento no se puede modificar directamente desde DHARMA para evitar alteraciones no deseadas en tu cuenta de Google. La edición y eliminación externa estará disponible en las siguientes fases.
          </span>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-between pt-3 border-t border-black/[0.05]">
          {activity.googleHtmlLink ? (
            <a
              href={activity.googleHtmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A73E8] hover:underline"
            >
              <span>Abrir en Google Calendar</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div />
          )}

          <Button variant="ghost" size="md" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  Lock, 
  MapPin, 
  Video, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { GoogleCalendarEvent } from '../../types';

export interface GoogleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent?: (event: GoogleCalendarEvent) => void;
}

export const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  isOpen,
  onClose,
  onSelectEvent,
}) => {
  const {
    googleSyncStatus,
    googleUser,
    googleEvents,
    lastGoogleSync,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    syncGoogleCalendar,
  } = useTaskContext();

  const isConnected = googleSyncStatus === 'connected';
  const isSyncing = googleSyncStatus === 'syncing' || googleSyncStatus === 'connecting';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CONEXIÓN GOOGLE CALENDAR"
      subtitle="Sincronización de eventos externos en DHARMA"
      maxWidth="lg"
    >
      <div className="space-y-6 select-none">
        {/* 
          ======================================================================
          1. TARJETA PRINCIPAL DE ESTADO GOOGLE OAUTH
          ======================================================================
        */}
        <div className={`p-5 rounded-[24px] border transition-all ${
          isConnected 
            ? 'bg-gradient-to-br from-[#E8F0FE]/90 via-white to-[#F8F9FA] border-[#4285F4]/20 shadow-xs' 
            : 'bg-[#FAF8F5] border-black/[0.04]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Logo Google estilizado */}
              <div className="w-12 h-12 rounded-[18px] bg-white flex items-center justify-center shadow-xs border border-black/[0.04] shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#1A73E8] uppercase">
                    GOOGLE OAUTH 2.0
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isConnected 
                      ? 'bg-[#E6F4EA] text-[#137333]' 
                      : 'bg-black/[0.04] text-[#697282]'
                  }`}>
                    {isConnected ? (
                      <>
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Conectado</span>
                      </>
                    ) : (
                      'Desconectado'
                    )}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#24292F] mt-0.5">
                  {isConnected && googleUser ? googleUser.name || googleUser.email : 'Google Calendar'}
                </h3>

                <p className="text-xs text-[#697282]">
                  {isConnected && googleUser ? (
                    <span>
                      {googleUser.email} {lastGoogleSync ? `· Sincronizado: ${lastGoogleSync}` : ''}
                    </span>
                  ) : (
                    'Conecta tu cuenta para sincronizar reuniones y citas en tiempo real'
                  )}
                </p>
              </div>
            </div>

            {/* Acciones de conexión */}
            <div className="flex items-center gap-2 shrink-0">
              {isConnected ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => syncGoogleCalendar()}
                    disabled={isSyncing}
                    icon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
                  >
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => disconnectGoogleCalendar()}
                    icon={<LogOut className="w-3.5 h-3.5 text-[#EB6B6B]" />}
                    className="text-[#697282] hover:text-[#EB6B6B]"
                    title="Desconectar cuenta"
                  >
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => connectGoogleCalendar()}
                  disabled={isSyncing}
                  icon={
                    isSyncing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    )
                  }
                  className="bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-sm"
                >
                  {isSyncing ? 'Conectando...' : 'Conectar con Google'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 
          ======================================================================
          2. PROTOCOLO FASE 10: PRIMERA VERSIÓN SOLO LECTURA
          ======================================================================
        */}
        <div className="p-4 rounded-[22px] bg-[#FAF8F5] border border-black/[0.03] space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white text-[#177468] shadow-2xs">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-[#24292F] tracking-wide uppercase">
              Protocolo de Seguridad: Solo Lectura
            </span>
          </div>

          <p className="text-xs text-[#697282] leading-relaxed">
            Los eventos de Google Calendar se muestran integrados en las vistas <strong>Mes, Semana, Agenda</strong> y en el <strong>Dashboard</strong>. En esta primera versión, DHARMA <strong>no modifica ni elimina eventos externos</strong> en tu cuenta.
          </p>

          <div className="pt-2 border-t border-black/[0.03] flex items-center gap-2 text-[11px] text-[#177468] font-semibold">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>
              Arquitectura lista: La API interna ya cuenta con los métodos para crear, editar y eliminar eventos en las siguientes fases.
            </span>
          </div>
        </div>

        {/* 
          ======================================================================
          3. LISTA DE EVENTOS SINCRONIZADOS
          ======================================================================
        */}
        {isConnected && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-[0.04em] text-[#697282]">
                Eventos Detectados en tu Calendario ({googleEvents.length})
              </span>
              <span className="text-[11px] text-[#9DA6B5]">
                Pulsa en un evento para ver detalles
              </span>
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {googleEvents.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#9DA6B5] bg-[#FAF8F5] rounded-[18px]">
                  No se encontraron eventos próximos en tu calendario de Google.
                </div>
              ) : (
                googleEvents.map((evt) => {
                  const dateStr = evt.start.date || evt.start.dateTime?.slice(0, 10) || 'Sin fecha';
                  const timeStr = evt.start.dateTime
                    ? new Date(evt.start.dateTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Todo el día';

                  return (
                    <div
                      key={evt.id}
                      onClick={() => {
                        if (onSelectEvent) onSelectEvent(evt);
                      }}
                      className="p-3.5 rounded-[18px] bg-white border border-black/[0.04] shadow-2xs hover:shadow-xs hover:border-[#4285F4]/30 transition-all cursor-pointer flex items-start justify-between gap-3 group"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full">
                            Google Calendar
                          </span>
                          <span className="text-[10px] text-[#697282] font-semibold flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {timeStr}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-[#24292F] truncate group-hover:text-[#1A73E8] transition-colors">
                          {evt.summary}
                        </h4>

                        <div className="flex items-center gap-3 text-[11px] text-[#9DA6B5]">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{dateStr}</span>
                          </span>

                          {evt.location && (
                            <span className="flex items-center gap-1 truncate max-w-[140px]">
                              <MapPin className="w-3 h-3 text-[#EA4335]" />
                              <span>{evt.location}</span>
                            </span>
                          )}

                          {evt.hangoutLink && (
                            <span className="flex items-center gap-1 text-[#1A73E8]">
                              <Video className="w-3 h-3" />
                              <span>Meet</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-[#9DA6B5] group-hover:text-[#1A73E8] transition-colors shrink-0 pt-1">
                        Ver ↗
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Botón de Cierre */}
        <div className="flex justify-end pt-2 border-t border-black/[0.04]">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

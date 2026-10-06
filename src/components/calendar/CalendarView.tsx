import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Lock
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { Task, AgendaEvent } from '../../types';
import { MONTH_NAMES_ES, getTodayISO, getWeekDays } from '../../utils/dateUtils';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { AgendaView } from './AgendaView';
import { SideAgendaPanel } from './SideAgendaPanel';
import { EventFormModal } from './EventFormModal';
import { GoogleCalendarModal } from './GoogleCalendarModal';
import { GoogleEventDetailModal } from './GoogleEventDetailModal';
import { googleCalendarService } from '../../services/googleCalendarService';
import { Button } from '../ui/Button';

export interface CalendarViewProps {
  onEditTask?: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onEditTask }) => {
  const {
    tasks,
    agendaEvents,
    calendarActivities,
    calendarViewMode,
    setCalendarViewMode,
    selectedCalendarDate,
    setSelectedCalendarDate,
    categories,
    googleSyncStatus,
    googleEvents,
    isGoogleCalendarModalOpen,
    openGoogleCalendarModal,
    closeGoogleCalendarModal,
    selectedGoogleEvent,
    setSelectedGoogleEvent,
  } = useTaskContext();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [targetDateForNew, setTargetDateForNew] = useState<string>(selectedCalendarDate);

  // Responsive device default: móvil -> agenda, tablet -> semana, desktop -> mes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        // Solo ajustar automáticamente si el usuario no ha forzado un cambio explícito en la sesión
        const width = window.innerWidth;
        if (width < 768) {
          // Móvil
        } else if (width < 1024) {
          // Tablet
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Navegación de periodos (Mes, Semana)
  const handlePrevPeriod = () => {
    if (calendarViewMode === 'mes') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (calendarViewMode === 'semana') {
      setCurrentDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() - 7);
        return next;
      });
    } else {
      // Agenda: desplazar fecha seleccionada 1 día hacia atrás
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 1);
      setCurrentDate(prev);
    }
  };

  const handleNextPeriod = () => {
    if (calendarViewMode === 'mes') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (calendarViewMode === 'semana') {
      setCurrentDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() + 7);
        return next;
      });
    } else {
      // Agenda: desplazar fecha seleccionada 1 día hacia adelante
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 1);
      setCurrentDate(next);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedCalendarDate(getTodayISO());
  };

  const handleOpenCreateEvent = (date?: string) => {
    setEditingEvent(null);
    setTargetDateForNew(date || selectedCalendarDate || getTodayISO());
    setIsEventModalOpen(true);
  };

  const handleEditEventById = (eventId: string) => {
    const found = agendaEvents.find((e) => e.id === eventId);
    if (found) {
      setEditingEvent(found);
      setIsEventModalOpen(true);
    }
  };

  const handleEditTaskById = (taskId: string) => {
    if (onEditTask) {
      const found = tasks.find((t) => t.id === taskId);
      if (found) {
        onEditTask(found);
      }
    }
  };

  // Título del periodo activo
  const periodTitle = React.useMemo(() => {
    if (calendarViewMode === 'mes') {
      return `${MONTH_NAMES_ES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (calendarViewMode === 'semana') {
      const weekDays = getWeekDays(currentDate);
      const first = weekDays[0];
      const last = weekDays[6];
      return `${first.dayNumber} - ${last.dayNumber} de ${MONTH_NAMES_ES[last.date.getMonth()]}, ${last.date.getFullYear()}`;
    }
    return `Agenda de Actividades`;
  }, [calendarViewMode, currentDate]);

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Aviso de Modo Local (Sin conectar Google Calendar todavía) */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-[22px] bg-[#FEF6E9]/60 border border-[#FEF6E9]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[12px] bg-[#FEF6E9] flex items-center justify-center text-[#8E5B18] shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#8E5B18]">
              CALENDARIO LOCAL · FASE 4 OPERATIVA
            </p>
            <p className="text-[11px] text-[#8E5B18]/85 mt-0.5">
              Visualización unificada de tareas con fecha/hora, eventos y recordatorios locales. Google Calendar se sincronizará en fases posteriores.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white text-[#8E5B18] shadow-2xs">
          DATOS LOCALES
        </span>
      </div>

      {/* 2. Barra de Control y Navegación del Calendario */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Lado izquierdo: Navegación de periodo (Hoy, <, >, Título) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleGoToday}
            className="px-3.5 py-2 rounded-[16px] bg-white hover:bg-[#F5F2EB] text-xs font-bold text-[#24292F] shadow-2xs transition-colors cursor-pointer"
          >
            Hoy
          </button>

          <div className="flex items-center bg-white rounded-[16px] p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevPeriod}
              className="p-1.5 text-[#697282] hover:text-[#24292F] hover:bg-[#F5F2EB] rounded-[12px] transition-colors cursor-pointer"
              title="Periodo anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextPeriod}
              className="p-1.5 text-[#697282] hover:text-[#24292F] hover:bg-[#F5F2EB] rounded-[12px] transition-colors cursor-pointer"
              title="Periodo siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-extrabold text-[#24292F] tracking-wide ml-1">
            {periodTitle}
          </h2>
        </div>

        {/* Lado derecho: Selector de Vistas [Mes | Semana | Agenda] + Botón Añadir */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Toggle de Vistas */}
          <div className="bg-[#F5F2EB]/80 p-1 rounded-[18px] flex items-center">
            <button
              type="button"
              onClick={() => setCalendarViewMode('mes')}
              className={`px-3 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                calendarViewMode === 'mes'
                  ? 'bg-white text-[#24292F] shadow-xs'
                  : 'text-[#697282] hover:text-[#24292F]'
              }`}
            >
              Mes
            </button>

            <button
              type="button"
              onClick={() => setCalendarViewMode('semana')}
              className={`px-3 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                calendarViewMode === 'semana'
                  ? 'bg-white text-[#24292F] shadow-xs'
                  : 'text-[#697282] hover:text-[#24292F]'
              }`}
            >
              Semana
            </button>

            <button
              type="button"
              onClick={() => setCalendarViewMode('agenda')}
              className={`px-3 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                calendarViewMode === 'agenda'
                  ? 'bg-white text-[#24292F] shadow-xs'
                  : 'text-[#697282] hover:text-[#24292F]'
              }`}
            >
              Agenda
            </button>
          </div>

          {/* Botón Google Calendar (FASE 10) */}
          <button
            type="button"
            onClick={openGoogleCalendarModal}
            title={
              googleSyncStatus === 'connected'
                ? `Google Calendar conectado (${googleEvents.length} eventos sincronizados)`
                : 'Conectar con Google Calendar'
            }
            className={`px-3 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
              googleSyncStatus === 'connected'
                ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#4285F4]/30 hover:bg-[#D2E3FC]'
                : 'bg-white text-[#5F6368] border-black/[0.04] hover:bg-[#FAF8F5]'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span className="hidden sm:inline">
              {googleSyncStatus === 'connected' ? `Google (${googleEvents.length})` : 'Google Calendar'}
            </span>
          </button>

          {/* Botón Añadir */}
          <Button
            variant="primary"
            size="md"
            onClick={() => handleOpenCreateEvent(selectedCalendarDate)}
            icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            Nuevo Evento
          </Button>
        </div>
      </div>

      {/* 3. VISTAS DEL CALENDARIO SEGÚN MODO ACTIVO Y DISPOSITIVO */}
      {calendarViewMode === 'mes' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Cuadrícula Mensual Orgánica (Tablet/Desktop: 7-8 columnas | Móvil: ancho completo) */}
          <div className="md:col-span-7 desktop:col-span-8 space-y-4">
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedCalendarDate}
              activities={calendarActivities}
              onSelectDate={(iso) => setSelectedCalendarDate(iso)}
              onEditTask={handleEditTaskById}
              onEditEvent={handleEditEventById}
            />

            {/* En pantallas móviles (<768px), mostrar las actividades del día seleccionado debajo */}
            <div className="md:hidden mt-6 pt-4 border-t border-black/[0.04]">
              <SideAgendaPanel
                selectedDate={selectedCalendarDate}
                activities={calendarActivities}
                onOpenCreateEvent={handleOpenCreateEvent}
                onEditTask={handleEditTaskById}
                onEditEvent={handleEditEventById}
              />
            </div>
          </div>

          {/* Panel Lateral de Agenda en Tablet & Desktop (Cuando exista espacio horizontal) */}
          <div className="hidden md:block md:col-span-5 desktop:col-span-4 sticky top-6">
            <SideAgendaPanel
              selectedDate={selectedCalendarDate}
              activities={calendarActivities}
              onOpenCreateEvent={handleOpenCreateEvent}
              onEditTask={handleEditTaskById}
              onEditEvent={handleEditEventById}
            />
          </div>
        </div>
      )}

      {calendarViewMode === 'semana' && (
        <div>
          <WeekView
            currentDate={currentDate}
            selectedDate={selectedCalendarDate}
            activities={calendarActivities}
            onSelectDate={(iso) => setSelectedCalendarDate(iso)}
            onOpenCreateEvent={handleOpenCreateEvent}
            onEditTask={handleEditTaskById}
            onEditEvent={handleEditEventById}
          />
        </div>
      )}

      {calendarViewMode === 'agenda' && (
        <div>
          <AgendaView
            activities={calendarActivities}
            onOpenCreateEvent={handleOpenCreateEvent}
            onEditTask={handleEditTaskById}
            onEditEvent={handleEditEventById}
          />
        </div>
      )}

      {/* 4. Modal para Crear / Editar Eventos y Recordatorios */}
      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        initialDate={targetDateForNew}
        initialEvent={editingEvent}
      />

      {/* 5. Modales de Google Calendar (FASE 10) */}
      <GoogleCalendarModal
        isOpen={isGoogleCalendarModalOpen}
        onClose={closeGoogleCalendarModal}
        onSelectEvent={(gEvt) => setSelectedGoogleEvent(gEvt)}
      />

      <GoogleEventDetailModal
        activity={
          selectedGoogleEvent
            ? googleCalendarService.convertGoogleEventToCalendarActivity(selectedGoogleEvent, categories)
            : null
        }
        onClose={() => setSelectedGoogleEvent(null)}
      />
    </div>
  );
};

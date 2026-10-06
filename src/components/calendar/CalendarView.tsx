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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cuadrícula Mensual Orgánica (Desktop: 7-8 columnas | Móvil/Tablet: ancho completo) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedCalendarDate}
              activities={calendarActivities}
              onSelectDate={(iso) => setSelectedCalendarDate(iso)}
              onEditTask={handleEditTaskById}
              onEditEvent={handleEditEventById}
            />

            {/* En pantallas móviles y tablets, mostrar las actividades del día seleccionado debajo */}
            <div className="lg:hidden mt-6 pt-4 border-t border-black/[0.04]">
              <SideAgendaPanel
                selectedDate={selectedCalendarDate}
                activities={calendarActivities}
                onOpenCreateEvent={handleOpenCreateEvent}
                onEditTask={handleEditTaskById}
                onEditEvent={handleEditEventById}
              />
            </div>
          </div>

          {/* Panel Lateral de Agenda en Desktop (Requerimiento: "En desktop: Mes + panel lateral de agenda") */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-6">
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
    </div>
  );
};

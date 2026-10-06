import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { CalendarActivity } from '../../types';
import { formatFriendlyDate, getTodayISO } from '../../utils/dateUtils';
import { ActivityCard } from './ActivityCard';
import { Button } from '../ui/Button';

export interface SideAgendaPanelProps {
  selectedDate: string; // ISO YYYY-MM-DD
  activities: CalendarActivity[];
  onOpenCreateEvent?: (date?: string) => void;
  onEditTask?: (taskId: string) => void;
  onEditEvent?: (eventId: string) => void;
}

export const SideAgendaPanel: React.FC<SideAgendaPanelProps> = ({
  selectedDate,
  activities,
  onOpenCreateEvent,
  onEditTask,
  onEditEvent,
}) => {
  const todayISO = getTodayISO();
  const isToday = selectedDate === todayISO;

  // Actividades del día seleccionado
  const dayActivities = React.useMemo(() => {
    return activities.filter((act) => act.date === selectedDate);
  }, [activities, selectedDate]);

  // Actividades próximas (posteriores al día seleccionado) para dar contexto continuo
  const upcomingActivities = React.useMemo(() => {
    return activities
      .filter((act) => act.date > selectedDate)
      .slice(0, 3);
  }, [activities, selectedDate]);

  return (
    <div className="flex flex-col space-y-5 bg-white/80 p-4 sm:p-5 rounded-[28px] border border-black/[0.04] shadow-[0_2px_14px_rgba(23,23,23,0.02)] select-none h-full">
      {/* 1. Encabezado del Panel */}
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-dharma uppercase text-[#8C8578]">
            <CalendarIcon className="w-3.5 h-3.5 text-[#171717]" />
            <span>Agenda del Día</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="text-base sm:text-lg font-bold font-serif-display text-[#171717]">
              {formatFriendlyDate(selectedDate)}
            </h3>
            {isToday && (
              <span className="text-[10px] font-extrabold tracking-dharma px-2.5 py-0.5 rounded-full bg-[#FFD84D] text-[#171717] shadow-2xs">
                HOY
              </span>
            )}
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8F4E8] text-[#171717] border border-black/[0.04] shadow-2xs">
          {dayActivities.length} {dayActivities.length === 1 ? 'ítem' : 'ítems'}
        </span>
      </div>

      {/* 2. Lista de Actividades del Día Seleccionado */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-0.5 scrollbar-none">
        {dayActivities.length === 0 ? (
          <div className="p-6 rounded-[22px] bg-white text-center space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#E8F6F4] flex items-center justify-center mx-auto text-[#177468]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#24292F]">
                Día despejado
              </p>
              <p className="text-[11px] text-[#697282] mt-0.5">
                No tienes eventos ni tareas con horario fijado para esta fecha.
              </p>
            </div>
            {onOpenCreateEvent && (
              <Button
                variant="pastel"
                pastelColor="teal"
                size="sm"
                onClick={() => onOpenCreateEvent(selectedDate)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Añadir al día
              </Button>
            )}
          </div>
        ) : (
          dayActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onEditTask={onEditTask}
              onEditEvent={onEditEvent}
            />
          ))
        )}
      </div>

      {/* 3. Próximas actividades horizonte (si hay pocas actividades hoy) */}
      {upcomingActivities.length > 0 && dayActivities.length <= 2 && (
        <div className="pt-3 border-t border-black/[0.04] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#697282] uppercase tracking-wider px-1">
            <span>En los próximos días</span>
            <Clock className="w-3.5 h-3.5 text-[#9DA6B5]" />
          </div>

          <div className="space-y-2">
            {upcomingActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => {
                  if (act.type === 'tarea' && act.taskId && onEditTask) {
                    onEditTask(act.taskId);
                  } else if (act.eventId && onEditEvent) {
                    onEditEvent(act.eventId);
                  }
                }}
                className="p-3 rounded-[18px] bg-white shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#24292F] truncate">
                    {act.title}
                  </p>
                  <p className="text-[10px] text-[#9DA6B5] mt-0.5 font-medium">
                    {formatFriendlyDate(act.date)} {act.time ? `· ${act.time}` : ''}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9DA6B5] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Botón inferior de captura para la fecha seleccionada */}
      {onOpenCreateEvent && (
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onOpenCreateEvent(selectedDate)}
          icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        >
          Añadir Actividad
        </Button>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Bell, 
  Plus
} from 'lucide-react';
import type { CalendarActivity, ActivityType } from '../../types';
import { formatFriendlyDate, getTodayISO } from '../../utils/dateUtils';
import { ActivityCard } from './ActivityCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

export interface AgendaViewProps {
  activities: CalendarActivity[];
  onOpenCreateEvent?: (date?: string) => void;
  onEditTask?: (taskId: string) => void;
  onEditEvent?: (eventId: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  activities,
  onOpenCreateEvent,
  onEditTask,
  onEditEvent,
}) => {
  const [filterType, setFilterType] = useState<ActivityType | 'todas'>('todas');
  const todayISO = getTodayISO();

  // Filtrar actividades por tipo
  const filteredActivities = React.useMemo(() => {
    if (filterType === 'todas') return activities;
    return activities.filter((act) => act.type === filterType);
  }, [activities, filterType]);

  // Agrupar actividades por fecha (YYYY-MM-DD)
  const groupedActivities = React.useMemo(() => {
    const groups: { date: string; friendlyTitle: string; isToday: boolean; items: CalendarActivity[] }[] = [];
    const dateMap = new Map<string, CalendarActivity[]>();

    filteredActivities.forEach((act) => {
      const list = dateMap.get(act.date) || [];
      list.push(act);
      dateMap.set(act.date, list);
    });

    // Ordenar fechas cronológicamente
    const sortedDates = Array.from(dateMap.keys()).sort();

    sortedDates.forEach((dateStr) => {
      groups.push({
        date: dateStr,
        friendlyTitle: formatFriendlyDate(dateStr),
        isToday: dateStr === todayISO,
        items: dateMap.get(dateStr) || [],
      });
    });

    return groups;
  }, [filteredActivities, todayISO]);

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* 1. Filtros de tipo de actividad (Pastillas suaves) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[26px] border border-black/[0.04] shadow-[0_2px_12px_rgba(23,23,23,0.02)]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterType('todas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === 'todas'
                ? 'bg-[#171717] text-white shadow-2xs'
                : 'bg-[#F8F4E8] text-[#8C8578] hover:text-[#171717]'
            }`}
          >
            Todas ({activities.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('evento')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterType === 'evento'
                ? 'bg-[#171717] text-white shadow-2xs'
                : 'bg-[#F8F4E8] text-[#8C8578] hover:text-[#171717]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Eventos</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('tarea')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterType === 'tarea'
                ? 'bg-[#171717] text-white shadow-2xs'
                : 'bg-[#F8F4E8] text-[#8C8578] hover:text-[#171717]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tareas</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('recordatorio')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterType === 'recordatorio'
                ? 'bg-[#171717] text-white shadow-2xs'
                : 'bg-[#F8F4E8] text-[#8C8578] hover:text-[#171717]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Recordatorios</span>
          </button>
        </div>

        {onOpenCreateEvent && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenCreateEvent()}
            icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
          >
            Añadir Actividad
          </Button>
        )}
      </div>

      {/* 2. Lista cronológica agrupada por fecha */}
      {groupedActivities.length === 0 ? (
        <EmptyState
          title="Sin actividades registradas"
          description="No se encontraron eventos, tareas o recordatorios para este periodo. Puedes programar una nueva actividad con el botón superior."
          mood="calm"
          actionLabel="Añadir Nueva Actividad"
          onAction={() => onOpenCreateEvent?.()}
        />
      ) : (
        <div className="space-y-6">
          {groupedActivities.map((group) => (
            <div key={group.date} className="space-y-3">
              {/* Encabezado del grupo de fecha */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      group.isToday ? 'bg-[#171717] ring-4 ring-[#FFD84D]/40' : 'bg-[#8C8578]/50'
                    }`}
                  />
                  <h3 className="text-base sm:text-lg font-bold font-serif-display text-[#171717] tracking-tight">
                    {group.friendlyTitle}
                  </h3>
                  {group.isToday && (
                    <span className="text-[10px] font-extrabold tracking-dharma px-2.5 py-0.5 rounded-full bg-[#FFD84D] text-[#171717] shadow-2xs">
                      HOY
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-[#8C8578]">
                  {group.items.length} {group.items.length === 1 ? 'actividad' : 'actividades'}
                </span>
              </div>

              {/* Tarjetas de actividades para este día */}
              <div className="space-y-2.5">
                {group.items.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onEditTask={onEditTask}
                    onEditEvent={onEditEvent}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

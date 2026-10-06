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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-[22px] shadow-[0_2px_12px_rgba(36,41,47,0.02)]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterType('todas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === 'todas'
                ? 'bg-[#177468] text-white shadow-xs'
                : 'text-[#697282] hover:bg-[#F5F2EB]'
            }`}
          >
            Todas ({activities.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('evento')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterType === 'evento'
                ? 'bg-[#177468] text-white shadow-xs'
                : 'text-[#697282] hover:bg-[#F5F2EB]'
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
                ? 'bg-[#177468] text-white shadow-xs'
                : 'text-[#697282] hover:bg-[#F5F2EB]'
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
                ? 'bg-[#177468] text-white shadow-xs'
                : 'text-[#697282] hover:bg-[#F5F2EB]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Recordatorios</span>
          </button>
        </div>

        {onOpenCreateEvent && (
          <Button
            variant="pastel"
            pastelColor="teal"
            size="sm"
            onClick={() => onOpenCreateEvent()}
            icon={<Plus className="w-3.5 h-3.5" />}
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
            <div key={group.date} className="space-y-2.5">
              {/* Encabezado del grupo de fecha */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-[#24292F] tracking-wide flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        group.isToday ? 'bg-[#177468] ring-4 ring-[#E8F6F4]' : 'bg-[#9DA6B5]/60'
                      }`}
                    />
                    <span>{group.friendlyTitle}</span>
                  </h3>
                  {group.isToday && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F6F4] text-[#177468]">
                      HOY
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-medium text-[#9DA6B5]">
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

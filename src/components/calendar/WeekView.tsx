import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { getWeekDays } from '../../utils/dateUtils';
import type { CalendarActivity } from '../../types';
import { ActivityCard } from './ActivityCard';

export interface WeekViewProps {
  currentDate: Date;
  selectedDate: string;
  activities: CalendarActivity[];
  onSelectDate: (isoDate: string) => void;
  onOpenCreateEvent?: (date: string) => void;
  onEditTask?: (taskId: string) => void;
  onEditEvent?: (eventId: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  selectedDate,
  activities,
  onSelectDate,
  onOpenCreateEvent,
  onEditTask,
  onEditEvent,
}) => {
  const weekDays = getWeekDays(currentDate);

  // Mapear actividades por fecha
  const activitiesByDate = React.useMemo(() => {
    const map = new Map<string, CalendarActivity[]>();
    activities.forEach((act) => {
      const list = map.get(act.date) || [];
      list.push(act);
      map.set(act.date, list);
    });
    return map;
  }, [activities]);

  return (
    <div className="select-none">
      {/* 
        Contenedor de 7 columnas semanales:
        En móvil/tablet pequeña: scroll horizontal cómodo sin comprimir las columnas.
        En tablet/desktop: columnas distribuidas fluidamente.
      */}
      <div className="flex flex-row overflow-x-auto gap-3 sm:gap-3.5 pb-6 pt-1 px-1 -mx-2 sm:mx-0 snap-x snap-mandatory scrollbar-none">
        {weekDays.map((day) => {
          const isSelected = day.isoDate === selectedDate;
          const dayActivities = activitiesByDate.get(day.isoDate) || [];

          return (
            <div
              key={day.isoDate}
              onClick={() => onSelectDate(day.isoDate)}
              className={`
                flex flex-col rounded-[26px] p-3.5 sm:p-4 min-h-[500px]
                shrink-0 snap-center w-[78vw] sm:w-[260px] md:flex-1 md:w-auto transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'ring-2 ring-[#177468] bg-[#E8F6F4]/40 scale-[1.005]'
                    : 'bg-[#F5F2EB]/50 hover:bg-[#F5F2EB]/80'
                }
              `}
            >
              {/* Cabecera del día */}
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-black/[0.04]">
                <div>
                  <span className="text-[11px] font-bold text-[#697282] uppercase tracking-wider block">
                    {day.dayNameShort}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`
                        text-lg font-extrabold flex items-center justify-center
                        ${
                          day.isToday
                            ? 'w-7 h-7 rounded-full bg-[#177468] text-white shadow-xs'
                            : isSelected
                            ? 'text-[#177468]'
                            : 'text-[#24292F]'
                        }
                      `}
                    >
                      {day.dayNumber}
                    </span>
                    {day.isToday && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#177468] text-white">
                        Hoy
                      </span>
                    )}
                  </div>
                </div>

                {onOpenCreateEvent && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCreateEvent(day.isoDate);
                    }}
                    className="w-7 h-7 rounded-[10px] bg-white text-[#697282] hover:text-[#24292F] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    title={`Añadir actividad para ${day.dayNameShort} ${day.dayNumber}`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Lista de actividades para este día */}
              <div className="space-y-2.5 flex-1">
                {dayActivities.length === 0 ? (
                  <div className="h-40 rounded-[20px] bg-white/40 flex flex-col items-center justify-center p-3 text-center">
                    <Clock className="w-5 h-5 text-[#9DA6B5]/60 mb-1.5" />
                    <p className="text-xs text-[#9DA6B5] font-medium">Sin actividades</p>
                    {onOpenCreateEvent && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCreateEvent(day.isoDate);
                        }}
                        className="text-[11px] text-[#177468] hover:underline font-bold mt-1.5 cursor-pointer"
                      >
                        + Añadir
                      </button>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

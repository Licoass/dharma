import React from 'react';
import { getMonthGrid, DAY_NAMES_SHORT_ES } from '../../utils/dateUtils';
import type { CalendarActivity } from '../../types';
import { ActivityCard } from './ActivityCard';

export interface MonthViewProps {
  currentDate: Date;
  selectedDate: string; // ISO YYYY-MM-DD
  activities: CalendarActivity[];
  onSelectDate: (isoDate: string) => void;
  onEditTask?: (taskId: string) => void;
  onEditEvent?: (eventId: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  selectedDate,
  activities,
  onSelectDate,
  onEditTask,
  onEditEvent,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthGrid(year, month);

  // Mapear actividades por fecha para acceso O(1)
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
      {/* 1. Días de la semana (Encabezado suave, sin líneas duras) */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
        {DAY_NAMES_SHORT_ES.map((dayName, idx) => (
          <div
            key={idx}
            className="text-[10px] sm:text-[11px] font-extrabold tracking-dharma text-[#8C8578] uppercase py-1.5"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 2. Cuadrícula orgánica de días */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {days.map((day, idx) => {
          const isSelected = day.isoDate === selectedDate;
          const dayActivities = activitiesByDate.get(day.isoDate) || [];
          const visibleActivities = dayActivities.slice(0, 2);
          const hiddenCount = dayActivities.length - visibleActivities.length;

          return (
            <div
              key={idx}
              onClick={() => onSelectDate(day.isoDate)}
              className={`
                min-h-[82px] sm:min-h-[108px] p-2 sm:p-2.5 rounded-[20px] sm:rounded-[24px] border border-black/[0.04]
                flex flex-col justify-between transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'ring-2 ring-[#171717] bg-[#FFFBEA] shadow-xs scale-[1.01]'
                    : day.isCurrentMonth
                    ? 'bg-white shadow-[0_2px_10px_rgba(23,23,23,0.02)] hover:shadow-[0_6px_20px_rgba(23,23,23,0.05)] hover:-translate-y-0.5'
                    : 'bg-white/40 opacity-40 hover:opacity-70'
                }
              `}
            >
              {/* Encabezado de la celda: Número de día */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-xs sm:text-base font-bold font-serif-display flex items-center justify-center
                    ${
                      day.isToday
                        ? 'w-6.5 h-6.5 rounded-full bg-[#171717] text-white shadow-2xs font-extrabold text-xs'
                        : isSelected
                        ? 'text-[#171717] font-extrabold'
                        : day.isCurrentMonth
                        ? 'text-[#171717]'
                        : 'text-[#8C8578]'
                    }
                  `}
                >
                  {day.dayNumber}
                </span>

                {dayActivities.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717]/70 sm:hidden" />
                )}
              </div>

              {/* Actividades del día (chips compactos suaves) */}
              <div className="space-y-1 flex-1 overflow-hidden mt-0.5">
                {visibleActivities.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    compact={true}
                    onEditTask={onEditTask}
                    onEditEvent={onEditEvent}
                  />
                ))}

                {hiddenCount > 0 && (
                  <div className="text-[10px] font-bold text-[#697282] px-1.5 py-0.5 rounded-full bg-[#FAF8F5] inline-block">
                    +{hiddenCount} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

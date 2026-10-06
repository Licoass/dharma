import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckSquare, 
  Bell, 
  MapPin, 
  Check, 
  Trash2, 
  Flame
} from 'lucide-react';
import type { CalendarActivity } from '../../types';
import { useTaskContext } from '../../context/TaskContext';

export interface ActivityCardProps {
  activity: CalendarActivity;
  compact?: boolean;
  onEditTask?: (taskId: string) => void;
  onEditEvent?: (eventId: string) => void;
  className?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  compact = false,
  onEditTask,
  onEditEvent,
  className = '',
}) => {
  const { 
    getCategoryById, 
    toggleTaskComplete, 
    toggleEventComplete, 
    deleteEvent 
  } = useTaskContext();

  const category = getCategoryById(activity.categoryId);

  const handleToggle = () => {
    if (activity.type === 'tarea' && activity.taskId) {
      toggleTaskComplete(activity.taskId);
    } else if (activity.eventId) {
      toggleEventComplete(activity.eventId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activity.eventId) {
      if (window.confirm('¿Deseas eliminar este registro de la agenda?')) {
        deleteEvent(activity.eventId);
      }
    }
  };

  const handleCardClick = () => {
    if (activity.type === 'tarea' && activity.taskId && onEditTask) {
      onEditTask(activity.taskId);
    } else if (activity.eventId && onEditEvent) {
      onEditEvent(activity.eventId);
    }
  };

  const typeConfig = {
    tarea: {
      label: 'Tarea',
      icon: <CheckSquare className="w-3.5 h-3.5" />,
      badgeBg: '#FAF8F5',
      badgeText: '#697282',
    },
    evento: {
      label: 'Evento',
      icon: <CalendarIcon className="w-3.5 h-3.5" />,
      badgeBg: '#E8F6F4',
      badgeText: '#177468',
    },
    recordatorio: {
      label: 'Recordatorio',
      icon: <Bell className="w-3.5 h-3.5" />,
      badgeBg: '#FEF6E9',
      badgeText: '#8E5B18',
    },
  }[activity.type];

  // Si es compacto (para celdas del mes o semana reducida)
  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className={`
          flex items-center gap-1.5 px-2 py-1 rounded-[10px] text-[11px] font-semibold
          truncate cursor-pointer transition-all hover:scale-[1.01] select-none
          ${activity.isCompleted ? 'line-through opacity-60' : ''}
          ${className}
        `}
        style={{
          backgroundColor: category?.bgSoft || '#F5F2EB',
          color: category?.textColor || '#24292F',
        }}
        title={`${activity.time ? activity.time + ' · ' : ''}${activity.title}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: category?.color || '#9DA6B5' }}
        />
        {activity.time && (
          <span className="font-mono text-[10px] opacity-80 shrink-0">
            {activity.time.split(' - ')[0]}
          </span>
        )}
        <span className="truncate">{activity.title}</span>
      </div>
    );
  }

  // Tarjeta suave y colorida completa (para Agenda y panel lateral)
  return (
    <div
      onClick={handleCardClick}
      className={`
        p-3.5 sm:p-4 rounded-[22px] transition-all select-none relative group cursor-pointer
        shadow-[0_2px_12px_rgba(36,41,47,0.02)] hover:shadow-[0_6px_20px_rgba(36,41,47,0.05)] hover:-translate-y-0.5
        ${
          activity.isCompleted
            ? 'bg-white/60 opacity-70 shadow-2xs'
            : 'bg-white'
        }
        ${className}
      `}
    >
      {/* Barra superior de tipo y categoría */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Badge de tipo de actividad */}
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
            style={{
              backgroundColor: typeConfig.badgeBg,
              color: typeConfig.badgeText,
            }}
          >
            {typeConfig.icon}
            <span>{typeConfig.label}</span>
          </span>

          {/* Badge de categoría con color pastel */}
          {category && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: category.bgSoft,
                color: category.textColor,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="truncate max-w-[120px]">{category.name}</span>
            </span>
          )}

          {activity.priority === 'vital' && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEEFEF] text-[#A63838]">
              <Flame className="w-3 h-3" />
              <span>Vital</span>
            </span>
          )}
        </div>

        {/* Acciones directas */}
        {activity.eventId && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 text-[#9DA6B5] hover:text-[#EB6B6B] transition-opacity cursor-pointer rounded-full hover:bg-[#FAF8F5]"
            title="Eliminar de la agenda"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Contenido principal: Checkbox (si tarea o recordatorio) + Título + Descripción */}
      <div className="flex items-start gap-3">
        {(activity.type === 'tarea' || activity.type === 'recordatorio') && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className={`
              shrink-0 w-5 h-5 rounded-[7px] border-2 flex items-center justify-center transition-all cursor-pointer mt-0.5
              ${
                activity.isCompleted
                  ? 'bg-[#177468] border-[#177468] text-white shadow-2xs'
                  : 'border-[#D0D6E0] hover:border-[#177468] bg-white hover:bg-[#E8F6F4]/40'
              }
            `}
            aria-label={activity.isCompleted ? 'Desmarcar' : 'Completar'}
          >
            {activity.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-bold leading-snug transition-colors ${
              activity.isCompleted
                ? 'line-through text-[#9DA6B5] font-normal'
                : 'text-[#24292F]'
            }`}
          >
            {activity.title}
          </h4>

          {activity.description && (
            <p className="text-xs text-[#697282] mt-1 leading-relaxed line-clamp-2">
              {activity.description}
            </p>
          )}

          {/* Fila de hora y ubicación */}
          <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-[#697282] font-semibold">
            {activity.time && (
              <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded-full text-[#177468]">
                <Clock className="w-3 h-3 text-[#177468]" />
                <span>{activity.time}</span>
              </span>
            )}

            {activity.location && (
              <span className="inline-flex items-center gap-1 text-[#9DA6B5]">
                <MapPin className="w-3 h-3 text-[#9DA6B5]" />
                <span className="truncate max-w-[150px]">{activity.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

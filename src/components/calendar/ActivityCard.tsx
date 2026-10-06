import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckSquare, 
  Bell, 
  MapPin, 
  Check, 
  Trash2, 
  Flame,
  Lock,
  Video
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
    deleteEvent,
    googleEvents,
    setSelectedGoogleEvent
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
    if (activity.source === 'google' && activity.googleEventId) {
      const gEvent = googleEvents.find((e) => e.id === activity.googleEventId);
      if (gEvent) {
        setSelectedGoogleEvent(gEvent);
        return;
      }
    }
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
    const isGoogle = activity.source === 'google';
    return (
      <div
        onClick={handleCardClick}
        className={`
          flex items-center gap-1.5 px-2 py-1 rounded-[10px] text-[11px] font-semibold
          truncate cursor-pointer transition-all hover:scale-[1.01] select-none
          ${activity.isCompleted ? 'line-through opacity-60' : ''}
          ${isGoogle ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#4285F4]/20' : ''}
          ${className}
        `}
        style={
          isGoogle
            ? undefined
            : {
                backgroundColor: category?.bgSoft || '#F5F2EB',
                color: category?.textColor || '#24292F',
              }
        }
        title={`${isGoogle ? 'Google Calendar: ' : ''}${activity.time ? activity.time + ' · ' : ''}${activity.title}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${isGoogle ? 'bg-[#4285F4]' : ''}`}
          style={isGoogle ? undefined : { backgroundColor: category?.color || '#9DA6B5' }}
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
        p-4 sm:p-4.5 rounded-[24px] transition-all select-none relative group cursor-pointer border border-black/[0.04]
        shadow-[0_2px_12px_rgba(23,23,23,0.02)] hover:shadow-[0_6px_22px_rgba(23,23,23,0.06)] hover:-translate-y-0.5
        ${
          activity.isCompleted
            ? 'bg-white/60 opacity-70 shadow-2xs'
            : activity.source === 'google'
            ? 'bg-gradient-to-br from-white via-white to-[#F0F9FE] border-[#9DD7F5]/40'
            : 'bg-white'
        }
        ${className}
      `}
      style={{
        borderLeftColor: category ? category.color : undefined,
        borderLeftWidth: category ? '4px' : undefined,
      }}
    >
      {/* Barra superior de tipo y categoría */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Badge de tipo de actividad / Google Calendar */}
          {activity.source === 'google' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-dharma uppercase bg-[#F0F9FE] text-[#171717] border border-[#9DD7F5]/40">
              <CalendarIcon className="w-3 h-3 text-[#171717]" />
              <span>Google Calendar</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-dharma uppercase bg-[#F8F4E8] text-[#171717] border border-black/[0.04]"
            >
              {typeConfig.icon}
              <span>{typeConfig.label}</span>
            </span>
          )}

          {/* Badge de categoría con color pastel */}
          {category && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-dharma uppercase border border-black/[0.03]"
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
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-dharma uppercase bg-[#FFF0EE] text-[#F59A8B] border border-[#F59A8B]/30">
              <Flame className="w-3 h-3 text-[#F59A8B]" />
              <span>Vital</span>
            </span>
          )}
        </div>

        {/* Acciones directas y Badge de Solo Lectura */}
        <div className="flex items-center gap-1.5">
          {activity.isReadOnly && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8C8578] bg-[#F8F4E8] px-2.5 py-0.5 rounded-full border border-black/[0.04]">
              <Lock className="w-2.5 h-2.5" />
              <span>Solo lectura</span>
            </span>
          )}

          {activity.eventId && !activity.isReadOnly && (
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-1 text-[#8C8578] hover:text-[#F59A8B] transition-opacity cursor-pointer rounded-full hover:bg-[#F8F4E8]"
              title="Eliminar de la agenda"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal: Checkbox (si tarea o recordatorio) + Título + Descripción */}
      <div className="flex items-start gap-3.5">
        {(activity.type === 'tarea' || activity.type === 'recordatorio') && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className={`
              shrink-0 w-5.5 h-5.5 rounded-[8px] border-2 flex items-center justify-center transition-all cursor-pointer mt-0.5
              ${
                activity.isCompleted
                  ? 'bg-[#171717] border-[#171717] text-white shadow-2xs'
                  : 'border-black/20 hover:border-[#171717] bg-white hover:bg-[#F8F4E8]'
              }
            `}
            aria-label={activity.isCompleted ? 'Desmarcar' : 'Completar'}
          >
            {activity.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm sm:text-[15px] font-bold leading-snug transition-colors ${
              activity.isCompleted
                ? 'line-through text-[#8C8578] font-normal'
                : 'text-[#171717]'
            }`}
          >
            {activity.title}
          </h4>

          {activity.description && (
            <p className="text-xs text-[#525252] mt-1 leading-relaxed line-clamp-2">
              {activity.description}
            </p>
          )}

          {/* Fila de hora y ubicación */}
          <div className="flex flex-wrap items-center gap-2.5 mt-2.5 pt-2 border-t border-black/[0.04] text-[11px] text-[#8C8578]">
            {activity.time && (
              <span className="inline-flex items-center gap-1.5 bg-[#F8F4E8] px-2.5 py-0.5 rounded-full text-[#171717] font-bold border border-black/[0.03]">
                <Clock className="w-3 h-3 text-[#171717]" />
                <span>{activity.time}</span>
              </span>
            )}

            {activity.location && (
              <span className="inline-flex items-center gap-1 text-[#8C8578] font-medium">
                <MapPin className="w-3 h-3 text-[#8C8578]" />
                <span className="truncate max-w-[150px]">{activity.location}</span>
              </span>
            )}

            {activity.googleMeetLink && (
              <a
                href={activity.googleMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[#171717] bg-[#F0F9FE] hover:bg-[#E0F3FD] px-2.5 py-0.5 rounded-full transition-colors font-bold border border-[#9DD7F5]/40"
                title="Unirse a Google Meet"
              >
                <Video className="w-3 h-3 text-[#171717]" />
                <span>Meet</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

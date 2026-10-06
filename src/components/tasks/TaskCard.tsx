import React from 'react';
import { Check, Clock, Calendar as CalendarIcon, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { StationBadge, PriorityBadge, ProtocolPill, StatusBadge } from '../common/Badge';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus?: (id: string, status: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onChangeStatus,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const isCompleted = task.status === 'completada';

  return (
    <div
      className={`
        relative group rounded-[22px] border transition-all duration-200
        ${
          isCompleted
            ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.04)]'
        }
        p-4 sm:p-5
      `}
    >
      {/* Top row: Badges, Station, Protocol Code, Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <StationBadge stationId={task.stationId} size="sm" />
          <PriorityBadge priority={task.priority} size="sm" />
          {task.protocolCode && <ProtocolPill code={task.protocolCode} />}
        </div>

        {/* Action dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Opciones de tarea"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowMenu(false)} 
              />
              <div className="absolute right-0 top-9 z-30 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 text-xs text-slate-700">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Editar tarea</span>
                </button>

                {onChangeStatus && (
                  <div className="py-1 border-t border-slate-100 my-1">
                    <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Cambiar estado
                    </p>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onChangeStatus(task.id, 'pendiente');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>Pendiente</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onChangeStatus(task.id, 'en_curso');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-teal-700 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span>En curso</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onChangeStatus(task.id, 'completada');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-emerald-700 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Completada</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (window.confirm('¿Eliminar esta tarea del registro?')) {
                      onDelete(task.id);
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-left cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content: Checkbox + Title + Description */}
      <div className="flex items-start gap-3.5">
        {/* Generous touch target checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`
            shrink-0 w-7 h-7 sm:w-6 sm:h-6 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer mt-0.5
            ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : 'border-slate-300 hover:border-teal-500 bg-white hover:bg-teal-50/30'
            }
          `}
          aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
              isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-800'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p
              className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                isCompleted ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Footer: Date, Estimated Time, Status */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs text-slate-400">
            {task.dueDate && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.dueDate}</span>
              </span>
            )}

            {task.estimatedMinutes && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.estimatedMinutes}m estim.</span>
              </span>
            )}

            <div className="ml-auto">
              <StatusBadge status={task.status} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

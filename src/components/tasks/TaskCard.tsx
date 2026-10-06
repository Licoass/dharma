import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  Calendar as CalendarIcon, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Tag as TagIcon
} from 'lucide-react';
import type { Task } from '../../types';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../ui/Badge';
import { DropdownMenu } from '../ui/DropdownMenu';
import { useTaskContext } from '../../context/TaskContext';

export interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus?: (id: string, statusId: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onChangeStatus,
  draggable = false,
  onDragStart,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const { statuses, toggleSubtask } = useTaskContext();

  const isCompleted = task.statusId === 'completado';
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const menuItems = [
    {
      id: 'edit',
      label: 'Editar tarea',
      icon: <Edit2 className="w-3.5 h-3.5 text-[#9DA6B5]" />,
      onClick: () => onEdit(task),
    },
    ...(onChangeStatus
      ? statuses
          .filter((st) => st.id !== task.statusId)
          .map((st) => ({
            id: `status-${st.id}`,
            label: `Mover a "${st.name}"`,
            icon: <Check className="w-3.5 h-3.5 text-[#177468]" />,
            onClick: () => onChangeStatus(task.id, st.id),
          }))
      : []),
    {
      id: 'delete',
      label: 'Eliminar registro',
      icon: <Trash2 className="w-3.5 h-3.5 text-[#EB6B6B]" />,
      destructive: true,
      onClick: () => {
        if (window.confirm('¿Deseas eliminar esta tarea?')) {
          onDelete(task.id);
        }
      },
    },
  ];

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={`
        rounded-[22px] transition-all duration-200 select-none p-3.5 sm:p-4
        ${draggable ? 'cursor-grab active:cursor-grabbing active:scale-[0.99]' : ''}
        ${
          isCompleted
            ? 'bg-white/60 opacity-75 shadow-xs'
            : 'bg-white shadow-[0_4px_20px_-2px_rgba(36,41,47,0.03),0_2px_8px_-1px_rgba(36,41,47,0.02)] hover:shadow-[0_8px_24px_-4px_rgba(36,41,47,0.05)]'
        }
      `}
    >
      {/* 1. Barra de metadatos superior: Categoría, Prioridad, Estado y Menú */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryBadge categoryId={task.categoryId} size="sm" />
          <PriorityBadge priority={task.priority} size="sm" />
          <StatusBadge statusId={task.statusId} size="sm" />
        </div>

        <DropdownMenu
          trigger={
            <button
              className="w-7 h-7 flex items-center justify-center rounded-[10px] text-[#9DA6B5] hover:text-[#24292F] hover:bg-[#F5F2EB] transition-colors"
              aria-label="Opciones"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          }
          items={menuItems}
        />
      </div>

      {/* 2. Cuerpo principal: Checkbox + Título + Descripción */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`
            shrink-0 w-6 h-6 rounded-[9px] border-2 flex items-center justify-center transition-all cursor-pointer mt-0.5
            ${
              isCompleted
                ? 'bg-[#177468] border-[#177468] text-white shadow-xs'
                : 'border-[#D0D6E0] hover:border-[#177468] bg-white hover:bg-[#E8F6F4]/40'
            }
          `}
          aria-label={isCompleted ? 'Desmarcar tarea' : 'Completar tarea'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm sm:text-[15px] font-bold leading-snug transition-colors ${
              isCompleted ? 'line-through text-[#9DA6B5] font-normal' : 'text-[#24292F]'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isCompleted ? 'text-[#9DA6B5]' : 'text-[#697282]'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Subtareas Progress chip */}
          {subtasks.length > 0 && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#F5F2EB] text-[11px] font-semibold text-[#697282] transition-colors cursor-pointer"
              >
                <CheckSquare className="w-3 h-3 text-[#177468]" />
                <span>
                  {completedSubtasks}/{subtasks.length} subtareas
                </span>
                {showSubtasks ? (
                  <ChevronUp className="w-3 h-3 text-[#9DA6B5]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#9DA6B5]" />
                )}
              </button>

              {/* Lista desplegable de subtareas interactivas */}
              {showSubtasks && (
                <div className="mt-2 pl-1 space-y-1.5 pt-1 border-t border-black/[0.04]">
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => toggleSubtask(task.id, st.id)}
                      className="flex items-center gap-2 text-xs cursor-pointer group py-0.5"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-[4px] border flex items-center justify-center transition-colors ${
                          st.completed
                            ? 'bg-[#177468] border-[#177468] text-white'
                            : 'border-[#CBD5E1] bg-white group-hover:border-[#177468]'
                        }`}
                      >
                        {st.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span
                        className={`truncate ${
                          st.completed ? 'line-through text-[#9DA6B5]' : 'text-[#24292F]'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Etiquetas */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#FAF8F5] text-[#697282] flex items-center gap-1"
                >
                  <TagIcon className="w-2.5 h-2.5 opacity-60" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Pie de metadatos: Fecha, Hora, Origen, Notas */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-3 text-[11px] text-[#9DA6B5]">
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 text-[#697282] font-semibold">
                <CalendarIcon className="w-3 h-3 text-[#177468]" />
                <span>{task.dueDate}</span>
              </span>
            )}

            {task.dueTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{task.dueTime}</span>
              </span>
            )}

            {task.notes && (
              <span className="inline-flex items-center gap-1 text-[#8E5B18]" title="Tiene notas">
                <FileText className="w-3 h-3" />
                <span>Notas</span>
              </span>
            )}

            {task.origin && (
              <span className="ml-auto text-[10px] font-medium text-[#9DA6B5]">
                {task.origin}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

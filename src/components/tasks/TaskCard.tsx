import { Check, Clock, Calendar as CalendarIcon, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../ui/Badge';
import { DropdownMenu } from '../ui/DropdownMenu';

export interface TaskCardProps {
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
  const isCompleted = task.status === 'completada';

  const menuItems = [
    {
      id: 'edit',
      label: 'Editar tarea',
      icon: <Edit2 className="w-3.5 h-3.5 text-[#9DA6B5]" />,
      onClick: () => onEdit(task),
    },
    ...(onChangeStatus
      ? [
          {
            id: 'status-next',
            label: isCompleted ? 'Marcar pendiente' : 'Marcar completada',
            icon: <Check className="w-3.5 h-3.5 text-[#177468]" />,
            onClick: () =>
              onChangeStatus(task.id, isCompleted ? 'pendiente' : 'completada'),
          },
        ]
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
      className={`
        rounded-[24px] transition-all duration-200 select-none p-4 sm:p-5
        ${
          isCompleted
            ? 'bg-white/60 opacity-70 shadow-xs'
            : 'bg-white shadow-[0_4px_24px_-2px_rgba(36,41,47,0.03),0_2px_8px_-1px_rgba(36,41,47,0.02)] hover:shadow-[0_10px_28px_-4px_rgba(36,41,47,0.06)]'
        }
      `}
    >
      {/* Top Badges & Dropdown Menu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryBadge stationId={task.stationId} size="sm" />
          <PriorityBadge priority={task.priority} size="sm" />
          {task.protocolCode && (
            <span className="text-[10px] font-mono text-[#9DA6B5] bg-[#F5F2EB] px-2 py-0.5 rounded-full font-medium">
              {task.protocolCode}
            </span>
          )}
        </div>

        <DropdownMenu
          trigger={
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[12px] text-[#9DA6B5] hover:text-[#24292F] hover:bg-[#F5F2EB] transition-colors"
              aria-label="Opciones"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          }
          items={menuItems}
        />
      </div>

      {/* Checkbox and Content */}
      <div className="flex items-start gap-3.5">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`
            shrink-0 w-7 h-7 sm:w-6 sm:h-6 rounded-[10px] border-2 flex items-center justify-center transition-all cursor-pointer mt-0.5
            ${
              isCompleted
                ? 'bg-[#177468] border-[#177468] text-white shadow-xs'
                : 'border-[#D0D6E0] hover:border-[#177468] bg-white hover:bg-[#E8F6F4]/40'
            }
          `}
          aria-label={isCompleted ? 'Desmarcar tarea' : 'Completar tarea'}
        >
          {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
              isCompleted ? 'line-through text-[#9DA6B5] font-normal' : 'text-[#24292F]'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p
              className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                isCompleted ? 'text-[#9DA6B5]' : 'text-[#697282]'
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
                  className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#F5F2EB] text-[#697282]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta footer */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs text-[#9DA6B5]">
            {task.dueDate && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#9DA6B5]" />
                <span>{task.dueDate}</span>
              </span>
            )}

            {task.estimatedMinutes && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9DA6B5]" />
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

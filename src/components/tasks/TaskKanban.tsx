import React from 'react';
import { Circle, PlayCircle, CheckCircle2, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

export interface TaskKanbanProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatus) => void;
  onQuickAdd: (status: TaskStatus) => void;
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onChangeStatus,
  onQuickAdd,
}) => {
  const columns: {
    status: TaskStatus;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    color: string;
    bgHeader: string;
  }[] = [
    {
      status: 'pendiente',
      title: 'Por Iniciar',
      subtitle: 'En cola',
      icon: Circle,
      color: '#9DA6B5',
      bgHeader: 'bg-white',
    },
    {
      status: 'en_curso',
      title: 'En Operación',
      subtitle: 'Activo',
      icon: PlayCircle,
      color: '#177468',
      bgHeader: 'bg-[#E8F6F4]',
    },
    {
      status: 'completada',
      title: 'Finalizadas',
      subtitle: 'Cumplido',
      icon: CheckCircle2,
      color: '#5CA16B',
      bgHeader: 'bg-[#EEF6F0]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-start pb-6 select-none">
      {columns.map((col) => {
        const Icon = col.icon;
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="flex flex-col bg-[#F5F2EB]/50 rounded-[28px] p-3.5 sm:p-4 min-h-[380px]"
          >
            {/* Cabecera de Columna */}
            <div className="flex items-center justify-between mb-3 px-1.5 py-1">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${col.color}20`, color: col.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#24292F] tracking-wide">
                      {col.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white font-mono font-bold text-[#697282] shadow-2xs">
                      {colTasks.length}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onQuickAdd(col.status)}
                className="w-8 h-8 rounded-[12px] bg-white text-[#697282] hover:text-[#24292F] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                title={`Agregar tarea a ${col.title}`}
                aria-label={`Agregar tarea a ${col.title}`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Lista de tareas */}
            <div className="space-y-3 flex-1">
              {colTasks.length === 0 ? (
                <div className="h-40 bg-white/40 rounded-[22px] flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs font-semibold text-[#9DA6B5]">
                    Sin tareas
                  </p>
                  <button
                    onClick={() => onQuickAdd(col.status)}
                    className="mt-1.5 text-xs text-[#177468] hover:underline font-bold cursor-pointer"
                  >
                    + Agregar
                  </button>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div key={task.id} className="relative group/kanban space-y-1">
                    <TaskCard
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onChangeStatus={onChangeStatus}
                    />

                    {/* Controles de avance */}
                    <div className="flex items-center justify-between px-2 pt-0.5 text-[11px] text-[#9DA6B5]">
                      {col.status !== 'pendiente' ? (
                        <button
                          onClick={() =>
                            onChangeStatus(
                              task.id,
                              col.status === 'completada' ? 'en_curso' : 'pendiente'
                            )
                          }
                          className="flex items-center gap-1 hover:text-[#24292F] transition-colors py-1 cursor-pointer"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Retroceder</span>
                        </button>
                      ) : (
                        <span />
                      )}

                      {col.status !== 'completada' && (
                        <button
                          onClick={() =>
                            onChangeStatus(
                              task.id,
                              col.status === 'pendiente' ? 'en_curso' : 'completada'
                            )
                          }
                          className="flex items-center gap-1 text-[#177468] hover:underline font-bold transition-colors py-1 cursor-pointer ml-auto"
                        >
                          <span>Avanzar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

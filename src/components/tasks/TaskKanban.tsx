import React from 'react';
import { Circle, PlayCircle, CheckCircle2, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskKanbanProps {
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
      subtitle: 'En cola de espera',
      icon: Circle,
      color: '#94A3B8',
      bgHeader: 'bg-slate-100/70',
    },
    {
      status: 'en_curso',
      title: 'En Operación',
      subtitle: 'Protocolo activo',
      icon: PlayCircle,
      color: '#0D9488',
      bgHeader: 'bg-teal-50/80',
    },
    {
      status: 'completada',
      title: 'Finalizadas',
      subtitle: 'Registro verificado',
      icon: CheckCircle2,
      color: '#16A34A',
      bgHeader: 'bg-emerald-50/80',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start pb-6">
      {columns.map((col) => {
        const Icon = col.icon;
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="flex flex-col bg-[#F8F9FA]/90 border border-slate-200/70 rounded-[24px] p-3 sm:p-4 min-h-[380px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1 py-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${col.color}15`, color: col.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 tracking-wide">
                      {col.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200/80 font-mono font-medium text-slate-600">
                      {colTasks.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {col.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onQuickAdd(col.status)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                title={`Agregar tarea a ${col.title}`}
                aria-label={`Agregar tarea a ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Tasks list inside column */}
            <div className="space-y-3 flex-1">
              {colTasks.length === 0 ? (
                <div className="h-44 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs font-medium text-slate-400">
                    Sin tareas en este estado
                  </p>
                  <button
                    onClick={() => onQuickAdd(col.status)}
                    className="mt-2 text-xs text-teal-600 hover:text-teal-700 font-semibold cursor-pointer"
                  >
                    + Agregar una ahora
                  </button>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div key={task.id} className="relative group/kanban">
                    <TaskCard
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onChangeStatus={onChangeStatus}
                    />

                    {/* Quick Move Navigation Buttons */}
                    <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
                      {col.status !== 'pendiente' ? (
                        <button
                          onClick={() =>
                            onChangeStatus(
                              task.id,
                              col.status === 'completada' ? 'en_curso' : 'pendiente'
                            )
                          }
                          className="flex items-center gap-1 hover:text-slate-700 transition-colors py-1 cursor-pointer"
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
                          className="flex items-center gap-1 hover:text-teal-700 font-medium transition-colors py-1 cursor-pointer ml-auto"
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

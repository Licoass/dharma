import React from 'react';
import { Calendar as CalendarIcon, Lock } from 'lucide-react';
import { Card } from '../ui/Card';
import { useTaskContext } from '../../context/TaskContext';
import { CategoryBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export const CalendarPlaceholderView: React.FC = () => {
  const { tasks } = useTaskContext();

  const tasksWithDate = tasks.filter((t) => t.dueDate && t.statusId !== 'completado');

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto select-none">
      {/* Notice Card: Transparent indication of development phase */}
      <Card padding="md" variant="tint" tintColor="honey">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-[14px] bg-[#FEF6E9] flex items-center justify-center shrink-0 text-[#8E5B18]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.05em] uppercase text-[#8E5B18]">
              MÓDULO TEMPORAL · FASE 1 (SOLO LOCAL)
            </h4>
            <p className="text-xs text-[#8E5B18]/90 mt-1 leading-relaxed">
              La sincronización bidireccional con <span className="font-bold">Google Calendar</span> y la vista interactiva se conectarán en fases posteriores. Puedes consultar las tareas que tienen fecha asignada en tu registro actual.
            </p>
          </div>
        </div>
      </Card>

      {/* Today's Timeline from Local Tasks */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6 pb-2">
          <div>
            <h3 className="text-lg font-bold text-[#24292F] tracking-[0.03em]">
              LÍNEA TEMPORAL DE PROTOCOLOS
            </h3>
            <p className="text-xs text-[#697282] mt-0.5">
              Tareas programadas registradas en las estaciones
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#E8F6F4] text-[#177468]">
            {tasksWithDate.length} PROGRAMADAS
          </span>
        </div>

        {tasksWithDate.length === 0 ? (
          <EmptyState
            title="Sin protocolos programados"
            description="Asigna fechas a tus tareas para ver su cronología organizada en esta estación."
            mood="calm"
          />
        ) : (
          <div className="space-y-3.5">
            {tasksWithDate.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-4 p-4 rounded-[22px] bg-[#FAF8F5] shadow-2xs"
              >
                <div className="p-2.5 rounded-[16px] bg-white text-[#177468] font-mono text-xs font-bold shrink-0 text-center min-w-[72px] shadow-xs">
                  <CalendarIcon className="w-4 h-4 mx-auto mb-1 text-[#177468]" />
                  <span>{task.dueDate}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge categoryId={task.categoryId} size="sm" />
                    {task.protocolCode && (
                      <span className="text-[10px] font-mono text-[#9DA6B5]">
                        {task.protocolCode}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#24292F] truncate">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-[#697282] line-clamp-1 mt-0.5">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

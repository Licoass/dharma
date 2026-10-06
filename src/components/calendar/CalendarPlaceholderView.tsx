import React from 'react';
import { Calendar as CalendarIcon, Lock } from 'lucide-react';
import { Card } from '../common/Card';
import { useTaskContext } from '../../context/TaskContext';
import { StationBadge } from '../common/Badge';
import { DharmaCore } from '../common/DharmaCore';

export const CalendarPlaceholderView: React.FC = () => {
  const { tasks } = useTaskContext();

  const tasksWithDate = tasks.filter((t) => t.dueDate && t.status !== 'completada');

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Notice Card: Transparent indication of development phase */}
      <Card padding="md" className="bg-amber-50/60 border-amber-200/70 text-amber-900">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wide">
              MÓDULO TEMPORAL · FASE 1 (SOLO LOCAL)
            </h4>
            <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
              La sincronización bidireccional con <span className="font-semibold">Google Calendar</span> y la vista mensual interactiva se conectarán en fases posteriores. Actualmente puedes consultar los protocolos que cuentan con fecha asignada en tu registro local.
            </p>
          </div>
        </div>
      </Card>

      {/* Today's Timeline from Local Tasks */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-[0.03em]">
              LÍNEA TEMPORAL DE PROTOCOLOS
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tareas programadas activas registradas en las estaciones
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
            {tasksWithDate.length} PROGRAMADAS
          </span>
        </div>

        {tasksWithDate.length === 0 ? (
          <div className="py-12 text-center">
            <DharmaCore mood="calm" size="md" />
            <p className="text-sm font-medium text-slate-600 mt-3">
              No hay protocolos con fecha límite fijada.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Asigna fechas al crear o editar tus tareas para verlas reflejadas aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasksWithDate.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200/60"
              >
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-teal-700 font-mono text-xs font-bold shrink-0 text-center min-w-[70px]">
                  <CalendarIcon className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                  <span>{task.dueDate}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StationBadge stationId={task.stationId} size="sm" />
                    {task.protocolCode && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {task.protocolCode}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 truncate">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
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

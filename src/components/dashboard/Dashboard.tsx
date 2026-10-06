import React from 'react';
import { Plus, ArrowRight, Compass } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DharmaCore } from '../common/DharmaCore';
import { TaskCard } from '../tasks/TaskCard';
import { STATIONS_LIST } from '../../data/stations';
import { useTaskContext } from '../../context/TaskContext';
import type { NavTab, Task, StationId } from '../../types';

export interface DashboardProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
  onOpenCreateTask,
  onEditTask,
}) => {
  const {
    tasks,
    metrics,
    dharmaMood,
    toggleTaskComplete,
    deleteTask,
    changeTaskStatus,
    setFilters,
  } = useTaskContext();

  // Active key protocols (vital or in progress)
  const priorityTasks = tasks
    .filter((t) => t.status !== 'completada' && (t.priority === 'vital' || t.priority === 'alta' || t.status === 'en_curso'))
    .slice(0, 3);

  return (
    <div className="space-y-7 sm:space-y-9 pb-8">
      {/* 1. BIENVENIDA Y DHARMA CORE (Santuario Personal) */}
      <Card
        padding="lg"
        className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F5] to-[#E8F6F4]/40 border-none shadow-[0_10px_35px_-5px_rgba(36,41,47,0.04)]"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            {/* Mascota con aura */}
            <div className="p-3.5 rounded-[26px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)] shrink-0">
              <DharmaCore mood={dharmaMood} size="lg" showLabel />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F6F4] text-[#177468] text-xs font-bold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2EB5A3] animate-pulse" />
                <span>Estación en Armonía</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24292F] tracking-[0.06em]">
                BUENAS HORAS
              </h2>

              <p className="text-xs sm:text-sm text-[#697282] max-w-md leading-relaxed">
                {metrics.vital > 0
                  ? `Tienes ${metrics.vital} protocolo(s) de alta prioridad esperando tu atención.`
                  : metrics.pending > 0
                  ? `Tienes ${metrics.pending} tareas pendientes distribuidas en tus estaciones.`
                  : 'Todas tus estaciones se encuentran en balance y al día.'}
              </p>
            </div>
          </div>

          {/* Acción única principal */}
          <div className="shrink-0 pt-2 sm:pt-0">
            <Button
              variant="primary"
              size="md"
              onClick={onOpenCreateTask}
              icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
            >
              Nuevo Protocolo
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. ESTACIONES DE VIDA (Tarjetas pastel flotantes) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#697282]">
            Tus Estaciones
          </h3>
          <button
            onClick={() => onNavigateTab('tareas')}
            className="text-xs font-semibold text-[#177468] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {STATIONS_LIST.map((st) => {
            const stationTasks = tasks.filter((t) => t.stationId === st.id);
            const pending = stationTasks.filter((t) => t.status !== 'completada').length;

            return (
              <div
                key={st.id}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, stationId: st.id as StationId }));
                  onNavigateTab('tareas');
                }}
                className="group p-4 sm:p-5 rounded-[24px] bg-white shadow-[0_4px_20px_-2px_rgba(36,41,47,0.03)] hover:shadow-[0_12px_30px_-4px_rgba(36,41,47,0.06)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[115px]"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: st.color }}
                  />
                  <span className="text-[10px] font-mono font-medium text-[#9DA6B5]">
                    {st.code}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-xs sm:text-sm font-bold text-[#24292F] group-hover:text-[#177468] transition-colors truncate">
                    {st.name}
                  </p>
                  <p className="text-[11px] text-[#697282] font-medium mt-0.5">
                    {pending} {pending === 1 ? 'activa' : 'activas'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ENFOQUE INMEDIATO (Tareas principales) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#697282]">
            Enfoque de Hoy
          </h3>
          <span className="text-xs text-[#9DA6B5]">
            {priorityTasks.length} en curso / prioritarias
          </span>
        </div>

        {priorityTasks.length === 0 ? (
          <Card padding="lg" className="text-center py-10 bg-white/60">
            <p className="text-sm font-bold text-[#24292F]">Sin tareas prioritarias pendientes</p>
            <p className="text-xs text-[#697282] mt-1 max-w-sm mx-auto">
              Todo lo urgente ha sido resuelto. Puedes revisar tus estaciones o tomarte un respiro consciente.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {priorityTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onEdit={onEditTask}
                onDelete={deleteTask}
                onChangeStatus={changeTaskStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. DIRECTRIZ DE BIENESTAR DHARMA */}
      <Card
        padding="md"
        className="bg-[#F5F2EB]/50 border-none flex items-center gap-4 text-[#697282]"
      >
        <div className="w-10 h-10 rounded-[14px] bg-white flex items-center justify-center shrink-0 text-[#177468] shadow-xs">
          <Compass className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm leading-relaxed">
          <span className="font-bold text-[#24292F]">Filosofía Dharma: </span>
          Cada estación tiene su propio ritmo. Organizar tu día no es acelerar el tiempo, sino habitarlo con claridad.
        </p>
      </Card>
    </div>
  );
};

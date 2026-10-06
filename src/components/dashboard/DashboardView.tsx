import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  ArrowUpRight, 
  Layers, 
  Plus, 
  TrendingUp, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Card } from '../common/Card';
import { DharmaCore } from '../common/DharmaCore';
import { STATIONS_LIST } from '../../data/stations';
import type { NavTab, Task } from '../../types';
import { TaskCard } from '../tasks/TaskCard';
import { Button } from '../common/Button';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
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
    setFilters 
  } = useTaskContext();

  // Tasks of high priority or currently in progress
  const priorityTasks = tasks
    .filter((t) => t.status !== 'completada' && (t.priority === 'vital' || t.priority === 'alta' || t.status === 'en_curso'))
    .slice(0, 4);

  // Station breakdown stats
  const stationStats = STATIONS_LIST.map((st) => {
    const stationTasks = tasks.filter((t) => t.stationId === st.id);
    const completed = stationTasks.filter((t) => t.status === 'completada').length;
    const pending = stationTasks.filter((t) => t.status !== 'completada').length;
    return {
      ...st,
      total: stationTasks.length,
      completed,
      pending,
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* 1. WELCOME HERO & DHARMA CORE STATUS BRIEFING */}
      <Card padding="lg" className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF9F6] to-teal-50/40 border-slate-200/80">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            {/* Organic Dharma Core Companion */}
            <div className="p-2 rounded-3xl bg-white shadow-sm border border-slate-200/80 shrink-0">
              <DharmaCore mood={dharmaMood} size="lg" showLabel />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-100/60 text-teal-800 text-xs font-semibold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                <span>Protocolo de Operaciones Activo</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-[0.06em]">
                ESTACIÓN DHARMA EN EQUILIBRIO
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1 leading-relaxed">
                {metrics.vital > 0
                  ? `Tienes ${metrics.vital} protocolo(s) vital(es) esperando atención. Tu enfoque está sincronizado.`
                  : metrics.pending > 0
                  ? `Todo en orden. ${metrics.pending} tareas pendientes distribuidas en tus estaciones.`
                  : 'Todas las estaciones se encuentran al día. Excelente cadencia.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={onOpenCreateTask}
              icon={<Plus className="w-4 h-4" />}
            >
              Nuevo Protocolo
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigateTab('tareas')}
              icon={<Layers className="w-4 h-4" />}
            >
              Ver Registro
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. CORE METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Metric 1 */}
        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              En Operación
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {metrics.inProgress}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Protocolos en curso
            </p>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Vitales
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
              {metrics.vital}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Máxima prioridad
            </p>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Completadas
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {metrics.completed}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              De {metrics.total} totales
            </p>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
              Rendimiento
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {metrics.completionPercentage}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${metrics.completionPercentage}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. PRIORIDAD INMEDIATA & ESTACIONES DE VIDA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left column (2 spans on desktop): Immediate Focus */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-[0.03em]">
                ENFOQUE PRIORITARIO
              </h3>
              <p className="text-xs text-slate-400">
                Protocolos con mayor impacto para el ciclo actual
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tareas')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {priorityTasks.length === 0 ? (
            <Card padding="lg" className="text-center py-10 bg-white/70">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">Sin tareas críticas pendientes</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Todas las tareas vitales han sido resueltas. Puedes revisar el resto de tus estaciones.
              </p>
              <Button
                variant="station"
                size="sm"
                onClick={onOpenCreateTask}
                className="mt-4"
              >
                Registrar nuevo protocolo
              </Button>
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

        {/* Right column (1 span): Station Health & Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-[0.03em]">
              ESTACIONES ACTIVAS
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              5 MÓDULOS
            </span>
          </div>

          <div className="space-y-3">
            {stationStats.map((st) => (
              <div
                key={st.id}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, stationId: st.id }));
                  onNavigateTab('tareas');
                }}
                className="group p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: st.color }}
                    />
                    <span className="text-xs font-bold text-slate-700 group-hover:text-teal-700 transition-colors">
                      {st.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-slate-400">
                    {st.code}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{st.pending} activas · {st.completed} completadas</span>
                  <span className="text-teal-600 font-medium group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dharma Station Philosophy Card */}
          <Card padding="md" className="bg-gradient-to-br from-[#FAF9F6] to-white border-dashed border-slate-300">
            <div className="flex items-center gap-2.5 text-slate-700 text-xs font-bold mb-1">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Directriz Dharma</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              "El orden no surge de la imposición, sino de la observación metódica de cada estación de tu vida."
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Search, 
  List, 
  Kanban, 
  Plus, 
  X
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { STATIONS_LIST } from '../../data/stations';
import type { Task, TaskStatus, StationId } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskKanban } from './TaskKanban';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export interface TasksViewProps {
  onOpenCreateTask: (defaultStatus?: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  onOpenCreateTask,
  onEditTask,
}) => {
  const {
    filteredTasks,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    toggleTaskComplete,
    deleteTask,
    changeTaskStatus,
  } = useTaskContext();

  const handleClearFilters = () => {
    setFilters({
      search: '',
      stationId: 'todas',
      status: 'todas',
      priority: 'todas',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.stationId !== 'todas' ||
    filters.status !== 'todas' ||
    filters.priority !== 'todas';

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Barra superior: Búsqueda + Toggle Lista/Kanban + Nueva Tarea */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Input de Búsqueda */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9DA6B5] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Buscar por protocolo, título o #etiqueta..."
            className="w-full pl-11 pr-10 py-3 rounded-[20px] bg-white text-sm text-[#24292F] placeholder:text-[#9DA6B5] focus:ring-2 focus:ring-[#177468]/15 outline-none transition-all shadow-[0_2px_12px_rgba(36,41,47,0.02)]"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9DA6B5] hover:text-[#24292F] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Toggle de Vistas y Botón de creación */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#F5F2EB]/80 p-1 rounded-[18px] flex items-center">
            <button
              onClick={() => setViewMode('lista')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'lista'
                  ? 'bg-white text-[#24292F] shadow-xs'
                  : 'text-[#697282] hover:text-[#24292F]'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Lista</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#24292F] shadow-xs'
                  : 'text-[#697282] hover:text-[#24292F]'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onOpenCreateTask('pendiente')}
            icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* 2. Filtros orgánicos: Chips de Estaciones y Estados */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-[26px] shadow-[0_4px_20px_-2px_rgba(36,41,47,0.02)]">
        {/* Estaciones */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-[#9DA6B5] uppercase tracking-wider shrink-0 mr-1">
            Estación:
          </span>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, stationId: 'todas' }))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              filters.stationId === 'todas'
                ? 'bg-[#24292F] text-white'
                : 'bg-[#F5F2EB] text-[#697282] hover:bg-[#EBE7DD]'
            }`}
          >
            Todas
          </button>
          {STATIONS_LIST.map((st) => {
            const isSelected = filters.stationId === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setFilters((prev) => ({ ...prev, stationId: st.id as StationId }))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-xs text-[#24292F] font-bold'
                    : 'text-[#697282] hover:bg-[#F5F2EB]'
                }`}
                style={{
                  backgroundColor: isSelected ? st.bgSoft : 'transparent',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: st.color }}
                />
                <span>{st.name}</span>
              </button>
            );
          })}
        </div>

        {/* Estados */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/[0.03] text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-[#9DA6B5] uppercase tracking-wider mr-1">
              Estado:
            </span>
            {[
              { id: 'todas', label: 'Todos' },
              { id: 'activas', label: 'Activas' },
              { id: 'pendiente', label: 'Pendientes' },
              { id: 'en_curso', label: 'En curso' },
              { id: 'completada', label: 'Completadas' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setFilters((prev) => ({ ...prev, status: s.id as any }))}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  filters.status === s.id
                    ? 'bg-[#177468] text-white font-bold'
                    : 'text-[#697282] hover:bg-[#F5F2EB]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#A63838] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Área de contenido: Lista o Kanban */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="Sin tareas en este canal"
          description="No se han encontrado registros con los filtros activos. Las estaciones se encuentran despejadas."
          mood="idle"
          actionLabel="Registrar Nueva Tarea"
          onAction={() => onOpenCreateTask('pendiente')}
        />
      ) : viewMode === 'lista' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#9DA6B5] px-1">
            <span>{filteredTasks.length} tarea(s) en registro</span>
            <span className="font-mono text-[10px]">VISTA SECUENCIAL</span>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task) => (
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
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-[#9DA6B5] px-1 mb-3">
            <span>Tablero de flujo · {filteredTasks.length} tarea(s)</span>
            <span className="font-mono text-[10px]">VISTA KANBAN</span>
          </div>

          <TaskKanban
            tasks={filteredTasks}
            onToggleComplete={toggleTaskComplete}
            onEdit={onEditTask}
            onDelete={deleteTask}
            onChangeStatus={changeTaskStatus}
            onQuickAdd={(status) => onOpenCreateTask(status)}
          />
        </div>
      )}
    </div>
  );
};

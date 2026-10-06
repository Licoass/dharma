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
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskKanban } from './TaskKanban';
import { Button } from '../common/Button';
import { DharmaCore } from '../common/DharmaCore';

interface TasksViewProps {
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
    <div className="space-y-6 pb-12">
      {/* 1. TOP CONTROLS BAR: SEARCH + VIEW MODE + NEW BUTTON */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Buscar por protocolo, título o #etiqueta..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all shadow-2xs"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher & Create Button */}
        <div className="flex items-center gap-2.5">
          {/* List / Kanban Toggle */}
          <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center border border-slate-200/70">
            <button
              onClick={() => setViewMode('lista')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'lista'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Lista</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
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
            icon={<Plus className="w-4 h-4" />}
          >
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* 2. CHIP FILTERS: STATIONS & STATUS */}
      <div className="space-y-2.5 bg-white p-3.5 sm:p-4 rounded-[22px] border border-slate-200/70 shadow-2xs">
        {/* Stations Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Estación:
          </span>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, stationId: 'todas' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              filters.stationId === 'todas'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Todas
          </button>
          {STATIONS_LIST.map((st) => {
            const isSelected = filters.stationId === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setFilters((prev) => ({ ...prev, stationId: st.id }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 text-slate-900 shadow-xs'
                    : 'border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: isSelected ? st.bgSoft : 'white',
                  borderColor: isSelected ? st.color : undefined,
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

        {/* Status and Priority Sub-filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  filters.status === s.id
                    ? 'bg-teal-700 text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. CONTENT AREA: LIST VIEW OR KANBAN VIEW */}
      {filteredTasks.length === 0 ? (
        <div className="p-10 sm:p-14 text-center rounded-[28px] bg-white border border-dashed border-slate-200 flex flex-col items-center justify-center">
          <DharmaCore mood="idle" size="lg" />
          <h3 className="mt-4 text-base font-bold text-slate-700 tracking-wide">
            Sin protocolos coincidentes
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mt-1">
            No se han encontrado registros con los filtros seleccionados o el canal está en calma.
          </p>
          <div className="flex gap-2 mt-4">
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                Restablecer Filtros
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenCreateTask('pendiente')}
            >
              Crear Nueva Tarea
            </Button>
          </div>
        </div>
      ) : viewMode === 'lista' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Mostrando {filteredTasks.length} tarea(s)</span>
            <span className="font-mono">LISTA SECUENCIAL</span>
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
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-3">
            <span>Tablero activo · {filteredTasks.length} tarea(s)</span>
            <span className="font-mono">FLUJO KANBAN</span>
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

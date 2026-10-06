import React, { useState } from 'react';
import { 
  Search, 
  List, 
  Kanban, 
  Plus, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskKanban } from './TaskKanban';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { GmailModal } from '../gmail/GmailModal';

export interface TasksViewProps {
  onOpenCreateTask: (defaultStatusId?: string) => void;
  onEditTask: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  onOpenCreateTask,
  onEditTask,
}) => {
  const {
    filteredTasks,
    categories,
    statuses,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    toggleTaskComplete,
    deleteTask,
    changeTaskStatus,
    addCategory,
    updateCategory,
    deleteCategory,
    addStatus,
    updateStatus,
    deleteStatus,
  } = useTaskContext();

  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [configTab, setConfigTab] = useState<'categorias' | 'estados'>('categorias');
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#0D9488');
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#0D9488');

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categoryId: 'todas',
      statusId: 'todas',
      priority: 'todas',
    });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      color: newCatColor,
      bgSoft: `${newCatColor}18`,
      borderColor: `${newCatColor}33`,
      textColor: newCatColor,
    });

    setNewCatName('');
  };

  const handleCreateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName.trim()) return;

    addStatus({
      name: newStatusName.trim(),
      color: newStatusColor,
      bgSoft: `${newStatusColor}18`,
      textColor: newStatusColor,
      order: statuses.length,
    });

    setNewStatusName('');
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.categoryId !== 'todas' ||
    filters.statusId !== 'todas' ||
    filters.priority !== 'todas';

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Barra superior: Búsqueda + Toggle Lista/Kanban + Nueva Tarea */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C8578] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Buscar por título, etiquetas o notas..."
            className="w-full pl-11 pr-10 py-3 rounded-[22px] bg-white text-sm text-[#171717] placeholder:text-[#8C8578] border border-black/[0.04] focus:ring-2 focus:ring-[#171717]/10 outline-none transition-all shadow-[0_2px_12px_rgba(23,23,23,0.02)]"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8578] hover:text-[#171717] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Toggle de Vistas y Botones */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#EFEAE0]/70 p-1 rounded-[20px] flex items-center border border-black/[0.03]">
            <button
              onClick={() => setViewMode('lista')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'lista'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#8C8578] hover:text-[#171717]'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Lista</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#8C8578] hover:text-[#171717]'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>

          <Button
            variant="pastel"
            pastelColor="coral"
            size="md"
            onClick={() => setIsGmailModalOpen(true)}
            icon={
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M1.5 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h3.75v-8.25L1.5 8.25z" />
                <path fill="#34A853" d="M22.5 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-3.75v-8.25l5.25-3.75z" />
                <path fill="#EA4335" d="M17.25 12V3.75L12 7.5 6.75 3.75V12z" />
                <path fill="#FBBC04" d="M1.5 5.25l10.5 7.5 10.5-7.5V4.5a1.5 1.5 0 0 0-2.4-1.2L12 8.55 3.9 3.3a1.5 1.5 0 0 0-2.4 1.2z" />
              </svg>
            }
          >
            Gmail
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => onOpenCreateTask(statuses[0]?.id || 'por_hacer')}
            icon={<Plus className="w-4 h-4 stroke-[3]" />}
          >
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* 2. Filtros Dinámicos: Categorías y Estados configurables */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-[28px] border border-black/[0.04] shadow-[0_2px_14px_rgba(23,23,23,0.02)]">
        {/* Fila de Categorías dinámicas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-extrabold tracking-dharma text-[#8C8578] uppercase shrink-0 mr-1">
            Categoría:
          </span>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, categoryId: 'todas' }))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              filters.categoryId === 'todas'
                ? 'bg-[#171717] text-white'
                : 'bg-[#F8F4E8] text-[#8C8578] hover:text-[#171717] hover:bg-[#F2ECE0]'
            }`}
          >
            Todas
          </button>

          {categories.map((cat) => {
            const isSelected = filters.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilters((prev) => ({ ...prev, categoryId: cat.id }))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-black/20 text-[#171717] shadow-2xs'
                    : 'border-transparent text-[#8C8578] hover:text-[#171717] hover:bg-[#F8F4E8]'
                }`}
                style={{
                  backgroundColor: isSelected ? cat.bgSoft : 'transparent',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="tracking-wide">{cat.name}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            title="Administrar categorías"
            className="p-1.5 rounded-full hover:bg-[#F8F4E8] text-[#8C8578] hover:text-[#171717] ml-1 shrink-0 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fila de Estados dinámicos */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-black/[0.04] text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-extrabold tracking-dharma text-[#8C8578] uppercase mr-1">
              Estado:
            </span>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, statusId: 'todas' }))}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                filters.statusId === 'todas'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#8C8578] hover:text-[#171717] hover:bg-[#F8F4E8]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, statusId: 'activas' }))}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                filters.statusId === 'activas'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#8C8578] hover:text-[#171717] hover:bg-[#F8F4E8]'
              }`}
            >
              Activas
            </button>

            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => setFilters((prev) => ({ ...prev, statusId: st.id }))}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  filters.statusId === st.id
                    ? 'bg-[#171717] text-white shadow-2xs'
                    : 'text-[#8C8578] hover:text-[#171717] hover:bg-[#F8F4E8]'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#F59A8B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Contenido: Vista LISTA o Vista KANBAN */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="Sin tareas en este canal"
          description="No se han encontrado registros con los filtros activos. Puedes crear una nueva tarea para iniciar."
          mood="idle"
          actionLabel="Registrar Nueva Tarea"
          onAction={() => onOpenCreateTask(statuses[0]?.id || 'por_hacer')}
        />
      ) : viewMode === 'lista' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#9DA6B5] px-1">
            <span>{filteredTasks.length} tarea(s) en lista</span>
            <span className="font-mono text-[10px]">VISTA LISTA ADAPTABLE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <span>Tablero interactivo · {filteredTasks.length} tarea(s)</span>
            <span className="font-mono text-[10px] hidden sm:inline">
              ARRASTRA Y SUELTA PARA CAMBIAR ESTADO
            </span>
            <span className="font-mono text-[10px] sm:hidden">
              DESLIZA HORIZONTALMENTE
            </span>
          </div>

          <TaskKanban
            tasks={filteredTasks}
            onToggleComplete={toggleTaskComplete}
            onEdit={onEditTask}
            onDelete={deleteTask}
            onChangeStatus={changeTaskStatus}
            onQuickAdd={(statusId) => onOpenCreateTask(statusId)}
          />
        </div>
      )}

      {/* Modal: Administrador Configurable de Entidades (Categorías y Estados) */}
      <Modal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        title="Configurar Entidades"
        subtitle="Crea, personaliza, renombra o elimina categorías y estados del sistema"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Selector de pestañas: Categorías / Estados */}
          <div className="flex bg-[#EFEAE0]/70 p-1 rounded-[18px]">
            <button
              type="button"
              onClick={() => setConfigTab('categorias')}
              className={`flex-1 py-2 text-xs font-bold rounded-[14px] transition-all cursor-pointer ${
                configTab === 'categorias'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#8C8578] hover:text-[#171717]'
              }`}
            >
              Categorías ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setConfigTab('estados')}
              className={`flex-1 py-2 text-xs font-bold rounded-[14px] transition-all cursor-pointer ${
                configTab === 'estados'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#8C8578] hover:text-[#171717]'
              }`}
            >
              Estados ({statuses.length})
            </button>
          </div>

          {configTab === 'categorias' ? (
            <div className="space-y-4">
              {/* Formulario para crear categoría */}
              <form onSubmit={handleCreateCategory} className="flex gap-2">
                <Input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nueva categoría (ej. Finanzas)"
                  className="flex-1"
                />
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-12 h-11 rounded-[16px] border-none cursor-pointer p-1 bg-white shadow-xs shrink-0"
                  title="Color de categoría"
                />
                <Button type="submit" variant="primary" size="md">
                  Añadir
                </Button>
              </form>

              {/* Lista de categorías existentes con opción de edición/eliminación */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3.5 rounded-[20px] bg-[#F8F4E8] border border-black/[0.04] gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <input
                        type="color"
                        value={cat.color}
                        onChange={(e) => {
                          const newColor = e.target.value;
                          updateCategory(cat.id, {
                            color: newColor,
                            bgSoft: `${newColor}18`,
                            textColor: newColor,
                          });
                        }}
                        className="w-6 h-6 rounded-full border-none cursor-pointer shrink-0"
                        title="Cambiar color"
                      />
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => updateCategory(cat.id, { name: e.target.value })}
                        className="bg-transparent text-sm font-bold text-[#171717] outline-none flex-1 min-w-0"
                        title="Editar nombre"
                      />
                    </div>

                    {categories.length > 1 && (
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="text-xs text-[#F59A8B] hover:text-[#EB6B6B] font-bold p-1 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formulario para crear estado */}
              <form onSubmit={handleCreateStatus} className="flex gap-2">
                <Input
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  placeholder="Nuevo estado (ej. En revisión)"
                  className="flex-1"
                />
                <input
                  type="color"
                  value={newStatusColor}
                  onChange={(e) => setNewStatusColor(e.target.value)}
                  className="w-12 h-11 rounded-[16px] border-none cursor-pointer p-1 bg-white shadow-xs shrink-0"
                  title="Color de estado"
                />
                <Button type="submit" variant="primary" size="md">
                  Añadir
                </Button>
              </form>

              {/* Lista de estados existentes con opción de edición/eliminación */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {statuses.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-3.5 rounded-[20px] bg-[#F8F4E8] border border-black/[0.04] gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <input
                        type="color"
                        value={st.color}
                        onChange={(e) => {
                          const newColor = e.target.value;
                          updateStatus(st.id, {
                            color: newColor,
                            bgSoft: `${newColor}18`,
                            textColor: newColor,
                          });
                        }}
                        className="w-6 h-6 rounded-full border-none cursor-pointer shrink-0"
                        title="Cambiar color"
                      />
                      <input
                        type="text"
                        value={st.name}
                        onChange={(e) => updateStatus(st.id, { name: e.target.value })}
                        className="bg-transparent text-sm font-bold text-[#171717] outline-none flex-1 min-w-0"
                        title="Editar nombre"
                      />
                    </div>

                    {statuses.length > 1 && (
                      <button
                        onClick={() => deleteStatus(st.id)}
                        className="text-xs text-[#F59A8B] hover:text-[#EB6B6B] font-bold p-1 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsCategoryManagerOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE GMAIL (FASE 12) */}
      <GmailModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
      />
    </div>
  );
};

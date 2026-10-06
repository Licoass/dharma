import React, { useState } from 'react';
import { Plus, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import type { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { useTaskContext } from '../../context/TaskContext';

export interface TaskKanbanProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, statusId: string) => void;
  onQuickAdd: (statusId: string) => void;
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onChangeStatus,
  onQuickAdd,
}) => {
  const { statuses } = useTaskContext();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== statusId) {
      setActiveDropColumn(statusId);
    }
  };

  const handleDragLeave = (_e: React.DragEvent, statusId: string) => {
    if (activeDropColumn === statusId) {
      setActiveDropColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatusId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onChangeStatus(taskId, targetStatusId);
    }
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  return (
    <div className="select-none">
      {/* 
        Contenedor Horizontal:
        En móvil usa desplazamiento horizontal (overflow-x-auto, no comprime las columnas).
        En desktop fluye en grid o flex amplio.
      */}
      <div className="flex flex-row overflow-x-auto gap-3.5 sm:gap-4.5 pb-6 pt-1 px-1 -mx-2 sm:mx-0 snap-x snap-mandatory scrollbar-none">
        {statuses.map((status, index) => {
          const colTasks = tasks.filter((t) => t.statusId === status.id);
          const isDragOver = activeDropColumn === status.id;

          const prevStatus = index > 0 ? statuses[index - 1] : null;
          const nextStatus = index < statuses.length - 1 ? statuses[index + 1] : null;

          return (
            <div
              key={status.id}
              onDragOver={(e) => handleDragOver(e, status.id)}
              onDragLeave={(e) => handleDragLeave(e, status.id)}
              onDrop={(e) => handleDrop(e, status.id)}
              className={`
                flex flex-col rounded-[28px] p-4 min-h-[480px]
                shrink-0 snap-center w-[84vw] sm:w-[320px] lg:flex-1 lg:w-auto transition-all duration-200 border border-black/[0.04]
                ${
                  isDragOver
                    ? 'ring-2 ring-[#171717] bg-[#FFFBEA] scale-[1.01]'
                    : 'bg-white/70 shadow-[0_2px_12px_rgba(23,23,23,0.02)]'
                }
              `}
            >
              {/* Cabecera de la columna */}
              <div className="flex items-center justify-between mb-4 px-1 py-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: status.color }}
                  />
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#171717] tracking-tight">
                      {status.name}
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#171717] text-white font-bold shadow-2xs">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onQuickAdd(status.id)}
                  className="w-7 h-7 rounded-[10px] bg-[#F8F4E8] text-[#171717] hover:bg-[#171717] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  title={`Agregar tarea a ${status.name}`}
                  aria-label={`Agregar tarea a ${status.name}`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Lista de tarjetas con drag and drop */}
              <div className="space-y-3.5 flex-1">
                {colTasks.length === 0 ? (
                  <div
                    className={`
                      h-48 rounded-[22px] flex flex-col items-center justify-center p-4 text-center transition-colors border border-dashed
                      ${isDragOver ? 'bg-[#FFD84D]/10 border-[#171717]' : 'bg-[#F8F4E8]/40 border-black/10'}
                    `}
                  >
                    <Layers className="w-6 h-6 text-[#8C8578] mb-2 opacity-40" />
                    <p className="text-xs font-bold text-[#8C8578]">
                      {isDragOver ? 'Soltar aquí' : 'Sin tareas'}
                    </p>
                    <button
                      onClick={() => onQuickAdd(status.id)}
                      className="mt-2 text-xs text-[#171717] hover:underline font-extrabold cursor-pointer"
                    >
                      + Añadir tarea
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div key={task.id} className="space-y-1">
                      <TaskCard
                        task={task}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onChangeStatus={onChangeStatus}
                      />

                      {/* Botones de avance rápido accesibles */}
                      <div className="flex items-center justify-between px-2 pt-0.5 text-[11px] text-[#8C8578]">
                        {prevStatus ? (
                          <button
                            onClick={() => onChangeStatus(task.id, prevStatus.id)}
                            className="flex items-center gap-1 hover:text-[#171717] transition-colors py-0.5 cursor-pointer font-medium"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>{prevStatus.name}</span>
                          </button>
                        ) : (
                          <span />
                        )}

                        {nextStatus ? (
                          <button
                            onClick={() => onChangeStatus(task.id, nextStatus.id)}
                            className="flex items-center gap-1 text-[#171717] hover:underline font-bold transition-colors py-0.5 cursor-pointer ml-auto"
                          >
                            <span>{nextStatus.name}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span />
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
    </div>
  );
};

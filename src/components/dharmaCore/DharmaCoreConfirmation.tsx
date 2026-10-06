import React, { useState } from 'react';
import { 
  Check, 
  Edit3, 
  Trash2, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { DharmaCore } from '../common/DharmaCore';
import { Button } from '../ui/Button';
import { CategoryBadge } from '../ui/Badge';
import { useTaskContext } from '../../context/TaskContext';
import type { DharmaCoreExtractionResult, DharmaCoreTaskPreview } from '../../services/dharmaCoreService';
import type { TaskPriority } from '../../types';

export interface DharmaCoreConfirmationProps {
  result: DharmaCoreExtractionResult;
  onAcceptAll: (tasksToSave: DharmaCoreTaskPreview[]) => void;
  onDiscard: () => void;
}

export const DharmaCoreConfirmation: React.FC<DharmaCoreConfirmationProps> = ({
  result,
  onAcceptAll,
  onDiscard,
}) => {
  const { categories } = useTaskContext();
  const [tasks, setTasks] = useState<DharmaCoreTaskPreview[]>(result.tasks);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateTaskTitle = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const handleUpdateTaskCategory = (id: string, categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, categoryId, categoryName: cat ? cat.name : t.categoryName }
          : t
      )
    );
  };

  const handleUpdateTaskPriority = (id: string, priority: TaskPriority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 select-none">
      {/* 
        =========================================================
        1. CABECERA: DHARMA CORE Y RESUMEN SEMÁNTICO
        =========================================================
      */}
      <div className="flex items-center gap-3.5 p-4 rounded-[22px] bg-gradient-to-r from-[#E8F6F4]/90 via-white to-[#FAF8F5] border border-[#177468]/15">
        <DharmaCore mood="celebrate" size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#177468] uppercase bg-[#E8F6F4] px-2 py-0.5 rounded-full">
              DHARMA CORE
            </span>
            {result.source === 'supabase_gemini' && (
              <span className="text-[10px] font-mono text-[#D48B38] bg-[#FEF6EC] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Gemini AI
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-[#24292F] mt-0.5">
            He encontrado:
          </h3>
        </div>
      </div>

      {/* 
        =========================================================
        2. LISTA DE CONFIRMACIÓN (Exacto al requerimiento)
        ✓ 2 tareas
        ✓ Categoría: Ocupamor
        ✓ Fecha: mañana
        =========================================================
      */}
      <div className="p-4 rounded-[20px] bg-[#FAF8F5] border border-black/[0.03] space-y-2">
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#24292F]">
          <span className="w-5 h-5 rounded-full bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
          <span>
            {tasks.length} tarea{tasks.length === 1 ? '' : 's'} detectada{tasks.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-bold text-[#24292F]">
          <span className="w-5 h-5 rounded-full bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
          <span>
            Categoría: <span className="text-[#177468]">{result.detectedCategory}</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-bold text-[#24292F]">
          <span className="w-5 h-5 rounded-full bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
          <span>
            Fecha: <span className="text-[#D48B38] capitalize">{result.detectedDateLabel}</span>
          </span>
        </div>

        {result.transcription && (
          <div className="pt-2 mt-2 border-t border-black/[0.04] flex items-start gap-2 text-xs text-[#697282]">
            <span className="text-[10px] font-mono font-bold text-[#177468] bg-[#E8F6F4] px-1.5 py-0.5 rounded shrink-0">
              AUDIO / TEXTO
            </span>
            <p className="italic text-[#4A5568] line-clamp-2">
              "{result.transcription}"
            </p>
          </div>
        )}
      </div>

      {/* 
        =========================================================
        3. LISTA DE TAREAS EXTRAÍDAS (Modo Resumen o Modo Edición)
        =========================================================
      */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-[0.04em] text-[#697282]">
            {isEditing ? 'Editar Tareas Detectadas' : 'Desglose de Tareas'}
          </span>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-[#177468] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modificar detalles</span>
            </button>
          )}
        </div>

        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className="p-3.5 rounded-[18px] bg-white border border-black/[0.04] shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-[#9DA6B5] bg-[#FAF8F5] px-2 py-0.5 rounded-md shrink-0">
                  Tarea {idx + 1}
                </span>

                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-[#9DA6B5] hover:text-[#EB6B6B] p-1 transition-colors"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <CategoryBadge categoryId={task.categoryId} size="sm" />
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#697282] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-black/[0.02]">
                        <Calendar className="w-2.5 h-2.5 opacity-60" />
                        <span>{task.dueDate}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleUpdateTaskTitle(task.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-xs font-bold text-[#24292F] focus:outline-none focus:ring-1 focus:ring-[#177468]"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={task.categoryId}
                      onChange={(e) => handleUpdateTaskCategory(task.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[11px] font-semibold text-[#697282] outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={task.priority}
                      onChange={(e) => handleUpdateTaskPriority(task.id, e.target.value as TaskPriority)}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[11px] font-semibold text-[#697282] outline-none"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="vital">Vital</option>
                    </select>
                  </div>
                </div>
              ) : (
                <h4 className="text-xs sm:text-sm font-bold text-[#24292F] leading-snug">
                  {task.title}
                </h4>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 
        =========================================================
        4. BOTONES DE ACCIÓN: [ACEPTAR TODO] [EDITAR] [DESCARTAR]
        =========================================================
      */}
      <div className="pt-3 border-t border-black/[0.04]">
        {isEditing ? (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsEditing(false)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Volver al resumen
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => onAcceptAll(tasks)}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Guardar y Aceptar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            {/* [DESCARTAR] */}
            <Button
              variant="ghost"
              size="md"
              onClick={onDiscard}
              className="text-[#697282] hover:text-[#EB6B6B]"
            >
              Descartar
            </Button>

            {/* [EDITAR] */}
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsEditing(true)}
              icon={<Edit3 className="w-4 h-4" />}
            >
              Editar
            </Button>

            {/* [ACEPTAR TODO] */}
            <Button
              variant="primary"
              size="md"
              onClick={() => onAcceptAll(tasks)}
              icon={<Check className="w-4 h-4 stroke-[2.5]" />}
            >
              Aceptar Todo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

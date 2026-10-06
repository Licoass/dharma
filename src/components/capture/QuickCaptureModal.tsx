import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTaskContext } from '../../context/TaskContext';
import type { TaskPriority } from '../../types';
import { DharmaCore } from '../common/DharmaCore';
import { ArrowRight, CornerDownLeft } from 'lucide-react';

export const QuickCaptureModal: React.FC = () => {
  const { isQuickCaptureOpen, setIsQuickCaptureOpen, addTask, categories, statuses } = useTaskContext();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-eco');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [dueDate] = useState('Hoy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      categoryId: categoryId || categories[0]?.id || 'cat-eco',
      statusId: statuses[0]?.id || 'por_hacer',
      priority,
      dueDate: dueDate || undefined,
      origin: 'Captura Rápida',
    });

    setTitle('');
    setIsQuickCaptureOpen(false);
  };

  return (
    <Modal
      isOpen={isQuickCaptureOpen}
      onClose={() => setIsQuickCaptureOpen(false)}
      title="Captura Rápida"
      subtitle="Ingresa una tarea o idea instantáneamente"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 select-none">
        {/* Core Prompt */}
        <div className="flex items-center gap-3 p-3.5 rounded-[20px] bg-[#E8F6F4]/70 text-[#177468] text-xs">
          <DharmaCore mood="focus" size="sm" />
          <p className="leading-snug">
            Captura ágilmente. El <span className="font-bold">Dharma Core</span> clasificará la tarea en tu categoría seleccionada.
          </p>
        </div>

        {/* Input */}
        <div>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Qué deseas resolver? (ej. Verificar auditoría Eco)"
            className="w-full px-4 py-3.5 rounded-[20px] bg-[#FAF8F5] text-sm sm:text-base font-semibold text-[#24292F] placeholder:text-[#9DA6B5] focus:ring-2 focus:ring-[#177468]/15 outline-none transition-all shadow-xs"
          />
        </div>

        {/* Categorías dinámicas */}
        <div>
          <span className="block text-[11px] font-bold text-[#697282] uppercase tracking-[0.05em] mb-2">
            Categoría
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'shadow-xs text-[#24292F] ring-2 ring-[#177468]/30 font-bold'
                        : 'text-[#697282] hover:bg-[#F5F2EB]'
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? cat.bgSoft : '#FAF8F5',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prioridad */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#697282] uppercase tracking-[0.05em] mr-1">
              Prioridad:
            </span>
            {(['baja', 'media', 'alta', 'vital'] as TaskPriority[]).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full capitalize transition-all cursor-pointer ${
                  priority === p
                    ? 'bg-[#24292F] text-white shadow-xs'
                    : 'text-[#697282] hover:bg-[#F5F2EB]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#9DA6B5]">
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Enter para guardar</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-3 flex justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsQuickCaptureOpen(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            <span>Guardar Tarea</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};

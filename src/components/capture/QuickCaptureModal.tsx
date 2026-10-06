import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTaskContext } from '../../context/TaskContext';
import type { TaskPriority } from '../../types';
import { DharmaCore } from '../common/DharmaCore';
import { ArrowRight, CornerDownLeft, Sparkles, Mic } from 'lucide-react';

export const QuickCaptureModal: React.FC = () => {
  const { 
    isQuickCaptureOpen, 
    setIsQuickCaptureOpen, 
    addTask, 
    categories, 
    statuses, 
    openDharmaCore,
    openAudioCapture
  } = useTaskContext();
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
        <div className="flex items-center gap-3 p-4 rounded-[22px] bg-[#FAF8F5] border border-black/[0.04] text-xs">
          <DharmaCore mood="focus" size="sm" />
          <div className="flex-1">
            <p className="leading-relaxed text-[#525252] font-medium">
              Captura ágilmente. El <span className="font-bold text-[#171717]">Dharma Core</span> clasificará la tarea en tu categoría seleccionada.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsQuickCaptureOpen(false);
                  openDharmaCore(title);
                }}
                className="text-[11px] font-bold text-[#171717] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-full border border-black/[0.04]"
              >
                <Sparkles className="w-3 h-3 text-[#FFD84D] stroke-[2.5]" />
                <span>Analizar texto con Core</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsQuickCaptureOpen(false);
                  openAudioCapture();
                }}
                className="text-[11px] font-bold text-[#171717] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-full border border-black/[0.04]"
              >
                <Mic className="w-3 h-3 text-[#B9A7F7]" />
                <span>Grabar nota de voz</span>
              </button>
            </div>
          </div>
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
            className="w-full px-4.5 py-3.5 rounded-[22px] bg-[#FAF8F5] text-sm sm:text-base font-semibold text-[#171717] placeholder:text-[#A39E93] focus:ring-2 focus:ring-black/10 focus:bg-white outline-none transition-all border border-black/[0.04]"
          />
        </div>

        {/* Categorías dinámicas */}
        <div>
          <span className="block text-[11px] font-bold text-[#8C827A] uppercase tracking-dharma mb-2">
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
                    px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border
                    ${
                      isSelected
                        ? 'text-[#171717] ring-2 ring-black/20 font-bold border-black/10 shadow-xs'
                        : 'text-[#737373] bg-[#FAF8F5] border-black/[0.04] hover:bg-[#F2ECE0]'
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? cat.bgSoft : undefined,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-2xs"
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
            <span className="text-[11px] font-bold text-[#8C827A] uppercase tracking-dharma mr-1">
              Prioridad:
            </span>
            {(['baja', 'media', 'alta', 'vital'] as TaskPriority[]).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1 text-[11px] font-bold rounded-full capitalize transition-all cursor-pointer ${
                  priority === p
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#737373] bg-[#FAF8F5] hover:bg-[#F2ECE0]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#8C827A]">
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Enter para guardar</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-3 flex justify-end gap-2.5 border-t border-black/[0.04]">
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

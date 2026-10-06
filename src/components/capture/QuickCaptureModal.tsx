import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTaskContext } from '../../context/TaskContext';
import type { StationId, TaskPriority } from '../../types';
import { STATIONS_LIST } from '../../data/stations';
import { DharmaCore } from '../common/DharmaCore';
import { ArrowRight, CornerDownLeft } from 'lucide-react';

export const QuickCaptureModal: React.FC = () => {
  const { isQuickCaptureOpen, setIsQuickCaptureOpen, addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [stationId, setStationId] = useState<StationId>('trabajo');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [dueDate] = useState('Hoy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      stationId,
      priority,
      status: 'pendiente',
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setIsQuickCaptureOpen(false);
  };

  return (
    <Modal
      isOpen={isQuickCaptureOpen}
      onClose={() => setIsQuickCaptureOpen(false)}
      title="Captura Rápida"
      subtitle="Ingresa una idea o protocolo a tu centro de mando"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 select-none">
        {/* Core Prompt */}
        <div className="flex items-center gap-3 p-3.5 rounded-[20px] bg-[#E8F6F4]/70 text-[#177468] text-xs">
          <DharmaCore mood="focus" size="sm" />
          <p className="leading-snug">
            Escribe con naturalidad. El <span className="font-bold">Dharma Core</span> organizará la tarea en tu estación local.
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
            placeholder="¿Qué deseas procesar hoy? (ej. Calibrar plan semanal)"
            className="w-full px-4 py-3.5 rounded-[20px] bg-[#FAF8F5] text-sm sm:text-base font-semibold text-[#24292F] placeholder:text-[#9DA6B5] focus:ring-2 focus:ring-[#177468]/15 outline-none transition-all shadow-xs"
          />
        </div>

        {/* Station select */}
        <div>
          <span className="block text-[11px] font-bold text-[#697282] uppercase tracking-[0.05em] mb-2">
            Estación
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STATIONS_LIST.map((st) => {
              const isSelected = stationId === st.id;
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStationId(st.id as StationId)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'shadow-xs text-[#24292F] font-bold'
                        : 'text-[#697282] hover:bg-[#F5F2EB]'
                    }
                  `}
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
        </div>

        {/* Priority */}
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
            <span>Procesar Entrada</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};

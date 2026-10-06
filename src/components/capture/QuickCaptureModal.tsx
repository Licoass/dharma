import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
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
      subtitle="Ingresa una idea, compromiso o protocolo al sistema"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core helper prompt */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50/60 border border-teal-100 text-teal-900 text-xs">
          <DharmaCore mood="focus" size="sm" />
          <p className="leading-snug">
            Escribe directamente. El <span className="font-semibold">Dharma Core</span> clasificará y resguardará la tarea en tu estación local.
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
            placeholder="¿Qué necesitas procesar? (ej. Enviar propuesta a cliente)"
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-teal-600/30 text-sm sm:text-base font-medium placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-xs"
          />
        </div>

        {/* Quick Station select */}
        <div>
          <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Estación
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STATIONS_LIST.map((st) => {
              const isSelected = stationId === st.id;
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStationId(st.id)}
                  className={`
                    px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'border-2 text-slate-900 shadow-xs'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }
                  `}
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
        </div>

        {/* Quick Priority & Timing */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Prioridad:
            </span>
            {(['baja', 'media', 'alta', 'vital'] as TaskPriority[]).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg capitalize border transition-all cursor-pointer ${
                  priority === p
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Enter para guardar</span>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2 flex justify-end gap-2">
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

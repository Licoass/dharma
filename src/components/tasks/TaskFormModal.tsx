import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { Task, StationId, TaskPriority, TaskStatus } from '../../types';
import { STATIONS_LIST } from '../../data/stations';
import { Calendar, Clock, Tag, Flag } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  initialTask?: Task | null;
  defaultStatus?: TaskStatus;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask = null,
  defaultStatus = 'pendiente',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stationId, setStationId] = useState<StationId>('trabajo');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined);
  const [tagsInput, setTagsInput] = useState('');
  const [protocolCode, setProtocolCode] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setStationId(initialTask.stationId);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setDueDate(initialTask.dueDate || '');
      setEstimatedMinutes(initialTask.estimatedMinutes);
      setTagsInput(initialTask.tags ? initialTask.tags.join(', ') : '');
      setProtocolCode(initialTask.protocolCode || '');
    } else {
      setTitle('');
      setDescription('');
      setStationId('trabajo');
      setPriority('media');
      setStatus(defaultStatus);
      setDueDate('');
      setEstimatedMinutes(undefined);
      setTagsInput('');
      setProtocolCode('');
    }
  }, [initialTask, defaultStatus, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      stationId,
      priority,
      status,
      dueDate: dueDate.trim() || undefined,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
      tags: tags.length > 0 ? tags : undefined,
      protocolCode: protocolCode.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Editar Registro de Tarea' : 'Nuevo Protocolo de Tarea'}
      subtitle={initialTask ? 'Actualiza los parámetros del protocolo' : 'Asigna la tarea a su estación correspondiente'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Título de la Tarea <span className="text-teal-600">*</span>
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Revisar balance de objetivos trimestrales"
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Descripción / Notas
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles, contexto o pasos necesarios..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
          />
        </div>

        {/* Station Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Estación Asignada
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STATIONS_LIST.map((st) => {
              const isSelected = stationId === st.id;
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStationId(st.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-xs'
                        : 'border-slate-200/90 hover:bg-slate-50 text-slate-600'
                    }
                  `}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: st.color }}
                  />
                  <div className="truncate">
                    <p className="truncate font-semibold">{st.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{st.code}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              Prioridad
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['baja', 'media', 'alta', 'vital'] as TaskPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 text-xs font-semibold rounded-xl border capitalize transition-all cursor-pointer ${
                    priority === p
                      ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Estado
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'pendiente', label: 'Pendiente' },
                { id: 'en_curso', label: 'En curso' },
                { id: 'completada', label: 'Completada' },
              ].map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStatus(st.id as TaskStatus)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    status === st.id
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Metadata: Due Date & Estimated Minutes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Fecha / Momento
            </label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Ej. Hoy 17:00, Mañana, Viernes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Tiempo Estimado (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="480"
              value={estimatedMinutes || ''}
              onChange={(e) => setEstimatedMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Ej. 25"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Etiquetas (separadas por comas)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="DeepWork, Casa, Enfoque, Finanzas"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {initialTask ? 'Guardar Cambios' : 'Registrar Tarea'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

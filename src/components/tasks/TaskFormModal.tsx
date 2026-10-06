import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import type { Task, StationId, TaskPriority, TaskStatus } from '../../types';
import { STATIONS_LIST } from '../../data/stations';
import { Calendar, Clock, Tag, Flag } from 'lucide-react';

export interface TaskFormModalProps {
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
      title={initialTask ? 'Editar Protocolo' : 'Nuevo Protocolo'}
      subtitle={initialTask ? 'Modifica los parámetros de la tarea' : 'Asigna la tarea a su estación correspondiente'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 select-none">
        {/* Título */}
        <Input
          label="Título de la tarea"
          required
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Revisar objetivos del ciclo"
        />

        {/* Descripción */}
        <Textarea
          label="Notas y detalles"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Contexto adicional, enlaces o pasos necesarios..."
        />

        {/* Estación */}
        <div>
          <label className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] mb-2 px-1">
            Estación
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STATIONS_LIST.map((st) => {
              const isSelected = stationId === st.id;
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStationId(st.id as StationId)}
                  className={`
                    flex items-center gap-2.5 px-3.5 py-2.5 rounded-[16px] text-xs font-semibold text-left transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'bg-white shadow-xs text-[#24292F] ring-2 ring-[#177468]/30 font-bold'
                        : 'bg-[#FAF8F5] text-[#697282] hover:bg-[#F5F2EB]'
                    }
                  `}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: st.color }}
                  />
                  <div className="truncate">
                    <p className="truncate">{st.name}</p>
                    <p className="text-[10px] text-[#9DA6B5] font-mono">{st.code}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prioridad y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] mb-2 px-1 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-[#9DA6B5]" />
              Prioridad
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['baja', 'media', 'alta', 'vital'] as TaskPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 text-xs font-bold rounded-[14px] capitalize transition-all cursor-pointer ${
                    priority === p
                      ? 'bg-[#24292F] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#697282] hover:bg-[#F5F2EB]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] mb-2 px-1">
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
                  className={`py-2 text-xs font-bold rounded-[14px] transition-all cursor-pointer ${
                    status === st.id
                      ? 'bg-[#177468] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#697282] hover:bg-[#F5F2EB]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fecha y Tiempo Estimado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha / Momento"
            icon={<Calendar className="w-4 h-4" />}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Ej. Hoy, Mañana, Viernes..."
          />

          <Input
            label="Tiempo estimado (minutos)"
            icon={<Clock className="w-4 h-4" />}
            type="number"
            min="1"
            max="480"
            value={estimatedMinutes || ''}
            onChange={(e) => setEstimatedMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ej. 25"
          />
        </div>

        {/* Etiquetas */}
        <Input
          label="Etiquetas (separadas por comas)"
          icon={<Tag className="w-4 h-4" />}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="DeepWork, Personal, Hogar, Finanzas"
        />

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {initialTask ? 'Guardar Cambios' : 'Registrar Protocolo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import type { Task, TaskPriority, Subtask } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import { Calendar, Clock, Tag, Flag, CheckSquare, Plus, Trash2, FileText, Compass } from 'lucide-react';

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  initialTask?: Task | null;
  defaultStatusId?: string;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask = null,
  defaultStatusId,
}) => {
  const { categories, statuses } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [statusId, setStatusId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [origin, setOrigin] = useState('Manual');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setCategoryId(initialTask.categoryId);
      setStatusId(initialTask.statusId);
      setPriority(initialTask.priority);
      setDueDate(initialTask.dueDate || '');
      setDueTime(initialTask.dueTime || '');
      setTagsInput(initialTask.tags ? initialTask.tags.join(', ') : '');
      setNotes(initialTask.notes || '');
      setOrigin(initialTask.origin || 'Manual');
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      setStatusId(defaultStatusId || statuses[0]?.id || 'por_hacer');
      setPriority('media');
      setDueDate('Hoy');
      setDueTime('18:00');
      setTagsInput('');
      setNotes('');
      setOrigin('Manual');
      setSubtasks([]);
    }
    setNewSubtaskTitle('');
  }, [initialTask, defaultStatusId, isOpen, categories, statuses]);

  const handleAddSubtask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    setSubtasks((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

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
      categoryId: categoryId || categories[0]?.id || 'cat-eco',
      statusId: statusId || statuses[0]?.id || 'por_hacer',
      priority,
      dueDate: dueDate.trim() || undefined,
      dueTime: dueTime.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      notes: notes.trim() || undefined,
      origin: origin.trim() || 'Manual',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Editar Tarea' : 'Nueva Tarea'}
      subtitle={initialTask ? 'Actualiza los parámetros y subtareas' : 'Completa los detalles de la tarea'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 select-none">
        {/* 1. Título */}
        <Input
          label="Título de la tarea"
          required
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Revisar informe de emisiones"
        />

        {/* 2. Descripción */}
        <Textarea
          label="Descripción"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Resumen o pasos clave de la tarea..."
        />

        {/* 3. Categoría (Configurable) */}
        <div>
          <label className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] mb-2 px-1">
            Categoría
          </label>
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

        {/* 4. Estado y Prioridad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] mb-2 px-1">
              Estado
            </label>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStatusId(st.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    statusId === st.id
                      ? 'bg-[#177468] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#697282] hover:bg-[#F5F2EB]'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

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
                  className={`py-1.5 text-xs font-bold rounded-[14px] capitalize transition-all cursor-pointer ${
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
        </div>

        {/* 5. Fecha y Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            icon={<Calendar className="w-4 h-4" />}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Ej. Hoy, Mañana, Viernes..."
          />

          <Input
            label="Hora"
            icon={<Clock className="w-4 h-4" />}
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            placeholder="Ej. 18:00, 14:30..."
          />
        </div>

        {/* 6. Subtareas dinámicas */}
        <div>
          <label className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] mb-2 px-1 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-[#177468]" />
            Subtareas
          </label>

          <div className="space-y-1.5 mb-2">
            {subtasks.map((st) => (
              <div
                key={st.id}
                className="flex items-center justify-between p-2 rounded-[14px] bg-[#FAF8F5] text-xs gap-2"
              >
                <div
                  onClick={() => handleToggleSubtask(st.id)}
                  className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                >
                  <span
                    className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 ${
                      st.completed
                        ? 'bg-[#177468] border-[#177468] text-white'
                        : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {st.completed && '✓'}
                  </span>
                  <span className={`truncate ${st.completed ? 'line-through text-[#9DA6B5]' : 'text-[#24292F]'}`}>
                    {st.title}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(st.id)}
                  className="text-[#9DA6B5] hover:text-[#EB6B6B] p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Input para agregar nueva subtarea */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder="Nueva subtarea... (Enter para agregar)"
              className="flex-1 px-3.5 py-2 rounded-[14px] bg-[#FAF8F5] text-xs text-[#24292F] outline-none focus:ring-1 focus:ring-[#177468]/30"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAddSubtask()}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Añadir
            </Button>
          </div>
        </div>

        {/* 7. Etiquetas y Origen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Etiquetas (separadas por comas)"
            icon={<Tag className="w-4 h-4" />}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Sostenibilidad, Q3, Finanzas..."
          />

          <Input
            label="Origen"
            icon={<Compass className="w-4 h-4" />}
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Manual, Captura Rápida, etc."
          />
        </div>

        {/* 8. Notas */}
        <div>
          <label className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] mb-1.5 px-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#9DA6B5]" />
            Notas adicionales
          </label>
          <Textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Información adicional, enlaces o contexto relevante..."
          />
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {initialTask ? 'Guardar Cambios' : 'Crear Tarea'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

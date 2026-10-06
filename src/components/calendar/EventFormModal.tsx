import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { useTaskContext } from '../../context/TaskContext';
import type { AgendaEvent } from '../../types';
import { getTodayISO } from '../../utils/dateUtils';
import { Calendar as CalendarIcon, MapPin, Bell } from 'lucide-react';

export interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialEvent?: AgendaEvent | null;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  initialEvent = null,
}) => {
  const { categories, addEvent, updateEvent } = useTaskContext();

  const [type, setType] = useState<'evento' | 'recordatorio'>('evento');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (initialEvent) {
      setType(initialEvent.type || 'evento');
      setTitle(initialEvent.title);
      setDescription(initialEvent.description || '');
      setDate(initialEvent.date);
      setTime(initialEvent.time || '');
      setLocation(initialEvent.location || '');
      setCategoryId(initialEvent.categoryId || categories[0]?.id || 'cat-personal');
    } else {
      setType('evento');
      setTitle('');
      setDescription('');
      setDate(initialDate || getTodayISO());
      setTime('10:00');
      setLocation('');
      setCategoryId(categories[0]?.id || 'cat-personal');
    }
  }, [initialEvent, initialDate, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialEvent) {
      updateEvent(initialEvent.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        date: date || getTodayISO(),
        time: time.trim() || '12:00',
        location: location.trim() || undefined,
        categoryId: categoryId || categories[0]?.id || 'cat-personal',
        type,
      });
    } else {
      addEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        date: date || getTodayISO(),
        time: time.trim() || '12:00',
        location: location.trim() || undefined,
        categoryId: categoryId || categories[0]?.id || 'cat-personal',
        type,
        isCompleted: false,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialEvent ? 'Editar Registro' : type === 'evento' ? 'Nuevo Evento' : 'Nuevo Recordatorio'}
      subtitle="Programa actividades con fecha y hora en el calendario local"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 select-none">
        {/* Selector de Tipo (Evento vs Recordatorio) */}
        <div className="flex bg-[#F5F2EB]/80 p-1 rounded-[16px]">
          <button
            type="button"
            onClick={() => setType('evento')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'evento'
                ? 'bg-white text-[#177468] shadow-xs'
                : 'text-[#697282] hover:text-[#24292F]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Evento</span>
          </button>
          <button
            type="button"
            onClick={() => setType('recordatorio')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'recordatorio'
                ? 'bg-white text-[#8E5B18] shadow-xs'
                : 'text-[#697282] hover:text-[#24292F]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Recordatorio</span>
          </button>
        </div>

        {/* Título */}
        <Input
          label="Título"
          required
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={type === 'evento' ? 'Ej. Reunión de coordinación de proyecto' : 'Ej. Comprar filtros de agua'}
        />

        {/* Fila: Fecha y Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="date"
            label="Fecha"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input
            type="text"
            label="Hora o Rango"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Ej. 10:00 o 10:00 - 11:30"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-bold text-[#697282] uppercase tracking-wider mb-1.5">
            Categoría del Sistema
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'shadow-xs font-bold ring-2 ring-black/10'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: cat.bgSoft,
                    color: cat.textColor,
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

        {/* Ubicación (opcional) */}
        {type === 'evento' && (
          <Input
            label="Ubicación o Enlace"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. Sala de conferencias o Llamada virtual"
            icon={<MapPin className="w-4 h-4 text-[#9DA6B5]" />}
          />
        )}

        {/* Descripción */}
        <Textarea
          label="Notas o descripción adicional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles sobre este registro..."
          rows={2}
        />

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/[0.04]">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md">
            {initialEvent ? 'Guardar Cambios' : 'Crear Registro'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

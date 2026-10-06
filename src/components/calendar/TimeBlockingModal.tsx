import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Clock, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { CategoryBadge, PriorityBadge } from '../ui/Badge';
import { getTodayISO } from '../../utils/dateUtils';

interface TimeBlockingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export const TimeBlockingModal: React.FC<TimeBlockingModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
}) => {
  const { 
    tasks, 
    scheduleTaskInCalendar, 
    googleSyncStatus 
  } = useTaskContext();

  const pendingTasks = tasks.filter((t) => t.statusId !== 'completado');

  const [selectedTaskId, setSelectedTaskId] = useState<string>(pendingTasks[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState<string>(defaultDate || getTodayISO());
  const [scheduledTime, setScheduledTime] = useState<string>('10:00');
  const [syncToGoogle, setSyncToGoogle] = useState<boolean>(googleSyncStatus === 'connected');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;

    setIsSubmitting(true);
    try {
      await scheduleTaskInCalendar(selectedTaskId, scheduledDate, scheduledTime, syncToGoogle);
      onClose();
    } catch (err) {
      console.warn('Error al programar time-blocking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Time Blocking — Agendar Tarea"
      subtitle="Asigna una franja horaria a tus tareas pendientes en el calendario"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 select-none">
        {/* Selector de Tarea */}
        <div>
          <label className="block text-[11px] font-bold text-[#8C827A] uppercase tracking-dharma mb-2">
            Selecciona la tarea a programar ({pendingTasks.length} disponibles)
          </label>

          {pendingTasks.length === 0 ? (
            <div className="p-4 rounded-[20px] bg-[#FAF8F5] text-center text-xs text-[#737373]">
              No hay tareas pendientes en este momento. ¡Todo al día!
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {pendingTasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-3 rounded-[18px] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-black/20 shadow-xs ring-2 ring-black/10'
                        : 'bg-white border-black/[0.04] hover:bg-[#FAF8F5]/60'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-[#171717] shrink-0" />
                        <span className="text-xs font-bold text-[#171717] truncate font-serif-display">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <CategoryBadge categoryId={task.categoryId} size="sm" />
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="selectedTask"
                      checked={isSelected}
                      onChange={() => setSelectedTaskId(task.id)}
                      className="accent-[#171717]"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-[#8C827A] uppercase tracking-dharma mb-1.5 flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Fecha</span>
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[18px] bg-[#FAF8F5] text-xs font-semibold text-[#171717] border border-black/[0.05] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8C827A] uppercase tracking-dharma mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Hora de inicio</span>
            </label>
            <input
              type="time"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[18px] bg-[#FAF8F5] text-xs font-semibold text-[#171717] border border-black/[0.05] outline-none"
            />
          </div>
        </div>

        {/* Opción de exportar a Google Calendar */}
        <div className="p-3.5 rounded-[20px] bg-[#FAF8F5] border border-black/[0.04] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-black/[0.04] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-[#171717] block">
                Crear en Google Calendar
              </span>
              <span className="text-[10px] text-[#737373] block">
                Sincroniza el bloque como evento en tu calendario externo
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={syncToGoogle}
              onChange={(e) => setSyncToGoogle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#E5DFD3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#171717]"></div>
          </label>
        </div>

        {/* Acciones */}
        <div className="pt-3 border-t border-black/[0.04] flex items-center justify-end gap-2.5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedTaskId || isSubmitting}
            icon={<Clock className="w-4 h-4 text-[#FFD84D]" />}
          >
            {isSubmitting ? 'Agendando...' : 'Fijar Bloque de Tiempo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import React from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Hourglass, 
  PlayCircle, 
  Circle,
  MapPin,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../ui/Badge';
import { DharmaCore } from '../common/DharmaCore';
import { DharmaRhythmWidget } from './DharmaRhythmWidget';
import { useTaskContext } from '../../context/TaskContext';
import type { NavTab, Task } from '../../types';

export interface DashboardProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
  onOpenCreateTask,
  onEditTask,
}) => {
  const {
    tasks,
    calendarActivities,
    metrics,
    dharmaMood,
    toggleTaskComplete,
    setFilters,
    googleSyncStatus,
    googleEvents,
    setSelectedGoogleEvent,
    transmissions,
    books,
  } = useTaskContext();

  const newTransmissionsCount = transmissions.filter((t) => t.status === 'nueva').length;
  const currentlyReadingBook = books.find((b) => b.status === 'leyendo');

  // 1. Tarea prioritaria destacada (primera vital o de alta prioridad no completada)
  const priorityTask =
    tasks.find((t) => t.statusId !== 'completado' && t.priority === 'vital') ||
    tasks.find((t) => t.statusId !== 'completado' && t.priority === 'alta') ||
    tasks.find((t) => t.statusId !== 'completado') ||
    null;

  // 2. Próximas tareas para "HOY" (excluyendo la prioritaria principal para no duplicar)
  const todayTasks = tasks
    .filter((t) => t.id !== priorityTask?.id && t.statusId !== 'completado')
    .slice(0, 4);

  // 3. Próximos eventos (incluye eventos locales y Google Calendar unificados)
  const upcomingEvents = calendarActivities
    .filter((a) => a.type === 'evento')
    .slice(0, 5);

  return (
    <div className="flex flex-col space-y-7 sm:space-y-9 select-none">
      {/* ============================================================ */}
      {/* 1. HEADER EDITORIAL (Saludo grande + Mascota + Botón Capturar) */}
      {/* ============================================================ */}
      <section className="order-1 flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-2 sm:pt-3">
        <div className="flex items-start sm:items-center gap-4">
          {/* Mascota DHARMA Core con sutil halo orgánico */}
          <div className="relative p-2.5 rounded-[22px] bg-white border border-black/[0.04] shadow-[0_4px_16px_rgba(23,23,23,0.03)] shrink-0">
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FFD84D]" />
            <DharmaCore mood={dharmaMood} size="sm" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-dharma text-[#8C8578] uppercase">
                D H A R M A
              </span>
              <span className="w-1 h-1 rounded-full bg-[#171717]/30" />
              <span className="text-xs text-[#737373] font-semibold">
                Centro de Mando Personal
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl desktop:text-5xl font-bold font-serif-display text-[#171717] tracking-tight mt-1 leading-tight">
              Buenos días.
            </h1>
            <p className="text-sm sm:text-base text-[#737373] mt-0.5 font-medium">
              ¿Qué necesitas resolver hoy?
            </p>
          </div>
        </div>

        {/* Botón principal CAPTURAR (alto contraste, desktop & tablet) */}
        <div className="hidden sm:block shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenCreateTask}
            className="shadow-[0_6px_22px_rgba(23,23,23,0.22)] gap-2.5 px-6"
          >
            <div className="w-5 h-5 rounded-full bg-[#FFD84D] flex items-center justify-center text-[#171717] shrink-0">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="font-extrabold tracking-wider text-xs uppercase">Capturar</span>
          </Button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. BOTÓN PRINCIPAL CAPTURAR MÓVIL (Alto contraste)           */}
      {/* ============================================================ */}
      <section className="order-2 sm:hidden w-full">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onOpenCreateTask}
          className="shadow-[0_8px_24px_rgba(23,23,23,0.22)] py-3.5 rounded-[22px]"
        >
          <div className="w-6 h-6 rounded-full bg-[#FFD84D] flex items-center justify-center text-[#171717] mr-2 shrink-0">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="font-extrabold tracking-wider text-sm uppercase">Capturar Entrada</span>
        </Button>
      </section>

      {/* ============================================================ */}
      {/* 3. COMPOSICIÓN ADAPTABLE TABLET / DESKTOP / MÓVIL             */}
      {/* ============================================================ */}
      <div className="order-3 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7 items-start">
        {/* COLUMNA DE CONTENIDO PRINCIPAL */}
        <div className="md:col-span-7 desktop:col-span-8 space-y-6 sm:space-y-7">
          {/* 3.1 TAREA PRIORITARIA (Hero — Objeto visual con forma orgánica sutil) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-extrabold tracking-dharma text-[#8C8578] flex items-center gap-1.5 uppercase">
                <Flame className="w-3.5 h-3.5 text-[#F59A8B]" />
                <span>Tu prioridad de hoy</span>
              </h3>
              <span className="text-[10px] font-extrabold tracking-dharma text-[#171717] uppercase bg-[#FFFBEA] border border-[#FFD84D]/50 px-2.5 py-0.5 rounded-full">
                Foco Principal
              </span>
            </div>

            {priorityTask ? (
              <div
                className="relative overflow-hidden p-6 sm:p-7 rounded-[30px] bg-[#FFFBEA] border border-[#FFD84D]/40 shadow-[0_8px_28px_-6px_rgba(255,216,77,0.18)] transition-all hover:shadow-[0_12px_36px_-6px_rgba(255,216,77,0.25)]"
              >
                {/* Forma orgánica suave decorativa de fondo (blob sutil) */}
                <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#FFD84D]/25 blur-xl pointer-events-none" />
                <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-[#F6A6C8]/15 blur-lg pointer-events-none" />

                {/* Fila superior: Categoría, Prioridad y Estado */}
                <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap mb-3.5">
                  <div className="flex items-center gap-2">
                    <CategoryBadge categoryId={priorityTask.categoryId} size="md" />
                    <PriorityBadge priority={priorityTask.priority} size="md" />
                  </div>
                  <StatusBadge statusId={priorityTask.statusId} size="md" />
                </div>

                {/* Título y descripción */}
                <h4 className="relative z-10 text-xl sm:text-2xl font-bold font-serif-display text-[#171717] leading-snug tracking-tight">
                  {priorityTask.title}
                </h4>

                {priorityTask.description && (
                  <p className="relative z-10 text-xs sm:text-sm text-[#525252] mt-2 leading-relaxed max-w-2xl font-medium">
                    {priorityTask.description}
                  </p>
                )}

                {/* Fila inferior: Fecha, Hora, y Acción de completado */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-black/[0.06]">
                  <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-bold text-[#171717]">
                    <span className="inline-flex items-center gap-1.5 bg-white border border-black/[0.05] px-3 py-1.5 rounded-full shadow-2xs">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#171717]" />
                      <span>{priorityTask.dueDate || 'Hoy'}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 bg-white border border-black/[0.05] px-3 py-1.5 rounded-full shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-[#171717]" />
                      <span>{priorityTask.dueTime || '18:00'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditTask(priorityTask)}
                      className="text-xs font-bold text-[#737373] hover:text-[#171717] px-3 py-1.5 rounded-full hover:bg-black/[0.04] transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => toggleTaskComplete(priorityTask.id)}
                      icon={<CheckCircle2 className="w-4 h-4 text-[#A8D8A0]" />}
                      className="rounded-full px-4"
                    >
                      Completar
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card padding="md" className="text-center py-8 bg-[#FAF6ED] border border-[#EAE3D2]">
                <p className="text-base font-bold font-serif-display text-[#171717]">Sin tareas prioritarias pendientes</p>
                <p className="text-xs text-[#737373] mt-1 font-medium">Todas las tareas vitales han sido resueltas con calma.</p>
              </Card>
            )}
          </section>

          {/* 3.1.1 DHARMA RHYTHM & HEALTH SCORE (Inspirado en la dirección visual) */}
          <section className="space-y-2">
            <DharmaRhythmWidget />
          </section>

          {/* 3.2 ESTADO DEL SISTEMA (Tu día: 4 Bloques coloridos y vivos) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-extrabold tracking-dharma text-[#8C8578] uppercase">
                Tu Día // Estado del Sistema
              </h3>
              <span className="text-[10px] font-bold text-[#737373] font-mono">
                {metrics.total} TOTALES
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
              {/* Pendientes — Amarillo */}
              <div
                onClick={() => {
                  setFilters((prev) => ({ ...prev, statusId: 'por_hacer' }));
                  onNavigateTab('tareas');
                }}
                className="p-4 sm:p-5 rounded-[26px] bg-[#FFFBEA] border border-[#FFD84D]/45 shadow-[0_4px_16px_-2px_rgba(255,216,77,0.12)] hover:shadow-[0_8px_24px_-2px_rgba(255,216,77,0.22)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-dharma text-[#171717] uppercase">Pendientes</span>
                  <div className="w-7 h-7 rounded-full bg-[#FFD84D] flex items-center justify-center text-[#171717]">
                    <Circle className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-serif-display text-[#171717]">
                    {String(metrics.pending).padStart(2, '0')}
                  </span>
                  <p className="text-[10px] text-[#737373] font-bold uppercase tracking-wider mt-0.5">En espera</p>
                </div>
              </div>

              {/* En proceso — Lavanda / Rosa */}
              <div
                onClick={() => {
                  setFilters((prev) => ({ ...prev, statusId: 'en_proceso' }));
                  onNavigateTab('tareas');
                }}
                className="p-4 sm:p-5 rounded-[26px] bg-[#F5F2FE] border border-[#B9A7F7]/45 shadow-[0_4px_16px_-2px_rgba(185,167,247,0.12)] hover:shadow-[0_8px_24px_-2px_rgba(185,167,247,0.22)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-dharma text-[#171717] uppercase">En proceso</span>
                  <div className="w-7 h-7 rounded-full bg-[#B9A7F7] flex items-center justify-center text-[#171717]">
                    <PlayCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-serif-display text-[#171717]">
                    {String(metrics.inProgress).padStart(2, '0')}
                  </span>
                  <p className="text-[10px] text-[#737373] font-bold uppercase tracking-wider mt-0.5">Activas</p>
                </div>
              </div>

              {/* En espera — Coral */}
              <div
                onClick={() => {
                  setFilters((prev) => ({ ...prev, statusId: 'en_espera' }));
                  onNavigateTab('tareas');
                }}
                className="p-4 sm:p-5 rounded-[26px] bg-[#FEF3F1] border border-[#F59A8B]/45 shadow-[0_4px_16px_-2px_rgba(245,154,139,0.12)] hover:shadow-[0_8px_24px_-2px_rgba(245,154,139,0.22)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-dharma text-[#171717] uppercase">En espera</span>
                  <div className="w-7 h-7 rounded-full bg-[#F59A8B] flex items-center justify-center text-[#171717]">
                    <Hourglass className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-serif-display text-[#171717]">
                    {String(metrics.waiting).padStart(2, '0')}
                  </span>
                  <p className="text-[10px] text-[#737373] font-bold uppercase tracking-wider mt-0.5">Pausadas</p>
                </div>
              </div>

              {/* Completadas — Verde */}
              <div
                onClick={() => {
                  setFilters((prev) => ({ ...prev, statusId: 'completado' }));
                  onNavigateTab('tareas');
                }}
                className="p-4 sm:p-5 rounded-[26px] bg-[#F2FAF0] border border-[#A8D8A0]/45 shadow-[0_4px_16px_-2px_rgba(168,216,160,0.12)] hover:shadow-[0_8px_24px_-2px_rgba(168,216,160,0.22)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-dharma text-[#171717] uppercase">Completadas</span>
                  <div className="w-7 h-7 rounded-full bg-[#A8D8A0] flex items-center justify-center text-[#171717]">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-serif-display text-[#171717]">
                    {String(metrics.completed).padStart(2, '0')}
                  </span>
                  <p className="text-[10px] text-[#737373] font-bold uppercase tracking-wider mt-0.5">Verificadas</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3.3 HOY (Próximas tareas programadas) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-extrabold tracking-dharma text-[#8C8578] flex items-center gap-1.5 uppercase">
                <Clock className="w-3.5 h-3.5 text-[#171717]" />
                <span>Próximas Tareas // Hoy</span>
              </h3>
              <button
                onClick={() => onNavigateTab('tareas')}
                className="text-xs font-bold text-[#171717] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver registro completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayTasks.length === 0 ? (
                <Card padding="md" className="text-center py-6 text-xs text-[#737373] bg-white border border-black/[0.04]">
                  No hay más tareas programadas para hoy.
                </Card>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-[24px] bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(23,23,23,0.02)] flex items-center justify-between gap-3.5 hover:shadow-[0_6px_20px_rgba(23,23,23,0.05)] hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="w-5.5 h-5.5 rounded-full border-2 border-black/20 hover:border-[#171717] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                        aria-label="Completar"
                      />

                      <div className="min-w-0 truncate">
                        <p className="text-sm font-bold text-[#171717] truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-[#8C8578] font-bold">
                            {task.dueTime || 'Hoy'}
                          </span>
                          <CategoryBadge categoryId={task.categoryId} size="sm" showDot={false} />
                        </div>
                      </div>
                    </div>

                    <StatusBadge statusId={task.statusId} size="sm" />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* ========================================================== */}
        {/* PANEL LATERAL INTEGRADO (Tablet & Desktop)                 */}
        {/* ========================================================== */}
        <div className="md:col-span-5 desktop:col-span-4 space-y-6 md:sticky md:top-24">
          {/* Subsección: AGENDA (Próximos eventos) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-extrabold tracking-dharma text-[#8C8578] flex items-center gap-1.5 uppercase">
                <CalendarIcon className="w-3.5 h-3.5 text-[#171717]" />
                <span>Agenda</span>
                {googleSyncStatus === 'connected' && (
                  <span className="text-[9px] font-extrabold text-[#171717] bg-[#F0F9FE] border border-[#9DD7F5] px-2 py-0.5 rounded-full">
                    Google Sync
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('calendario')}
                className="text-xs font-bold text-[#171717] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver calendario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents.length === 0 ? (
                <Card padding="md" className="text-center py-6 text-xs text-[#737373] bg-white border border-black/[0.04]">
                  No hay eventos programados en la agenda.
                </Card>
              ) : (
                upcomingEvents.map((evt) => {
                  const isGoogle = evt.source === 'google';
                  return (
                    <div
                      key={evt.id}
                      onClick={() => {
                        if (isGoogle && evt.googleEventId) {
                          const gEvt = googleEvents.find((e) => e.id === evt.googleEventId);
                          if (gEvt) setSelectedGoogleEvent(gEvt);
                        }
                        onNavigateTab('calendario');
                      }}
                      className={`p-3.5 sm:p-4 rounded-[24px] bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(23,23,23,0.02)] flex items-start gap-3.5 hover:shadow-[0_6px_20px_rgba(23,23,23,0.05)] transition-all cursor-pointer ${
                        isGoogle ? 'border-[#9DD7F5]/50' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-[16px] font-mono text-[11px] font-bold text-center shrink-0 min-w-[65px] ${
                        isGoogle ? 'bg-[#F0F9FE] text-[#171717] border border-[#9DD7F5]/40' : 'bg-[#FAF6ED] text-[#171717] border border-[#EAE3D2]'
                      }`}>
                        {evt.time ? evt.time.split(' - ')[0] : 'Hoy'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-[#171717] truncate">
                            {evt.title}
                          </p>
                          {isGoogle && (
                            <span className="text-[9px] font-bold text-[#171717] bg-[#F0F9FE] px-1.5 py-0.5 rounded-full shrink-0">
                              G-Cal
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#737373]">
                          <span className="font-semibold text-[#8C8578]">
                            {evt.time || evt.date}
                          </span>
                          {evt.location && (
                            <span className="inline-flex items-center gap-1 truncate max-w-[100px]">
                              <MapPin className="w-3 h-3 text-[#8C8578]" />
                              <span className="truncate">{evt.location}</span>
                            </span>
                          )}
                          <div className="ml-auto">
                            <CategoryBadge categoryId={evt.categoryId} size="sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Subsección: ESTACIONES EN ÓRBITA (Objetos de diseño) */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-extrabold tracking-dharma text-[#8C8578] uppercase px-1">
              Estaciones en Órbita
            </h3>

            <div className="space-y-2.5">
              {/* Transmisiones */}
              <div
                onClick={() => onNavigateTab('transmisiones')}
                className="p-3.5 rounded-[24px] bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(23,23,23,0.02)] hover:shadow-[0_6px_20px_rgba(23,23,23,0.05)] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[16px] bg-[#FFFBEA] border border-[#FFD84D]/40 text-[#171717] flex items-center justify-center font-bold text-sm">
                    📻
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#171717]">Transmisiones (Inbox)</p>
                    <p className="text-[11px] text-[#737373]">
                      {newTransmissionsCount > 0 ? `${newTransmissionsCount} por procesar` : 'Buzón al día'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C8578]" />
              </div>

              {/* Lectura activa en Biblioteca si existe */}
              {currentlyReadingBook && (
                <div
                  onClick={() => onNavigateTab('biblioteca')}
                  className="p-3.5 rounded-[24px] bg-gradient-to-r from-[#FFFBEA]/40 to-white border border-black/[0.04] hover:shadow-[0_6px_20px_rgba(23,23,23,0.05)] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-[16px] bg-[#FDF0F5] border border-[#F6A6C8]/40 text-[#171717] flex items-center justify-center font-bold text-sm shrink-0">
                      📖
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#171717] truncate">
                        {currentlyReadingBook.title}
                      </p>
                      <p className="text-[11px] text-[#737373] truncate">
                        Leyendo · {currentlyReadingBook.author}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C8578] shrink-0 ml-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

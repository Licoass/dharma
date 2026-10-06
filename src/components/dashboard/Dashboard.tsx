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
    <div className="flex flex-col space-y-6 sm:space-y-8 select-none">
      {/* ============================================================ */}
      {/* 1. HEADER (Móvil: Prioridad 1 | Desktop: Encabezado superior)   */}
      {/* ============================================================ */}
      <section className="order-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 sm:pt-2">
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Pequeña ilustración/mascota Dharma discreta que acompaña el saludo */}
          <div className="p-2 sm:p-2.5 rounded-[18px] bg-white shadow-[0_4px_16px_rgba(36,41,47,0.03)] shrink-0">
            <DharmaCore mood={dharmaMood} size="sm" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.06em] text-[#177468] uppercase">
                DHARMA
              </span>
              <span className="w-1 h-1 rounded-full bg-[#9DA6B5]/60" />
              <span className="text-xs text-[#697282] font-medium">
                Centro de Mando Personal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24292F] tracking-[0.03em] mt-0.5">
              Buenos días
            </h1>
            <p className="text-xs sm:text-sm text-[#697282] mt-0.5 font-medium">
              ¿Qué necesitas resolver hoy?
            </p>
          </div>
        </div>

        {/* Botón principal CAPTURAR (visible en desktop como acción de cabecera) */}
        <div className="hidden sm:block shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={onOpenCreateTask}
            icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            CAPTURAR
          </Button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. BOTÓN PRINCIPAL CAPTURAR (Móvil: Prioridad 2)             */}
      {/* ============================================================ */}
      <section className="order-2 sm:hidden w-full">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onOpenCreateTask}
          icon={<Plus className="w-5 h-5 stroke-[2.5]" />}
          className="shadow-[0_8px_24px_rgba(23,116,104,0.22)]"
        >
          CAPTURAR
        </Button>
      </section>

      {/* ============================================================ */}
      {/* 3. COMPOSICIÓN ADAPTABLE TABLET / DESKTOP / MÓVIL             */}
      {/* Móvil (<768px): Columna única vertical                       */}
      {/* Tablet (768px–1199px): Contenido principal 7 / Panel 5        */}
      {/* Desktop (1200px+): Contenido principal 8 / Panel 4            */}
      {/* ============================================================ */}
      <div className="order-3 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7 items-start">
        {/* COLUMNA DE CONTENIDO PRINCIPAL */}
        <div className="md:col-span-7 desktop:col-span-8 space-y-6 sm:space-y-7">
          {/* 3.1 TAREA PRIORITARIA (Hero) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#697282] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#EB6B6B]" />
                <span>Tarea Prioritaria</span>
              </h3>
              <span className="text-[11px] font-semibold text-[#177468]">
                Foco Principal
              </span>
            </div>

            {priorityTask ? (
              <div
                className="p-5 sm:p-7 rounded-[28px] bg-gradient-to-br from-white via-white to-[#F5F2EB]/50 shadow-[0_8px_30px_-4px_rgba(36,41,47,0.04)] transition-all hover:shadow-[0_14px_36px_-4px_rgba(36,41,47,0.07)]"
              >
                {/* Fila superior: Categoría, Prioridad y Estado */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-3.5">
                  <div className="flex items-center gap-2">
                    <CategoryBadge categoryId={priorityTask.categoryId} size="md" />
                    <PriorityBadge priority={priorityTask.priority} size="md" />
                  </div>
                  <StatusBadge statusId={priorityTask.statusId} size="md" />
                </div>

                {/* Título y descripción */}
                <h4 className="text-lg sm:text-xl font-bold text-[#24292F] leading-snug tracking-wide">
                  {priorityTask.title}
                </h4>

                {priorityTask.description && (
                  <p className="text-xs sm:text-sm text-[#697282] mt-1.5 leading-relaxed max-w-2xl">
                    {priorityTask.description}
                  </p>
                )}

                {/* Fila inferior: Fecha, Hora, y Acción de completado */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-black/[0.04]">
                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-[#697282] font-semibold">
                    <span className="inline-flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-full">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#177468]" />
                      <span>{priorityTask.dueDate || 'Hoy'}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-[#177468]" />
                      <span>{priorityTask.dueTime || '18:00'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditTask(priorityTask)}
                      className="text-xs font-bold text-[#697282] hover:text-[#24292F] px-3 py-1.5 rounded-full hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                    <Button
                      variant="pastel"
                      pastelColor="teal"
                      size="sm"
                      onClick={() => toggleTaskComplete(priorityTask.id)}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Completar
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card padding="md" className="text-center py-8">
                <p className="text-sm font-bold text-[#24292F]">Sin tareas prioritarias pendientes</p>
                <p className="text-xs text-[#697282] mt-1">Todas las tareas vitales han sido resueltas.</p>
              </Card>
            )}
          </section>

          {/* 3.2 ESTADO DEL SISTEMA (Grid 2 columnas en Tablet, 4 en Desktop) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#697282]">
                Estado del Sistema
              </h3>
              <span className="text-[11px] font-medium text-[#9DA6B5]">
                {metrics.total} totales
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
              {/* Pendientes */}
              <div
                onClick={() => {
                  setFilters((prev) => ({ ...prev, statusId: 'por_hacer' }));
                  onNavigateTab('tareas');
                }}
                className="p-4 rounded-[22px] bg-white shadow-[0_4px_20px_-2px_rgba(36,41,47,0.03)] hover:shadow-[0_8px_24px_-2px_rgba(36,41,47,0.06)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#697282]">Pendientes</span>
                  <div className="w-7 h-7 rounded-[10px] bg-[#F5F2EB] flex items-center justify-center text-[#9DA6B5]">
                    <Circle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#24292F]">
                    {metrics.pending}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-[#9DA6B5] mt-0.5">En espera</p>
                </div>
              </div>

              {/* En proceso */}
              <div
                onClick={() => {
                  setFilters((prev) => ({ ...prev, statusId: 'en_proceso' }));
                  onNavigateTab('tareas');
                }}
                className="p-4 rounded-[22px] bg-[#E8F6F4]/50 shadow-[0_4px_20px_-2px_rgba(36,41,47,0.03)] hover:shadow-[0_8px_24px_-2px_rgba(36,41,47,0.06)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#177468]">En proceso</span>
                  <div className="w-7 h-7 rounded-[10px] bg-[#E8F6F4] flex items-center justify-center text-[#177468]">
                    <PlayCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#177468]">
                    {metrics.inProgress}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-[#177468]/80 mt-0.5">Activas</p>
                </div>
              </div>

              {/* En espera */}
              <div
                onClick={() => {
                  setFilters((prev) => ({ ...prev, statusId: 'en_espera' }));
                  onNavigateTab('tareas');
                }}
                className="p-4 rounded-[22px] bg-[#FEF6E9]/50 shadow-[0_4px_20px_-2px_rgba(36,41,47,0.03)] hover:shadow-[0_8px_24px_-2px_rgba(36,41,47,0.06)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8E5B18]">En espera</span>
                  <div className="w-7 h-7 rounded-[10px] bg-[#FEF6E9] flex items-center justify-center text-[#8E5B18]">
                    <Hourglass className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#8E5B18]">
                    {metrics.waiting}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-[#8E5B18]/80 mt-0.5">Pausadas</p>
                </div>
              </div>

              {/* Completadas */}
              <div
                onClick={() => {
                  setFilters((prev) => ({ ...prev, statusId: 'completado' }));
                  onNavigateTab('tareas');
                }}
                className="p-4 rounded-[22px] bg-[#EEF6F0]/50 shadow-[0_4px_20px_-2px_rgba(36,41,47,0.03)] hover:shadow-[0_8px_24px_-2px_rgba(36,41,47,0.06)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#376841]">Completadas</span>
                  <div className="w-7 h-7 rounded-[10px] bg-[#EEF6F0] flex items-center justify-center text-[#376841]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#376841]">
                    {metrics.completed}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-[#376841]/80 mt-0.5">Verificadas</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3.3 HOY (Próximas tareas programadas) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#697282] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#177468]" />
                <span>Hoy</span>
              </h3>
              <button
                onClick={() => onNavigateTab('tareas')}
                className="text-xs font-semibold text-[#177468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver registro completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayTasks.length === 0 ? (
                <Card padding="md" className="text-center py-6 text-xs text-[#9DA6B5]">
                  No hay más tareas programadas para hoy.
                </Card>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 sm:p-4 rounded-[22px] bg-white shadow-[0_2px_12px_rgba(36,41,47,0.02)] flex items-center justify-between gap-3 hover:shadow-[0_6px_20px_rgba(36,41,47,0.04)] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="w-5 h-5 rounded-[8px] border-2 border-[#D0D6E0] hover:border-[#177468] flex items-center justify-center shrink-0 cursor-pointer"
                        aria-label="Completar"
                      />

                      <div className="min-w-0 truncate">
                        <p className="text-xs sm:text-sm font-bold text-[#24292F] truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-[#9DA6B5] font-semibold">
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
              <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#697282] flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#177468]" />
                <span>Agenda</span>
                {googleSyncStatus === 'connected' && (
                  <span className="text-[10px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full border border-[#4285F4]/20">
                    Google Sync
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('calendario')}
                className="text-xs font-semibold text-[#177468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver calendario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents.length === 0 ? (
                <Card padding="md" className="text-center py-6 text-xs text-[#9DA6B5]">
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
                      className={`p-3.5 sm:p-4 rounded-[22px] bg-white shadow-[0_2px_12px_rgba(36,41,47,0.02)] flex items-start gap-3.5 hover:shadow-[0_6px_20px_rgba(36,41,47,0.04)] transition-all cursor-pointer ${
                        isGoogle ? 'border border-[#4285F4]/15' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-[14px] font-mono text-[11px] font-bold text-center shrink-0 min-w-[65px] ${
                        isGoogle ? 'bg-[#E8F0FE] text-[#1A73E8]' : 'bg-[#FAF8F5] text-[#177468]'
                      }`}>
                        {evt.time ? evt.time.split(' - ')[0] : 'Hoy'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-[#24292F] truncate">
                            {evt.title}
                          </p>
                          {isGoogle && (
                            <span className="text-[9px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-1.5 py-0.5 rounded shrink-0">
                              G-Cal
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#697282]">
                          <span className="font-semibold text-[#9DA6B5]">
                            {evt.time || evt.date}
                          </span>
                          {evt.location && (
                            <span className="inline-flex items-center gap-1 truncate max-w-[100px]">
                              <MapPin className="w-3 h-3 text-[#9DA6B5]" />
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

          {/* Subsección: ESTACIONES COMPLEMENTARIAS (Tablet Widget) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#697282] px-1">
              Estaciones en Órbita
            </h3>

            <div className="space-y-2.5">
              {/* Transmisiones */}
              <div
                onClick={() => onNavigateTab('transmisiones')}
                className="p-3.5 rounded-[22px] bg-white shadow-[0_2px_12px_rgba(36,41,47,0.02)] hover:shadow-[0_6px_20px_rgba(36,41,47,0.04)] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[12px] bg-[#E8F6F4] text-[#177468] flex items-center justify-center font-bold text-xs">
                    📻
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#24292F]">Transmisiones (Inbox)</p>
                    <p className="text-[11px] text-[#9DA6B5]">
                      {newTransmissionsCount > 0 ? `${newTransmissionsCount} por procesar` : 'Todo procesado'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9DA6B5]" />
              </div>

              {/* Lectura activa en Biblioteca si existe */}
              {currentlyReadingBook && (
                <div
                  onClick={() => onNavigateTab('biblioteca')}
                  className="p-3.5 rounded-[22px] bg-gradient-to-r from-[#FAF8F5] to-white border border-black/[0.04] hover:shadow-[0_6px_20px_rgba(36,41,47,0.04)] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[12px] bg-[#FEF6E9] text-[#8E5B18] flex items-center justify-center font-bold text-xs shrink-0">
                      📖
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#24292F] truncate">
                        {currentlyReadingBook.title}
                      </p>
                      <p className="text-[11px] text-[#9DA6B5] truncate">
                        Leyendo · {currentlyReadingBook.author}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#9DA6B5] shrink-0 ml-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

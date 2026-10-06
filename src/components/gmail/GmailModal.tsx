import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  Search, 
  ExternalLink, 
  Check, 
  Mail, 
  Star, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  X,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { gmailService } from '../../services/gmailService';
import type { 
  GmailEmail, 
  GmailLabelFilter, 
  GoogleUser,
  TaskPriority 
} from '../../types';
import { useTaskContext } from '../../context/TaskContext';

export interface GmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

export const GmailModal: React.FC<GmailModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const { categories, addTask, tasks } = useTaskContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabelFilter, setSelectedLabelFilter] = useState<GmailLabelFilter>('ALL');
  const [emails, setEmails] = useState<GmailEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<GmailEmail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(gmailService.getCurrentUser());
  const [isConnected, setIsConnected] = useState(gmailService.isAuthenticated());

  // Estado para el panel de conversión de correo a tarea
  const [isConverting, setIsConverting] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategoryId, setTaskCategoryId] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('media');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Detectar correos que ya tienen tareas creadas asociadas (por coincidencia de notas o título)
  const convertedEmailIds = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.origin === 'Gmail' && t.notes) {
        emails.forEach((e) => {
          if (t.notes?.includes(e.id) || t.title.toLowerCase() === e.subject.toLowerCase()) {
            set.add(e.id);
          }
        });
      }
    });
    return set;
  }, [tasks, emails]);

  // Cargar lista de correos
  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const results = await gmailService.searchEmails({
        query: searchQuery,
        labelFilter: selectedLabelFilter,
      });
      setEmails(results);

      // Auto-seleccionar el primer correo si no hay ninguno seleccionado
      if (results.length > 0 && !selectedEmail) {
        setSelectedEmail(results[0]);
      }
    } catch (err) {
      console.error('Error buscando correos de Gmail', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsConnected(gmailService.isAuthenticated());
      setUser(gmailService.getCurrentUser());
      fetchEmails();
      setSuccessMessage(null);
      setIsConverting(false);
    }
  }, [isOpen, selectedLabelFilter]);

  // Búsqueda en vivo al escribir
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchEmails();
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { user } = await gmailService.loginWithGoogle();
      setUser(user);
      setIsConnected(true);
      await fetchEmails();
    } catch (err) {
      console.error('Error conectando Gmail', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Preparar formulario para convertir el correo en tarea
  const handleStartConversion = (email: GmailEmail) => {
    setSelectedEmail(email);
    setIsConverting(true);

    const cleanTitle = email.subject.replace(/^(re|fwd|rv):\s*/gi, '').trim();
    setTaskTitle(cleanTitle || 'Revisar correo de ' + email.from.name);

    const suggestedCat = gmailService.suggestCategoryForEmail(email, categories);
    setTaskCategoryId(suggestedCat);

    const suggestedPriority = gmailService.suggestPriorityForEmail(email);
    setTaskPriority(suggestedPriority);

    const todayStr = new Date().toISOString().slice(0, 10);
    setTaskDueDate(todayStr);

    setSuccessMessage(null);
  };

  const handleConfirmCreateTask = () => {
    if (!selectedEmail) return;

    const taskPayload = gmailService.convertEmailToTaskInput(selectedEmail, categories, {
      title: taskTitle.trim(),
      categoryId: taskCategoryId,
      priority: taskPriority,
      dueDate: taskDueDate,
    });

    addTask(taskPayload);

    setSuccessMessage(`✓ Tarea creada exitosamente: «${taskTitle.trim()}»`);
    setIsConverting(false);

    if (onTaskCreated) onTaskCreated();

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="lg"
    >
      <div className="space-y-4 select-none -mt-3">
        {/* ENCABEZADO CON IDENTIDAD DE GMAIL */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE8E1]">
          <div className="flex items-center gap-3">
            {/* Logo de Gmail */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FCE8E6] to-[#FFFFFF] border border-[#FAD2CF] flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M1.5 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h3.75v-8.25L1.5 8.25z" />
                <path fill="#34A853" d="M22.5 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-3.75v-8.25l5.25-3.75z" />
                <path fill="#EA4335" d="M17.25 12V3.75L12 7.5 6.75 3.75V12z" />
                <path fill="#FBBC04" d="M1.5 5.25l10.5 7.5 10.5-7.5V4.5a1.5 1.5 0 0 0-2.4-1.2L12 8.55 3.9 3.3a1.5 1.5 0 0 0-2.4 1.2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#24292F]">
                  Explorador de Gmail
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#FCE8E6] text-[#D93025] px-2 py-0.5 rounded-full">
                  FASE 12
                </span>
              </div>
              <p className="text-xs text-[#697282]">
                Fuente de información para buscar correos y convertirlos en tareas de DHARMA.
              </p>
            </div>
          </div>

          {/* Estado de conexión */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isConnected ? (
              <div className="flex items-center gap-2 bg-[#F5F2EB]/60 px-3 py-1.5 rounded-full border border-[#EBE8E1]">
                <span className="w-2 h-2 rounded-full bg-[#137333] animate-pulse" />
                <span className="text-xs text-[#24292F] font-medium">
                  {user?.email || 'Conectado'}
                </span>
              </div>
            ) : (
              <Button
                variant="pastel"
                pastelColor="coral"
                size="sm"
                onClick={handleConnect}
                disabled={isLoading}
                icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              >
                Conectar Gmail
              </Button>
            )}
          </div>
        </div>

        {/* AVISO IMPORTANTE: LÍMITES Y FILOSOFÍA DE INTEGRACIÓN */}
        <div className="p-3.5 rounded-[18px] bg-gradient-to-r from-[#FEF6EC] to-[#F5F2EB] border border-[#F59E0B]/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs text-[#24292F] leading-relaxed">
            <span className="font-bold text-[#D97706]">Fuente de Información Externa:</span>{' '}
            DHARMA no reemplaza a tu cliente de correo. Gmail sigue siendo Gmail. Esta herramienta te permite consultar correos para convertirlos en tareas estructuradas con un solo clic.
          </div>
        </div>

        {/* FEEDBACK DE TAREA CREADA EXITOSAMENTE */}
        {successMessage && (
          <div className="p-3.5 rounded-[16px] bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#137333]" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-[#137333]/70 hover:text-[#137333] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. BARRA DE BÚSQUEDA Y FILTROS RÁPIDOS */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9DA6B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por asunto, remitente o palabra clave (ej: fotos, caudal, remesas)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-[18px] bg-[#F5F2EB]/60 text-xs sm:text-sm text-[#24292F] placeholder:text-[#9DA6B5] border border-[#EBE8E1] focus:ring-2 focus:ring-[#D93025]/15 outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA6B5] hover:text-[#24292F] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtros de etiquetas */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'INBOX', label: 'Recibidos' },
              { id: 'UNREAD', label: 'No leídos' },
              { id: 'IMPORTANT', label: 'Importantes' },
              { id: 'STARRED', label: 'Destacados' },
            ].map((f) => {
              const isSelected = selectedLabelFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedLabelFilter(f.id as GmailLabelFilter)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#24292F] text-white shadow-xs'
                      : 'bg-[#F5F2EB] text-[#697282] hover:bg-[#EBE7DD]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PANEL PRINCIPAL: LISTADO Y DETALLE DEL CORREO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 min-h-[360px] max-h-[460px]">
          {/* LISTA DE CORREOS (Columna izquierda) */}
          <div
            className={`md:col-span-5 space-y-2 overflow-y-auto pr-1 ${
              selectedEmail && isConverting ? 'hidden md:block' : 'block'
            }`}
          >
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-[#D93025] animate-spin" />
                <p className="text-xs text-[#697282]">Consultando Gmail...</p>
              </div>
            ) : emails.length === 0 ? (
              <div className="py-10 text-center space-y-2 bg-[#FAF8F5] rounded-[20px] p-4">
                <Mail className="w-8 h-8 text-[#9DA6B5] mx-auto opacity-60" />
                <p className="text-xs font-bold text-[#24292F]">
                  No se encontraron correos
                </p>
                <p className="text-[11px] text-[#697282]">
                  Prueba con otro término de búsqueda.
                </p>
              </div>
            ) : (
              emails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const hasTask = convertedEmailIds.has(email.id);

                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmail(email);
                      setIsConverting(false);
                    }}
                    className={`p-3 rounded-[18px] border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-[#D93025]/40 shadow-xs ring-2 ring-[#D93025]/10'
                        : 'bg-white hover:bg-[#FAF8F5] border-[#EBE8E1]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {email.isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#1A73E8] shrink-0" />
                        )}
                        <span className="text-xs font-bold text-[#24292F] truncate">
                          {email.from.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#9DA6B5] shrink-0">
                        {email.date.slice(5, 16)}
                      </span>
                    </div>

                    <h5 className={`text-xs truncate ${email.isUnread ? 'font-bold text-[#24292F]' : 'font-medium text-[#484F58]'}`}>
                      {email.subject}
                    </h5>

                    <p className="text-[11px] text-[#697282] line-clamp-2 mt-0.5 leading-snug">
                      {email.snippet}
                    </p>

                    {/* Insignias de estado */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {hasTask && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Tarea en DHARMA
                        </span>
                      )}
                      {email.isImportant && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FEF7E0] text-[#B06000]">
                          Importante
                        </span>
                      )}
                      {email.isStarred && (
                        <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DETALLE Y CONVERSIÓN DE CORREO (Columna derecha) */}
          <div className="md:col-span-7 bg-[#FAF8F5] rounded-[22px] border border-[#EBE8E1] p-4 flex flex-col justify-between overflow-y-auto">
            {selectedEmail ? (
              <div className="space-y-3.5 flex-1 flex flex-col">
                {/* Botón volver en móvil si está convirtiendo */}
                {isConverting && (
                  <button
                    onClick={() => setIsConverting(false)}
                    className="md:hidden flex items-center gap-1 text-xs text-[#697282] hover:text-[#24292F] font-bold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Volver al correo
                  </button>
                )}

                {/* VISTA A: INFORMACIÓN BÁSICA DEL CORREO */}
                {!isConverting ? (
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Encabezado del correo */}
                      <div className="border-b border-[#EBE8E1] pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-[#24292F] leading-snug">
                            {selectedEmail.subject}
                          </h4>
                          <a
                            href={selectedEmail.gmailWebLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl text-[#697282] hover:text-[#D93025] hover:bg-[#FCE8E6] transition-colors shrink-0"
                            title="Abrir este correo en Gmail"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs text-[#697282]">
                          <div>
                            <span className="font-bold text-[#24292F]">De: </span>
                            <span>{selectedEmail.from.name}</span>{' '}
                            <span className="text-[11px] text-[#9DA6B5]">&lt;{selectedEmail.from.email}&gt;</span>
                          </div>
                          <div className="text-[11px] font-mono text-[#9DA6B5]">
                            {selectedEmail.date}
                          </div>
                        </div>
                      </div>

                      {/* Cuerpo legible básico */}
                      <div className="p-3.5 rounded-[16px] bg-white border border-[#EBE8E1] text-xs text-[#24292F] leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto">
                        {selectedEmail.bodyText || selectedEmail.snippet}
                      </div>
                    </div>

                    {/* Acciones principales del correo */}
                    <div className="pt-3 border-t border-[#EBE8E1] flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={selectedEmail.gmailWebLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#697282] hover:text-[#D93025] transition-colors py-1 cursor-pointer"
                      >
                        <span>Abrir en Gmail</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartConversion(selectedEmail)}
                        icon={<Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />}
                      >
                        Convertir en Tarea
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* VISTA B: FORMULARIO DE CONVERSIÓN EN TAREA DHARMA */
                  <div className="space-y-3.5 flex-1 flex flex-col justify-between animate-fadeIn">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#EBE8E1]">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#177468]" />
                          <h4 className="text-xs sm:text-sm font-bold text-[#24292F]">
                            Crear Tarea desde Correo
                          </h4>
                        </div>
                        <button
                          onClick={() => setIsConverting(false)}
                          className="text-xs text-[#697282] hover:text-[#24292F] cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>

                      <div className="space-y-3 mt-3">
                        {/* Título de la tarea */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#697282] uppercase mb-1">
                            Título de la Tarea
                          </label>
                          <input
                            type="text"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-[14px] bg-white border border-[#EBE8E1] text-xs font-semibold text-[#24292F] focus:outline-none focus:ring-2 focus:ring-[#177468]/20"
                          />
                        </div>

                        {/* Categoría y Prioridad */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-[#697282] uppercase mb-1">
                              Categoría DHARMA
                            </label>
                            <select
                              value={taskCategoryId}
                              onChange={(e) => setTaskCategoryId(e.target.value)}
                              className="w-full px-3 py-2 rounded-[14px] bg-white border border-[#EBE8E1] text-xs font-semibold text-[#24292F] focus:outline-none"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#697282] uppercase mb-1">
                              Prioridad
                            </label>
                            <select
                              value={taskPriority}
                              onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                              className="w-full px-3 py-2 rounded-[14px] bg-white border border-[#EBE8E1] text-xs font-semibold text-[#24292F] focus:outline-none"
                            >
                              <option value="baja">Baja</option>
                              <option value="media">Media</option>
                              <option value="alta">Alta</option>
                              <option value="vital">Vital</option>
                            </select>
                          </div>
                        </div>

                        {/* Fecha de vencimiento */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#697282] uppercase mb-1">
                            Fecha de Vencimiento
                          </label>
                          <input
                            type="date"
                            value={taskDueDate}
                            onChange={(e) => setTaskDueDate(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-[14px] bg-white border border-[#EBE8E1] text-xs text-[#24292F] font-semibold focus:outline-none"
                          />
                        </div>

                        {/* Origen y Referencia */}
                        <div className="p-2.5 rounded-[12px] bg-[#E8F0FE]/60 border border-[#D2E3FC] text-[11px] text-[#1A73E8] flex items-center justify-between">
                          <span className="font-semibold">Origen: Gmail (enlace automático guardado)</span>
                          <span className="font-mono text-[10px]">{selectedEmail.from.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EBE8E1]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsConverting(false)}
                      >
                        Atrás
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleConfirmCreateTask}
                        icon={<Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      >
                        Crear Tarea en DHARMA
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-[#9DA6B5] space-y-2">
                <Mail className="w-10 h-10 mx-auto opacity-50" />
                <p className="text-xs">Selecciona un correo para ver su información y convertirlo en tarea.</p>
              </div>
            )}
          </div>
        </div>

        {/* PIE DEL MODAL */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EBE8E1] text-xs text-[#9DA6B5]">
          <span>{emails.length} correo(s) listados</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

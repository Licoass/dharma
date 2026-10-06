import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Layers, 
  Sliders,
  FileText,
  Bookmark,
  BookOpen,
  Radio,
  Calendar,
  Sparkles,
  ArrowRight,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTaskContext } from '../../context/TaskContext';
import { DharmaCore } from '../common/DharmaCore';
import { GmailModal } from '../gmail/GmailModal';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import type { NavTab } from '../../types';

export interface MoreViewProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const MoreView: React.FC<MoreViewProps> = ({ onNavigateTab }) => {
  const { 
    tasks, 
    resetToDefaults, 
    categories, 
    openDharmaCore,
    openGoogleCalendarModal,
    googleSyncStatus,
    googleEvents,
    googleUser
  } = useTaskContext();
  const { isInstallable, isStandalone, installPwa } = usePwaInstall();
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dharma_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          localStorage.setItem('dharma_tasks_v3', JSON.stringify(imported));
          window.location.reload();
        } else {
          alert('El archivo no contiene un formato de tareas válido para DHARMA.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const roadmap = [
    {
      phase: 'FASE 1',
      title: 'Sistema Visual Dharma',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'App Shell, Sidebar, Bottom Navigation, Header, Dashboard',
        'Sistema de tokens centralizado (colores suaves, sombras, tipografía)',
        'Componentes reutilizables: Card, Button, Badge, Modal, Input',
        'Diseño pastel, orgánico, espacioso y sin recargo visual',
      ],
    },
    {
      phase: 'FASE 2',
      title: 'Dashboard Dharma',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Saludo contextual y frase "¿Qué necesitas resolver hoy?"',
        'Botón principal CAPTURAR con accesibilidad mobile-first',
        'Estado del sistema con métricas reactivas por estado',
        'Tarea prioritaria con selector inteligente de foco',
        'Ilustración discreta de Dharma Core integrada armónicamente',
      ],
    },
    {
      phase: 'FASE 3',
      title: 'Sistema de Tareas Completo',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Modelo completo: título, descripción, categoría, estado, prioridad, fecha, hora, etiquetas, subtareas, notas, origen',
        'Categorías y Estados como entidades 100% configurables',
        'Vista LISTA limpia y compacta con progreso de subtareas',
        'Vista KANBAN con drag-and-drop interactivo',
        'Desplazamiento horizontal fluido en móviles sin comprimir tarjetas',
      ],
    },
    {
      phase: 'FASE 4',
      title: 'Calendario Visual Unificado',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Visualización unificada: tareas con fecha/hora, eventos y recordatorios locales',
        'Vistas: Mes (cuadrícula orgánica), Semana (columnas fluidas) y Agenda',
        'Layout adaptativo: Móvil (Agenda), Tablet (Semana), Desktop (Mes + panel lateral)',
        'Tarjetas suaves y coloridas respetando el lenguaje visual DHARMA',
        'Sin líneas rígidas empresariales; datos locales listos para futura sincronización',
      ],
    },
    {
      phase: 'FASE 5',
      title: 'Registros y Archivo',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Módulo Registros para notas personales con categorías, checklist interactivo, etiquetas y enlaces',
        'Módulo Archivo con tarjetas visuales ricas para enlaces (imagen, título, dominio, descripción, etiquetas, abrir)',
        'Búsqueda en tiempo real, filtros por categoría y favoritos en ambos módulos',
        'Intercambiador directo Registros ↔ Archivo y acceso completo responsive',
      ],
    },
    {
      phase: 'FASE 6',
      title: 'Biblioteca de Libros',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Módulo Biblioteca con estados: Quiero leer, Leyendo, Terminado y Abandonado',
        'Tarjetas suaves con portada, título, autor, insignia de estado y etiquetas',
        'Cuadrícula responsive: 2 columnas en móvil, 3 en tablet, 4+ en desktop',
        'Filtros por estado con métricas en tiempo real, búsqueda y destacados',
      ],
    },
    {
      phase: 'FASE 7',
      title: 'Transmisiones (Inbox)',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Módulo Inbox para material crudo con tipos: Texto, Audio, Enlace e Imagen',
        'Opciones funcionales para Texto y Enlace; interfaz preparada para Audio con visualizador de ondas',
        'Estados de procesamiento: Nueva, Procesando, Procesada y Archivada',
        'Estética de estación de comunicaciones moderna y pastel (sin pantalla terminal ni estética militar)',
        'Acción rápida para convertir transmisiones directamente en tareas o notas',
      ],
    },
    {
      phase: 'FASE 8',
      title: 'Dharma Core (Integración Gemini)',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Motor de extracción semántica para convertir texto libre en tareas y protocolos',
        'Detección inteligente de tareas múltiples, categorías (Ocupamor, etc.) y fechas relativas (mañana, etc.)',
        'Pantalla de confirmación obligatoria previa al guardado: [Aceptar todo], [Editar] y [Descartar]',
        'Llamada segura a Gemini mediante Supabase Edge Functions sin exponer API keys en el frontend',
      ],
    },
    {
      phase: 'FASE 9',
      title: 'Captura de Audio & Dharma Core',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Grabación móvil: botón grande 🎙 con «Mantén presionado para hablar» (touch & pointer hold)',
        'Grabación desktop: botón «Iniciar grabación» y «Detener grabación»',
        'Cronómetro en vivo (00:00, 00:01, 00:02...) con visualizador de ondas reactivas',
        'Acciones al terminar: Reproducir (reproductor interactivo), Descartar y Procesar con DHARMA CORE',
        'Almacenamiento temporal en Supabase Storage (bucket audio-transmissions) y llamada multimodal con Gemini',
        'Extracción con IA: transcribir, identificar tareas, categorías, fechas y prioridades',
        'Seguridad y control: nunca crea tareas automáticamente sin confirmación explícita del usuario',
      ],
    },
    {
      phase: 'FASE 10',
      title: 'Google Calendar (Solo Lectura)',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Autenticación Google OAuth 2.0 (Google Identity Services + Demo local seguro)',
        'Integración de lectura directa con la API de Google Calendar v3',
        'Eventos externos integrados en Mes, Semana, Agenda y Dashboard',
        'Insignias visuales distintivas «Google Calendar» y «Solo lectura»',
        'Modal de detalle con enlace directo a Google Meet y vista web del evento',
        'Arquitectura preparada para operaciones de creación, edición y eliminación en fases posteriores',
      ],
    },
    {
      phase: 'FASE 11',
      title: 'Google Drive (Buscador & Recursos de Archivo)',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Integración con Google Drive API v3 y Google OAuth 2.0',
        'Buscador y explorador de archivos con filtros por tipo (Docs, Sheets, Slides, PDFs, Carpetas)',
        'Vinculación de archivos como recursos dentro de ARCHIVO sin copiar archivos a Supabase',
        'Almacenamiento exclusivo de referencia ligera (URL, id, metadata y miniatura)',
        'Apertura directa del archivo en Google Drive en nueva pestaña al interactuar con el recurso',
      ],
    },
    {
      phase: 'FASE 12',
      title: 'Gmail (Fuente de Información)',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Integración con Gmail API v3 y Google OAuth 2.0',
        'Buscador y explorador de correos por asunto, remitente y contenido en tiempo real',
        'Visualización limpia de información básica (remitente, fecha, extracto y mensaje)',
        'Conversión fluida de correos en tareas DHARMA con categoría y prioridad sugeridas',
        'Límites respetados: DHARMA no reemplaza al cliente de correo, lo utiliza como fuente de información',
      ],
    },
    {
      phase: 'FASE 13',
      title: 'Experiencia Móvil (Android PWA)',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Web App Manifest con iconos adaptativos maskable (192px y 512px)',
        'Service Worker con precache de App Shell y soporte offline resiliente',
        'Navegación inferior táctil con objetivos mínimos de 48px y botón FAB centrado de 56px',
        'Grabación de audio táctil optimizada con halos reactivos y prevención de scroll',
        'Eliminación de dependencias de hover y prevención de auto-zoom en inputs',
        'Arquitectura preparada para empaquetado nativo a APK/AAB mediante Capacitor',
      ],
    },
    {
      phase: 'FASE 14+',
      title: 'Empaquetado APK/AAB (Capacitor) & Nube',
      status: 'pendiente',
      badge: 'SIGUIENTES FASES',
      items: [
        'Empaquetado directo de la PWA como APK y AAB mediante Capacitor para Google Play Store',
        'Persistencia en tiempo real en Supabase Database multidispositivo',
        'Operaciones de escritura en Google Calendar (crear, editar, eliminar)',
        'Notificaciones push nativas en Android con recordatorios de tareas',
      ],
    },
  ];

  return (
    <div className="space-y-7 pb-12 max-w-5xl mx-auto select-none">
      {/* BANNERS PRINCIPALES: DHARMA CORE, CALENDAR, DRIVE & GMAIL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* BANNER DHARMA CORE IA */}
        <Card
          padding="md"
          className="bg-gradient-to-r from-[#E8F6F4] via-white to-[#FEF6EC] border border-[#177468]/15 cursor-pointer hover:shadow-[0_8px_24px_rgba(23,116,104,0.12)] transition-all"
          onClick={() => openDharmaCore()}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <DharmaCore mood="celebrate" size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#177468] uppercase bg-[#E8F6F4] px-2 py-0.5 rounded-full">
                    DHARMA CORE ONLINE
                  </span>
                  <span className="text-[10px] font-mono text-[#D48B38]">GEMINI FLASH</span>
                </div>
                <h3 className="text-sm font-bold text-[#24292F] mt-0.5">
                  Extracción Semántica IA
                </h3>
                <p className="text-[11px] text-[#697282] line-clamp-1">
                  Convierte texto y voz en tareas estructuradas.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openDharmaCore();
              }}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Abrir
            </Button>
          </div>
        </Card>

        {/* BANNER GOOGLE CALENDAR OAUTH */}
        <Card
          padding="md"
          className="bg-gradient-to-r from-[#E8F0FE] via-white to-[#F8F9FA] border border-[#4285F4]/20 cursor-pointer hover:shadow-[0_8px_24px_rgba(66,133,244,0.12)] transition-all"
          onClick={() => openGoogleCalendarModal()}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F0FE] flex items-center justify-center shrink-0 border border-[#D2E3FC]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    googleSyncStatus === 'connected'
                      ? 'bg-[#E6F4EA] text-[#137333]'
                      : 'bg-[#F1F3F4] text-[#5F6368]'
                  }`}>
                    {googleSyncStatus === 'connected' ? 'CONECTADO (SOLO LECTURA)' : 'GOOGLE CALENDAR'}
                  </span>
                  {googleEvents.length > 0 && (
                    <span className="text-[10px] font-mono text-[#1A73E8]">
                      {googleEvents.length} eventos
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#24292F] mt-0.5">
                  {googleUser ? googleUser.email : 'Google Calendar'}
                </h3>
                <p className="text-[11px] text-[#697282] line-clamp-1">
                  Sincroniza eventos de tu cuenta externa en vistas DHARMA.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openGoogleCalendarModal();
              }}
              icon={<Calendar className="w-3.5 h-3.5 text-[#1A73E8]" />}
            >
              Gestionar
            </Button>
          </div>
        </Card>

        {/* BANNER GOOGLE DRIVE */}
        <Card
          padding="md"
          className="bg-gradient-to-r from-[#FEF6EC] via-white to-[#F8F9FA] border border-[#F59E0B]/20 cursor-pointer hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)] transition-all"
          onClick={() => onNavigateTab && onNavigateTab('archivo')}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF6EC] flex items-center justify-center shrink-0 border border-[#FDE68A]">
                <svg className="w-5 h-5" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FEF6EC] text-[#D97706]">
                    GOOGLE DRIVE
                  </span>
                  <span className="text-[10px] font-mono text-[#D97706]">ENLACE DIRECTO</span>
                </div>
                <h3 className="text-sm font-bold text-[#24292F] mt-0.5">
                  Archivos de Drive
                </h3>
                <p className="text-[11px] text-[#697282] line-clamp-1">
                  Explora y vincula a Archivo sin descargas en Supabase.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigateTab) onNavigateTab('archivo');
              }}
              icon={<ArrowRight className="w-3.5 h-3.5 text-[#D97706]" />}
            >
              Explorar
            </Button>
          </div>
        </Card>

        {/* BANNER GMAIL */}
        <Card
          padding="md"
          className="bg-gradient-to-r from-[#FCE8E6] via-white to-[#F8F9FA] border border-[#EA4335]/20 cursor-pointer hover:shadow-[0_8px_24px_rgba(234,67,53,0.12)] transition-all"
          onClick={() => setIsGmailModalOpen(true)}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FCE8E6] flex items-center justify-center shrink-0 border border-[#FAD2CF]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M1.5 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h3.75v-8.25L1.5 8.25z" />
                  <path fill="#34A853" d="M22.5 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-3.75v-8.25l5.25-3.75z" />
                  <path fill="#EA4335" d="M17.25 12V3.75L12 7.5 6.75 3.75V12z" />
                  <path fill="#FBBC04" d="M1.5 5.25l10.5 7.5 10.5-7.5V4.5a1.5 1.5 0 0 0-2.4-1.2L12 8.55 3.9 3.3a1.5 1.5 0 0 0-2.4 1.2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FCE8E6] text-[#D93025]">
                    GMAIL
                  </span>
                  <span className="text-[10px] font-mono text-[#D93025]">TAREAS</span>
                </div>
                <h3 className="text-sm font-bold text-[#24292F] mt-0.5">
                  Correos Gmail
                </h3>
                <p className="text-[11px] text-[#697282] line-clamp-1">
                  Convierte correos en tareas estructuradas.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsGmailModalOpen(true);
              }}
              icon={<ArrowRight className="w-3.5 h-3.5 text-[#D93025]" />}
            >
              Consultar
            </Button>
          </div>
        </Card>
      </div>
      {/* 0. ACCESO RÁPIDO A MÓDULOS ACTIVOS */}
      {onNavigateTab && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          <Card 
            padding="md" 
            className="group cursor-pointer hover:shadow-[0_8px_24px_rgba(23,116,104,0.10)] transition-all bg-gradient-to-br from-white to-[#F9FAF8] border border-[#EBE8E1]"
            onClick={() => onNavigateTab('transmisiones')}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#E8F6F4] text-[#177468] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#177468] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Abrir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#24292F] mb-0.5">Transmisiones</h3>
            <p className="text-[11px] text-[#697282] leading-snug line-clamp-2">
              Buzón Inbox para notas crudas, audios y enlaces.
            </p>
          </Card>

          <Card 
            padding="md" 
            className="group cursor-pointer hover:shadow-[0_8px_24px_rgba(23,116,104,0.10)] transition-all bg-gradient-to-br from-white to-[#F9FAF8] border border-[#EBE8E1]"
            onClick={() => onNavigateTab('registros')}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#E8F6F4] text-[#177468] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#177468] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Abrir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#24292F] mb-0.5">Registros</h3>
            <p className="text-[11px] text-[#697282] leading-snug line-clamp-2">
              Bitácora y notas personales con checklist y etiquetas.
            </p>
          </Card>

          <Card 
            padding="md" 
            className="group cursor-pointer hover:shadow-[0_8px_24px_rgba(23,116,104,0.10)] transition-all bg-gradient-to-br from-white to-[#F9FAF8] border border-[#EBE8E1]"
            onClick={() => onNavigateTab('archivo')}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#FEF6EC] text-[#D48B38] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#D48B38] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Abrir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#24292F] mb-0.5">Archivo</h3>
            <p className="text-[11px] text-[#697282] leading-snug line-clamp-2">
              Colección visual de enlaces con miniaturas y dominio.
            </p>
          </Card>

          <Card 
            padding="md" 
            className="group cursor-pointer hover:shadow-[0_8px_24px_rgba(23,116,104,0.10)] transition-all bg-gradient-to-br from-white to-[#F9FAF8] border border-[#EBE8E1]"
            onClick={() => onNavigateTab('biblioteca')}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#2E7D32] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Abrir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#24292F] mb-0.5">Biblioteca</h3>
            <p className="text-[11px] text-[#697282] leading-snug line-clamp-2">
              Estación de lecturas, progreso y libros guardados.
            </p>
          </Card>
        </div>
      )}

      {/* 1. CATEGORÍAS CONFIGURADAS */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Layers className="w-4 h-4 text-[#177468]" />
          <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#697282]">
            Categorías del Sistema ({categories.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {categories.map((cat) => (
            <Card key={cat.id} padding="md" className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-bold text-sm text-[#24292F] truncate">{cat.name}</span>
                </div>
              </div>
              <p className="text-xs text-[#697282] leading-relaxed line-clamp-2">
                {cat.description || 'Categoría activa en Dharma'}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. EXPERIENCIA MÓVIL & ANDROID PWA */}
      <Card padding="lg" className="border border-[#177468]/20 bg-gradient-to-br from-white via-[#FAF8F5] to-[#E8F6F4]/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F6F4] text-[#177468] flex items-center justify-center shrink-0 border border-[#177468]/20">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#24292F]">
                  EXPERIENCIA MÓVIL ANDROID (PWA)
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isStandalone
                    ? 'bg-[#E6F4EA] text-[#137333]'
                    : isInstallable
                    ? 'bg-[#FEF7E0] text-[#B06000]'
                    : 'bg-[#F1F3F4] text-[#5F6368]'
                }`}>
                  {isStandalone ? 'APP INSTALADA (STANDALONE)' : isInstallable ? 'LISTA PARA INSTALAR' : 'PWA ACTIVA'}
                </span>
              </div>
              <p className="text-xs text-[#697282] mt-0.5">
                Optimizada con sensación nativa, navegación inferior por gestos, soporte offline y sin menús diminutos.
              </p>
            </div>
          </div>

          {isInstallable && !isStandalone && (
            <Button
              variant="primary"
              size="md"
              onClick={installPwa}
              icon={<Download className="w-4 h-4 stroke-[2.5]" />}
            >
              Instalar en Android
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#484F58]">
          <div className="p-3 rounded-2xl bg-white/80 border border-[#EBE8E1] space-y-1">
            <div className="font-bold text-[#24292F] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#177468]" />
              <span>Navegación Táctil 48px+</span>
            </div>
            <p className="text-[11px] text-[#697282]">
              Objetivos táctiles confortables, botón de captura FAB de 56px y zonas seguras de barra de gestos.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-[#EBE8E1] space-y-1">
            <div className="font-bold text-[#24292F] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#177468]" />
              <span>Sin Dependencia de Hover</span>
            </div>
            <p className="text-[11px] text-[#697282]">
              Todas las acciones accesibles por toque directo, sin menús inaccesibles en pantallas táctiles.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-[#EBE8E1] space-y-1">
            <div className="font-bold text-[#24292F] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#177468]" />
              <span>Preparado para Capacitor</span>
            </div>
            <p className="text-[11px] text-[#697282]">
              Estructura lista para compilar directamente a APK o AAB para Google Play Store en fases posteriores.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. PLAN DE DESARROLLO POR FASES (ROADMAP) */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6 pb-2">
          <div>
            <h3 className="text-lg font-bold text-[#24292F] tracking-[0.03em]">
              PROGRESIÓN POR FASES
            </h3>
            <p className="text-xs text-[#697282] mt-0.5">
              Construcción secuencial verificando cada etapa antes de avanzar
            </p>
          </div>
          <DharmaCore mood="calm" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-[22px] transition-all ${
                item.status === 'completada'
                  ? 'bg-[#E8F6F4]/50'
                  : 'bg-[#F5F2EB]/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold tracking-wider text-[#177468]">
                  {item.phase}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === 'completada'
                      ? 'bg-[#177468] text-white'
                      : 'bg-white/80 text-[#697282]'
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#24292F] mb-2">
                {item.title}
              </h4>

              <ul className="space-y-1.5 text-xs text-[#697282]">
                {item.items.map((sub, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        item.status === 'completada' ? 'bg-[#177468]' : 'bg-[#9DA6B5]'
                      }`}
                    />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. GESTIÓN DE DATOS LOCALES */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-4 h-4 text-[#177468]" />
          <h3 className="text-base sm:text-lg font-bold text-[#24292F] tracking-[0.03em]">
            CONTROL DE DATOS LOCALES
          </h3>
        </div>
        <p className="text-xs text-[#697282] mb-6">
          Durante la Fase 1, todos los datos residen en el almacenamiento de tu navegador. Puedes exportar o importar tus copias en cualquier momento.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleExportJSON}
            icon={<Download className="w-4 h-4" />}
          >
            Exportar JSON
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-4 h-4" />}
          >
            Importar JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />

          <Button
            variant="pastel"
            pastelColor="teal"
            size="md"
            onClick={() => {
              if (window.confirm('¿Deseas restaurar los registros a los ejemplos iniciales?')) {
                resetToDefaults();
              }
            }}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Restaurar Demo
          </Button>
        </div>
      </Card>

      {/* MODAL DE GMAIL (FASE 12) */}
      <GmailModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
      />
    </div>
  );
};

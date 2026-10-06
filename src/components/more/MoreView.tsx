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
  CheckCircle2,
  Bell,
  Cloud
} from 'lucide-react';
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
    googleUser,
    cloudSyncStatus,
    lastSyncedAt,
    triggerManualSync,
    notificationPermission,
    requestNotificationPermission,
    sendTestNotification
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
      phase: 'FASE 14',
      title: 'Experiencia Tablet (Tercera Experiencia Dedicada)',
      status: 'completada',
      badge: 'VERIFICADO',
      items: [
        'Breakpoints específicos: Mobile (< 768px), Tablet (768px – 1199px), Desktop (1200px+)',
        'Sidebar compacto táctil (80px) con iconos centrados, badges compactos y FAB de captura integrado',
        'Composición dedicada de Dashboard: contenido principal fluido + panel lateral integrado de Agenda y Google Calendar',
        'Grids adaptativos de 2 y 3 columnas en Tareas (lista 2 cols), Biblioteca (3 cols exactas) y Archivo',
        'Paneles laterales sticky cuando existe espacio sin estirar ni encoger interfaces desktop',
      ],
    },
    {
      phase: 'FASE 15+',
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
    <div className="space-y-8 pb-16 max-w-5xl mx-auto select-none">
      {/* HEADER EDITORIAL DE SECCIÓN */}
      <div className="pt-2 pb-1">
        <span className="text-[11px] font-bold uppercase tracking-dharma text-[#8C827A] block mb-1">
          SISTEMA & CONFIGURACIÓN
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-display text-[#171717] tracking-tight">
          Centro de Control Dharma
        </h1>
        <p className="text-sm text-[#737373] mt-1 font-medium">
          Integraciones inteligentes, ajustes del sistema y progreso por fases.
        </p>
      </div>

      {/* BANNERS PRINCIPALES: DHARMA CORE, CALENDAR, DRIVE & GMAIL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BANNER DHARMA CORE IA */}
        <div
          className="p-5 rounded-[24px] bg-[#EBF7F2]/70 border border-[#A8D8A0]/40 cursor-pointer hover:shadow-[0_12px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          onClick={() => openDharmaCore()}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <DharmaCore mood="celebrate" size="sm" />
              <span className="text-[9px] font-bold tracking-dharma uppercase bg-white/80 text-[#171717] px-2.5 py-1 rounded-full border border-black/[0.04]">
                GEMINI FLASH
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#171717] font-serif-display">
              Dharma Core IA
            </h3>
            <p className="text-xs text-[#525252] mt-1 line-clamp-2 leading-relaxed">
              Extracción semántica para convertir texto y voz en tareas ordenadas.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#171717] tracking-dharma uppercase">ONLINE</span>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openDharmaCore();
              }}
              icon={<Sparkles className="w-3.5 h-3.5 text-[#FFD84D]" />}
            >
              Abrir
            </Button>
          </div>
        </div>

        {/* BANNER GOOGLE CALENDAR OAUTH */}
        <div
          className="p-5 rounded-[24px] bg-[#EDF5FD]/70 border border-[#9DD7F5]/40 cursor-pointer hover:shadow-[0_12px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          onClick={() => openGoogleCalendarModal()}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-black/[0.04]">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <span className={`text-[9px] font-bold tracking-dharma uppercase px-2.5 py-1 rounded-full border border-black/[0.04] ${
                googleSyncStatus === 'connected'
                  ? 'bg-[#A8D8A0]/30 text-[#171717]'
                  : 'bg-white/80 text-[#737373]'
              }`}>
                {googleSyncStatus === 'connected' ? 'CONECTADO' : 'SYNC'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#171717] font-serif-display truncate">
              {googleUser ? googleUser.email : 'Google Calendar'}
            </h3>
            <p className="text-xs text-[#525252] mt-1 line-clamp-2 leading-relaxed">
              Sincroniza eventos de tu calendario en vistas Mes, Agenda y Dashboard.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#171717] tracking-dharma uppercase">
              {googleEvents.length > 0 ? `${googleEvents.length} EVENTOS` : 'SOLO LECTURA'}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openGoogleCalendarModal();
              }}
              icon={<Calendar className="w-3.5 h-3.5 text-[#171717]" />}
            >
              Gestionar
            </Button>
          </div>
        </div>

        {/* BANNER GOOGLE DRIVE */}
        <div
          className="p-5 rounded-[24px] bg-[#FEF8E7]/70 border border-[#FFD84D]/40 cursor-pointer hover:shadow-[0_12px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          onClick={() => onNavigateTab && onNavigateTab('archivo')}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-black/[0.04]">
                <svg className="w-4.5 h-4.5" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
              </div>
              <span className="text-[9px] font-bold tracking-dharma uppercase bg-white/80 text-[#171717] px-2.5 py-1 rounded-full border border-black/[0.04]">
                VINCULADO
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#171717] font-serif-display">
              Google Drive
            </h3>
            <p className="text-xs text-[#525252] mt-1 line-clamp-2 leading-relaxed">
              Explora y vincula documentos directos a Archivo sin sobrecargar almacenamiento.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#171717] tracking-dharma uppercase">ARCHIVO</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigateTab) onNavigateTab('archivo');
              }}
              icon={<ArrowRight className="w-3.5 h-3.5 text-[#171717]" />}
            >
              Explorar
            </Button>
          </div>
        </div>

        {/* BANNER GMAIL */}
        <div
          className="p-5 rounded-[24px] bg-[#FDF2F0]/70 border border-[#F59A8B]/40 cursor-pointer hover:shadow-[0_12px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          onClick={() => setIsGmailModalOpen(true)}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-black/[0.04]">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M1.5 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h3.75v-8.25L1.5 8.25z" />
                  <path fill="#34A853" d="M22.5 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-3.75v-8.25l5.25-3.75z" />
                  <path fill="#EA4335" d="M17.25 12V3.75L12 7.5 6.75 3.75V12z" />
                  <path fill="#FBBC04" d="M1.5 5.25l10.5 7.5 10.5-7.5V4.5a1.5 1.5 0 0 0-2.4-1.2L12 8.55 3.9 3.3a1.5 1.5 0 0 0-2.4 1.2z" />
                </svg>
              </div>
              <span className="text-[9px] font-bold tracking-dharma uppercase bg-white/80 text-[#171717] px-2.5 py-1 rounded-full border border-black/[0.04]">
                INBOX
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#171717] font-serif-display">
              Gmail a Tareas
            </h3>
            <p className="text-xs text-[#525252] mt-1 line-clamp-2 leading-relaxed">
              Consulta tus correos relevantes y transfórmalos en tareas con un clic.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#171717] tracking-dharma uppercase">MENSAJES</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsGmailModalOpen(true);
              }}
              icon={<ArrowRight className="w-3.5 h-3.5 text-[#171717]" />}
            >
              Consultar
            </Button>
          </div>
        </div>
      </div>

      {/* ACCESO RÁPIDO A MÓDULOS ACTIVOS */}
      {onNavigateTab && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div 
            className="group p-5 rounded-[24px] bg-white border border-black/[0.05] cursor-pointer hover:shadow-[0_12px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all"
            onClick={() => onNavigateTab('transmisiones')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#B9A7F7]/25 text-[#171717] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold tracking-dharma uppercase text-[#171717] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Abrir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#171717] font-serif-display mb-1">Transmisiones</h3>
            <p className="text-xs text-[#737373] leading-relaxed line-clamp-2">
              Buzón crudo para notas rápidas, audios y enlaces entrantes.
            </p>
          </div>

          <div 
            className="group p-5 rounded-[24px] bg-white border border-black/[0.05] cursor-pointer hover:shadow-[0_12px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all"
            onClick={() => onNavigateTab('registros')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6A6C8]/25 text-[#171717] flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold tracking-dharma uppercase text-[#171717] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Abrir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#171717] font-serif-display mb-1">Registros</h3>
            <p className="text-xs text-[#737373] leading-relaxed line-clamp-2">
              Bitácora personal y notas estructuradas con checklist interactivo.
            </p>
          </div>

          <div 
            className="group p-5 rounded-[24px] bg-white border border-black/[0.05] cursor-pointer hover:shadow-[0_12px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all"
            onClick={() => onNavigateTab('archivo')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD84D]/30 text-[#171717] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bookmark className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold tracking-dharma uppercase text-[#171717] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Abrir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#171717] font-serif-display mb-1">Archivo</h3>
            <p className="text-xs text-[#737373] leading-relaxed line-clamp-2">
              Colección visual de enlaces con miniaturas, dominio y filtros.
            </p>
          </div>

          <div 
            className="group p-5 rounded-[24px] bg-white border border-black/[0.05] cursor-pointer hover:shadow-[0_12px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all"
            onClick={() => onNavigateTab('biblioteca')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#A8D8A0]/30 text-[#171717] flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold tracking-dharma uppercase text-[#171717] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Abrir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#171717] font-serif-display mb-1">Biblioteca</h3>
            <p className="text-xs text-[#737373] leading-relaxed line-clamp-2">
              Estación de lecturas, portadas, estados y progreso literario.
            </p>
          </div>
        </div>
      )}

      {/* CATEGORÍAS CONFIGURADAS */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#171717]" />
            <h2 className="text-lg font-bold font-serif-display text-[#171717]">
              Categorías del Sistema
            </h2>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-dharma text-[#8C827A]">
            {categories.length} ACTIVAS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="p-5 rounded-[24px] bg-white border border-black/[0.05] hover:shadow-[0_8px_20px_rgba(23,23,23,0.04)] transition-all space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs ring-2 ring-white"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-bold text-sm text-[#171717] truncate font-serif-display">
                  {cat.name}
                </span>
              </div>
              <p className="text-xs text-[#737373] leading-relaxed line-clamp-2 font-medium">
                {cat.description || 'Categoría activa en Dharma'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIENCIA MÓVIL & ANDROID PWA */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_4px_24px_rgba(23,23,23,0.03)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD84D]/30 text-[#171717] flex items-center justify-center shrink-0 border border-black/[0.04]">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-[#171717] font-serif-display">
                  Experiencia Móvil Android (PWA)
                </h2>
                <span className={`text-[10px] font-bold tracking-dharma uppercase px-2.5 py-0.5 rounded-full border border-black/[0.04] ${
                  isStandalone
                    ? 'bg-[#A8D8A0]/30 text-[#171717]'
                    : isInstallable
                    ? 'bg-[#FFD84D]/40 text-[#171717]'
                    : 'bg-[#F2ECE0] text-[#737373]'
                }`}>
                  {isStandalone ? 'INSTALADA' : isInstallable ? 'LISTA PARA INSTALAR' : 'PWA ACTIVA'}
                </span>
              </div>
              <p className="text-xs text-[#737373] mt-1 font-medium leading-relaxed">
                Diseño responsive nativo: navegación inferior cápsula, captura rápida, audio táctil y soporte offline.
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-xs">
          <div className="p-4 rounded-[20px] bg-[#FAF8F5] border border-black/[0.03] space-y-1.5">
            <div className="font-bold text-[#171717] flex items-center gap-1.5 font-serif-display">
              <CheckCircle2 className="w-4 h-4 text-[#171717]" />
              <span>Navegación 48px+</span>
            </div>
            <p className="text-[11px] text-[#737373] leading-relaxed">
              Objetivos táctiles confortables, FAB central de 56px y zonas seguras para Android.
            </p>
          </div>

          <div className="p-4 rounded-[20px] bg-[#FAF8F5] border border-black/[0.03] space-y-1.5">
            <div className="font-bold text-[#171717] flex items-center gap-1.5 font-serif-display">
              <CheckCircle2 className="w-4 h-4 text-[#171717]" />
              <span>Sin Dependencia Hover</span>
            </div>
            <p className="text-[11px] text-[#737373] leading-relaxed">
              Todas las acciones accesibles por pulsación directa, sin menús invisibles.
            </p>
          </div>

          <div className="p-4 rounded-[20px] bg-[#FAF8F5] border border-black/[0.03] space-y-1.5">
            <div className="font-bold text-[#171717] flex items-center gap-1.5 font-serif-display">
              <CheckCircle2 className="w-4 h-4 text-[#171717]" />
              <span>Capacitor Ready</span>
            </div>
            <p className="text-[11px] text-[#737373] leading-relaxed">
              Arquitectura preparada para compilar a binario APK/AAB para Google Play Store.
            </p>
          </div>
        </div>
      </div>

      {/* PLAN DE DESARROLLO POR FASES (ROADMAP) */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_4px_24px_rgba(23,23,23,0.03)]">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-black/[0.04]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-dharma text-[#8C827A] block mb-0.5">
              ROADMAP
            </span>
            <h2 className="text-xl font-bold font-serif-display text-[#171717]">
              Progresión del Proyecto
            </h2>
            <p className="text-xs text-[#737373] mt-0.5 font-medium">
              Evolución arquitectónica y diseño editorial verificado paso a paso
            </p>
          </div>
          <DharmaCore mood="calm" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-[24px] transition-all border ${
                item.status === 'completada'
                  ? 'bg-[#FAF8F5] border-black/[0.05]'
                  : 'bg-[#F7F4EC]/50 border-dashed border-black/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-bold tracking-dharma text-[#171717] uppercase">
                  {item.phase}
                </span>
                <span
                  className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                    item.status === 'completada'
                      ? 'bg-[#171717] text-[#FFD84D]'
                      : 'bg-[#E5DFD3] text-[#737373]'
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#171717] font-serif-display mb-2">
                {item.title}
              </h4>

              <ul className="space-y-1.5 text-xs text-[#737373]">
                {item.items.map((sub, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        item.status === 'completada' ? 'bg-[#171717]' : 'bg-[#C2BAAF]'
                      }`}
                    />
                    <span className="leading-relaxed font-medium">{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* SINCRONIZACIÓN EN LA NUBE & NOTIFICACIONES (PRIORIDAD ALTA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta 1: Sincronización Local-First Supabase */}
        <div className="p-6 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_4px_24px_rgba(23,23,23,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#9DD7F5]/25 text-[#171717] flex items-center justify-center">
                  <Cloud className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-display text-[#171717]">
                    Sincronización Cloud
                  </h3>
                  <span className="text-[10px] font-bold tracking-dharma uppercase text-[#8C827A]">
                    SUPABASE LOCAL-FIRST
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold tracking-dharma px-3 py-1 rounded-full uppercase border ${
                  cloudSyncStatus === 'synced'
                    ? 'bg-[#EBF7E9] text-[#1E7E34] border-[#A8D8A0]'
                    : cloudSyncStatus === 'syncing'
                    ? 'bg-[#FFFBEA] text-[#B78103] border-[#FFD84D]'
                    : cloudSyncStatus === 'offline'
                    ? 'bg-[#FDF2F0] text-[#D93025] border-[#F59A8B]'
                    : 'bg-[#F4EFE6] text-[#737373] border-black/[0.06]'
                }`}
              >
                {cloudSyncStatus === 'synced'
                  ? 'SINCRONIZADO'
                  : cloudSyncStatus === 'syncing'
                  ? 'GUARDANDO...'
                  : cloudSyncStatus === 'offline'
                  ? 'OFFLINE'
                  : 'MODO LOCAL'}
              </span>
            </div>

            <p className="text-xs text-[#737373] leading-relaxed mt-2">
              Arquitectura reactiva y tolerante a fallos de red. Las tareas y cambios se aplican al instante en tu dispositivo y se respaldan en Supabase en segundo plano.
            </p>

            {lastSyncedAt && (
              <p className="text-[11px] text-[#A39B8F] mt-2 font-medium">
                Último respaldo: {new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => triggerManualSync()}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />}
            >
              Forzar Respaldo
            </Button>
          </div>
        </div>

        {/* Tarjeta 2: Notificaciones y Recordatorios Push */}
        <div className="p-6 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_4px_24px_rgba(23,23,23,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD84D]/25 text-[#171717] flex items-center justify-center">
                  <Bell className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-display text-[#171717]">
                    Recordatorios y Avisos
                  </h3>
                  <span className="text-[10px] font-bold tracking-dharma uppercase text-[#8C827A]">
                    NOTIFICACIONES LOCALES
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold tracking-dharma px-3 py-1 rounded-full uppercase border ${
                  notificationPermission === 'granted'
                    ? 'bg-[#EBF7E9] text-[#1E7E34] border-[#A8D8A0]'
                    : notificationPermission === 'denied'
                    ? 'bg-[#FDF2F0] text-[#D93025] border-[#F59A8B]'
                    : 'bg-[#FFFBEA] text-[#B78103] border-[#FFD84D]'
                }`}
              >
                {notificationPermission === 'granted'
                  ? 'ACTIVADAS'
                  : notificationPermission === 'denied'
                  ? 'BLOQUEADAS'
                  : 'PENDIENTE'}
              </span>
            </div>

            <p className="text-xs text-[#737373] leading-relaxed mt-2">
              Dharma monitorea tus tareas pendientes cada minuto. Recibirás avisos nativos en tu navegador o en la pantalla de bloqueo de tu smartphone Android.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-end gap-2">
            {notificationPermission !== 'granted' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  const perm = await requestNotificationPermission();
                  if (perm === 'granted') {
                    sendTestNotification();
                  }
                }}
                icon={<Bell className="w-3.5 h-3.5 text-[#FFD84D]" />}
              >
                Habilitar Avisos
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => sendTestNotification()}
                icon={<Bell className="w-3.5 h-3.5 text-[#171717]" />}
              >
                Probar Aviso
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* GESTIÓN DE DATOS LOCALES */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_4px_24px_rgba(23,23,23,0.03)]">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-[#171717]" />
          <h2 className="text-lg font-bold font-serif-display text-[#171717]">
            Control de Datos Locales
          </h2>
        </div>
        <p className="text-xs text-[#737373] mb-6 font-medium leading-relaxed max-w-2xl">
          Tus datos residen de forma privada en el almacenamiento local del navegador. Puedes exportar una copia JSON en cualquier momento o restaurar datos de muestra.
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
            variant="secondary"
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
      </div>

      {/* MODAL DE GMAIL */}
      <GmailModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
      />
    </div>
  );
};

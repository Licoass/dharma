import React, { useRef } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTaskContext } from '../../context/TaskContext';
import { DharmaCore } from '../common/DharmaCore';
import type { NavTab } from '../../types';

export interface MoreViewProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const MoreView: React.FC<MoreViewProps> = ({ onNavigateTab }) => {
  const { tasks, resetToDefaults, categories } = useTaskContext();
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
      badge: 'ACTUAL',
      items: [
        'Módulo Inbox para material crudo con tipos: Texto, Audio, Enlace e Imagen',
        'Opciones funcionales para Texto y Enlace; interfaz preparada para Audio con visualizador de ondas',
        'Estados de procesamiento: Nueva, Procesando, Procesada y Archivada',
        'Estética de estación de comunicaciones moderna y pastel (sin pantalla terminal ni estética militar)',
        'Acción rápida para convertir transmisiones directamente en tareas o notas',
      ],
    },
    {
      phase: 'FASE 8+',
      title: 'Sincronización en la Nube & Google Calendar',
      status: 'pendiente',
      badge: 'SIGUIENTES FASES',
      items: [
        'Persistencia y sincronización en tiempo real multidispositivo',
        'Integración bidireccional con Google Calendar',
        'Automatizaciones y análisis de hábitos inteligentes',
      ],
    },
  ];

  return (
    <div className="space-y-7 pb-12 max-w-5xl mx-auto select-none">
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

      {/* 2. PLAN DE DESARROLLO POR FASES (ROADMAP) */}
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
    </div>
  );
};

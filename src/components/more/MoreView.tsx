import React, { useRef } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Layers, 
  Sliders
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useTaskContext } from '../../context/TaskContext';
import { STATIONS_LIST } from '../../data/stations';
import { DharmaCore } from '../common/DharmaCore';

export const MoreView: React.FC = () => {
  const { tasks, resetToDefaults } = useTaskContext();
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
          localStorage.setItem('dharma_tasks_v1', JSON.stringify(imported));
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
      title: 'Sistema Visual & Núcleo de Tareas',
      status: 'completada',
      badge: 'ACTIVA Y OPERATIVA',
      items: [
        'Arquitectura React + TypeScript + Vite + Tailwind',
        'Sistema de diseño orgánico y tarjetas redondeadas (24px)',
        'Mascota y asistente visual: Dharma Core',
        'Navegación adaptativa (Móvil, Tablet, Desktop)',
        'Gestión de tareas, estaciones, prioridades y estados',
        'Vistas duales: Lista secuencial y Tablero Kanban',
        'Captura rápida (botón central móvil y atajos)',
      ],
    },
    {
      phase: 'FASE 2',
      title: 'Backend & Sincronización en la Nube',
      status: 'pendiente',
      badge: 'SIGUIENTE FASE',
      items: [
        'Integración de Supabase (PostgreSQL + Auth)',
        'Sincronización en tiempo real multidispositivo',
        'Políticas de seguridad RLS',
      ],
    },
    {
      phase: 'FASE 3',
      title: 'Integraciones Externas (Google Calendar)',
      status: 'pendiente',
      badge: 'PLANIFICADO',
      items: [
        'Sincronización con Google Calendar y eventos',
        'Time-blocking y agenda unificada',
      ],
    },
    {
      phase: 'FASE 4',
      title: 'Dharma Core Inteligente (IA Gemini)',
      status: 'pendiente',
      badge: 'PLANIFICADO',
      items: [
        'Procesamiento en lenguaje natural mediante Gemini',
        'Categorización autónoma y resúmenes de protocolo',
      ],
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-5xl mx-auto">
      {/* 1. ESTACIONES CONFIGURADAS */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-teal-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-[0.03em]">
            ESTACIONES DEL SISTEMA
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {STATIONS_LIST.map((st) => (
            <div
              key={st.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: st.color }}
                  />
                  <span className="font-bold text-sm text-slate-800">{st.name}</span>
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                  {st.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. PLAN DE DESARROLLO POR FASES (ROADMAP) */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-[0.03em]">
              PROGRESIÓN POR FASES DEL PROYECTO
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Desarrollo iterativo garantizando estabilidad en cada etapa
            </p>
          </div>
          <DharmaCore mood="calm" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                item.status === 'completada'
                  ? 'bg-teal-50/40 border-teal-200/80'
                  : 'bg-slate-50/50 border-slate-200/70 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold tracking-wider text-teal-800">
                  {item.phase}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === 'completada'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-2">
                {item.title}
              </h4>

              <ul className="space-y-1.5 text-xs text-slate-600">
                {item.items.map((sub, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                        item.status === 'completada' ? 'bg-teal-600' : 'bg-slate-400'
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
          <Sliders className="w-5 h-5 text-teal-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-[0.03em]">
            CONTROL Y RESPALDO DE DATOS LOCALES
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Durante la Fase 1, todos los datos residen en el almacenamiento de tu navegador de manera segura. Puedes exportar o importar copias de seguridad en formato JSON.
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
            variant="station"
            size="md"
            onClick={() => {
              if (window.confirm('¿Deseas restaurar las tareas a los ejemplos iniciales?')) {
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

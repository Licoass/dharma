import React from 'react';
import type { NavTab } from '../../types';
import { DharmaCore } from '../common/DharmaCore';
import { useTaskContext } from '../../context/TaskContext';
import { RefreshCw, Plus } from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onOpenQuickCapture: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenQuickCapture }) => {
  const { dharmaMood, metrics, resetToDefaults } = useTaskContext();

  const todayStr = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
    inicio: {
      title: 'CENTRO DE MANDO',
      subtitle: 'Visión general de estaciones y protocolos activos',
    },
    tareas: {
      title: 'REGISTRO DE TAREAS',
      subtitle: `${metrics.pending} pendientes · ${metrics.inProgress} en curso · ${metrics.completed} completadas`,
    },
    capturar: {
      title: 'NUEVA ENTRADA',
      subtitle: 'Captura ágil de tareas o protocolos',
    },
    calendario: {
      title: 'ESTACIÓN TEMPORAL',
      subtitle: 'Cronograma y planificación de ciclos',
    },
    mas: {
      title: 'SISTEMAS Y AJUSTES',
      subtitle: 'Configuración de estaciones y hoja de ruta',
    },
  };

  const current = tabTitles[currentTab] || tabTitles.inicio;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Title & Subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider text-teal-700/80 uppercase">
              DHARMA // {currentTab.toUpperCase()}
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
            <span className="hidden sm:inline-block text-xs text-slate-500 capitalize">
              {todayStr}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-[0.06em] text-slate-800 truncate mt-0.5">
            {current.title}
          </h2>
          <p className="hidden sm:block text-xs sm:text-sm text-slate-500 tracking-[0.02em] mt-0.5 truncate">
            {current.subtitle}
          </p>
        </div>

        {/* Right Actions: System Health & Core Pill */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Capture button on Tablet/Desktop header */}
          <button
            onClick={onOpenQuickCapture}
            title="Captura rápida"
            className="hidden sm:inline-flex md:hidden items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Capturar</span>
          </button>

          {/* Reset to sample data button */}
          <button
            onClick={() => {
              if (window.confirm('¿Deseas recargar los datos demostrativos iniciales de DHARMA?')) {
                resetToDefaults();
              }
            }}
            title="Restaurar datos iniciales"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Datos Demo</span>
          </button>

          {/* Quick Dharma Core indicator badge */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 sm:py-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <DharmaCore mood={dharmaMood} size="sm" />
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-700 tracking-wider">
                  CORE ONLINE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                {metrics.completionPercentage}% completado
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

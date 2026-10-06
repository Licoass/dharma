import React from 'react';
import type { NavTab } from '../../types';
import { DharmaCore } from '../common/DharmaCore';
import { useTaskContext } from '../../context/TaskContext';
import { RefreshCw, Plus } from 'lucide-react';

export interface HeaderProps {
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
      subtitle: 'Visión general de estaciones y protocolos',
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
    registros: {
      title: 'REGISTROS',
      subtitle: 'Bitácora y notas personales organizadas por categoría',
    },
    archivo: {
      title: 'ARCHIVO DE RECURSOS',
      subtitle: 'Marcadores, enlaces y referencias visuales guardadas',
    },
    biblioteca: {
      title: 'BIBLIOTECA PERSONAL',
      subtitle: 'Estación de lecturas, protocolos y conocimiento acumulado',
    },
    mas: {
      title: 'SISTEMAS Y AJUSTES',
      subtitle: 'Configuración de estaciones y hoja de ruta',
    },
  };

  const current = tabTitles[currentTab] || tabTitles.inicio;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/85 backdrop-blur-md px-5 sm:px-8 py-4 sm:py-5 transition-all select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Titular */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-[0.06em] text-[#177468] uppercase">
              DHARMA // {currentTab.toUpperCase()}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#9DA6B5]/50" />
            <span className="text-xs text-[#697282] capitalize">
              {todayStr}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-[0.06em] text-[#24292F] truncate mt-0.5">
            {current.title}
          </h2>
          <p className="hidden sm:block text-xs sm:text-sm text-[#697282] tracking-[0.02em] mt-0.5 truncate">
            {current.subtitle}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenQuickCapture}
            title="Captura rápida"
            className="sm:hidden w-10 h-10 rounded-[14px] bg-[#177468] text-white flex items-center justify-center shadow-sm cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Deseas recargar los datos de muestra iniciales de DHARMA?')) {
                resetToDefaults();
              }
            }}
            title="Restaurar datos de muestra"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#697282] hover:text-[#24292F] hover:bg-white rounded-[14px] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Datos Demo</span>
          </button>

          {/* Dharma Core Status Pill */}
          <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-[20px] shadow-[0_2px_12px_rgba(36,41,47,0.03)]">
            <DharmaCore mood={dharmaMood} size="sm" />
            <div className="text-left hidden sm:block">
              <span className="text-[11px] font-bold text-[#24292F] tracking-wide block leading-none">
                CORE ONLINE
              </span>
              <span className="text-[10px] text-[#9DA6B5] block mt-0.5">
                {metrics.completionPercentage}% completado
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import type { NavTab } from '../../types';
import { DharmaCore } from '../common/DharmaCore';
import { useTaskContext } from '../../context/TaskContext';
import { RefreshCw, Plus, Sparkles, Mic, Search } from 'lucide-react';

export interface HeaderProps {
  currentTab: NavTab;
  onOpenQuickCapture: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenQuickCapture }) => {
  const { 
    dharmaMood, 
    metrics, 
    openDharmaCore, 
    openAudioCapture,
    openOmniSearch,
    cloudSyncStatus,
    triggerManualSync
  } = useTaskContext();

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
    transmisiones: {
      title: 'ESTACIÓN DE TRANSMISIONES (INBOX)',
      subtitle: 'Recepción de señales crudas, audios, notas y enlaces por clasificar',
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
    <header className="sticky top-0 z-30 bg-[#F8F4E8]/90 backdrop-blur-md border-b border-[#EAE3D2]/70 px-5 sm:px-8 py-3.5 sm:py-4 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Titular Editorial */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-[0.16em] text-[#8C8578] uppercase">
              D H A R M A // {currentTab.toUpperCase()}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#171717]/30" />
            <span className="text-[11px] text-[#737373] font-medium capitalize">
              {todayStr}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-[#171717] truncate mt-0.5 tracking-tight">
            {current.title}
          </h2>
          <p className="hidden sm:block text-xs text-[#737373] font-medium mt-0.5 truncate">
            {current.subtitle}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* OmniSearch Global */}
          <button
            onClick={openOmniSearch}
            title="Búsqueda Universal (Ctrl + K)"
            className="flex items-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#171717] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer shadow-xs border border-black/[0.06]"
          >
            <Search className="w-3.5 h-3.5 text-[#8C827A]" />
            <span className="text-xs font-semibold hidden md:inline text-[#737373]">
              Buscar...
            </span>
            <kbd className="hidden lg:inline-flex items-center text-[10px] font-mono text-[#8C827A] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-black/[0.04]">
              ⌘K
            </kbd>
          </button>

          {/* Estado de Sincronización Cloud */}
          <button
            onClick={() => triggerManualSync()}
            title={`Sincronización: ${cloudSyncStatus.toUpperCase()} (Clic para sincronizar)`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-[#737373] hover:text-[#171717] rounded-full border border-black/[0.05] transition-all cursor-pointer shadow-2xs"
          >
            {cloudSyncStatus === 'synced' ? (
              <span className="w-2 h-2 rounded-full bg-[#A8D8A0]" />
            ) : cloudSyncStatus === 'syncing' ? (
              <RefreshCw className="w-3 h-3 animate-spin text-[#FFD84D]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#8C827A]" />
            )}
            <span className="text-[10px] uppercase tracking-dharma font-bold">
              {cloudSyncStatus === 'synced' ? 'NUBE OK' : cloudSyncStatus === 'syncing' ? 'SYNC...' : 'LOCAL'}
            </span>
          </button>

          <button
            onClick={onOpenQuickCapture}
            title="Captura rápida"
            className="sm:hidden w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center shadow-md cursor-pointer active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.8]" />
          </button>

          {/* Botón Grabación de Voz / Audio */}
          <button
            onClick={() => openAudioCapture()}
            title="Grabar Audio — Transcribir y detectar tareas con DHARMA CORE"
            className="flex items-center gap-1.5 sm:gap-2 bg-[#F5F2FE] hover:bg-[#EBE5FD] text-[#171717] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 border border-[#B9A7F7]/50"
          >
            <div className="w-2 h-2 rounded-full bg-[#B9A7F7] animate-pulse" />
            <Mic className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-xs font-bold hidden sm:inline">Voz</span>
          </button>

          {/* Botón Asistente IA Dharma Core */}
          <button
            onClick={() => openDharmaCore()}
            title="Dharma Core — Extracción inteligente de tareas con Gemini"
            className="flex items-center gap-1.5 sm:gap-2 bg-[#FFFBEA] hover:bg-[#FFF5CC] text-[#171717] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 border border-[#FFD84D]/60"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-xs font-extrabold hidden sm:inline tracking-wider">CORE IA</span>
          </button>

          {/* Dharma Core Status Pill */}
          <button
            onClick={() => openDharmaCore()}
            title="Abrir Dharma Core"
            className="flex items-center gap-2.5 bg-white hover:bg-[#FAF6ED] px-3.5 py-1.5 rounded-full shadow-2xs border border-black/[0.05] transition-colors cursor-pointer"
          >
            <DharmaCore mood={dharmaMood} size="sm" />
            <div className="text-left hidden sm:block">
              <span className="text-[10px] font-extrabold text-[#171717] tracking-[0.12em] uppercase block leading-none">
                ONLINE
              </span>
              <span className="text-[10px] text-[#737373] block mt-0.5">
                {metrics.completionPercentage}% hecho
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

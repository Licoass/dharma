import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Plus, 
  Calendar, 
  MoreHorizontal,
  Layers
} from 'lucide-react';
import type { NavTab } from '../../types';
import { STATIONS_LIST } from '../../data/stations';
import { DharmaCore } from '../common/DharmaCore';
import { useTaskContext } from '../../context/TaskContext';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { metrics, setIsQuickCaptureOpen, dharmaMood, filters, setFilters } = useTaskContext();

  const navItems = [
    { id: 'inicio' as NavTab, label: 'Inicio', icon: Home, badge: null },
    { id: 'tareas' as NavTab, label: 'Tareas', icon: CheckSquare, badge: metrics.pending + metrics.inProgress },
    { id: 'capturar' as NavTab, label: 'Capturar', icon: Plus, isFab: true },
    { id: 'calendario' as NavTab, label: 'Calendario', icon: Calendar, badge: null },
    { id: 'mas' as NavTab, label: 'Más', icon: MoreHorizontal, badge: null },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP & TABLET SIDEBAR                                   */}
      {/* ============================================================ */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-r border-slate-200/70 w-20 lg:w-64 transition-all duration-300">
        {/* Brand Header */}
        <div className="p-4 lg:p-6 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DharmaCore mood={dharmaMood} size="sm" />
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold tracking-[0.06em] text-slate-800 leading-none">
                DHARMA
              </h1>
              <p className="text-[11px] font-medium text-slate-400 tracking-[0.03em] mt-1">
                Centro de Mando
              </p>
            </div>
          </div>
          <span className="hidden lg:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
            v1.0
          </span>
        </div>

        {/* Quick Capture Action (Desktop) */}
        <div className="p-3 lg:p-4">
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="w-full min-h-[46px] rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2.5 shadow-sm shadow-teal-700/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">Captura Rápida</span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-2.5 lg:px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.filter((i) => !i.isFab).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const hasBadge = typeof item.badge === 'number' && item.badge > 0;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-medium text-sm transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-white text-teal-800 shadow-sm border border-slate-200/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }
                `}
                title={item.label}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-teal-600' : 'text-slate-400'
                  }`}
                />
                <span className="hidden lg:inline">{item.label}</span>
                {hasBadge && (
                  <span className="hidden lg:inline-flex ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Desktop Stations Quick Filter */}
          <div className="hidden lg:block pt-6 pb-2">
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Estaciones</span>
              <Layers className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, stationId: 'todas' }));
                  if (currentTab !== 'tareas') onTabChange('tareas');
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                  filters.stationId === 'todas'
                    ? 'bg-slate-200/60 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                <span>Todas las estaciones</span>
              </button>

              {STATIONS_LIST.map((station) => {
                const isSelected = filters.stationId === station.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, stationId: station.id }));
                      if (currentTab !== 'tareas') onTabChange('tareas');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                      isSelected
                        ? 'font-semibold text-slate-900'
                        : 'text-slate-600 hover:bg-slate-100/60'
                    }`}
                    style={{
                      backgroundColor: isSelected ? station.bgSoft : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: station.color }}
                      />
                      <span className="truncate">{station.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {station.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer info: Local State Indicator */}
        <div className="p-3 lg:p-4 border-t border-slate-200/60 bg-white/40">
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="text-[11px] leading-tight">
              <p className="font-semibold text-slate-700">Almacenamiento Local</p>
              <p className="text-slate-400">Fase 1 · Seguro y persistente</p>
            </div>
          </div>
          <div className="lg:hidden flex justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Almacenamiento Activo" />
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE BOTTOM NAVIGATION (MOBILE FIRST)                    */}
      {/* ============================================================ */}
      <nav 
        aria-label="Navegación principal inferior"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/70 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const hasBadge = typeof item.badge === 'number' && item.badge > 0;

            // Central elevated capture FAB
            if (item.isFab) {
              return (
                <div key={item.id} className="relative -top-4 flex flex-col items-center">
                  <button
                    onClick={() => setIsQuickCaptureOpen(true)}
                    className="w-14 h-14 min-w-[48px] min-h-[48px] rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-700/25 flex items-center justify-center active:scale-95 transition-transform cursor-pointer border-4 border-[#FAF9F6]"
                    aria-label="Captura rápida"
                  >
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </button>
                  <span className="text-[10px] font-medium text-slate-500 mt-1">
                    Capturar
                  </span>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer py-1
                  ${isActive ? 'text-teal-700 font-semibold' : 'text-slate-400 hover:text-slate-600'}
                `}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  {hasBadge && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge! > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] tracking-tight leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

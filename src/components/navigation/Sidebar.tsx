import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Plus, 
  Calendar, 
  FileText,
  Bookmark,
  BookOpen,
  Radio,
  MoreHorizontal
} from 'lucide-react';
import type { NavTab } from '../../types';
import { DharmaCore } from '../common/DharmaCore';
import { Avatar } from '../ui/Avatar';
import { useTaskContext } from '../../context/TaskContext';

export interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const { metrics, setIsQuickCaptureOpen, dharmaMood, filters, setFilters, categories, transmissions } = useTaskContext();

  const newTransmissionsCount = transmissions.filter((t) => t.status === 'nueva').length;

  const navItems = [
    { id: 'inicio' as NavTab, label: 'Inicio', icon: Home, badge: null },
    { id: 'transmisiones' as NavTab, label: 'Transmisiones', icon: Radio, badge: newTransmissionsCount > 0 ? newTransmissionsCount : null },
    { id: 'tareas' as NavTab, label: 'Tareas', icon: CheckSquare, badge: metrics.pending + metrics.inProgress },
    { id: 'calendario' as NavTab, label: 'Calendario', icon: Calendar, badge: null },
    { id: 'registros' as NavTab, label: 'Registros', icon: FileText, badge: null },
    { id: 'archivo' as NavTab, label: 'Archivo', icon: Bookmark, badge: null },
    { id: 'biblioteca' as NavTab, label: 'Biblioteca', icon: BookOpen, badge: null },
    { id: 'mas' as NavTab, label: 'Más', icon: MoreHorizontal, badge: null },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md w-20 lg:w-64 transition-all duration-300 select-none">
      {/* Brand Header */}
      <div className="p-5 lg:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <DharmaCore mood={dharmaMood} size="sm" />
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold tracking-[0.06em] text-[#24292F] leading-none">
              DHARMA
            </h1>
            <p className="text-[11px] font-medium text-[#9DA6B5] tracking-[0.03em] mt-1">
              Centro de Mando
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-3.5 lg:px-5 py-1">
        <button
          onClick={() => setIsQuickCaptureOpen(true)}
          className="w-full min-h-[46px] rounded-[18px] bg-[#177468] hover:bg-[#126157] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(23,116,104,0.18)] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden lg:inline">Capturar</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 lg:px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const hasBadge = typeof item.badge === 'number' && item.badge > 0;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full min-h-[46px] flex items-center gap-3.5 px-4 py-2.5 rounded-[18px] font-semibold text-sm transition-all cursor-pointer
                ${
                  isActive
                    ? 'bg-white text-[#177468] shadow-[0_4px_16px_-2px_rgba(36,41,47,0.04)]'
                    : 'text-[#697282] hover:text-[#24292F] hover:bg-[#F5F2EB]/60'
                }
              `}
              title={item.label}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-[#177468]' : 'text-[#9DA6B5]'
                }`}
              />
              <span className="hidden lg:inline">{item.label}</span>
              {hasBadge && (
                <span className="hidden lg:inline-flex ml-auto text-[11px] px-2 py-0.5 rounded-full bg-[#E8F6F4] text-[#177468] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Categorías Dinámicas */}
        <div className="hidden lg:block pt-6 pb-2">
          <p className="px-4 mb-2.5 text-[11px] font-bold text-[#9DA6B5] uppercase tracking-[0.06em]">
            Categorías
          </p>

          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, categoryId: 'todas' }));
                if (currentTab !== 'tareas') onTabChange('tareas');
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs rounded-[14px] transition-colors cursor-pointer ${
                filters.categoryId === 'todas'
                  ? 'bg-white text-[#24292F] font-bold shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                  : 'text-[#697282] hover:bg-[#F5F2EB]/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#9DA6B5] shrink-0" />
              <span>Todas las categorías</span>
            </button>

            {categories.map((category) => {
              const isSelected = filters.categoryId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, categoryId: category.id }));
                    if (currentTab !== 'tareas') onTabChange('tareas');
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs rounded-[14px] transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white font-bold text-[#24292F] shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                      : 'text-[#697282] hover:bg-[#F5F2EB]/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate">{category.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Profile / Core Status */}
      <div className="p-4 lg:p-5 bg-white/40 flex items-center gap-3">
        <Avatar name="Dharma User" variant="teal" statusDot="online" size="sm" />
        <div className="hidden lg:block text-left truncate">
          <p className="text-xs font-bold text-[#24292F] truncate">Centro Activo</p>
          <p className="text-[11px] text-[#9DA6B5] truncate">Fase 3 · Sistema de Tareas</p>
        </div>
      </div>
    </aside>
  );
};

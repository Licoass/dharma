import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Plus, 
  Calendar, 
  MoreHorizontal 
} from 'lucide-react';
import type { NavTab } from '../../types';
import { useTaskContext } from '../../context/TaskContext';

export interface BottomNavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  const { metrics, setIsQuickCaptureOpen } = useTaskContext();

  const navItems = [
    { id: 'inicio' as NavTab, label: 'Inicio', icon: Home, badge: null },
    { id: 'tareas' as NavTab, label: 'Tareas', icon: CheckSquare, badge: metrics.pending + metrics.inProgress },
    { id: 'capturar' as NavTab, label: 'Capturar', icon: Plus, isFab: true },
    { id: 'calendario' as NavTab, label: 'Calendario', icon: Calendar, badge: null },
    { id: 'mas' as NavTab, label: 'Más', icon: MoreHorizontal, badge: null },
  ];

  return (
    <nav
      aria-label="Navegación móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center justify-around h-16 px-3 max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const hasBadge = typeof item.badge === 'number' && item.badge > 0;

          // Botón central elevado
          if (item.isFab) {
            return (
              <div key={item.id} className="relative -top-5 flex flex-col items-center">
                <button
                  onClick={() => setIsQuickCaptureOpen(true)}
                  className="w-14 h-14 min-w-[50px] min-h-[50px] rounded-full bg-[#177468] hover:bg-[#126157] text-white shadow-[0_8px_20px_rgba(23,116,104,0.30)] flex items-center justify-center active:scale-95 transition-transform cursor-pointer border-4 border-[#FAF8F5]"
                  aria-label="Captura rápida"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
                <span className="text-[10px] font-semibold text-[#697282] mt-0.5">
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
                flex-1 min-h-[46px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer py-1
                ${isActive ? 'text-[#177468] font-bold' : 'text-[#9DA6B5] hover:text-[#697282]'}
              `}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {hasBadge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#177468] text-white text-[9px] font-bold flex items-center justify-center">
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
  );
};

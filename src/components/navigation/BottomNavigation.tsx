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

  const handleTabClick = (tabId: NavTab) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(15); } catch (_) {}
    }
    onTabChange(tabId);
  };

  const handleFabClick = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(30); } catch (_) {}
    }
    setIsQuickCaptureOpen(true);
  };

  return (
    <div
      aria-label="Navegación móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3.5 pb-safe pt-2 pointer-events-none"
    >
      <nav className="pointer-events-auto bg-[#171717] text-white rounded-full px-2 sm:px-3 h-[68px] shadow-[0_18px_45px_rgba(23,23,23,0.35)] border border-white/10 flex items-center justify-around max-w-md mx-auto relative select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const hasBadge = typeof item.badge === 'number' && item.badge > 0;

          // Botón central Capturar (FAB destacado circular en rosa con icono negro)
          if (item.isFab) {
            return (
              <div key={item.id} className="flex flex-col items-center px-1">
                <button
                  type="button"
                  onClick={handleFabClick}
                  className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-full bg-[#F6A6C8] hover:bg-[#E996B9] text-[#171717] shadow-[0_6px_20px_rgba(246,166,200,0.45)] flex items-center justify-center active:scale-90 transition-all cursor-pointer border-2 border-[#171717]"
                  aria-label="Captura rápida"
                >
                  <Plus className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`
                flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer py-1 px-1 rounded-2xl active:scale-95
                ${isActive ? 'text-white font-bold' : 'text-[#8A8A8A] hover:text-[#D4D4D4]'}
              `}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-white stroke-[2.5]' : 'stroke-[1.9]'
                  }`}
                />
                {hasBadge && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#FFD84D] text-[#171717] text-[9px] font-extrabold flex items-center justify-center">
                    {item.badge! > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight leading-none ${isActive ? 'text-white' : 'text-[#8A8A8A]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

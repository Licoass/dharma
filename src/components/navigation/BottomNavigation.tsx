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
    <nav
      aria-label="Navegación móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(36,41,47,0.06)] border-t border-black/[0.04]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto relative select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const hasBadge = typeof item.badge === 'number' && item.badge > 0;

          // Botón central elevado (Android Material FAB)
          if (item.isFab) {
            return (
              <div key={item.id} className="relative -top-5 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleFabClick}
                  className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] hover:bg-[#126157] text-white shadow-[0_10px_26px_rgba(20,184,166,0.40)] flex items-center justify-center active:scale-90 transition-all cursor-pointer border-4 border-[#FAF8F5]"
                  aria-label="Captura rápida"
                >
                  <Plus className="w-6 h-6 stroke-[2.6]" />
                </button>
                <span className="text-[10px] font-bold text-[#484F58] mt-0.5 tracking-tight">
                  Capturar
                </span>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`
                flex-1 min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer py-1 px-1 rounded-2xl active:scale-95 active:bg-black/[0.03]
                ${isActive ? 'text-[#177468] font-bold' : 'text-[#8C95A6] hover:text-[#484F58]'}
              `}
            >
              <div className={`relative px-3 py-1 rounded-full transition-all ${
                isActive ? 'bg-[#E8F6F4]' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-[#177468]' : 'stroke-[1.8]'}`} />
                {hasBadge && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#177468] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge! > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

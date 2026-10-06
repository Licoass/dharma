import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute top-full mt-2 z-40 w-48 bg-white
              rounded-[20px] p-2 shadow-[0_12px_32px_rgba(36,41,47,0.08)]
              ${align === 'right' ? 'right-0' : 'left-0'}
            `}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className={`
                  w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] text-xs font-semibold
                  transition-colors text-left cursor-pointer
                  ${
                    item.destructive
                      ? 'text-[#A63838] hover:bg-[#FEEFEF]'
                      : 'text-[#24292F] hover:bg-[#FAF8F5]'
                  }
                `}
              >
                {item.icon && <span className="text-sm shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

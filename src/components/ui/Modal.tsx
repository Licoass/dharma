import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5">
          {/* Backdrop suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#24292F]/20 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 360 }}
            className={`
              relative w-full ${maxWMap[maxWidth]} bg-white
              rounded-t-[32px] sm:rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.08)]
              p-6 sm:p-7 z-10 max-h-[92vh] overflow-y-auto
            `}
          >
            {/* Header */}
            {(title || subtitle) && (
              <div className="flex items-start justify-between mb-5 pb-2">
                <div>
                  {title && (
                    <h3 className="text-xl font-bold text-[#24292F] tracking-[0.03em]">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-[#697282] mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="w-10 h-10 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[14px] text-[#9DA6B5] hover:text-[#24292F] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                  aria-label="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

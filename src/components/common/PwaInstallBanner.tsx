import React, { useState } from 'react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Button } from '../ui/Button';
import { Smartphone, Download, X } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const { isInstallable, isStandalone, isInstalled, installPwa } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  // No mostrar si ya está ejecutándose como aplicación instalada o si el usuario lo descartó
  if (isStandalone || isDismissed || (!isInstallable && !isInstalled)) {
    return null;
  }

  return (
    <div className="mb-4 p-3.5 sm:p-4 rounded-[22px] bg-gradient-to-r from-[#E8F6F4] via-white to-[#FEF6EC] border border-[#177468]/20 shadow-[0_4px_20px_rgba(23,116,104,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 select-none animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#E8F6F4] border border-[#177468]/20 flex items-center justify-center shrink-0 text-[#177468]">
          <Smartphone className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-[#24292F]">
              Instala DHARMA en tu Android
            </h4>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#177468] text-white">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-[#697282] line-clamp-1 mt-0.5">
            Acceso instantáneo en pantalla completa, navegación por gestos y soporte offline.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button
          variant="primary"
          size="sm"
          onClick={installPwa}
          icon={<Download className="w-3.5 h-3.5 stroke-[2.5]" />}
        >
          Instalar App
        </Button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-xl text-[#9DA6B5] hover:text-[#24292F] hover:bg-black/5 transition-colors cursor-pointer"
          title="Descartar por ahora"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

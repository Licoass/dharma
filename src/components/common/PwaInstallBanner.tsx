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
    <div className="mb-5 p-4 sm:p-4.5 rounded-[24px] bg-white border border-black/[0.05] shadow-[0_8px_24px_rgba(23,23,23,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 select-none animate-fadeIn">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-[#FFD84D]/30 border border-black/[0.04] flex items-center justify-center shrink-0 text-[#171717]">
          <Smartphone className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold font-serif-display text-[#171717]">
              Instala DHARMA en tu Android
            </h4>
            <span className="text-[9px] font-bold tracking-dharma px-2.5 py-0.5 rounded-full bg-[#171717] text-[#FFD84D] uppercase">
              PWA
            </span>
          </div>
          <p className="text-xs text-[#737373] line-clamp-1 mt-0.5 font-medium">
            Acceso instantáneo en pantalla completa, navegación táctil y soporte offline.
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
          className="p-2 rounded-xl text-[#8C827A] hover:text-[#171717] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
          title="Descartar por ahora"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

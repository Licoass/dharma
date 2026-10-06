import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  Plus, 
  Search, 
  X, 
  RotateCw, 
  CheckCircle2, 
  Archive, 
  Activity
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { Transmission, TransmissionStatus, TransmissionType, NavTab } from '../../types';
import { TransmissionCard } from './TransmissionCard';
import { NewTransmissionModal } from './NewTransmissionModal';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export interface TransmissionsViewProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const TransmissionsView: React.FC<TransmissionsViewProps> = () => {
  const { 
    transmissions, 
    addTransmission, 
    deleteTransmission, 
    changeTransmissionStatus 
  } = useTaskContext();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TransmissionStatus | 'todas'>('todas');
  const [selectedType, setSelectedType] = useState<TransmissionType | 'todos'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Conteo reactivo de señales en el Inbox
  const counts = useMemo(() => {
    return {
      total: transmissions.length,
      nuevas: transmissions.filter((t) => t.status === 'nueva').length,
      procesando: transmissions.filter((t) => t.status === 'procesando').length,
      procesadas: transmissions.filter((t) => t.status === 'procesada').length,
      archivadas: transmissions.filter((t) => t.status === 'archivada').length,
    };
  }, [transmissions]);

  // Filtrado de transmisiones
  const filteredTransmissions = useMemo(() => {
    return transmissions.filter((item) => {
      // 1. Estado
      if (selectedStatus !== 'todas' && item.status !== selectedStatus) return false;

      // 2. Tipo
      if (selectedType !== 'todos' && item.type !== selectedType) return false;

      // 3. Búsqueda por texto
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(query);
        const matchContent = item.content.toLowerCase().includes(query);
        const matchUrl = item.url?.toLowerCase().includes(query);
        const matchFreq = item.frequencyCode?.toLowerCase().includes(query);
        if (!matchTitle && !matchContent && !matchUrl && !matchFreq) return false;
      }

      return true;
    });
  }, [transmissions, selectedStatus, selectedType, search]);

  const handleCreateTransmission = (data: Omit<Transmission, 'id' | 'createdAt'>) => {
    addTransmission(data);
  };

  const statusFilterTabs: { id: TransmissionStatus | 'todas'; label: string; count: number; icon?: React.ReactNode }[] = [
    { id: 'todas', label: 'Todas', count: counts.total },
    { id: 'nueva', label: 'Nuevas', count: counts.nuevas, icon: <span className="w-2 h-2 rounded-full bg-[#D48B38] animate-pulse" /> },
    { id: 'procesando', label: 'Procesando', count: counts.procesando, icon: <RotateCw className="w-3 h-3 text-[#1E88E5]" /> },
    { id: 'procesada', label: 'Procesadas', count: counts.procesadas, icon: <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" /> },
    { id: 'archivada', label: 'Archivadas', count: counts.archivadas, icon: <Archive className="w-3 h-3 text-[#716E85]" /> },
  ];

  const typeFilterTabs: { id: TransmissionType | 'todos'; label: string }[] = [
    { id: 'todos', label: 'Cualquier tipo' },
    { id: 'texto', label: 'Texto' },
    { id: 'enlace', label: 'Enlace' },
    { id: 'audio', label: 'Audio' },
    { id: 'imagen', label: 'Imagen' },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto select-none">
      {/* 
        =========================================================
        1. BANNER TELEMÉTRICO: ESTACIÓN DE COMUNICACIONES DHARMA
        (Pastel, Suave, Contemporáneo, No militar, No terminal)
        =========================================================
      */}
      {/* 
        =========================================================
        1. BANNER TELEMÉTRICO: ESTACIÓN DE COMUNICACIONES DHARMA
        (Cálido, Editorial, Contemporáneo)
        =========================================================
      */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-[0_2px_14px_rgba(23,23,23,0.02)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Emblema Receptora Pastel */}
            <div className="w-12 h-12 rounded-[18px] bg-[#FFFBEA] text-[#171717] font-bold border border-[#FFD84D]/40 flex items-center justify-center shrink-0 shadow-xs relative">
              <Radio className="w-6 h-6 stroke-[1.8]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FFD84D] border-2 border-white animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-extrabold tracking-dharma text-[#171717] uppercase bg-[#FFFBEA] border border-[#FFD84D]/50 px-2.5 py-0.5 rounded-full">
                  ● RECEPTORA EN LÍNEA
                </span>
                <span className="text-[10px] font-mono text-[#8C8578]">CANAL 108.4 MHz</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif-display text-[#171717] tracking-tight mt-1">
                Transmisiones (Inbox)
              </h2>
              <p className="text-xs text-[#8C8578] font-medium">
                Lugar de entrada para todo material crudo, notas y enlaces antes de ser clasificados
              </p>
            </div>
          </div>

          {/* Mini Telemetría & Botón Principal */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-black/[0.03]">
            {/* Métricas rápidas */}
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-2 rounded-[18px] bg-[#FFFBEA] border border-[#FFD84D]/40 text-center min-w-[76px]">
                <p className="text-[9px] uppercase tracking-dharma font-extrabold text-[#171717]">Sin procesar</p>
                <p className="text-base font-bold font-serif-display text-[#171717] leading-none mt-1">{counts.nuevas}</p>
              </div>
              <div className="px-3.5 py-2 rounded-[18px] bg-[#F0F9FE] border border-[#9DD7F5]/40 text-center min-w-[76px]">
                <p className="text-[9px] uppercase tracking-dharma font-extrabold text-[#171717]">En cola</p>
                <p className="text-base font-bold font-serif-display text-[#171717] leading-none mt-1">{counts.procesando}</p>
              </div>
            </div>

            {/* Botón Principal: ＋ NUEVA TRANSMISIÓN */}
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="gap-2 px-4 shadow-[0_4px_16px_rgba(23,23,23,0.18)]"
              icon={
                <div className="w-4 h-4 rounded-full bg-[#FFD84D] text-[#171717] flex items-center justify-center font-bold">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </div>
              }
            >
              Nueva Transmisión
            </Button>
          </div>
        </div>

        {/* Onda Sonora Decorativa Suave */}
        <div className="mt-4 pt-3.5 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#8C8578] font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#171717]" />
            <span className="hidden sm:inline">Espectro de señal receptora:</span>
            <div className="flex items-center gap-1">
              {[8, 14, 20, 10, 16, 22, 12, 18, 24, 14, 20, 12, 8, 16, 22, 14, 10].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#171717]/40 rounded-full"
                  style={{ height: `${h * 0.6}px` }}
                />
              ))}
            </div>
          </div>
          <span className="text-[#171717] font-bold tracking-wider text-[10px]">PROTOCOLO DHARMA INBOX ACTIVO</span>
        </div>
      </div>

      {/* 
        =========================================================
        2. FILTROS Y CONTROLES
        =========================================================
      */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8578] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por contenido, asunto, URL o código de frecuencia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-[22px] bg-white border border-black/[0.04] text-xs sm:text-sm text-[#171717] placeholder-[#8C8578] focus:outline-none focus:ring-2 focus:ring-[#171717]/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8578] hover:text-[#171717] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro por tipo de transmisión */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {typeFilterTabs.map((tab) => {
              const isSelected = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`
                    px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border
                    ${
                      isSelected
                        ? 'bg-[#171717] text-white border-[#171717] shadow-2xs'
                        : 'bg-white text-[#8C8578] border-black/[0.04] hover:bg-[#F8F4E8] hover:text-[#171717]'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Píldoras de Filtro por Estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statusFilterTabs.map((tab) => {
            const isSelected = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`
                  px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border
                  ${
                    isSelected
                      ? 'bg-[#171717] text-white border-[#171717] shadow-2xs'
                      : 'bg-white text-[#8C8578] border-black/[0.04] hover:bg-[#F8F4E8] hover:text-[#171717]'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`
                    text-[10px] px-1.5 py-0.2 rounded-full font-bold
                    ${isSelected ? 'bg-white/25 text-white' : 'bg-black/[0.05] text-[#8C8578]'}
                  `}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        =========================================================
        3. FLUJO DE SEÑALES / TRANSMISIONES
        Cuadrícula equilibrada para cómoda lectura
        =========================================================
      */}
      {filteredTransmissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTransmissions.map((tx) => (
            <TransmissionCard
              key={tx.id}
              transmission={tx}
              onChangeStatus={changeTransmissionStatus}
              onDelete={deleteTransmission}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No hay transmisiones registradas"
          description={
            search || selectedStatus !== 'todas' || selectedType !== 'todos'
              ? 'No hay señales que coincidan con los filtros o término de búsqueda activo.'
              : 'El buzón de transmisiones está despejado. Toda nueva idea, audio o enlace recibido aparecerá aquí.'
          }
          actionLabel="＋ Nueva Transmisión"
          onAction={() => setIsModalOpen(true)}
          mood="focus"
        />
      )}

      {/* Modal para emitir nueva transmisión */}
      <NewTransmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransmission}
      />
    </div>
  );
};

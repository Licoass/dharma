import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  X, 
  Bookmark, 
  FileText 
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { ArchiveItem, NavTab } from '../../types';
import { ArchiveCard } from './ArchiveCard';
import { ArchiveFormModal } from './ArchiveFormModal';
import { GoogleDriveModal } from './GoogleDriveModal';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export interface ArchiveViewProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ onNavigateTab }) => {
  const { 
    archiveItems, 
    categories, 
    deleteArchiveItem, 
    toggleArchiveFavorite 
  } = useTaskContext();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);

  // Filtrado reactivo de recursos guardados
  const filteredItems = useMemo(() => {
    return archiveItems.filter((item) => {
      // 1. Favoritos
      if (onlyFavorites && !item.isFavorite) return false;

      // 2. Categoría
      if (selectedCategory !== 'todas' && item.categoryId !== selectedCategory) {
        return false;
      }

      // 3. Búsqueda
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDomain = item.domain.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchUrl = item.url.toLowerCase().includes(q);
        const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));

        if (!matchTitle && !matchDomain && !matchDesc && !matchUrl && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [archiveItems, search, selectedCategory, onlyFavorites]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: ArchiveItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Barra superior: Switcher de módulo + Búsqueda + Guardar Enlace */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Toggle rápido entre Archivo (Enlaces) y Registros (Notas) */}
        <div className="bg-[#F5F2EB]/80 p-1 rounded-[18px] flex items-center self-start sm:self-auto">
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('registros')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] text-xs font-bold text-[#697282] hover:text-[#24292F] transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Registros</span>
            </button>
          )}

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] text-xs font-bold bg-white text-[#24292F] shadow-xs cursor-default"
          >
            <Bookmark className="w-4 h-4 text-[#177468]" />
            <span>Archivo ({archiveItems.length})</span>
          </button>
        </div>

        {/* Buscador y Acción */}
        <div className="flex items-center gap-2.5 flex-1 sm:max-w-md ml-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9DA6B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, dominio, etiquetas..."
              className="w-full pl-10 pr-9 py-2.5 rounded-[18px] bg-white text-sm text-[#24292F] placeholder:text-[#9DA6B5] focus:ring-2 focus:ring-[#177468]/15 outline-none transition-all shadow-[0_2px_12px_rgba(36,41,47,0.02)]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA6B5] hover:text-[#24292F] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="pastel"
            pastelColor="sky"
            size="md"
            onClick={() => setIsDriveModalOpen(true)}
            icon={
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            }
          >
            Google Drive
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            Guardar Enlace
          </Button>
        </div>
      </div>

      {/* 2. Filtros Dinámicos: Categorías y Favoritos */}
      <div className="bg-white p-3.5 sm:p-4 rounded-[24px] shadow-[0_2px_14px_rgba(36,41,47,0.02)] flex flex-wrap items-center justify-between gap-3">
        {/* Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
          <span className="text-[11px] font-bold text-[#9DA6B5] uppercase tracking-wider shrink-0 mr-1">
            Categoría:
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('todas')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'todas'
                ? 'bg-[#24292F] text-white'
                : 'bg-[#F5F2EB] text-[#697282] hover:bg-[#EBE7DD]'
            }`}
          >
            Todas
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-xs text-[#24292F] font-bold ring-2 ring-black/5'
                    : 'text-[#697282] hover:bg-[#F5F2EB]'
                }`}
                style={{
                  backgroundColor: isSelected ? cat.bgSoft : 'transparent',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle de Favoritos */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyFavorites
                ? 'bg-[#FEF3C7] text-[#D97706] shadow-xs'
                : 'text-[#697282] hover:bg-[#F5F2EB]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-[#D97706]' : ''}`} />
            <span>Favoritos</span>
          </button>

          {(search || selectedCategory !== 'todas' || onlyFavorites) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('todas');
                setOnlyFavorites(false);
              }}
              className="text-xs text-[#A63838] hover:underline font-semibold flex items-center gap-1 cursor-pointer ml-1"
            >
              <X className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Cuadrícula de Enlaces Guardados (Tarjetas visuales con imagen previa) */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="Sin enlaces en el archivo"
          description="No se han encontrado recursos guardados que coincidan con los criterios de búsqueda o filtros."
          mood="calm"
          actionLabel="Guardar Primer Enlace"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <ArchiveCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={deleteArchiveItem}
              onToggleFavorite={toggleArchiveFavorite}
            />
          ))}
        </div>
      )}

      {/* 4. Modal de Formulario */}
      <ArchiveFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        initialItem={editingItem}
      />

      {/* 5. Modal de Google Drive (FASE 11) */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
      />
    </div>
  );
};

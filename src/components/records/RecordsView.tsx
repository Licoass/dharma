import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  X, 
  FileText, 
  Bookmark 
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { Note, NavTab } from '../../types';
import { NoteCard } from './NoteCard';
import { NoteFormModal } from './NoteFormModal';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export interface RecordsViewProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({ onNavigateTab }) => {
  const { 
    notes, 
    categories, 
    deleteNote, 
    toggleNoteFavorite 
  } = useTaskContext();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Filtrado reactivo de notas
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // 1. Favoritos
      if (onlyFavorites && !n.isFavorite) return false;

      // 2. Categoría
      if (selectedCategory !== 'todas' && n.categoryId !== selectedCategory) {
        return false;
      }

      // 3. Búsqueda
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchContent = n.content.toLowerCase().includes(q);
        const matchTags = n.tags?.some((t) => t.toLowerCase().includes(q));
        const matchLinks = n.links?.some((l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q));
        const matchChecklist = n.checklist?.some((c) => c.title.toLowerCase().includes(q));

        if (!matchTitle && !matchContent && !matchTags && !matchLinks && !matchChecklist) {
          return false;
        }
      }

      return true;
    });
  }, [notes, search, selectedCategory, onlyFavorites]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Barra superior: Switcher de módulo + Búsqueda + Nueva Nota */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Toggle rápido entre Registros (Notas) y Archivo (Enlaces) */}
        <div className="bg-[#EFEAE0]/70 p-1 rounded-[20px] flex items-center border border-black/[0.03] self-start sm:self-auto">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] text-xs font-bold bg-[#171717] text-white shadow-2xs cursor-default"
          >
            <FileText className="w-4 h-4 text-[#FFD84D]" />
            <span>Registros ({notes.length})</span>
          </button>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('archivo')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] text-xs font-bold text-[#8C8578] hover:text-[#171717] transition-all cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>Archivo</span>
            </button>
          )}
        </div>

        {/* Buscador y Acción */}
        <div className="flex items-center gap-2.5 flex-1 sm:max-w-md ml-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8578] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar notas, etiquetas, checklists..."
              className="w-full pl-10 pr-9 py-2.5 rounded-[22px] bg-white text-sm text-[#171717] placeholder:text-[#8C8578] border border-black/[0.04] focus:ring-2 focus:ring-[#171717]/10 outline-none transition-all shadow-[0_2px_12px_rgba(23,23,23,0.02)]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8578] hover:text-[#171717] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            icon={<Plus className="w-4 h-4 stroke-[3]" />}
          >
            Nueva Nota
          </Button>
        </div>
      </div>

      {/* 2. Filtros Dinámicos: Categorías y Favoritos */}
      <div className="bg-white p-4 sm:p-5 rounded-[28px] border border-black/[0.04] shadow-[0_2px_14px_rgba(23,23,23,0.02)] flex flex-wrap items-center justify-between gap-3">
        {/* Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
          <span className="text-[10px] font-extrabold tracking-dharma text-[#8C8578] uppercase shrink-0 mr-1">
            Categoría:
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('todas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'todas'
                ? 'bg-[#171717] text-white shadow-2xs'
                : 'bg-[#F8F4E8] text-[#8C8578] hover:text-[#171717]'
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-black/20 text-[#171717] shadow-2xs'
                    : 'border-transparent text-[#8C8578] hover:text-[#171717] hover:bg-[#F8F4E8]'
                }`}
                style={{
                  backgroundColor: isSelected ? cat.bgSoft : 'transparent',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="tracking-wide">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle de Favoritos */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              onlyFavorites
                ? 'bg-[#FFFBEA] border-[#FFD84D]/50 text-[#171717] shadow-2xs'
                : 'border-transparent text-[#8C8578] hover:text-[#171717] hover:bg-[#F8F4E8]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-[#FFD84D] text-[#FFD84D]' : ''}`} />
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
              className="text-xs text-[#F59A8B] hover:underline font-bold flex items-center gap-1 cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Cuadrícula de Notas */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          title="Sin notas encontradas"
          description="No se han registrado notas que coincidan con la búsqueda o los filtros seleccionados."
          mood="calm"
          actionLabel="Crear Nueva Nota"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={deleteNote}
              onToggleFavorite={toggleNoteFavorite}
            />
          ))}
        </div>
      )}

      {/* 4. Modal de Formulario */}
      <NoteFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        initialNote={editingNote}
      />
    </div>
  );
};

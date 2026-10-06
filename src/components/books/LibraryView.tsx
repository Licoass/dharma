import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  X, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Library as LibraryIcon
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { Book, BookStatus, NavTab } from '../../types';
import { BookCard } from './BookCard';
import { BookFormModal } from './BookFormModal';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export interface LibraryViewProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = () => {
  const { 
    books, 
    addBook, 
    updateBook, 
    deleteBook, 
    changeBookStatus, 
    toggleBookFavorite 
  } = useTaskContext();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | 'todos'>('todos');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Métricas de lectura en tiempo real
  const counts = useMemo(() => {
    return {
      total: books.length,
      leyendo: books.filter((b) => b.status === 'leyendo').length,
      quiero_leer: books.filter((b) => b.status === 'quiero_leer').length,
      terminado: books.filter((b) => b.status === 'terminado').length,
      abandonado: books.filter((b) => b.status === 'abandonado').length,
      favoritos: books.filter((b) => b.isFavorite).length,
    };
  }, [books]);

  // Filtrado reactivo de libros
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Favoritos
      if (onlyFavorites && !book.isFavorite) return false;

      // 2. Filtro por Estado
      if (selectedStatus !== 'todos' && book.status !== selectedStatus) return false;

      // 3. Búsqueda por texto (título, autor, etiquetas, notas)
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(query);
        const matchAuthor = book.author.toLowerCase().includes(query);
        const matchNotes = book.notes?.toLowerCase().includes(query);
        const matchTags = book.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchAuthor && !matchNotes && !matchTags) return false;
      }

      return true;
    });
  }, [books, selectedStatus, onlyFavorites, search]);

  const handleOpenCreate = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleSaveBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
    } else {
      addBook(bookData);
    }
  };

  const statusFilterTabs: { id: BookStatus | 'todos'; label: string; count: number; icon?: React.ReactNode }[] = [
    { id: 'todos', label: 'Todos', count: counts.total },
    { id: 'leyendo', label: 'Leyendo', count: counts.leyendo, icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'quiero_leer', label: 'Quiero leer', count: counts.quiero_leer, icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'terminado', label: 'Terminado', count: counts.terminado, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'abandonado', label: 'Abandonado', count: counts.abandonado, icon: <XCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto select-none">
      {/* 
        =========================================================
        1. TARJETA RESUMEN / METRICAS DHARMA (Pastel & Orgánico)
        =========================================================
      */}
      {/* 
        =========================================================
        1. TARJETA RESUMEN / METRICAS DHARMA (Editorial & Cálido)
        =========================================================
      */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-[0_2px_14px_rgba(23,23,23,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[18px] bg-[#FFFBEA] text-[#171717] flex items-center justify-center font-bold border border-[#FFD84D]/40 shadow-xs">
              <LibraryIcon className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-display text-[#171717] tracking-tight">
                Biblioteca Personal
              </h2>
              <p className="text-xs text-[#8C8578] font-medium">
                Registro de lecturas, protocolos de aprendizaje y sabiduría acumulada
              </p>
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <div className="px-3.5 py-2 rounded-[18px] bg-[#F0F9FE] border border-[#9DD7F5]/40 text-center min-w-[76px]">
              <p className="text-[9px] uppercase tracking-dharma font-extrabold text-[#171717]">Leyendo</p>
              <p className="text-lg font-bold font-serif-display text-[#171717] leading-none mt-1">{counts.leyendo}</p>
            </div>
            <div className="px-3.5 py-2 rounded-[18px] bg-[#FFFBEA] border border-[#FFD84D]/40 text-center min-w-[76px]">
              <p className="text-[9px] uppercase tracking-dharma font-extrabold text-[#171717]">Quiero leer</p>
              <p className="text-lg font-bold font-serif-display text-[#171717] leading-none mt-1">{counts.quiero_leer}</p>
            </div>
            <div className="px-3.5 py-2 rounded-[18px] bg-[#F2F9F1] border border-[#A8D8A0]/40 text-center min-w-[76px]">
              <p className="text-[9px] uppercase tracking-dharma font-extrabold text-[#171717]">Terminados</p>
              <p className="text-lg font-bold font-serif-display text-[#171717] leading-none mt-1">{counts.terminado}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 
        =========================================================
        2. BARRA DE CONTROLES: Búsqueda, Filtro de Estado y Botón
        =========================================================
      */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Input de Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8578] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por título, autor o etiquetas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-[22px] bg-white border border-black/[0.04] text-xs sm:text-sm text-[#171717] placeholder-[#8C8578] focus:outline-none focus:ring-2 focus:ring-[#171717]/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8578] hover:text-[#171717] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Filtro de Favoritos */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`
                px-3.5 py-2.5 rounded-[20px] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border
                ${
                  onlyFavorites
                    ? 'bg-[#FFFBEA] text-[#171717] border-[#FFD84D]/50 shadow-2xs'
                    : 'bg-white text-[#8C8578] border-black/[0.04] hover:bg-[#F8F4E8]'
                }
              `}
              title="Filtrar por libros destacados"
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-[#FFD84D] text-[#FFD84D]' : ''}`} />
              <span className="hidden sm:inline">Destacados</span>
              {counts.favoritos > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-black/[0.05]">
                  {counts.favoritos}
                </span>
              )}
            </button>

            {/* Botón Añadir Libro */}
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenCreate}
              icon={<Plus className="w-4 h-4 stroke-[3]" />}
            >
              Añadir Libro
            </Button>
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
        3. CUADRÍCULA RESPONSIVE DE LIBROS
        - Móvil (< 768px): 2 columnas (grid-cols-2)
        - Tablet (768px - 1199px): 3 columnas (md:grid-cols-3)
        - Desktop (1200px+): 4 o más columnas (desktop:grid-cols-4 xl:grid-cols-5)
        =========================================================
      */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 desktop:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleOpenEdit}
              onDelete={deleteBook}
              onChangeStatus={changeBookStatus}
              onToggleFavorite={toggleBookFavorite}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No se encontraron libros"
          description={
            search || selectedStatus !== 'todos' || onlyFavorites
              ? 'No hay obras que coincidan con los filtros o término de búsqueda activo.'
              : 'Tu biblioteca personal aún está vacía. Comienza registrando tu primera lectura.'
          }
          actionLabel="Añadir Libro"
          onAction={handleOpenCreate}
          mood="focus"
        />
      )}

      {/* Modal para añadir o editar libro */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleSaveBook}
        initialBook={editingBook}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Star, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Tag as TagIcon 
} from 'lucide-react';
import type { Book, BookStatus } from '../../types';
import { DropdownMenu } from '../ui/DropdownMenu';

export interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: BookStatus) => void;
  onToggleFavorite: (id: string) => void;
}

// Configuración visual de estados (Lenguaje Pastel DHARMA)
export const BOOK_STATUS_CONFIG: Record<
  BookStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  leyendo: {
    label: 'Leyendo',
    bg: 'bg-[#E8F6F4]',
    text: 'text-[#177468]',
    border: 'border-[#BDE8E2]',
    icon: <BookOpen className="w-3 h-3 stroke-[2.2]" />,
  },
  quiero_leer: {
    label: 'Quiero leer',
    bg: 'bg-[#FEF6EC]',
    text: 'text-[#D48B38]',
    border: 'border-[#FCE1C2]',
    icon: <Clock className="w-3 h-3 stroke-[2.2]" />,
  },
  terminado: {
    label: 'Terminado',
    bg: 'bg-[#EAF5EA]',
    text: 'text-[#2E7D32]',
    border: 'border-[#CDE7CD]',
    icon: <CheckCircle2 className="w-3 h-3 stroke-[2.2]" />,
  },
  abandonado: {
    label: 'Abandonado',
    bg: 'bg-[#F0EFF4]',
    text: 'text-[#716E85]',
    border: 'border-[#DEDCE5]',
    icon: <XCircle className="w-3 h-3 stroke-[2.2]" />,
  },
};

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onChangeStatus,
  onToggleFavorite,
}) => {
  const [imageError, setImageError] = useState(false);
  const statusInfo = BOOK_STATUS_CONFIG[book.status] || BOOK_STATUS_CONFIG.quiero_leer;

  // Cálculo de progreso de lectura si está leyendo y tiene páginas
  const progressPercent =
    book.pages && book.currentPage !== undefined && book.pages > 0
      ? Math.min(100, Math.round((book.currentPage / book.pages) * 100))
      : null;

  const menuItems = [
    {
      id: 'edit',
      label: 'Editar libro',
      icon: <Edit2 className="w-3.5 h-3.5 text-[#9DA6B5]" />,
      onClick: () => onEdit(book),
    },
    {
      id: 'status-leyendo',
      label: 'Marcar: Leyendo',
      icon: <BookOpen className="w-3.5 h-3.5 text-[#177468]" />,
      onClick: () => onChangeStatus(book.id, 'leyendo'),
    },
    {
      id: 'status-quiero',
      label: 'Marcar: Quiero leer',
      icon: <Clock className="w-3.5 h-3.5 text-[#D48B38]" />,
      onClick: () => onChangeStatus(book.id, 'quiero_leer'),
    },
    {
      id: 'status-terminado',
      label: 'Marcar: Terminado',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />,
      onClick: () => onChangeStatus(book.id, 'terminado'),
    },
    {
      id: 'status-abandonado',
      label: 'Marcar: Abandonado',
      icon: <XCircle className="w-3.5 h-3.5 text-[#716E85]" />,
      onClick: () => onChangeStatus(book.id, 'abandonado'),
    },
    {
      id: 'delete',
      label: 'Eliminar libro',
      icon: <Trash2 className="w-3.5 h-3.5 text-[#EB6B6B]" />,
      destructive: true,
      onClick: () => {
        if (window.confirm(`¿Deseas eliminar "${book.title}" de la biblioteca?`)) {
          onDelete(book.id);
        }
      },
    },
  ];

  return (
    <div className="group rounded-[22px] bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(36,41,47,0.03)] hover:shadow-[0_12px_30px_rgba(36,41,47,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden select-none">
      {/* 
        =========================================================
        1. PORTADA DEL LIBRO (Aspect Ratio Elegante & Suave)
        =========================================================
      */}
      <div className="relative aspect-[3/4] w-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center">
        {book.coverUrl && !imageError ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Fallback orgánico Dharma */
          <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-gradient-to-br from-[#FAF8F5] via-[#E8F6F4]/40 to-[#F5F2EB] text-[#24292F] text-center">
            <div className="w-8 h-8 rounded-full bg-white/80 shadow-xs flex items-center justify-center mt-2 text-[#177468]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="space-y-1 px-2">
              <p className="text-xs font-bold leading-snug line-clamp-3">{book.title}</p>
              <p className="text-[10px] text-[#697282] line-clamp-1">{book.author}</p>
            </div>
            <div className="w-8 h-1 rounded-full bg-[#177468]/20 mb-1" />
          </div>
        )}

        {/* Gradiente sutil para legibilidad de botones flotantes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Botón Favorito Flotante */}
        <button
          type="button"
          onClick={() => onToggleFavorite(book.id)}
          className={`
            absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center
            backdrop-blur-md transition-all shadow-xs cursor-pointer z-10
            ${
              book.isFavorite
                ? 'bg-white text-[#F59E0B] opacity-100'
                : 'bg-white/85 text-[#9DA6B5] hover:text-[#24292F] hover:bg-white opacity-90 group-hover:opacity-100'
            }
          `}
          title={book.isFavorite ? 'Quitar de destacados' : 'Destacar libro'}
        >
          <Star className={`w-3.5 h-3.5 ${book.isFavorite ? 'fill-[#F59E0B]' : ''}`} />
        </button>

        {/* Menú de opciones rápido flotante (desktop / hover) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <DropdownMenu
            trigger={
              <button
                className="w-7 h-7 rounded-full bg-white/85 hover:bg-white backdrop-blur-md text-[#24292F] flex items-center justify-center shadow-xs cursor-pointer opacity-90 group-hover:opacity-100 transition-opacity"
                aria-label="Opciones del libro"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            }
            items={menuItems}
          />
        </div>

        {/* Insignia de Estado Flotante en la Portada */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight
              border backdrop-blur-md shadow-xs transition-transform
              ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}
            `}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </span>
        </div>
      </div>

      {/* 
        =========================================================
        2. INFORMACIÓN DEL LIBRO (Título, Autor, Etiquetas, Progreso)
        =========================================================
      */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1">
          {/* Título */}
          <h4
            className="text-xs sm:text-sm font-bold text-[#24292F] leading-snug line-clamp-2 hover:text-[#177468] transition-colors cursor-pointer"
            onClick={() => onEdit(book)}
            title={book.title}
          >
            {book.title}
          </h4>

          {/* Autor */}
          <p className="text-[11px] sm:text-xs text-[#697282] font-medium line-clamp-1">
            {book.author}
          </p>
        </div>

        {/* Progreso de Lectura (Si está Leyendo) */}
        {book.status === 'leyendo' && progressPercent !== null && (
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-[10px] text-[#697282] font-semibold">
              <span>pág. {book.currentPage}/{book.pages}</span>
              <span className="text-[#177468]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-black/[0.04]">
              <div
                className="h-full bg-gradient-to-r from-[#177468] to-[#2EC4B6] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Etiquetas (Pills Suaves) */}
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {book.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] bg-[#FAF8F5] text-[#697282] font-medium text-[9px] sm:text-[10px] border border-black/[0.02]"
              >
                <TagIcon className="w-2 h-2 opacity-50" />
                <span className="truncate max-w-[80px]">{tag}</span>
              </span>
            ))}
            {book.tags.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-[6px] bg-[#FAF8F5] text-[#9DA6B5] font-semibold text-[9px]">
                +{book.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

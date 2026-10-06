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

// Configuración visual de estados (Lenguaje Editorial Cálido DHARMA)
export const BOOK_STATUS_CONFIG: Record<
  BookStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  leyendo: {
    label: 'LEYENDO',
    bg: 'bg-[#F0F9FE]',
    text: 'text-[#171717]',
    border: 'border-[#9DD7F5]/50',
    icon: <BookOpen className="w-3 h-3 stroke-[2.2]" />,
  },
  quiero_leer: {
    label: 'QUIERO LEER',
    bg: 'bg-[#FFFBEA]',
    text: 'text-[#171717]',
    border: 'border-[#FFD84D]/60',
    icon: <Clock className="w-3 h-3 stroke-[2.2]" />,
  },
  terminado: {
    label: 'TERMINADO',
    bg: 'bg-[#F2F9F1]',
    text: 'text-[#171717]',
    border: 'border-[#A8D8A0]/60',
    icon: <CheckCircle2 className="w-3 h-3 stroke-[2.2]" />,
  },
  abandonado: {
    label: 'ABANDONADO',
    bg: 'bg-[#F8F4E8]',
    text: 'text-[#8C8578]',
    border: 'border-black/10',
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
    <div className="group rounded-[28px] bg-white border border-black/[0.04] shadow-[0_2px_14px_rgba(23,23,23,0.02)] hover:shadow-[0_12px_32px_rgba(23,23,23,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden select-none">
      {/* 
        =========================================================
        1. PORTADA DEL LIBRO (Aspect Ratio Elegante & Suave)
        =========================================================
      */}
      <div className="relative aspect-[3/4] w-full bg-[#F8F4E8] overflow-hidden flex items-center justify-center">
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
          <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-gradient-to-br from-[#F8F4E8] via-[#FFFBEA] to-[#F8F4E8] text-[#171717] text-center">
            <div className="w-9 h-9 rounded-[14px] bg-white shadow-xs flex items-center justify-center mt-2 text-[#171717] font-bold border border-black/[0.04]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="space-y-1 px-2">
              <p className="text-xs font-bold font-serif-display leading-snug line-clamp-3 text-[#171717]">{book.title}</p>
              <p className="text-[10px] text-[#8C8578] line-clamp-1 font-medium">{book.author}</p>
            </div>
            <div className="w-8 h-1 rounded-full bg-black/10 mb-1" />
          </div>
        )}

        {/* Gradiente sutil para legibilidad de botones flotantes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Botón Favorito Flotante */}
        <button
          type="button"
          onClick={() => onToggleFavorite(book.id)}
          className={`
            absolute top-3 right-3 w-7.5 h-7.5 rounded-full flex items-center justify-center
            backdrop-blur-md transition-all shadow-xs cursor-pointer z-10 border border-black/[0.05]
            ${
              book.isFavorite
                ? 'bg-white text-[#FFD84D] opacity-100'
                : 'bg-white/90 text-[#8C8578] hover:text-[#171717] hover:bg-white opacity-90 group-hover:opacity-100'
            }
          `}
          title={book.isFavorite ? 'Quitar de destacados' : 'Destacar libro'}
        >
          <Star className={`w-3.5 h-3.5 ${book.isFavorite ? 'fill-[#FFD84D]' : ''}`} />
        </button>

        {/* Menú de opciones rápido flotante */}
        <div className="absolute top-3 left-3 z-10">
          <DropdownMenu
            trigger={
              <button
                className="w-7.5 h-7.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#171717] flex items-center justify-center shadow-xs cursor-pointer opacity-90 group-hover:opacity-100 transition-opacity border border-black/[0.05]"
                aria-label="Opciones del libro"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            }
            items={menuItems}
          />
        </div>

        {/* Insignia de Estado Flotante en la Portada */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-dharma uppercase
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
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1">
          {/* Título */}
          <h4
            className="text-sm font-bold font-serif-display text-[#171717] leading-snug line-clamp-2 hover:underline transition-colors cursor-pointer"
            onClick={() => onEdit(book)}
            title={book.title}
          >
            {book.title}
          </h4>

          {/* Autor */}
          <p className="text-xs text-[#8C8578] font-medium line-clamp-1">
            {book.author}
          </p>
        </div>

        {/* Progreso de Lectura (Si está Leyendo) */}
        {book.status === 'leyendo' && progressPercent !== null && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] text-[#8C8578] font-bold">
              <span>pág. {book.currentPage}/{book.pages}</span>
              <span className="text-[#171717]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#F8F4E8] rounded-full overflow-hidden border border-black/[0.04]">
              <div
                className="h-full bg-[#171717] rounded-full transition-all duration-300"
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
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F8F4E8] text-[#171717] font-bold text-[9px] uppercase tracking-wider border border-black/[0.03]"
              >
                <TagIcon className="w-2 h-2 opacity-50" />
                <span className="truncate max-w-[80px]">{tag}</span>
              </span>
            ))}
            {book.tags.length > 2 && (
              <span className="px-2 py-0.5 rounded-full bg-[#F8F4E8] text-[#8C8578] font-bold text-[9px]">
                +{book.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

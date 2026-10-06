import React from 'react';
import { 
  Star, 
  ExternalLink, 
  CheckSquare, 
  Tag as TagIcon, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Calendar
} from 'lucide-react';
import type { Note } from '../../types';
import { CategoryBadge } from '../ui/Badge';
import { DropdownMenu } from '../ui/DropdownMenu';
import { useTaskContext } from '../../context/TaskContext';

export interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const { toggleNoteChecklistItem, categories } = useTaskContext();

  const checklist = note.checklist || [];
  const completedChecklist = checklist.filter((i) => i.completed).length;
  const category = categories.find((c) => c.id === note.categoryId);

  // Determinar tipo visual de nota para la presentación editorial
  const visualType = React.useMemo(() => {
    if (note.isFavorite || note.tags?.some((t) => t.toLowerCase().includes('importante'))) {
      return { label: 'IMPORTANTE', color: '#F59A8B', bg: '#FFF0EE' };
    }
    if (checklist.length > 0) {
      return { label: 'LISTA', color: '#FFD84D', bg: '#FFFBEA' };
    }
    if (note.links && note.links.length > 0) {
      return { label: 'REFERENCIA', color: '#9DD7F5', bg: '#F0F9FE' };
    }
    if (note.tags?.some((t) => t.toLowerCase().includes('idea'))) {
      return { label: 'IDEA', color: '#B9A7F7', bg: '#F5F2FE' };
    }
    return { label: 'NOTA NORMAL', color: '#A8D8A0', bg: '#F2F9F1' };
  }, [note, checklist]);

  const menuItems = [
    {
      id: 'edit',
      label: 'Editar nota',
      icon: <Edit2 className="w-3.5 h-3.5 text-[#8C8578]" />,
      onClick: () => onEdit(note),
    },
    {
      id: 'delete',
      label: 'Eliminar nota',
      icon: <Trash2 className="w-3.5 h-3.5 text-[#F59A8B]" />,
      destructive: true,
      onClick: () => {
        if (window.confirm('¿Deseas eliminar esta nota?')) {
          onDelete(note.id);
        }
      },
    },
  ];

  return (
    <div
      className="p-5 sm:p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-[0_2px_14px_rgba(23,23,23,0.02)] hover:shadow-[0_8px_24px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4 select-none relative"
      style={{
        borderLeftColor: category ? category.color : visualType.color,
        borderLeftWidth: '4px',
      }}
    >
      {/* 1. Barra superior: Tipo Visual + Categoría + Favorito y Menú */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[9px] font-extrabold tracking-dharma uppercase px-2.5 py-0.5 rounded-full border border-black/[0.03]"
            style={{
              backgroundColor: visualType.bg,
              color: '#171717',
            }}
          >
            {visualType.label}
          </span>
          <CategoryBadge categoryId={note.categoryId} size="sm" />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(note.id)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              note.isFavorite
                ? 'text-[#FFD84D] hover:bg-[#FFFBEA]'
                : 'text-[#8C8578] hover:text-[#171717] hover:bg-[#F8F4E8]'
            }`}
            title={note.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            aria-label="Favorito"
          >
            <Star
              className={`w-4 h-4 ${note.isFavorite ? 'fill-[#FFD84D]' : ''}`}
            />
          </button>

          <DropdownMenu
            trigger={
              <button
                className="w-7 h-7 flex items-center justify-center rounded-[10px] text-[#8C8578] hover:text-[#171717] hover:bg-[#F8F4E8] transition-colors"
                aria-label="Opciones"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            }
            items={menuItems}
          />
        </div>
      </div>

      {/* 2. Título Editorial y Contenido */}
      <div className="space-y-2 flex-1">
        <h3 className="text-lg font-bold font-serif-display text-[#171717] leading-snug">
          {note.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-[#525252] leading-relaxed line-clamp-4 whitespace-pre-line font-medium">
          {note.content}
        </p>
      </div>

      {/* 3. Checklist interactivo embebido */}
      {checklist.length > 0 && (
        <div className="p-3.5 rounded-[20px] bg-[#F8F4E8]/60 border border-black/[0.03] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-extrabold tracking-wider uppercase text-[#171717]">
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-[#171717]" />
              <span>Checklist</span>
            </span>
            <span className="font-bold text-[#8C8578]">
              {completedChecklist}/{checklist.length}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleNoteChecklistItem(note.id, item.id)}
                className="flex items-center gap-2.5 text-xs cursor-pointer group select-none"
              >
                <span
                  className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-colors shrink-0 ${
                    item.completed
                      ? 'bg-[#171717] border-[#171717] text-white'
                      : 'border-black/20 bg-white group-hover:border-[#171717]'
                  }`}
                >
                  {item.completed && <span className="text-[10px] font-bold">✓</span>}
                </span>
                <span
                  className={`truncate font-medium ${
                    item.completed ? 'line-through text-[#8C8578]' : 'text-[#171717]'
                  }`}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Enlaces guardados en la nota */}
      {note.links && note.links.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[9px] font-extrabold tracking-dharma uppercase text-[#8C8578] block px-0.5">
            Enlaces de referencia:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {note.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F9FE] hover:bg-[#E0F3FD] text-[11px] font-bold text-[#171717] border border-[#9DD7F5]/40 transition-colors truncate max-w-full"
                title={link.url}
              >
                <ExternalLink className="w-3 h-3 shrink-0 text-[#171717]" />
                <span className="truncate">{link.title || link.url}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 5. Etiquetas y fecha */}
      <div className="pt-2.5 border-t border-black/[0.04] flex items-center justify-between gap-2 text-[11px] text-[#8C8578]">
        {note.tags && note.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-[#F8F4E8] text-[#171717] border border-black/[0.03] font-bold text-[9px] uppercase tracking-wider flex items-center gap-1"
              >
                <TagIcon className="w-2.5 h-2.5 opacity-60" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1 text-[10px] font-bold text-[#8C8578] ml-auto">
          <Calendar className="w-3 h-3 text-[#8C8578]" />
          <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

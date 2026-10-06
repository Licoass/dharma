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
  const { toggleNoteChecklistItem } = useTaskContext();

  const checklist = note.checklist || [];
  const completedChecklist = checklist.filter((i) => i.completed).length;

  const menuItems = [
    {
      id: 'edit',
      label: 'Editar nota',
      icon: <Edit2 className="w-3.5 h-3.5 text-[#9DA6B5]" />,
      onClick: () => onEdit(note),
    },
    {
      id: 'delete',
      label: 'Eliminar nota',
      icon: <Trash2 className="w-3.5 h-3.5 text-[#EB6B6B]" />,
      destructive: true,
      onClick: () => {
        if (window.confirm('¿Deseas eliminar esta nota?')) {
          onDelete(note.id);
        }
      },
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-[24px] bg-white shadow-[0_2px_14px_rgba(36,41,47,0.02)] hover:shadow-[0_8px_24px_rgba(36,41,47,0.05)] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4 select-none">
      {/* 1. Barra superior: Categoría, Favorito y Menú */}
      <div className="flex items-center justify-between gap-2">
        <CategoryBadge categoryId={note.categoryId} size="sm" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(note.id)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              note.isFavorite
                ? 'text-[#F59E0B] hover:bg-[#FEF3C7]'
                : 'text-[#9DA6B5] hover:text-[#24292F] hover:bg-[#F5F2EB]'
            }`}
            title={note.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            aria-label="Favorito"
          >
            <Star
              className={`w-4 h-4 ${note.isFavorite ? 'fill-[#F59E0B]' : ''}`}
            />
          </button>

          <DropdownMenu
            trigger={
              <button
                className="w-7 h-7 flex items-center justify-center rounded-[10px] text-[#9DA6B5] hover:text-[#24292F] hover:bg-[#F5F2EB] transition-colors"
                aria-label="Opciones"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            }
            items={menuItems}
          />
        </div>
      </div>

      {/* 2. Título y Contenido */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-[#24292F] leading-snug">
          {note.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-[#697282] leading-relaxed line-clamp-4 whitespace-pre-line">
          {note.content}
        </p>
      </div>

      {/* 3. Checklist interactivo embebido */}
      {checklist.length > 0 && (
        <div className="p-3 rounded-[18px] bg-[#FAF8F5] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#697282]">
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-[#177468]" />
              <span>Checklist</span>
            </span>
            <span className="font-mono text-[#9DA6B5]">
              {completedChecklist}/{checklist.length}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleNoteChecklistItem(note.id, item.id)}
                className="flex items-center gap-2 text-xs cursor-pointer group select-none"
              >
                <span
                  className={`w-3.5 h-3.5 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                    item.completed
                      ? 'bg-[#177468] border-[#177468] text-white'
                      : 'border-[#CBD5E1] bg-white group-hover:border-[#177468]'
                  }`}
                >
                  {item.completed && <span className="text-[10px] font-bold">✓</span>}
                </span>
                <span
                  className={`truncate ${
                    item.completed ? 'line-through text-[#9DA6B5]' : 'text-[#24292F]'
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9DA6B5] block px-0.5">
            Enlaces de referencia:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {note.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F6F4]/70 hover:bg-[#E8F6F4] text-[11px] font-semibold text-[#177468] transition-colors truncate max-w-full"
                title={link.url}
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{link.title || link.url}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 5. Etiquetas y fecha */}
      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between gap-2 text-[11px] text-[#9DA6B5]">
        {note.tags && note.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#697282] font-semibold text-[10px] flex items-center gap-1"
              >
                <TagIcon className="w-2.5 h-2.5 opacity-60" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1 text-[10px] font-medium ml-auto">
          <Calendar className="w-3 h-3 text-[#9DA6B5]" />
          <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

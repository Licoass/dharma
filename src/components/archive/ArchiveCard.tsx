import React, { useState } from 'react';
import { 
  Star, 
  ArrowUpRight, 
  Globe, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Tag as TagIcon,
  Image as ImageIcon
} from 'lucide-react';
import type { ArchiveItem } from '../../types';
import { CategoryBadge } from '../ui/Badge';
import { DropdownMenu } from '../ui/DropdownMenu';

export interface ArchiveCardProps {
  item: ArchiveItem;
  onEdit: (item: ArchiveItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [imageError, setImageError] = useState(false);

  const menuItems = [
    {
      id: 'edit',
      label: 'Editar recurso',
      icon: <Edit2 className="w-3.5 h-3.5 text-[#9DA6B5]" />,
      onClick: () => onEdit(item),
    },
    {
      id: 'delete',
      label: 'Eliminar del archivo',
      icon: <Trash2 className="w-3.5 h-3.5 text-[#EB6B6B]" />,
      destructive: true,
      onClick: () => {
        if (window.confirm('¿Deseas eliminar este enlace del archivo?')) {
          onDelete(item.id);
        }
      },
    },
  ];

  return (
    <div className="rounded-[26px] bg-white shadow-[0_2px_14px_rgba(36,41,47,0.02)] hover:shadow-[0_10px_28px_rgba(36,41,47,0.06)] hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between select-none border border-black/[0.02]">
      {/* 
        =========================================================
        1. SECCIÓN DE IMAGEN PREVIA (No simplemente una URL azul)
        =========================================================
      */}
      <div className="relative h-40 sm:h-44 w-full bg-[#FAF8F5] overflow-hidden">
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FAF8F5] to-[#E8F6F4]/30 text-[#9DA6B5]">
            <ImageIcon className="w-8 h-8 stroke-[1.5] opacity-50 mb-1" />
            <span className="text-xs font-mono font-medium opacity-70">{item.domain}</span>
          </div>
        )}

        {/* Botón Favorito Flotante */}
        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          className={`
            absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
            backdrop-blur-md transition-all shadow-xs cursor-pointer
            ${
              item.isFavorite
                ? 'bg-white text-[#F59E0B]'
                : 'bg-white/80 text-[#9DA6B5] hover:text-[#24292F] hover:bg-white'
            }
          `}
          title={item.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-[#F59E0B]' : ''}`} />
        </button>

        {/* Categoría flotante sobre la imagen */}
        <div className="absolute bottom-3 left-3">
          <CategoryBadge categoryId={item.categoryId} size="sm" />
        </div>
      </div>

      {/* 
        =========================================================
        2. CUERPO DE LA TARJETA: Título, Dominio, Descripción
        =========================================================
      */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Título del recurso */}
          <h4 className="text-base font-bold text-[#24292F] leading-snug line-clamp-1 hover:text-[#177468] transition-colors">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              {item.title}
            </a>
          </h4>

          {/* Dominio limpio */}
          <div className="flex items-center gap-1.5 text-xs text-[#9DA6B5] font-mono">
            <Globe className="w-3.5 h-3.5 shrink-0 opacity-70" />
            <span className="truncate">{item.domain}</span>
          </div>

          {/* Descripción */}
          {item.description && (
            <p className="text-xs text-[#697282] line-clamp-2 leading-relaxed pt-0.5">
              {item.description}
            </p>
          )}

          {/* Etiquetas */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#697282] font-semibold text-[10px] flex items-center gap-1"
                >
                  <TagIcon className="w-2.5 h-2.5 opacity-60" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 
          =========================================================
          3. PIE DE ACCIONES: "Abrir →" y Menú contextual
          =========================================================
        */}
        <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between gap-2">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#177468] hover:text-[#126157] hover:underline transition-colors py-1 cursor-pointer"
          >
            <span>Abrir</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

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
    </div>
  );
};

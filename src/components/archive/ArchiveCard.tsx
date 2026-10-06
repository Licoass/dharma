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
    <div className="rounded-[28px] bg-white border border-black/[0.04] shadow-[0_2px_14px_rgba(23,23,23,0.02)] hover:shadow-[0_10px_28px_rgba(23,23,23,0.06)] hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between select-none">
      {/* 
        =========================================================
        1. SECCIÓN DE IMAGEN PREVIA (Objeto visual)
        =========================================================
      */}
      <div className="relative h-44 sm:h-48 w-full bg-[#F8F4E8] overflow-hidden">
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F8F4E8] to-[#FFFBEA] text-[#8C8578]">
            <ImageIcon className="w-8 h-8 stroke-[1.5] opacity-40 mb-1" />
            <span className="text-xs font-mono font-bold text-[#8C8578]">{item.domain}</span>
          </div>
        )}

        {/* Botón Favorito Flotante */}
        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          className={`
            absolute top-3.5 right-3.5 w-8.5 h-8.5 rounded-full flex items-center justify-center
            backdrop-blur-md transition-all shadow-xs cursor-pointer border border-black/[0.05]
            ${
              item.isFavorite
                ? 'bg-white text-[#FFD84D]'
                : 'bg-white/90 text-[#8C8578] hover:text-[#171717] hover:bg-white'
            }
          `}
          title={item.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-[#FFD84D]' : ''}`} />
        </button>

        {/* Categoría flotante sobre la imagen */}
        <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5">
          <CategoryBadge categoryId={item.categoryId} size="sm" />
          {item.source === 'google_drive' && (
            <span className="bg-white/95 backdrop-blur-md text-[#171717] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-xs border border-black/[0.05]">
              <svg className="w-3 h-3" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
              <span>Drive</span>
            </span>
          )}
        </div>
      </div>

      {/* 
        =========================================================
        2. CUERPO DE LA TARJETA: Título, Dominio, Descripción
        =========================================================
      */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          {/* Título del recurso */}
          <h4 className="text-base font-bold font-serif-display text-[#171717] leading-snug line-clamp-1 hover:underline transition-colors">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              {item.title}
            </a>
          </h4>

          {/* Dominio limpio con distinción de Drive */}
          <div className="flex items-center gap-1.5 text-xs text-[#8C8578] font-mono">
            {item.source === 'google_drive' ? (
              <span className="text-[#171717] font-bold flex items-center gap-1 bg-[#F0F9FE] px-2 py-0.5 rounded-full border border-[#9DD7F5]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                Google Drive
              </span>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <span className="truncate">{item.domain}</span>
              </>
            )}
          </div>

          {/* Descripción */}
          {item.description && (
            <p className="text-xs text-[#525252] line-clamp-2 leading-relaxed pt-0.5 font-medium">
              {item.description}
            </p>
          )}

          {/* Etiquetas */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 ${
                    tag === 'Google Drive'
                      ? 'bg-[#F0F9FE] text-[#171717] border border-[#9DD7F5]/40'
                      : 'bg-[#F8F4E8] text-[#171717] border border-black/[0.03]'
                  }`}
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
            className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-[#171717] text-white hover:bg-black transition-colors cursor-pointer shadow-2xs"
          >
            <span>{item.source === 'google_drive' ? 'Abrir en Drive' : 'Abrir'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

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
    </div>
  );
};

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
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <CategoryBadge categoryId={item.categoryId} size="sm" />
          {item.source === 'google_drive' && (
            <span className="bg-white/95 backdrop-blur-md text-[#1A73E8] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs border border-[#D2E3FC]">
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

          {/* Dominio limpio con distinción de Drive */}
          <div className="flex items-center gap-1.5 text-xs text-[#9DA6B5] font-mono">
            {item.source === 'google_drive' ? (
              <span className="text-[#1A73E8] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                Google Drive
              </span>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">{item.domain}</span>
              </>
            )}
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
                  className={`px-2 py-0.5 rounded-md font-semibold text-[10px] flex items-center gap-1 ${
                    tag === 'Google Drive'
                      ? 'bg-[#E8F0FE] text-[#1A73E8]'
                      : 'bg-[#FAF8F5] text-[#697282]'
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
            className={`inline-flex items-center gap-1 text-xs font-bold py-1 transition-colors cursor-pointer ${
              item.source === 'google_drive'
                ? 'text-[#1A73E8] hover:text-[#1557B0]'
                : 'text-[#177468] hover:text-[#126157] hover:underline'
            }`}
          >
            <span>{item.source === 'google_drive' ? 'Abrir en Drive' : 'Abrir'}</span>
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

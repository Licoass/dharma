import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Tag as TagIcon,
  Image as ImageIcon 
} from 'lucide-react';
import type { Book, BookStatus } from '../../types';
import { BOOK_STATUS_CONFIG } from './BookCard';

export interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialBook?: Book | null;
}

const COVER_PRESETS = [
  {
    name: 'Cosmos / Azul',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Filosofía / Ocre',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Desierto / Terracota',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sistemas / Menta',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Naturaleza / Verde',
    url: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Clásico / Crema',
    url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
  },
];

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialBook,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<BookStatus>('quiero_leer');
  const [tagsInput, setTagsInput] = useState('');
  const [pages, setPages] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title);
      setAuthor(initialBook.author);
      setCoverUrl(initialBook.coverUrl || '');
      setStatus(initialBook.status);
      setTagsInput(initialBook.tags ? initialBook.tags.join(', ') : '');
      setPages(initialBook.pages ?? '');
      setCurrentPage(initialBook.currentPage ?? '');
      setNotes(initialBook.notes || '');
      setIsFavorite(!!initialBook.isFavorite);
    } else {
      setTitle('');
      setAuthor('');
      setCoverUrl('');
      setStatus('quiero_leer');
      setTagsInput('');
      setPages('');
      setCurrentPage('');
      setNotes('');
      setIsFavorite(false);
    }
  }, [initialBook, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const pagesNum = typeof pages === 'number' && pages > 0 ? pages : undefined;
    const currentNum =
      typeof currentPage === 'number' && currentPage >= 0 ? currentPage : undefined;

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl.trim() || undefined,
      status,
      tags: tags.length > 0 ? tags : undefined,
      pages: pagesNum,
      currentPage: currentNum,
      notes: notes.trim() || undefined,
      isFavorite,
    });

    onClose();
  };

  const statusOptions: { id: BookStatus; label: string; icon: React.ReactNode }[] = [
    { id: 'quiero_leer', label: 'Quiero leer', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'leyendo', label: 'Leyendo', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'terminado', label: 'Terminado', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'abandonado', label: 'Abandonado', icon: <XCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialBook ? 'Editar Libro' : 'Nuevo Libro en Biblioteca'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 select-none">
        {/* Título y Autor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Título de la obra *"
            placeholder="Ej: Fundación, Hábitos Atómicos..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Autor / Autora *"
            placeholder="Ej: Isaac Asimov, James Clear..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        {/* Estado del Libro */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#697282] uppercase tracking-[0.04em]">
            Estado de lectura
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {statusOptions.map((opt) => {
              const isSelected = status === opt.id;
              const cfg = BOOK_STATUS_CONFIG[opt.id];
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id)}
                  className={`
                    px-3 py-2.5 rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border
                    ${
                      isSelected
                        ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-current/20 shadow-xs scale-[1.02]`
                        : 'bg-[#FAF8F5] text-[#697282] border-transparent hover:bg-[#F0ECE1]'
                    }
                  `}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Portada URL y sugerencias */}
        <div className="space-y-2">
          <Input
            label="Enlace a la Portada (Imagen)"
            placeholder="https://images.unsplash.com/... o deja vacío para diseño automático"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            icon={<ImageIcon className="w-4 h-4 text-[#9DA6B5]" />}
          />

          {/* Mini presets de portadas */}
          <div>
            <span className="text-[11px] font-semibold text-[#9DA6B5]">Portadas predefinidas:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {COVER_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverUrl(preset.url)}
                  className="px-2 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E8F6F4] text-[10px] font-medium text-[#697282] hover:text-[#177468] transition-colors cursor-pointer border border-black/[0.04]"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Páginas y Progreso */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total Páginas"
            type="number"
            placeholder="Ej: 384"
            value={pages === '' ? '' : pages}
            onChange={(e) => setPages(e.target.value ? Number(e.target.value) : '')}
          />

          <Input
            label="Página Actual"
            type="number"
            placeholder="Ej: 140"
            value={currentPage === '' ? '' : currentPage}
            onChange={(e) => setCurrentPage(e.target.value ? Number(e.target.value) : '')}
          />
        </div>

        {/* Etiquetas */}
        <div className="space-y-1.5">
          <Input
            label="Etiquetas (separadas por comas)"
            placeholder="Ciencia Ficción, Psicología, Filosofía..."
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            icon={<TagIcon className="w-4 h-4 text-[#9DA6B5]" />}
          />
        </div>

        {/* Notas y reflexiones */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#697282] uppercase tracking-[0.04em]">
            Notas y reflexiones personales
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ideas clave, citas o impresiones sobre esta lectura..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-[16px] bg-[#FAF8F5] border border-transparent focus:border-[#177468]/30 focus:bg-white text-xs sm:text-sm text-[#24292F] outline-none transition-all resize-none"
          />
        </div>

        {/* Favorito / Destacado */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex items-center gap-2 text-xs font-bold text-[#24292F] hover:text-[#D48B38] transition-colors cursor-pointer"
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#9DA6B5]'
              }`}
            />
            <span>{isFavorite ? 'Libro destacado' : 'Marcar como destacado'}</span>
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.05]">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={!title.trim() || !author.trim()}>
            {initialBook ? 'Guardar Cambios' : 'Añadir a la Biblioteca'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

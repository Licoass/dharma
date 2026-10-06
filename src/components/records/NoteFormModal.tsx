import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { useTaskContext } from '../../context/TaskContext';
import type { Note, NoteChecklistItem, NoteLink } from '../../types';
import { Plus, Trash2, Link as LinkIcon, CheckSquare, Star } from 'lucide-react';

export interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote?: Note | null;
}

export const NoteFormModal: React.FC<NoteFormModalProps> = ({
  isOpen,
  onClose,
  initialNote = null,
}) => {
  const { categories, addNote, updateNote } = useTaskContext();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Checklist state
  const [checklist, setChecklist] = useState<NoteChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Links state
  const [links, setLinks] = useState<NoteLink[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setCategoryId(initialNote.categoryId);
      setTagsInput(initialNote.tags ? initialNote.tags.join(', ') : '');
      setIsFavorite(!!initialNote.isFavorite);
      setChecklist(initialNote.checklist || []);
      setLinks(initialNote.links || []);
    } else {
      setTitle('');
      setContent('');
      setCategoryId(categories[0]?.id || 'cat-personal');
      setTagsInput('');
      setIsFavorite(false);
      setChecklist([]);
      setLinks([]);
    }
    setNewChecklistText('');
    setNewLinkTitle('');
    setNewLinkUrl('');
  }, [initialNote, isOpen, categories]);

  const handleAddChecklistItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newChecklistText.trim()) return;

    setChecklist((prev) => [
      ...prev,
      {
        id: `nc-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
        title: newChecklistText.trim(),
        completed: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newLinkUrl.trim()) return;

    let formattedUrl = newLinkUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setLinks((prev) => [
      ...prev,
      {
        id: `nl-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
        title: newLinkTitle.trim() || formattedUrl,
        url: formattedUrl,
      },
    ]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const notePayload = {
      title: title.trim(),
      content: content.trim(),
      categoryId: categoryId || categories[0]?.id || 'cat-personal',
      tags: tags.length > 0 ? tags : undefined,
      links: links.length > 0 ? links : undefined,
      checklist: checklist.length > 0 ? checklist : undefined,
      isFavorite,
    };

    if (initialNote) {
      updateNote(initialNote.id, notePayload);
    } else {
      addNote(notePayload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialNote ? 'Editar Registro' : 'Nueva Nota Personal'}
      subtitle="Escribe tus notas, checklists y enlaces de referencia"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 select-none">
        {/* Título y Favorito */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              label="Título de la nota"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Guía de procesos de campo..."
            />
          </div>
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`mt-6 p-3 rounded-[16px] transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-[#FEF3C7] text-[#F59E0B]'
                : 'bg-[#FAF8F5] text-[#9DA6B5] hover:text-[#24292F]'
            }`}
            title={isFavorite ? 'Marcado como favorito' : 'Marcar favorito'}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-[#F59E0B]' : ''}`} />
          </button>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-bold text-[#697282] uppercase tracking-wider mb-1.5">
            Categoría del Sistema
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'shadow-xs font-bold ring-2 ring-black/10'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: cat.bgSoft,
                    color: cat.textColor,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido */}
        <Textarea
          label="Contenido"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe el cuerpo de tu nota, ideas o protocolo..."
          rows={4}
        />

        {/* Checklist */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#697282] uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-[#177468]" />
            <span>Checklist</span>
          </label>

          <div className="flex gap-2">
            <Input
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              placeholder="Añadir ítem a la lista..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleAddChecklistItem}
              icon={<Plus className="w-4 h-4" />}
            >
              Añadir
            </Button>
          </div>

          {checklist.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-[14px] bg-[#FAF8F5] text-xs gap-2"
                >
                  <span className="truncate flex-1">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-[#9DA6B5] hover:text-[#EB6B6B] p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enlaces de referencia */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#697282] uppercase tracking-wider flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-[#177468]" />
            <span>Enlaces Adjuntos</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              placeholder="Título del enlace (ej. Documentación)"
            />
            <div className="flex gap-2">
              <Input
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddLink}
                icon={<Plus className="w-4 h-4" />}
              >
                +
              </Button>
            </div>
          </div>

          {links.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-2.5 rounded-[14px] bg-[#FAF8F5] text-xs gap-2"
                >
                  <div className="min-w-0 flex-1 truncate">
                    <span className="font-bold text-[#24292F]">{link.title}</span>
                    <span className="text-[#9DA6B5] ml-2 text-[11px] truncate">({link.url})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link.id)}
                    className="text-[#9DA6B5] hover:text-[#EB6B6B] p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Etiquetas */}
        <Input
          label="Etiquetas (separadas por coma)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Ej. Protocolo, Hardware, Lectura"
        />

        {/* Botones */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-black/[0.04]">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md">
            {initialNote ? 'Guardar Cambios' : 'Crear Nota'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

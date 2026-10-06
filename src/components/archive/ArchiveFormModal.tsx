import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { useTaskContext } from '../../context/TaskContext';
import type { ArchiveItem } from '../../types';
import { Globe, Image as ImageIcon, Star } from 'lucide-react';

export interface ArchiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: ArchiveItem | null;
}

// Presets de imágenes de muestra estéticas y libres de derechos para previews rápidos
const PRESET_IMAGES = [
  { label: 'Diseño & UI', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  { label: 'Código & Tech', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hardware & IoT', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
  { label: 'Comunidad', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80' },
  { label: 'Naturaleza & Calma', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80' },
];

export const ArchiveFormModal: React.FC<ArchiveFormModalProps> = ({
  isOpen,
  onClose,
  initialItem = null,
}) => {
  const { categories, addArchiveItem, updateArchiveItem } = useTaskContext();

  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Extraer dominio automáticamente de la URL
  const extractDomain = (urlStr: string) => {
    try {
      let cleaned = urlStr.trim();
      if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
        cleaned = `https://${cleaned}`;
      }
      const parsed = new URL(cleaned);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const extracted = extractDomain(value);
    if (extracted) {
      setDomain(extracted);
      if (!title) {
        // Sugerir título amigable basado en el dominio
        setTitle(`Recurso en ${extracted}`);
      }
    }
  };

  useEffect(() => {
    if (initialItem) {
      setUrl(initialItem.url);
      setDomain(initialItem.domain);
      setTitle(initialItem.title);
      setDescription(initialItem.description);
      setImageUrl(initialItem.imageUrl || '');
      setCategoryId(initialItem.categoryId);
      setTagsInput(initialItem.tags ? initialItem.tags.join(', ') : '');
      setIsFavorite(!!initialItem.isFavorite);
    } else {
      setUrl('');
      setDomain('');
      setTitle('');
      setDescription('');
      setImageUrl(PRESET_IMAGES[0].url);
      setCategoryId(categories[0]?.id || 'cat-team-nox');
      setTagsInput('');
      setIsFavorite(false);
    }
  }, [initialItem, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const finalDomain = domain.trim() || extractDomain(finalUrl) || 'enlace';

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: title.trim(),
      url: finalUrl,
      domain: finalDomain,
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      categoryId: categoryId || categories[0]?.id || 'cat-team-nox',
      tags: tags.length > 0 ? tags : undefined,
      isFavorite,
    };

    if (initialItem) {
      updateArchiveItem(initialItem.id, payload);
    } else {
      addArchiveItem(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? 'Editar Recurso' : 'Guardar Enlace en Archivo'}
      subtitle="Guarda recursos, documentación y referencias visuales con previsualización"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 select-none">
        {/* URL */}
        <Input
          label="URL del recurso"
          required
          autoFocus
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://ejemplo.com/recurso"
          icon={<Globe className="w-4 h-4 text-[#9DA6B5]" />}
        />

        {/* Fila: Título y Favorito */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              label="Nombre del recurso"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Biblioteca de Componentes UI"
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

        {/* Dominio */}
        <Input
          label="Dominio detectado"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="ejemplo.com"
        />

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

        {/* URL de Imagen de Previsualización */}
        <div className="space-y-2">
          <Input
            label="URL de imagen de portada"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            icon={<ImageIcon className="w-4 h-4 text-[#9DA6B5]" />}
          />

          {/* Presets visuales rápidos */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-[#9DA6B5] uppercase shrink-0">
              Presets:
            </span>
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF8F5] hover:bg-[#F5F2EB] text-[#697282] shrink-0 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Vista previa de la imagen seleccionada */}
          {imageUrl && (
            <div className="h-28 w-full rounded-[18px] overflow-hidden bg-[#FAF8F5] border border-black/[0.04]">
              <img
                src={imageUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Descripción */}
        <Textarea
          label="Descripción o notas del enlace"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Por qué es relevante este enlace o qué contiene?..."
          rows={2}
        />

        {/* Etiquetas */}
        <Input
          label="Etiquetas (separadas por coma)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Ej. Diseño, Recursos, Herramientas"
        />

        {/* Botones */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-black/[0.04]">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md">
            {initialItem ? 'Guardar Cambios' : 'Guardar en Archivo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

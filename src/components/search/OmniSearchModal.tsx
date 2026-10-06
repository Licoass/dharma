import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  CheckSquare, 
  Calendar, 
  FileText, 
  Bookmark, 
  BookOpen, 
  Radio, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { NavTab, UnifiedSearchResult } from '../../types';

interface OmniSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const OmniSearchModal: React.FC<OmniSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { 
    tasks, 
    notes, 
    archiveItems, 
    books, 
    transmissions, 
    calendarActivities, 
    categories,
    openDharmaCore
  } = useTaskContext();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const results: UnifiedSearchResult[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list: UnifiedSearchResult[] = [];

    // 1. Tareas
    tasks.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
      ) {
        const cat = categories.find((c) => c.id === t.categoryId);
        list.push({
          id: `task-${t.id}`,
          type: 'tarea',
          title: t.title,
          snippet: t.description || (t.dueDate ? `Programada: ${t.dueDate}` : 'Tarea'),
          targetTab: 'tareas',
          categoryId: t.categoryId,
          categoryName: cat?.name,
          categoryColor: cat?.color,
          badge: t.priority.toUpperCase(),
          date: t.dueDate,
          originalItem: t,
        });
      }
    });

    // 2. Calendario
    calendarActivities.forEach((a) => {
      if (
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
      ) {
        const cat = categories.find((c) => c.id === a.categoryId);
        list.push({
          id: `act-${a.id}`,
          type: 'evento',
          title: a.title,
          snippet: `${a.date}${a.time ? ` · ${a.time}` : ''}`,
          targetTab: 'calendario',
          categoryId: a.categoryId,
          categoryName: cat?.name,
          categoryColor: cat?.color,
          badge: a.source === 'google' ? 'GOOGLE' : 'CALENDARIO',
          date: a.date,
          originalItem: a,
        });
      }
    });

    // 3. Registros (Notas)
    notes.forEach((n) => {
      if (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags && n.tags.some((tag) => tag.toLowerCase().includes(q)))
      ) {
        const cat = categories.find((c) => c.id === n.categoryId);
        list.push({
          id: `note-${n.id}`,
          type: 'nota',
          title: n.title,
          snippet: n.content.slice(0, 90),
          targetTab: 'registros',
          categoryId: n.categoryId,
          categoryName: cat?.name,
          categoryColor: cat?.color,
          badge: 'NOTA',
          date: n.createdAt.slice(0, 10),
          originalItem: n,
        });
      }
    });

    // 4. Archivo (Links)
    archiveItems.forEach((ar) => {
      if (
        ar.title.toLowerCase().includes(q) ||
        ar.description.toLowerCase().includes(q) ||
        ar.domain.toLowerCase().includes(q)
      ) {
        const cat = categories.find((c) => c.id === ar.categoryId);
        list.push({
          id: `arch-${ar.id}`,
          type: 'enlace',
          title: ar.title,
          snippet: `${ar.domain} — ${ar.description.slice(0, 80)}`,
          targetTab: 'archivo',
          categoryId: ar.categoryId,
          categoryName: cat?.name,
          categoryColor: cat?.color,
          badge: 'ARCHIVO',
          date: ar.createdAt.slice(0, 10),
          originalItem: ar,
        });
      }
    });

    // 5. Biblioteca (Libros)
    books.forEach((b) => {
      if (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.tags && b.tags.some((tag) => tag.toLowerCase().includes(q)))
      ) {
        list.push({
          id: `book-${b.id}`,
          type: 'libro',
          title: b.title,
          snippet: `Autor: ${b.author} · Estado: ${b.status.replace('_', ' ').toUpperCase()}`,
          targetTab: 'biblioteca',
          badge: 'LIBRO',
          originalItem: b,
        });
      }
    });

    // 6. Transmisiones
    transmissions.forEach((tr) => {
      if (
        tr.content.toLowerCase().includes(q) ||
        (tr.title && tr.title.toLowerCase().includes(q))
      ) {
        list.push({
          id: `trans-${tr.id}`,
          type: 'transmision',
          title: tr.title || `Transmisión ${tr.type.toUpperCase()}`,
          snippet: tr.content.slice(0, 90),
          targetTab: 'transmisiones',
          badge: tr.type.toUpperCase(),
          date: tr.createdAt.slice(0, 10),
          originalItem: tr,
        });
      }
    });

    return list.slice(0, 15);
  }, [query, tasks, calendarActivities, notes, archiveItems, books, transmissions, categories]);

  const handleSelect = (item: UnifiedSearchResult) => {
    onNavigateTab(item.targetTab);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        openDharmaCore(query.trim());
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getTypeIcon = (type: UnifiedSearchResult['type']) => {
    switch (type) {
      case 'tarea':
        return <CheckSquare className="w-4 h-4 text-[#171717]" />;
      case 'evento':
        return <Calendar className="w-4 h-4 text-[#4285F4]" />;
      case 'nota':
        return <FileText className="w-4 h-4 text-[#F6A6C8]" />;
      case 'enlace':
        return <Bookmark className="w-4 h-4 text-[#FFD84D]" />;
      case 'libro':
        return <BookOpen className="w-4 h-4 text-[#A8D8A0]" />;
      case 'transmision':
        return <Radio className="w-4 h-4 text-[#B9A7F7]" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171717]/35 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white border border-black/[0.08] rounded-[28px] shadow-[0_24px_64px_rgba(23,23,23,0.18)] overflow-hidden z-10 flex flex-col max-h-[82vh]"
          >
            {/* Input Header */}
            <div className="p-4 sm:p-5 border-b border-black/[0.05] flex items-center gap-3 bg-[#FAF8F5]">
              <Search className="w-5 h-5 text-[#8C827A] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Buscar en tareas, notas, enlaces, libros, calendario..."
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#171717] placeholder:text-[#A39E93] outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full hover:bg-black/5 text-[#8C827A]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#8C827A] bg-white px-2 py-0.5 rounded-md border border-black/[0.05]">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 sm:p-3 space-y-1.5 flex-1 min-h-[220px]">
              {query.trim() === '' ? (
                <div className="p-8 text-center text-[#8C827A] space-y-2">
                  <p className="text-xs sm:text-sm font-medium">
                    Escribe para buscar instantáneamente en todos tus módulos de DHARMA
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px]">
                    <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-black/[0.04]">Tareas</span>
                    <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-black/[0.04]">Google Calendar</span>
                    <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-black/[0.04]">Notas & Checklist</span>
                    <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-black/[0.04]">Enlaces & Drive</span>
                    <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-black/[0.04]">Biblioteca</span>
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-sm font-semibold text-[#171717]">
                    No se encontraron coincidencias para "{query}"
                  </p>
                  <button
                    onClick={() => {
                      openDharmaCore(query);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD84D]" />
                    <span>Crear o procesar con Dharma Core</span>
                  </button>
                </div>
              ) : (
                results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3.5 rounded-[20px] transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FAF8F5] border border-black/[0.08] shadow-xs'
                          : 'hover:bg-[#FAF8F5]/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center shrink-0 shadow-2xs">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#171717] truncate font-serif-display">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-bold tracking-dharma px-2 py-0.5 rounded-full bg-white border border-black/[0.04] text-[#171717] shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.snippet && (
                            <p className="text-xs text-[#737373] line-clamp-1 mt-0.5 font-medium">
                              {item.snippet}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.categoryName && (
                          <span
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full hidden sm:inline-block border border-black/[0.04]"
                            style={{
                              backgroundColor: `${item.categoryColor}25`,
                              color: '#171717',
                            }}
                          >
                            {item.categoryName}
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-[#8C827A]" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 px-5 border-t border-black/[0.05] bg-[#FAF8F5] flex items-center justify-between text-[11px] text-[#8C827A]">
              <span>Navega con ↑ ↓ y pulsa Enter</span>
              <span>Esc para cerrar</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

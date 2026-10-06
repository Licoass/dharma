import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  Search, 
  ExternalLink, 
  Check, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  File, 
  Folder, 
  Film, 
  Info, 
  Sparkles,
  RefreshCw,
  Plus,
  ShieldCheck,
  X
} from 'lucide-react';
import { googleDriveService } from '../../services/googleDriveService';
import type { 
  GoogleDriveFile, 
  GoogleDriveFilterCategory, 
  GoogleUser 
} from '../../types';
import { useTaskContext } from '../../context/TaskContext';

export interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded?: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  onItemAdded,
}) => {
  const { categories, addArchiveItem, archiveItems } = useTaskContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<GoogleDriveFilterCategory>('all');
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(googleDriveService.getCurrentUser());
  const [isConnected, setIsConnected] = useState(googleDriveService.isAuthenticated());

  // Estado para vincular un archivo específico
  const [activeFileToImport, setActiveFileToImport] = useState<GoogleDriveFile | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Set de IDs ya vinculados para evitar re-guardar o mostrar feedback
  const linkedFileIds = useMemo(() => {
    return new Set(
      archiveItems
        .filter((item) => item.source === 'google_drive' && item.driveFileId)
        .map((item) => item.driveFileId)
    );
  }, [archiveItems]);

  // Cargar archivos al abrir o cambiar filtros
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const results = await googleDriveService.searchFiles({
        query: searchQuery,
        category: selectedCategoryFilter,
      });
      setFiles(results);
    } catch (err) {
      console.error('Error buscando archivos en Google Drive', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsConnected(googleDriveService.isAuthenticated());
      setUser(googleDriveService.getCurrentUser());
      fetchFiles();
      setSaveSuccessMessage(null);
      setActiveFileToImport(null);
    }
  }, [isOpen, selectedCategoryFilter]);

  // Búsqueda en vivo al escribir
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchFiles();
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { user } = await googleDriveService.loginWithGoogle();
      setUser(user);
      setIsConnected(true);
      await fetchFiles();
    } catch (err) {
      console.error('Error conectando con Google Drive', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFileForImport = (file: GoogleDriveFile) => {
    setActiveFileToImport(file);
    const suggestedCat = googleDriveService.suggestCategoryForFile(file.name, categories);
    setTargetCategoryId(suggestedCat);
    setCustomTitle(file.name.replace(/\.(gdoc|gsheet|gslides)$/, ''));
    const typeInfo = googleDriveService.getFileTypeInfo(file.mimeType);
    setCustomTags([typeInfo.tag, 'Google Drive']);
    setSaveSuccessMessage(null);
  };

  const handleAddTag = () => {
    if (customTagInput.trim() && !customTags.includes(customTagInput.trim())) {
      setCustomTags([...customTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter((t) => t !== tagToRemove));
  };

  const handleConfirmSave = () => {
    if (!activeFileToImport) return;

    const payload = googleDriveService.prepareArchiveItemFromDrive(
      activeFileToImport,
      targetCategoryId || categories[0]?.id || '',
      customTags,
      customTitle
    );

    addArchiveItem(payload);
    setSaveSuccessMessage(`«${activeFileToImport.name}» vinculado exitosamente.`);
    setActiveFileToImport(null);
    if (onItemAdded) onItemAdded();

    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  // Helper para renderizar iconos según MIME
  const renderMimeIcon = (mimeType: string) => {
    const info = googleDriveService.getFileTypeInfo(mimeType);
    if (info.category === 'document') {
      return <FileText className="w-5 h-5 text-[#1A73E8]" />;
    }
    if (info.category === 'spreadsheet') {
      return <FileSpreadsheet className="w-5 h-5 text-[#188038]" />;
    }
    if (info.category === 'presentation') {
      return <Presentation className="w-5 h-5 text-[#E37400]" />;
    }
    if (info.category === 'pdf') {
      return <File className="w-5 h-5 text-[#D93025]" />;
    }
    if (info.category === 'folder') {
      return <Folder className="w-5 h-5 text-[#5F6368]" />;
    }
    if (info.category === 'media') {
      return <Film className="w-5 h-5 text-[#9334E6]" />;
    }
    return <File className="w-5 h-5 text-[#4285F4]" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="lg"
    >
      <div className="space-y-5 select-none -mt-3">
        {/* ENCABEZADO CON IDENTIDAD GOOGLE DRIVE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE8E1]">
          <div className="flex items-center gap-3">
            {/* Logo de Google Drive */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E8F0FE] to-[#F1F3F4] border border-[#D2E3FC] flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#24292F]">
                  Explorador de Google Drive
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#E8F0FE] text-[#1A73E8] px-2 py-0.5 rounded-full">
                  FASE 11
                </span>
              </div>
              <p className="text-xs text-[#697282]">
                Busca y vincula archivos de Drive como recursos en Archivo.
              </p>
            </div>
          </div>

          {/* Estado de cuenta / Conectar */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isConnected ? (
              <div className="flex items-center gap-2 bg-[#F5F2EB]/60 px-3 py-1.5 rounded-full border border-[#EBE8E1]">
                <span className="w-2 h-2 rounded-full bg-[#137333] animate-pulse" />
                <span className="text-xs text-[#24292F] font-medium">
                  {user?.email || 'Conectado'}
                </span>
              </div>
            ) : (
              <Button
                variant="pastel"
                pastelColor="teal"
                size="sm"
                onClick={handleConnect}
                disabled={isLoading}
                icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              >
                Conectar Drive
              </Button>
            )}
          </div>
        </div>

        {/* AVISO IMPORTANTE: CERO COPIAS A SUPABASE */}
        <div className="p-3.5 rounded-[18px] bg-gradient-to-r from-[#E8F6F4] to-[#F5F2EB] border border-[#177468]/15 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#177468] shrink-0 mt-0.5" />
          <div className="text-xs text-[#24292F] leading-relaxed">
            <span className="font-bold text-[#177468]">Vinculación Directa sin Copias:</span>{' '}
            Los archivos <span className="font-semibold">no se duplican ni se suben a Supabase</span>. DHARMA guarda exclusivamente la referencia oficial y enlace seguro para abrirlo directamente en Google Drive.
          </div>
        </div>

        {/* FEEDBACK DE GUARDADO EXITOSO */}
        {saveSuccessMessage && (
          <div className="p-3 rounded-[16px] bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#137333]" />
              <span>{saveSuccessMessage}</span>
            </div>
            <button
              onClick={() => setSaveSuccessMessage(null)}
              className="text-[#137333]/70 hover:text-[#137333] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* FORMULARIO DE IMPORTACIÓN EXPANDIDO AL SELECCIONAR UN ARCHIVO */}
        {activeFileToImport && (
          <div className="p-4 sm:p-5 rounded-[22px] bg-white border-2 border-[#177468]/30 shadow-[0_6px_20px_rgba(23,116,104,0.08)] space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#F5F2EB] pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#177468]" />
                <h4 className="text-sm font-bold text-[#24292F]">
                  Configurar Recurso para ARCHIVO
                </h4>
              </div>
              <button
                onClick={() => setActiveFileToImport(null)}
                className="text-xs text-[#697282] hover:text-[#24292F] cursor-pointer p-1"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Título */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-[#697282] uppercase mb-1">
                  Título del Recurso
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-[14px] bg-[#F5F2EB]/50 border border-[#EBE8E1] text-xs font-semibold text-[#24292F] focus:outline-none focus:ring-2 focus:ring-[#177468]/20"
                />
              </div>

              {/* Categoría DHARMA */}
              <div>
                <label className="block text-[11px] font-bold text-[#697282] uppercase mb-1">
                  Categoría en DHARMA
                </label>
                <select
                  value={targetCategoryId}
                  onChange={(e) => setTargetCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-[14px] bg-[#F5F2EB]/50 border border-[#EBE8E1] text-xs text-[#24292F] font-semibold focus:outline-none focus:ring-2 focus:ring-[#177468]/20"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL Directa de Drive */}
              <div>
                <label className="block text-[11px] font-bold text-[#697282] uppercase mb-1">
                  Destino Google Drive
                </label>
                <div className="px-3.5 py-2 rounded-[14px] bg-[#F5F2EB]/30 border border-[#EBE8E1] text-xs text-[#697282] truncate font-mono flex items-center justify-between">
                  <span className="truncate">{activeFileToImport.webViewLink}</span>
                  <a
                    href={activeFileToImport.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A73E8] hover:underline ml-2 flex items-center gap-0.5 shrink-0"
                  >
                    Probar <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Etiquetas */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-[#697282] uppercase mb-1">
                  Etiquetas (Tags)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {customTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-[#E8F6F4] text-[#177468] text-[11px] font-semibold flex items-center gap-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-[#EB6B6B]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Agregar etiqueta..."
                    className="flex-1 px-3 py-1.5 rounded-[12px] bg-[#F5F2EB]/50 border border-[#EBE8E1] text-xs text-[#24292F] focus:outline-none"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddTag}
                    icon={<Plus className="w-3 h-3" />}
                  >
                    Añadir
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F5F2EB]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveFileToImport(null)}
              >
                Descartar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmSave}
                icon={<Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              >
                Guardar en ARCHIVO
              </Button>
            </div>
          </div>
        )}

        {/* 2. BARRA DE BÚSQUEDA Y FILTROS POR TIPO */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9DA6B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en Google Drive por nombre, tipo o propietario..."
              className="w-full pl-10 pr-9 py-2.5 rounded-[18px] bg-[#F5F2EB]/60 text-xs sm:text-sm text-[#24292F] placeholder:text-[#9DA6B5] border border-[#EBE8E1] focus:ring-2 focus:ring-[#177468]/15 outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA6B5] hover:text-[#24292F] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtros por Categoría MIME de Drive */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'document', label: 'Docs' },
              { id: 'spreadsheet', label: 'Sheets' },
              { id: 'presentation', label: 'Slides' },
              { id: 'pdf', label: 'PDFs' },
              { id: 'folder', label: 'Carpetas' },
              { id: 'media', label: 'Multimedia' },
            ].map((f) => {
              const isSelected = selectedCategoryFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(f.id as GoogleDriveFilterCategory)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#24292F] text-white shadow-xs'
                      : 'bg-[#F5F2EB] text-[#697282] hover:bg-[#EBE7DD]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. LISTADO DE ARCHIVOS ENCONTRADOS */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-[#177468] animate-spin" />
              <p className="text-xs text-[#697282]">Consultando Google Drive...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="py-10 text-center space-y-2 bg-[#FAF8F5] rounded-[20px] p-6">
              <Info className="w-8 h-8 text-[#9DA6B5] mx-auto opacity-60" />
              <h4 className="text-xs sm:text-sm font-bold text-[#24292F]">
                No se encontraron archivos en Google Drive
              </h4>
              <p className="text-xs text-[#697282]">
                Prueba con otro término de búsqueda o cambia el filtro de tipo de documento.
              </p>
            </div>
          ) : (
            files.map((file) => {
              const typeInfo = googleDriveService.getFileTypeInfo(file.mimeType);
              const isAlreadySaved = linkedFileIds.has(file.id);
              const isBeingEdited = activeFileToImport?.id === file.id;

              return (
                <div
                  key={file.id}
                  className={`p-3.5 rounded-[20px] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border ${
                    isBeingEdited
                      ? 'bg-[#E8F6F4]/50 border-[#177468]/30 shadow-xs'
                      : 'bg-white hover:bg-[#FAF8F5] border-[#EBE8E1]'
                  }`}
                >
                  {/* Info del Archivo */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-black/5"
                      style={{ backgroundColor: typeInfo.bgSoft }}
                    >
                      {renderMimeIcon(file.mimeType)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: typeInfo.bgSoft,
                            color: typeInfo.color,
                          }}
                        >
                          {typeInfo.label}
                        </span>

                        {isAlreadySaved && (
                          <span className="text-[10px] font-bold text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> En Archivo
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-[#24292F] truncate mt-0.5">
                        {file.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#9DA6B5] mt-1">
                        {file.owners?.[0] && (
                          <span>Por {file.owners[0].displayName || file.owners[0].emailAddress}</span>
                        )}
                        {file.size && (
                          <span>{googleDriveService.formatFileSize(file.size)}</span>
                        )}
                        {file.modifiedTime && (
                          <span>
                            {new Date(file.modifiedTime).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Botón Ver en Drive */}
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-[#697282] hover:text-[#1A73E8] hover:bg-[#E8F0FE] transition-colors"
                      title="Abrir en Google Drive"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Botón Vincular a Archivo */}
                    <Button
                      variant={isAlreadySaved ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handleSelectFileForImport(file)}
                      icon={isAlreadySaved ? <RefreshCw className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    >
                      {isAlreadySaved ? 'Re-vincular' : 'Guardar en Archivo'}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PIE DEL MODAL */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EBE8E1] text-xs text-[#9DA6B5]">
          <span>{files.length} archivo(s) disponibles</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

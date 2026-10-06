import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DharmaCore } from '../common/DharmaCore';
import { 
  RotateCw, 
  CornerDownLeft, 
  Wand2, 
  ShieldCheck 
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { 
  processWithDharmaCore, 
  type DharmaCoreExtractionResult, 
  type DharmaCoreTaskPreview 
} from '../../services/dharmaCoreService';
import { DharmaCoreConfirmation } from './DharmaCoreConfirmation';

export interface DharmaCoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
  onCompleted?: () => void;
}

const SAMPLE_PROMPTS = [
  'mañana tengo que revisar las publicaciones de ocupamor y recordarle a Anderling que mande las fotos',
  'urgente para hoy: llamar al proveedor de solo guayas y cotizar cables de alta tensión',
  'el jueves reunión técnica con eco ingeniería y revisar el caudal hídrico',
];

export const DharmaCoreModal: React.FC<DharmaCoreModalProps> = ({
  isOpen,
  onClose,
  initialText = '',
  onCompleted,
}) => {
  const { categories, statuses, addTask, setDharmaMood } = useTaskContext();
  const [inputText, setInputText] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DharmaCoreExtractionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialText) {
        setInputText(initialText);
      }
      setResult(null);
      setErrorMessage(null);
    }
  }, [isOpen, initialText]);

  const handleAnalyze = async (textToProcess?: string) => {
    const text = (textToProcess || inputText).trim();
    if (!text) return;

    setIsLoading(true);
    setErrorMessage(null);
    setDharmaMood('syncing');

    try {
      const extraction = await processWithDharmaCore(text, categories);
      setResult(extraction);
      setDharmaMood('focus');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar el texto con Dharma Core');
      setDharmaMood('calm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAll = (tasksToSave: DharmaCoreTaskPreview[]) => {
    // La IA NO guarda directamente: Solo se guarda tras la confirmación explícita
    tasksToSave.forEach((t) => {
      addTask({
        title: t.title,
        description: t.description || `Generada por Dharma Core a partir de: "${inputText}"`,
        categoryId: t.categoryId || categories[0]?.id || 'cat-pers',
        statusId: statuses[0]?.id || 'por_hacer',
        priority: t.priority || 'media',
        dueDate: t.dueDate,
        origin: 'Dharma Core',
      });
    });

    setDharmaMood('celebrate');
    setTimeout(() => setDharmaMood('calm'), 2000);

    if (onCompleted) {
      onCompleted();
    }
    handleClose();
  };

  const handleDiscard = () => {
    setResult(null);
    handleClose();
  };

  const handleClose = () => {
    setInputText('');
    setResult(null);
    setErrorMessage(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={result ? 'DHARMA CORE' : 'DHARMA CORE — ASISTENTE INTELIGENTE'}
      subtitle={
        result
          ? 'Confirmación previa a la integración en el sistema'
          : 'Transforma texto libre en tareas y protocolos estructurados'
      }
      maxWidth="lg"
    >
      {result ? (
        /* Pantalla de Confirmación */
        <DharmaCoreConfirmation
          result={result}
          onAcceptAll={handleAcceptAll}
          onDiscard={handleDiscard}
        />
      ) : (
        /* Pantalla de Entrada de Texto Libre */
        <div className="space-y-5 select-none">
          {/* Banner de Presentación Dharma Core */}
          <div className="p-4 rounded-[22px] bg-gradient-to-r from-[#E8F6F4] via-white to-[#FEF6EC] border border-[#177468]/15 flex items-start gap-3.5">
            <DharmaCore mood={isLoading ? 'syncing' : 'focus'} size="sm" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#24292F]">
                Extracción Semántica con Gemini
              </h4>
              <p className="text-xs text-[#697282] leading-relaxed">
                Escribe en lenguaje natural. Dharma Core detectará automáticamente tareas, fechas, categorías y prioridades, presentándote una <strong className="text-[#177468]">pantalla de confirmación</strong> antes de guardar.
              </p>
            </div>
          </div>

          {/* Área de Texto Libre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#697282] uppercase tracking-[0.04em] px-1">
              Ingresa tu texto libre o nota informal
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ej: mañana tengo que revisar las publicaciones de ocupamor y recordarle a Anderling que mande las fotos..."
              rows={4}
              autoFocus
              className="w-full px-4 py-3 rounded-[20px] bg-[#FAF8F5] border border-black/[0.04] focus:border-[#177468]/30 focus:bg-white text-sm sm:text-base font-medium text-[#24292F] outline-none transition-all resize-none shadow-xs placeholder:text-[#9DA6B5]"
            />
          </div>

          {/* Prompts de Ejemplo Rápido */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#9DA6B5] uppercase tracking-wider px-1">
              Pruebas sugeridas:
            </span>
            <div className="flex flex-col gap-1.5">
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(prompt);
                    handleAnalyze(prompt);
                  }}
                  className="text-left p-2.5 rounded-[14px] bg-[#FAF8F5] hover:bg-[#E8F6F4] text-xs text-[#4A5568] hover:text-[#177468] transition-colors border border-black/[0.02] flex items-center justify-between gap-2 cursor-pointer group"
                >
                  <span className="italic line-clamp-1">"{prompt}"</span>
                  <span className="text-[10px] font-bold text-[#177468] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                    Probar <CornerDownLeft className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error si ocurre */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#EB6B6B]/20 text-xs text-[#EB6B6B] font-medium">
              {errorMessage}
            </div>
          )}

          {/* Nota de Seguridad */}
          <div className="flex items-center gap-2 text-[11px] text-[#697282] px-1">
            <ShieldCheck className="w-4 h-4 text-[#177468] shrink-0" />
            <span>
              Llamada segura a Gemini vía <strong>Supabase Edge Functions</strong>. Claves protegidas sin exposición en frontend.
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.04]">
            <Button variant="ghost" size="md" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleAnalyze()}
              disabled={!inputText.trim() || isLoading}
              icon={
                isLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 stroke-[2.2]" />
                )
              }
            >
              {isLoading ? 'Analizando con Gemini...' : 'Analizar con Dharma Core'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

import React, { useMemo } from 'react';
import { CheckCircle2, Target, BookOpen, Radio } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { DharmaRhythmData } from '../../types';

export const DharmaRhythmWidget: React.FC = () => {
  const { tasks, books, transmissions, metrics } = useTaskContext();

  const rhythmData: DharmaRhythmData = useMemo(() => {
    // 1. Tareas completadas hoy vs total
    const taskRate = metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : 80;
    
    // 2. Prioridad vital / alta resuelta
    const highPriorityTasks = tasks.filter((t) => t.priority === 'vital' || t.priority === 'alta');
    const highPriorityDone = highPriorityTasks.length > 0
      ? highPriorityTasks.filter((t) => t.statusId === 'completado').length / highPriorityTasks.length
      : 1;

    // 3. Transmisiones procesadas (inbox zero mindfulness)
    const processedTransmissions = transmissions.filter((tr) => tr.status === 'procesada' || tr.status === 'archivada').length;
    const transRate = transmissions.length > 0 ? (processedTransmissions / transmissions.length) * 100 : 100;

    // 4. Hábito de lectura
    const readingActive = books.some((b) => b.status === 'leyendo' || b.status === 'terminado');

    // Cálculo armónico del score sobre 10
    let rawScore = 5.0;
    rawScore += (taskRate / 100) * 2.5;
    rawScore += highPriorityDone * 1.5;
    rawScore += (transRate / 100) * 0.5;
    if (readingActive) rawScore += 0.5;

    const score = Math.min(10.0, Math.max(5.0, Number(rawScore.toFixed(1))));

    let message = 'Ritmo equilibrado. Mantén la concentración en tu prioridad de hoy.';
    if (score >= 9.0) {
      message = '¡Excelente claridad mental! Has consolidado la mayor parte de tu foco diario.';
    } else if (score >= 7.5) {
      message = 'Buen avance del día. Resuelve las tareas en proceso para completar el ciclo.';
    } else {
      message = 'Día iniciando. Enfócate en tu tarea vital para impulsar tu ritmo consciente.';
    }

    return {
      score,
      taskRate: Math.round(taskRate),
      priorityDone: highPriorityDone >= 0.5,
      transmissionsProcessedRate: Math.round(transRate),
      readingActive,
      message,
    };
  }, [tasks, books, transmissions, metrics]);

  // Circunferencia del círculo SVG (radio 56 => 2 * PI * 56 = ~351.8)
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rhythmData.score / 10) * circumference;

  return (
    <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_4px_24px_rgba(23,23,23,0.03)] flex flex-col md:flex-row items-center justify-between gap-6 select-none relative overflow-hidden">
      {/* Mancha orgánica decorativa de fondo */}
      <div 
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none opacity-40 blur-2xl"
        style={{
          background: 'radial-gradient(circle, #FFD84D 0%, #F6A6C8 40%, #B9A7F7 70%, transparent 100%)',
        }}
      />

      {/* 1. ANILLO CROMÁTICO CON PUNTAJE CENTRAL */}
      <div className="flex items-center gap-5 sm:gap-6 shrink-0 z-10">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
            {/* Pista de fondo */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#F2ECE0"
              strokeWidth="11"
              fill="transparent"
            />
            {/* Anillo de progreso con gradiente */}
            <defs>
              <linearGradient id="dharmaScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD84D" />
                <stop offset="25%" stopColor="#F6A6C8" />
                <stop offset="50%" stopColor="#B9A7F7" />
                <stop offset="75%" stopColor="#9DD7F5" />
                <stop offset="100%" stopColor="#A8D8A0" />
              </linearGradient>
            </defs>
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#dharmaScoreGradient)"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Puntaje en el centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-serif-display text-[#171717] tracking-tight">
              {rhythmData.score.toFixed(1)}
            </span>
            <span className="text-[9px] font-bold tracking-dharma uppercase text-[#8C827A] mt-0.5">
              RITMO
            </span>
          </div>
        </div>

        {/* Encabezado descriptivo */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-dharma uppercase px-2.5 py-0.5 rounded-full bg-[#171717] text-[#FFD84D]">
              CONSCIOUS FLOW
            </span>
            <span className="text-xs text-[#8C827A] font-semibold">Hoy</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-serif-display text-[#171717]">
            Ritmo y Vitalidad
          </h3>
          <p className="text-xs text-[#737373] max-w-xs font-medium leading-relaxed">
            {rhythmData.message}
          </p>
        </div>
      </div>

      {/* 2. PILARES DEL RITMO (DESGLOSE VISUAL) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto z-10">
        {/* Tareas */}
        <div className="p-3 rounded-[20px] bg-[#FAF8F5] border border-black/[0.04] text-center space-y-1">
          <div className="w-7 h-7 mx-auto rounded-full bg-[#FFD84D]/30 flex items-center justify-center text-[#171717]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#171717] block font-serif-display">
            {rhythmData.taskRate}%
          </span>
          <span className="text-[9px] font-bold tracking-dharma uppercase text-[#8C827A] block">
            TAREAS
          </span>
        </div>

        {/* Foco */}
        <div className="p-3 rounded-[20px] bg-[#FAF8F5] border border-black/[0.04] text-center space-y-1">
          <div className="w-7 h-7 mx-auto rounded-full bg-[#F6A6C8]/30 flex items-center justify-center text-[#171717]">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#171717] block font-serif-display">
            {rhythmData.priorityDone ? 'Activo' : 'En curso'}
          </span>
          <span className="text-[9px] font-bold tracking-dharma uppercase text-[#8C827A] block">
            FOCO VITAL
          </span>
        </div>

        {/* Lectura */}
        <div className="p-3 rounded-[20px] bg-[#FAF8F5] border border-black/[0.04] text-center space-y-1">
          <div className="w-7 h-7 mx-auto rounded-full bg-[#A8D8A0]/30 flex items-center justify-center text-[#171717]">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#171717] block font-serif-display">
            {rhythmData.readingActive ? 'Activo' : 'Pausa'}
          </span>
          <span className="text-[9px] font-bold tracking-dharma uppercase text-[#8C827A] block">
            LECTURA
          </span>
        </div>

        {/* Inbox */}
        <div className="p-3 rounded-[20px] bg-[#FAF8F5] border border-black/[0.04] text-center space-y-1">
          <div className="w-7 h-7 mx-auto rounded-full bg-[#B9A7F7]/30 flex items-center justify-center text-[#171717]">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#171717] block font-serif-display">
            {rhythmData.transmissionsProcessedRate}%
          </span>
          <span className="text-[9px] font-bold tracking-dharma uppercase text-[#8C827A] block">
            INBOX
          </span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import type { StationId, TaskPriority, TaskStatus } from '../../types';
import { STATIONS } from '../../data/stations';

export const StationBadge: React.FC<{ stationId: StationId; size?: 'sm' | 'md' }> = ({
  stationId,
  size = 'md',
}) => {
  const station = STATIONS[stationId] || STATIONS.personal;
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
      style={{
        backgroundColor: station.bgSoft,
        color: station.textColor,
        border: `1px solid ${station.borderColor}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: station.color }}
      />
      <span>{station.name}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TaskPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const config = {
    baja: { label: 'Baja', bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
    media: { label: 'Media', bg: '#EFF6FF', text: '#2563EB', border: '#DBEAFE' },
    alta: { label: 'Alta', bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    vital: { label: 'Vital', bg: '#FFE4E6', text: '#E11D48', border: '#FECDD3' },
  }[priority];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const config = {
    pendiente: { label: 'Pendiente', bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' },
    en_curso: { label: 'En curso', bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' },
    completada: { label: 'Completada', bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7' },
    archivada: { label: 'Archivada', bg: '#F1F5F9', text: '#94A3B8', border: '#E2E8F0' },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'en_curso' ? 'animate-pulse' : ''
        }`}
        style={{
          backgroundColor:
            status === 'pendiente'
              ? '#94A3B8'
              : status === 'en_curso'
              ? '#0D9488'
              : status === 'completada'
              ? '#16A34A'
              : '#CBD5E1',
        }}
      />
      {config.label}
    </span>
  );
};

export const ProtocolPill: React.FC<{ code?: string }> = ({ code }) => {
  if (!code) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-slate-100/80 text-slate-500 border border-slate-200/60 tracking-wider">
      {code}
    </span>
  );
};

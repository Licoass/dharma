import React from 'react';
import type { StationId, TaskStatus, TaskPriority } from '../../types';
import { STATIONS } from '../../data/stations';

export interface BadgeProps {
  variant?: 'teal' | 'lavender' | 'sage' | 'honey' | 'coral' | 'sky' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'teal',
  size = 'md',
  children,
  icon,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  }[size];

  const variantClasses = {
    teal: 'bg-[#E8F6F4] text-[#177468]',
    lavender: 'bg-[#F2EDFA] text-[#6A449F]',
    sage: 'bg-[#EEF6F0] text-[#376841]',
    honey: 'bg-[#FEF6E9] text-[#8E5B18]',
    coral: 'bg-[#FEEFEF] text-[#A63838]',
    sky: 'bg-[#EDF5FC] text-[#246A9E]',
    neutral: 'bg-[#F5F2EB] text-[#697282]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const CategoryBadge: React.FC<{
  stationId: StationId;
  size?: 'sm' | 'md';
  showDot?: boolean;
}> = ({ stationId, size = 'md', showDot = true }) => {
  const station = STATIONS[stationId] || STATIONS.personal;

  const colorVariants: Record<StationId, 'teal' | 'lavender' | 'honey' | 'sage' | 'sky'> = {
    trabajo: 'teal',
    personal: 'lavender',
    enfoque: 'honey',
    bienestar: 'sage',
    protocolos: 'sky',
  };

  return (
    <Badge variant={colorVariants[stationId] || 'teal'} size={size}>
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: station.color }}
        />
      )}
      <span>{station.name}</span>
    </Badge>
  );
};

export const StatusBadge: React.FC<{
  status: TaskStatus;
  size?: 'sm' | 'md';
}> = ({ status, size = 'md' }) => {
  const config = {
    pendiente: { label: 'Pendiente', variant: 'neutral' as const },
    en_curso: { label: 'En proceso', variant: 'teal' as const },
    en_espera: { label: 'En espera', variant: 'honey' as const },
    completada: { label: 'Completada', variant: 'sage' as const },
    archivada: { label: 'Archivada', variant: 'neutral' as const },
  }[status];

  return (
    <Badge variant={config.variant} size={size}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'en_curso'
            ? 'animate-pulse bg-[#177468]'
            : status === 'en_espera'
            ? 'bg-[#E8A743]'
            : status === 'completada'
            ? 'bg-[#5CA16B]'
            : 'bg-[#9DA6B5]'
        }`}
      />
      <span>{config.label}</span>
    </Badge>
  );
};

export const PriorityBadge: React.FC<{
  priority: TaskPriority;
  size?: 'sm' | 'md';
}> = ({ priority, size = 'md' }) => {
  const config = {
    baja: { label: 'Baja', variant: 'neutral' as const },
    media: { label: 'Media', variant: 'sky' as const },
    alta: { label: 'Alta', variant: 'honey' as const },
    vital: { label: 'Vital', variant: 'coral' as const },
  }[priority];

  return (
    <Badge variant={config.variant} size={size}>
      <span>{config.label}</span>
    </Badge>
  );
};

import React from 'react';
import type { TaskPriority } from '../../types';
import { useTaskContext } from '../../context/TaskContext';

export interface BadgeProps {
  variant?: 'teal' | 'lavender' | 'sage' | 'honey' | 'coral' | 'sky' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'teal',
  size = 'md',
  children,
  icon,
  className = '',
  style,
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
      style={style}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const CategoryBadge: React.FC<{
  categoryId?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}> = ({ categoryId = '', size = 'md', showDot = true }) => {
  const { getCategoryById } = useTaskContext();
  const category = getCategoryById(categoryId);

  if (!category) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.12em] rounded-full select-none transition-colors border ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
      }`}
      style={{
        backgroundColor: category.bgSoft,
        borderColor: category.borderColor || `${category.color}40`,
        color: '#171717',
      }}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
      )}
      <span className="truncate">{category.name}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{
  statusId?: string;
  size?: 'sm' | 'md';
}> = ({ statusId = '', size = 'md' }) => {
  const { getStatusById } = useTaskContext();
  const status = getStatusById(statusId);

  if (!status) return null;

  const isProgress = status.id === 'en_proceso';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.12em] rounded-full select-none transition-colors border ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
      }`}
      style={{
        backgroundColor: status.bgSoft,
        borderColor: `${status.color}40`,
        color: '#171717',
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${isProgress ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: status.color }}
      />
      <span className="truncate">{status.name}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{
  priority: TaskPriority;
  size?: 'sm' | 'md';
}> = ({ priority, size = 'md' }) => {
  const config = {
    baja: { label: 'Baja', bg: 'bg-[#F0F9FE]', border: 'border-[#9DD7F5]/50' },
    media: { label: 'Media', bg: 'bg-[#F5F2FE]', border: 'border-[#B9A7F7]/50' },
    alta: { label: 'Alta', bg: 'bg-[#FFFBEA]', border: 'border-[#FFD84D]/50' },
    vital: { label: 'Vital', bg: 'bg-[#FEF3F1]', border: 'border-[#F59A8B]/50' },
  }[priority];

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-[0.12em] rounded-full select-none border text-[#171717] ${
        config.bg
      } ${config.border} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
      }`}
    >
      <span>{config.label}</span>
    </span>
  );
};

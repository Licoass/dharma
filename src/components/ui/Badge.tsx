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
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full select-none transition-colors ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
      style={{
        backgroundColor: category.bgSoft,
        color: category.textColor,
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
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full select-none transition-colors ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
      style={{
        backgroundColor: status.bgSoft,
        color: status.textColor,
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

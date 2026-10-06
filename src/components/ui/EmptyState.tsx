import React from 'react';
import { DharmaCore } from '../common/DharmaCore';
import type { DharmaCoreMood } from '../../types';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  mood?: DharmaCoreMood;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  mood = 'idle',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`
        p-8 sm:p-12 rounded-[28px] bg-white/70
        flex flex-col items-center justify-center text-center select-none
        ${className}
      `}
    >
      <div className="p-3 rounded-full bg-[#F5F2EB]/60 mb-4">
        <DharmaCore mood={mood} size="lg" />
      </div>

      <h4 className="text-base sm:text-lg font-bold text-[#24292F] tracking-[0.02em]">
        {title}
      </h4>

      {description && (
        <p className="text-xs sm:text-sm text-[#697282] max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

import React from 'react';

export interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  rounded = 'md',
}) => {
  const roundedClasses = {
    sm: 'rounded-[10px]',
    md: 'rounded-[16px]',
    lg: 'rounded-[24px]',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={`animate-pulse bg-[#F0ECE1]/80 ${roundedClasses} ${className}`}
    />
  );
};

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-[24px] bg-white shadow-[0_4px_20px_-2px_rgba(36,41,47,0.02)] space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-5" rounded="full" />
        <Skeleton className="w-12 h-5" rounded="full" />
      </div>
      <div className="flex items-start gap-3">
        <Skeleton className="w-6 h-6 shrink-0" rounded="md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-5" rounded="sm" />
          <Skeleton className="w-1/2 h-4" rounded="sm" />
        </div>
      </div>
    </div>
  );
};

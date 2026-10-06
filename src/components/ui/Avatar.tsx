import React from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'teal' | 'lavender' | 'honey' | 'sage';
  statusDot?: 'online' | 'busy' | 'away' | null;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Dharma',
  size = 'md',
  variant = 'teal',
  statusDot = null,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs rounded-[12px]',
    md: 'w-11 h-11 text-sm rounded-[16px]',
    lg: 'w-14 h-14 text-base rounded-[20px]',
  }[size];

  const variantBg = {
    teal: 'bg-[#E8F6F4] text-[#177468]',
    lavender: 'bg-[#F2EDFA] text-[#6A449F]',
    honey: 'bg-[#FEF6E9] text-[#8E5B18]',
    sage: 'bg-[#EEF6F0] text-[#376841]',
  }[variant];

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses} object-cover shadow-[0_2px_8px_rgba(0,0,0,0.04)]`}
        />
      ) : (
        <div
          className={`${sizeClasses} ${variantBg} font-bold flex items-center justify-center select-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]`}
        >
          {initials}
        </div>
      )}

      {statusDot && (
        <span
          className={`
            absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
            ${statusDot === 'online' ? 'bg-[#5CA16B]' : statusDot === 'busy' ? 'bg-[#EB6B6B]' : 'bg-[#E8A743]'}
          `}
        />
      )}
    </div>
  );
};

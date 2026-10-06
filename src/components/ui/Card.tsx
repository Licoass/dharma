import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'surface' | 'warm' | 'ghost' | 'tint';
  tintColor?: 'yellow' | 'pink' | 'lavender' | 'blue' | 'green' | 'coral' | 'teal' | 'sage' | 'honey' | 'sky';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  tintColor = 'yellow',
  interactive = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const tintStyles: Record<string, string> = {
    yellow: 'bg-[#FFFBEA] border border-[#FFD84D]/35',
    pink: 'bg-[#FDF0F5] border border-[#F6A6C8]/35',
    lavender: 'bg-[#F5F2FE] border border-[#B9A7F7]/35',
    blue: 'bg-[#F0F9FE] border border-[#9DD7F5]/35',
    green: 'bg-[#F2FAF0] border border-[#A8D8A0]/35',
    coral: 'bg-[#FEF3F1] border border-[#F59A8B]/35',
    // retro-compatibilidad
    teal: 'bg-[#F2FAF0] border border-[#A8D8A0]/35',
    sage: 'bg-[#F2FAF0] border border-[#A8D8A0]/35',
    honey: 'bg-[#FFFBEA] border border-[#FFD84D]/35',
    sky: 'bg-[#F0F9FE] border border-[#9DD7F5]/35',
  };

  const variantMap = {
    surface: 'bg-white shadow-[0_4px_22px_-2px_rgba(23,23,23,0.03),0_2px_8px_-1px_rgba(23,23,23,0.02)] border border-black/[0.04]',
    warm: 'bg-[#FAF6ED] border border-[#EAE3D2]/80',
    ghost: 'bg-transparent border border-black/[0.06]',
    tint: tintStyles[tintColor] || tintStyles.yellow,
  };

  return (
    <div
      className={`
        rounded-[26px] transition-all duration-200 select-none text-[#171717]
        ${variantMap[variant]}
        ${
          interactive
            ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-4px_rgba(23,23,23,0.06),0_4px_12px_-2px_rgba(23,23,23,0.02)] active:scale-[0.99]'
            : ''
        }
        ${paddingMap[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

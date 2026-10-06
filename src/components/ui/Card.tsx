import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'surface' | 'warm' | 'ghost' | 'tint';
  tintColor?: 'teal' | 'lavender' | 'sage' | 'honey' | 'coral' | 'sky';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  tintColor = 'teal',
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

  const variantMap = {
    surface: 'bg-white shadow-[0_4px_24px_-2px_rgba(36,41,47,0.03),0_2px_8px_-1px_rgba(36,41,47,0.02)]',
    warm: 'bg-[#F5F2EB]/70',
    ghost: 'bg-transparent border border-black/[0.04]',
    tint: {
      teal: 'bg-[#E8F6F4]/70',
      lavender: 'bg-[#F2EDFA]/70',
      sage: 'bg-[#EEF6F0]/70',
      honey: 'bg-[#FEF6E9]/70',
      coral: 'bg-[#FEEFEF]/70',
      sky: 'bg-[#EDF5FC]/70',
    }[tintColor],
  };

  return (
    <div
      className={`
        rounded-[26px] transition-all duration-200 select-none
        ${variantMap[variant]}
        ${
          interactive
            ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-4px_rgba(36,41,47,0.06),0_4px_12px_-2px_rgba(36,41,47,0.02)] active:scale-[0.99]'
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

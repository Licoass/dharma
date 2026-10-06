import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'pastel' | 'ghost';
  accentColor?: 'yellow' | 'pink' | 'lavender';
  pastelColor?: 'yellow' | 'pink' | 'lavender' | 'blue' | 'green' | 'coral' | 'teal' | 'honey' | 'sage' | 'sky';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  accentColor = 'yellow',
  pastelColor = 'yellow',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold select-none
    transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none
    cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black/20
  `;

  const sizeClasses = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs rounded-[16px] gap-1.5',
    md: 'min-h-[46px] px-5 py-2.5 text-sm rounded-[20px] gap-2', // comfortably exceeds 44px touch target
    lg: 'min-h-[52px] px-6 py-3 text-base rounded-[24px] gap-2.5',
    icon: 'w-[46px] h-[46px] min-w-[46px] min-h-[46px] rounded-[18px] p-0',
  }[size];

  const variantClasses = {
    primary: 'bg-[#171717] hover:bg-[#2B2B2B] text-white shadow-[0_4px_16px_rgba(23,23,23,0.18)] active:bg-black',
    secondary: 'bg-white hover:bg-[#FAF6ED] text-[#171717] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)] active:bg-[#F2ECE0]',
    accent: {
      yellow: 'bg-[#FFD84D] hover:bg-[#F7CE3B] text-[#171717] shadow-[0_4px_16px_rgba(255,216,77,0.30)]',
      pink: 'bg-[#F6A6C8] hover:bg-[#E996B9] text-[#171717] shadow-[0_4px_16px_rgba(246,166,200,0.30)]',
      lavender: 'bg-[#B9A7F7] hover:bg-[#A995EF] text-[#171717] shadow-[0_4px_16px_rgba(185,167,247,0.30)]',
    }[accentColor],
    ghost: 'bg-transparent hover:bg-black/[0.05] text-[#737373] hover:text-[#171717]',
    pastel: {
      yellow: 'bg-[#FFFBEA] text-[#171717] border border-[#FFD84D]/40 hover:bg-[#FFF5CC]',
      pink: 'bg-[#FDF0F5] text-[#171717] border border-[#F6A6C8]/40 hover:bg-[#FAE1EC]',
      lavender: 'bg-[#F5F2FE] text-[#171717] border border-[#B9A7F7]/40 hover:bg-[#ECE5FC]',
      blue: 'bg-[#F0F9FE] text-[#171717] border border-[#9DD7F5]/40 hover:bg-[#E2F3FD]',
      green: 'bg-[#F2FAF0] text-[#171717] border border-[#A8D8A0]/40 hover:bg-[#E4F4E0]',
      coral: 'bg-[#FEF3F1] text-[#171717] border border-[#F59A8B]/40 hover:bg-[#FCE5E1]',
      // retro-compatibilidad
      teal: 'bg-[#F2FAF0] text-[#171717] border border-[#A8D8A0]/40 hover:bg-[#E4F4E0]',
      sage: 'bg-[#F2FAF0] text-[#171717] border border-[#A8D8A0]/40 hover:bg-[#E4F4E0]',
      honey: 'bg-[#FFFBEA] text-[#171717] border border-[#FFD84D]/40 hover:bg-[#FFF5CC]',
      sky: 'bg-[#F0F9FE] text-[#171717] border border-[#9DD7F5]/40 hover:bg-[#E2F3FD]',
    }[pastelColor],
  }[variant];

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses}
        ${variantClasses}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

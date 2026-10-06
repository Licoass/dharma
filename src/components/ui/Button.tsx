import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'pastel' | 'ghost';
  pastelColor?: 'teal' | 'lavender' | 'honey' | 'sage' | 'coral' | 'sky';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  pastelColor = 'teal',
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
    inline-flex items-center justify-center font-medium select-none
    transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none
    cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-400/40
  `;

  const sizeClasses = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs rounded-[16px] gap-1.5',
    md: 'min-h-[46px] px-5 py-2.5 text-sm rounded-[20px] gap-2', // comfortably exceeds 44px touch target
    lg: 'min-h-[52px] px-6 py-3 text-base rounded-[22px] gap-2.5',
    icon: 'w-[46px] h-[46px] min-w-[46px] min-h-[46px] rounded-[18px] p-0',
  }[size];

  const variantClasses = {
    primary: 'bg-[#177468] hover:bg-[#126157] text-white shadow-[0_4px_14px_rgba(23,116,104,0.18)] active:bg-[#0D4D45]',
    secondary: 'bg-white hover:bg-[#FAF8F5] text-[#24292F] shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:bg-[#F5F2EB]',
    ghost: 'bg-transparent hover:bg-black/[0.03] text-[#697282] hover:text-[#24292F]',
    pastel: {
      teal: 'bg-[#E8F6F4] text-[#177468] hover:bg-[#D5EFEA]',
      lavender: 'bg-[#F2EDFA] text-[#6A449F] hover:bg-[#E4D7F7]',
      honey: 'bg-[#FEF6E9] text-[#8E5B18] hover:bg-[#FCEACD]',
      sage: 'bg-[#EEF6F0] text-[#376841] hover:bg-[#DCEDE0]',
      coral: 'bg-[#FEEFEF] text-[#A63838] hover:bg-[#FDDBDB]',
      sky: 'bg-[#EDF5FC] text-[#246A9E] hover:bg-[#D9ECFA]',
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

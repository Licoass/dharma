import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'station';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium select-none
    transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
    cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30
  `;

  const sizeClasses = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'min-h-[44px] px-4 py-2.5 text-sm rounded-2xl gap-2', // meets 44px min touch target
    lg: 'min-h-[50px] px-6 py-3 text-base rounded-2xl gap-2.5',
    icon: 'w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl p-0',
  }[size];

  const variantClasses = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-700/10 active:bg-teal-800',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs active:bg-slate-100',
    ghost: 'bg-transparent hover:bg-slate-100/70 text-slate-600 active:bg-slate-200/50',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 active:bg-rose-200',
    station: 'bg-teal-50 hover:bg-teal-100/80 text-teal-800 border border-teal-200/60 active:bg-teal-200',
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
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

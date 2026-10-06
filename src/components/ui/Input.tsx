import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] px-1"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-4 text-[#9DA6B5] pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          className={`
            w-full min-h-[46px] rounded-[18px] bg-white text-sm text-[#24292F]
            placeholder:text-[#9DA6B5] transition-all outline-none
            shadow-[0_2px_10px_rgba(0,0,0,0.02)]
            focus:ring-2 focus:ring-[#177468]/15 focus:bg-white
            ${icon ? 'pl-11 pr-4' : 'px-4'}
            ${error ? 'ring-2 ring-[#EB6B6B]/40' : 'hover:bg-white/80'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-[#A63838] px-1 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-[#9DA6B5] px-1">{hint}</p>
      ) : null}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  hint,
  error,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#697282] uppercase tracking-[0.04em] px-1"
        >
          {label}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        className={`
          w-full rounded-[20px] bg-white text-sm text-[#24292F] p-4
          placeholder:text-[#9DA6B5] transition-all outline-none resize-none
          shadow-[0_2px_10px_rgba(0,0,0,0.02)]
          focus:ring-2 focus:ring-[#177468]/15
          ${error ? 'ring-2 ring-[#EB6B6B]/40' : 'hover:bg-white/80'}
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p className="text-xs text-[#A63838] px-1 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-[#9DA6B5] px-1">{hint}</p>
      ) : null}
    </div>
  );
};

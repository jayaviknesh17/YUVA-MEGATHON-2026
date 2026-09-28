import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  iconLeft: IconLeft,
  iconRight: IconRight,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-950 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow focus:ring-brand-500 active:scale-[0.98]',
    secondary: 'bg-surface-800 hover:bg-surface-700 text-surface-100 border border-surface-700 focus:ring-surface-500',
    outline: 'bg-transparent border border-brand-500/50 hover:bg-brand-500/10 text-brand-400 focus:ring-brand-500',
    ghost: 'bg-transparent hover:bg-surface-800 text-surface-300 hover:text-surface-100 focus:ring-surface-600',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-sm active:scale-[0.98]',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500 shadow-glow-emerald active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : IconLeft ? (
        <IconLeft className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
      {!isLoading && IconRight ? <IconRight className="w-4 h-4" /> : null}
    </button>
  );
};

export default Button;
